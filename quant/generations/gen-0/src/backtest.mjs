// Gen-0 Backtest Script
import { ema, rsi } from './lib.mjs';

const FEE = 0.001;

async function fetchHistoricalCandles() {
  // Get Kraken 5-min candles (returns ~720 = 2.5 days)
  const res = await fetch('https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=5');
  const data = await res.json();
  if (data.error && data.error.length > 0) throw new Error(data.error[0]);
  const key = Object.keys(data.result).find(k => k !== 'last');
  return data.result[key].map(k => ({
    time: k[0] * 1000,
    close: parseFloat(k[4]),
  }));
}

function backtest(candles) {
  let cash = 10000;
  let position = { qty: 0, side: null, entryPrice: 0 };
  const trades = [];
  let wins = 0, losses = 0, consecutiveLosses = 0, maxConsecLosses = 0;

  for (let i = 25; i < candles.length; i++) {
    const window = candles.slice(0, i + 1);
    const closes = window.map(c => c.close);
    const ema9 = ema(closes, 9);
    const ema21 = ema(closes, 21);
    const rsi14 = rsi(closes);
    const price = closes[closes.length - 1];
    const last = closes.length - 1;
    const prev = last - 1;

    // Check stop loss / take profit
    if (position.qty > 0) {
      const pctChange = position.side === 'LONG'
        ? (price - position.entryPrice) / position.entryPrice
        : (position.entryPrice - price) / position.entryPrice;

      if (pctChange <= -0.02 || pctChange >= 0.03) {
        const fee = position.qty * price * FEE;
        const pnl = position.side === 'LONG'
          ? position.qty * (price - position.entryPrice) - fee
          : position.qty * (position.entryPrice - price) - fee;
        cash += pnl;
        trades.push({ pnl, reason: pctChange <= -0.02 ? 'stop_loss' : 'take_profit' });
        if (pnl > 0) { wins++; consecutiveLosses = 0; }
        else { losses++; consecutiveLosses++; maxConsecLosses = Math.max(maxConsecLosses, consecutiveLosses); }
        position = { qty: 0, side: null, entryPrice: 0 };
      }
    }

    // Signals
    const emaDiff = ema9[last] - ema21[last];
    const emaDiffPrev = ema9[prev] - ema21[prev];

    let signal = null;
    // EMA crossover
    if (emaDiffPrev <= 0 && emaDiff > 0) signal = 'LONG';
    else if (emaDiffPrev >= 0 && emaDiff < 0) signal = 'SHORT';
    // RSI
    if (!signal) {
      if (rsi14[last] < 30 && rsi14[prev] >= 30) signal = 'LONG';
      else if (rsi14[last] > 70 && rsi14[prev] <= 70) signal = 'SHORT';
    }

    if (signal && position.qty === 0) {
      // Skip if consecutive losses pause
      if (consecutiveLosses >= 3) { consecutiveLosses = 0; continue; }

      const maxVal = cash * 0.05;
      const qty = maxVal / price;
      const fee = qty * price * FEE;
      cash -= fee;
      position = { qty, side: signal, entryPrice: price };
    }
  }

  // Close any remaining position
  if (position.qty > 0) {
    const price = candles[candles.length - 1].close;
    const fee = position.qty * price * FEE;
    const pnl = position.side === 'LONG'
      ? position.qty * (price - position.entryPrice) - fee
      : position.qty * (position.entryPrice - price) - fee;
    cash += pnl;
    trades.push({ pnl, reason: 'final_close' });
    if (pnl > 0) wins++; else losses++;
  }

  return {
    finalCash: cash,
    totalPnL: cash - 10000,
    totalTrades: trades.length,
    wins,
    losses,
    winRate: trades.length > 0 ? (wins / trades.length * 100).toFixed(1) : '0',
    maxConsecLosses,
    trades,
  };
}

async function main() {
  console.log('📊 Gen-0 Backtest Starting...');
  const candles = await fetchHistoricalCandles();
  console.log(`Fetched ${candles.length} candles`);

  const result = backtest(candles);
  console.log('\n=== BACKTEST RESULTS ===');
  console.log(`Final Cash: $${result.finalCash.toFixed(2)}`);
  console.log(`Total PnL: $${result.totalPnL.toFixed(2)}`);
  console.log(`Trades: ${result.totalTrades} (W:${result.wins} L:${result.losses})`);
  console.log(`Win Rate: ${result.winRate}%`);
  console.log(`Max Consecutive Losses: ${result.maxConsecLosses}`);

  if (result.totalPnL < 0) {
    console.log('\n⚠️ Backtest shows negative PnL - proceeding with caution');
  } else {
    console.log('\n✅ Backtest positive - strategy viable');
  }
}

main().catch(console.error);
