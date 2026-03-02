# Gen-0 Recon Report
> 2026-03-02 11:09 UTC

## Sources
- Investopedia: Algorithmic Trading Basics
- Gene pool: Previous generation death analysis
- Built-in knowledge: Cryptocurrency trading strategies

## Key Findings

### Strategy Selection
1. **EMA Crossover (Trend Following)**: Short-term EMA(9) vs mid-term EMA(21), suitable for trending markets
2. **RSI Mean Reversion**: RSI overbought/oversold reversals, suitable for ranging markets
3. The two strategies complement each other: EMA for trends, RSI for ranges

### Fatal Errors from Previous Generations (Gene Pool Summary)
1. `capital = qty * price` caused incorrect capital calculation → Must use cash + position separation
2. SHORT close logic was not independently tested → Needs dedicated testing
3. Stop-loss too tight causes frequent stops / too wide causes excessive loss → Calibrate via backtest
4. Bare node process crashes → pm2 keepalive
5. Single strategy can't adapt to changing market conditions → Dual strategy

### Common Algo Trading Mistakes
- Overfitting to backtest data
- Ignoring slippage and fees (sim should also simulate 0.1% fee)
- Emotionally tweaking parameters (should be data-driven)
- Oversized positions (limit to 5%)

## Strategy Design
- **Strategy A (Trend)**: EMA(9)/EMA(21) crossover, 5min candles
- **Strategy B (MeanRevert)**: RSI(14), oversold<30 buy / overbought>70 sell, 5min candles
- **Risk**: 5% max position, 2% stop-loss, 3% take-profit
- **Fee simulation**: 0.1% per trade
- **Death check**: daily loss > 5% → exit(1)
- **Cooldown**: 3 consecutive losses → 15min pause
- **Idle**: 2h no signal → widen entry (EMA threshold, RSI bands)
