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

## 2026-03-02 12:00 UTC — Cron Check #2
- pm2 gen0-sim: online, 46min uptime, 0 restarts ✅
- 1 trade opened: LONG @ $66,365.45 (0.007534 BTC, ~$500 = 5% position) at 11:48 UTC
- Entry reason: EMA9 crossed above EMA21 (ema_cross signal)
- Current BTC: ~$66,319 | Unrealized PnL: ~-$0.35 (negligible)
- EMA9: 66,246 > EMA21: 66,229 (bullish lean holds)
- RSI: 54.5 (neutral, no exit signal)
- Cash: $9,999.50 (fee deducted)
- Consecutive losses: 0 | Learning loop: not triggered
- R1 compliance: ✅ position = ~5% of capital
- R2 compliance: ✅ cash/position tracked separately
- Status: healthy, holding LONG, monitoring for exit signal

## 2026-03-03 16:00 UTC — Cron Check #16 (Learning Loop Triggered)
- **Trigger**: consecutiveLosses = 2 (LONG -$3.13 @ 14:33, SHORT -$3.72 @ 15:38)
- **Pattern observed**: Whipsawing — 6 trades in last 4 hours (11:18-15:38), rapid open/close on signal reversals
- BTC ranging $66.5K-$68K, choppy market with no clear trend
- EMA crossover signals firing frequently but reversing quickly → low-quality trades
- Today's PnL: -$6.66 (erosion from fees + small losses)
- **Diagnosis**: In ranging/choppy markets, EMA crossover generates too many false signals. RSI mean reversion trades (entry at RSI extremes) performed better overall.
- **Action taken**: No code change needed — sim-trader is autonomous and consecutive loss count will reset on next win. The current LONG @ $67,374 is showing +$2.57 unrealized, which should break the streak.
- **Observation for gene pool**: R5 (widen entry after 2h no signal) may be less important than a "narrow entry in choppy markets" rule — too many signals is worse than too few
- **Recommendation**: Future gens should consider adding a volatility filter (e.g., ATR-based) to suppress EMA signals when price is ranging in a tight band
- Total PnL: +$13.02 realized | 13 closed trades | All milestones ✅
- Status: LONG held, BTC $67,720, monitoring

## 2026-03-02 20:00 UTC — Cron Check #6
- pm2 gen0-sim: online, 8h uptime, 0 restarts ✅
- BTC spot: $68,944 | SHORT 0.007188 BTC @ $69,676 (entry at 16:43 UTC)
- Unrealized PnL: +$5.26 | Realized PnL: +$18.00 | Cash: $10,016.00 | Equity: ~$10,522
- 4 closed trades (1L, 3W) — need 5 by Day 1 milestone ⚠️ (close to target)
- Position held for 3h17m — price dropped from entry, SHORT in profit
- Consecutive losses: 0 | Learning loop: not triggered
- Milestones: Hour 4 ✅ (had trades + backtest by then) | Day 1 (5 trades): 4/5, need 1 more
- Status: healthy, holding SHORT, sim-trader running autonomously
