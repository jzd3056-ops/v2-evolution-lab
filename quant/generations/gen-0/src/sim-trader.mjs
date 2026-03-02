// Gen-0 Sim Trader (pm2 managed)
import {
  loadState, saveState, fetchPrice, fetchCandles,
  getSignals, executeTrade, closePosition,
  checkDeath, checkStopLoss, shouldWidenEntry, initTradesLog
} from './lib.mjs';

const INTERVAL = 5 * 60 * 1000; // 5 minutes

async function tick() {
  const state = loadState();

  // Death check
  if (checkDeath(state)) {
    saveState(state);
    // Write postmortem
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    fs.writeFileSync(path.join(__dirname, '..', 'postmortem.md'),
      `# Gen-0 Postmortem\n- Died: ${new Date().toISOString()}\n- Cause: Daily loss > 5%\n- Total PnL: $${state.totalPnL.toFixed(2)}\n- Trades: ${state.totalTrades}\n- Cash: $${state.cash.toFixed(2)}\n`
    );
    process.exit(1);
  }

  // Pause check
  if (Date.now() < state.pauseUntil) {
    console.log(`⏸️ Paused until ${new Date(state.pauseUntil).toISOString()}`);
    saveState(state);
    return;
  }

  try {
    const [price, candles] = await Promise.all([fetchPrice(), fetchCandles()]);
    console.log(`[${new Date().toISOString()}] BTC: $${price.toFixed(2)} | Cash: $${state.cash.toFixed(2)} | PnL: $${state.totalPnL.toFixed(2)} | Pos: ${state.position.side || 'NONE'} ${state.position.qty.toFixed(6)}`);

    // Check stop loss / take profit on existing position
    let updatedState = checkStopLoss(state, price);

    // Check if we should widen entry conditions
    const widen = shouldWidenEntry(updatedState);
    if (widen && !updatedState.widenedEntry) {
      console.log('📢 No signals for 2h+ — widening entry conditions');
      updatedState.widenedEntry = true;
    } else if (!widen) {
      updatedState.widenedEntry = false;
    }

    // Get signals
    const { signals, indicators } = getSignals(candles, updatedState.widenedEntry);

    if (signals.length > 0 && updatedState.position.qty === 0) {
      const signal = signals[0]; // Take first signal
      console.log(`📊 Signal: ${signal.side} (${signal.strategy}) — ${signal.reason}`);
      updatedState = executeTrade(updatedState, signal.side, price, `${signal.strategy}: ${signal.reason}`);
    } else if (signals.length > 0 && updatedState.position.qty > 0) {
      // Check if signal is opposite to current position
      const signal = signals[0];
      if (signal.side !== updatedState.position.side) {
        console.log(`🔄 Reversing: ${updatedState.position.side} → ${signal.side}`);
        updatedState = closePosition(updatedState, price, 'signal_reversal');
        updatedState = executeTrade(updatedState, signal.side, price, `${signal.strategy}: ${signal.reason}`);
      }
    }

    // Log indicators
    console.log(`  EMA9: ${indicators.ema9.toFixed(2)} | EMA21: ${indicators.ema21.toFixed(2)} | RSI: ${indicators.rsi.toFixed(1)}`);

    saveState(updatedState);
  } catch (err) {
    console.error('❌ Tick error:', err.message);
  }
}

// Init
initTradesLog();
console.log('🚀 Gen-0 Sim Trader starting...');
tick(); // First tick immediately
setInterval(tick, INTERVAL);
