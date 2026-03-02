// Gen-0 Core Trading Library
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, '..');
const STATE_FILE = path.join(BASE, 'sim-state.json');
const TRADES_LOG = path.join(BASE, 'logs', 'trades.md');
const FEE_RATE = 0.001; // 0.1%

// === State Management ===
export function loadState() {
  if (fs.existsSync(STATE_FILE)) return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  return {
    cash: 10000,
    position: { qty: 0, side: null, entryPrice: 0 },
    trades: [],
    dailyPnL: 0,
    dailyStart: Date.now(),
    consecutiveLosses: 0,
    pauseUntil: 0,
    lastSignalTime: Date.now(),
    totalTrades: 0,
    totalPnL: 0,
    priceHistory: [],
    widenedEntry: false,
  };
}

export function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// === Price Fetching ===
export async function fetchPrice() {
  const res = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
  const data = await res.json();
  return parseFloat(data.data.amount);
}

export async function fetchCandles(limit = 50) {
  // Use Kraken OHLC API: 5min candles
  const res = await fetch('https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=5');
  const data = await res.json();
  if (data.error && data.error.length > 0) throw new Error(data.error[0]);
  const key = Object.keys(data.result).find(k => k !== 'last');
  const candles = data.result[key].slice(-limit);
  return candles.map(k => ({
    time: k[0] * 1000,
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[6]),
  }));
}

// === Indicators ===
export function ema(prices, period) {
  const k = 2 / (period + 1);
  let emv = prices[0];
  const result = [emv];
  for (let i = 1; i < prices.length; i++) {
    emv = prices[i] * k + emv * (1 - k);
    result.push(emv);
  }
  return result;
}

export function rsi(prices, period = 14) {
  if (prices.length < period + 1) return Array(prices.length).fill(50);
  const result = Array(period).fill(50);
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) avgGain += diff; else avgLoss -= diff;
  }
  avgGain /= period; avgLoss /= period;
  result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  for (let i = period + 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
    result.push(avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss));
  }
  return result;
}

// === Signals ===
export function getSignals(candles, widenedEntry = false) {
  const closes = candles.map(c => c.close);
  const ema9 = ema(closes, 9);
  const ema21 = ema(closes, 21);
  const rsi14 = rsi(closes);
  const last = closes.length - 1;
  const prev = last - 1;

  const signals = [];

  // Strategy A: EMA Crossover (Trend)
  const emaDiff = ema9[last] - ema21[last];
  const emaDiffPrev = ema9[prev] - ema21[prev];
  if (emaDiffPrev <= 0 && emaDiff > 0) signals.push({ strategy: 'ema_cross', side: 'LONG', reason: 'EMA9 crossed above EMA21' });
  if (emaDiffPrev >= 0 && emaDiff < 0) signals.push({ strategy: 'ema_cross', side: 'SHORT', reason: 'EMA9 crossed below EMA21' });

  // Strategy B: RSI Mean Reversion
  const rsiThreshLow = widenedEntry ? 35 : 30;
  const rsiThreshHigh = widenedEntry ? 65 : 70;
  if (rsi14[last] < rsiThreshLow && rsi14[prev] >= rsiThreshLow) signals.push({ strategy: 'rsi_revert', side: 'LONG', reason: `RSI(${rsi14[last].toFixed(1)}) dropped below ${rsiThreshLow}` });
  if (rsi14[last] > rsiThreshHigh && rsi14[prev] <= rsiThreshHigh) signals.push({ strategy: 'rsi_revert', side: 'SHORT', reason: `RSI(${rsi14[last].toFixed(1)}) rose above ${rsiThreshHigh}` });

  return { signals, indicators: { ema9: ema9[last], ema21: ema21[last], rsi: rsi14[last], price: closes[last] } };
}

// === Trade Execution ===
export function executeTrade(state, side, price, reason) {
  const maxPositionValue = state.cash * 0.05; // 5% max
  const fee = price * FEE_RATE;

  if (state.position.qty !== 0) {
    // Close existing position first
    state = closePosition(state, price, 'new signal opposite');
  }

  const qty = maxPositionValue / price;
  const cost = qty * fee;

  state.position = { qty, side, entryPrice: price };
  state.cash -= cost; // fee only, position tracked separately
  state.lastSignalTime = Date.now();
  state.totalTrades++;

  const trade = {
    time: new Date().toISOString(),
    action: `OPEN_${side}`,
    price,
    qty: qty.toFixed(6),
    fee: cost.toFixed(2),
    reason,
    cash: state.cash.toFixed(2),
  };
  state.trades.push(trade);
  logTrade(trade);
  return state;
}

export function closePosition(state, price, reason) {
  if (state.position.qty === 0) return state;

  const { qty, side, entryPrice } = state.position;
  const fee = qty * price * FEE_RATE;
  let pnl;

  if (side === 'LONG') {
    pnl = qty * (price - entryPrice) - fee;
  } else { // SHORT
    pnl = qty * (entryPrice - price) - fee;
  }

  state.cash += pnl; // cash tracks realized PnL
  // Note: NOT doing capital = qty * price (gene pool rule)
  state.dailyPnL += pnl;
  state.totalPnL += pnl;

  if (pnl < 0) {
    state.consecutiveLosses++;
    if (state.consecutiveLosses >= 3) {
      state.pauseUntil = Date.now() + 15 * 60 * 1000; // 15 min pause
      console.log('⚠️ 3 consecutive losses - pausing 15 minutes');
    }
  } else {
    state.consecutiveLosses = 0;
  }

  const trade = {
    time: new Date().toISOString(),
    action: `CLOSE_${side}`,
    price,
    qty: qty.toFixed(6),
    pnl: pnl.toFixed(2),
    fee: fee.toFixed(2),
    reason,
    cash: state.cash.toFixed(2),
    totalPnL: state.totalPnL.toFixed(2),
  };
  state.trades.push(trade);
  logTrade(trade);

  state.position = { qty: 0, side: null, entryPrice: 0 };
  return state;
}

// === Risk Checks ===
export function checkDeath(state) {
  // Reset daily PnL if new day
  if (Date.now() - state.dailyStart > 86400000) {
    state.dailyPnL = 0;
    state.dailyStart = Date.now();
  }
  // Daily loss > 5% of initial capital
  if (state.dailyPnL < -500) { // 5% of $10000
    console.log('💀 DEATH: Daily loss exceeds 5%');
    return true;
  }
  return false;
}

export function checkStopLoss(state, price) {
  if (state.position.qty === 0) return state;
  const { side, entryPrice } = state.position;
  const pctChange = side === 'LONG'
    ? (price - entryPrice) / entryPrice
    : (entryPrice - price) / entryPrice;

  if (pctChange <= -0.02) { // 2% stop loss
    console.log(`🛑 Stop loss hit: ${(pctChange * 100).toFixed(2)}%`);
    state = closePosition(state, price, 'stop_loss');
  } else if (pctChange >= 0.03) { // 3% take profit
    console.log(`🎯 Take profit hit: ${(pctChange * 100).toFixed(2)}%`);
    state = closePosition(state, price, 'take_profit');
  }
  return state;
}

export function shouldWidenEntry(state) {
  return Date.now() - state.lastSignalTime > 2 * 60 * 60 * 1000; // 2 hours
}

// === Logging ===
function logTrade(trade) {
  const line = `| ${trade.time} | ${trade.action} | $${trade.price} | ${trade.qty} | ${trade.pnl || '-'} | ${trade.reason} | cash: $${trade.cash} |\n`;
  fs.appendFileSync(TRADES_LOG, line);
}

export function initTradesLog() {
  if (!fs.existsSync(TRADES_LOG)) {
    fs.writeFileSync(TRADES_LOG, '# Gen-0 Trades Log\n| Time | Action | Price | Qty | PnL | Reason | Cash |\n|------|--------|-------|-----|-----|--------|------|\n');
  }
}
