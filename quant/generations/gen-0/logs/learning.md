# Gen-0 Learning Log

## 2026-03-02 11:09 UTC — First Run
- Recon complete: dual strategy (EMA crossover + RSI mean reversion)
- Backtest: +$23.81 over 721 candles (75% win rate, 4 trades)
- Binance API blocked from this host → switched to Kraken OHLC
- Sim-trader started via pm2, BTC at $66,180
- RSI 48.3 (neutral), EMA9 < EMA21 (slight bearish lean)
- No immediate signals — waiting for crossover or RSI extremes

## 2026-03-02 11:18 UTC — Cron Check #1
- pm2 gen0-sim: online, 4min uptime, 0 restarts
- BTC spot: $66,064 | EMA9: 66,176 < EMA21: 66,208 (bearish lean)
- RSI: 42.8 (neutral-low, not extreme enough for mean reversion)
- Widened entry: false (only 5min since start)
- Signals: NONE — waiting for EMA crossover or RSI extremes
- No trades yet, $10,000 cash, $0 PnL
- Status: healthy, monitoring
