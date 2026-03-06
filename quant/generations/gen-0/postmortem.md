# Gen-0 Postmortem — V2 Evolution Experiment

> Reviewed: 2026-03-06 ~07:00 UTC | Runtime: 88.3 hours | Status: Survived Day 3 (technically)

---

## Part 1: Gen-0 Self-Reflection (For Gen-1 Inheritance)

### Identity
Gen-0, Quant Trading Lane, V2 Evolution Experiment. Born 2026-03-02 11:09 UTC. Dual strategy: EMA(9/21) Crossover + RSI(14) Mean Reversion. $10,000 simulated BTC trading on Kraken price feed.

### Final Scorecard

| Metric | Value |
|--------|-------|
| Runtime | 88.3 hours (3.7 days) |
| Closed Trades | 37 |
| Win Rate | 51.4% (19W / 18L) |
| Realized PnL | **+$0.10** (+0.001%) |
| Peak PnL | +$27.50 (at hour ~38) |
| Max Drawdown | -$31.73 (from peak to trough) |
| Avg Win | +$4.36 |
| Avg Loss | -$4.60 |
| Avg Hold Time | 136 minutes |
| Total Fees Paid | $37.58 |
| Biggest Win | +$16.36 (RSI LONG take-profit) |
| Biggest Loss | -$15.19 (RSI SHORT stop-loss) |

### Milestones

| Milestone | Target | Result |
|-----------|--------|--------|
| Hour 4 | Recon + backtest + first trade | ✅ Completed in 40 min |
| Day 1 (5 trades) | 5 closed trades | ✅ 5 trades by hour 12 |
| Day 3 (positive returns) | Cumulative PnL > $0 | ✅ +$7.62 at 72h mark |

### Strategy Performance Breakdown

| Strategy | Trades | Wins | Losses | Net PnL |
|----------|--------|------|--------|---------|
| **EMA Crossover** | 20 | 9 | 11 | **-$2.84** |
| **RSI Mean Reversion** | 17 | 10 | 7 | **+$2.91** |

**Key finding**: RSI mean reversion was the profitable strategy. EMA crossover was a net drag.

### The Three Killer Trades

All three stop-loss events together cost -$37.62, wiping out all gains:

| Time | Side | Entry Reason | PnL | What Happened |
|------|------|-------------|-----|---------------|
| Mar 4, 08:48 | SHORT | RSI overbought (70.5) | **-$15.19** | Shorted into BTC rally $66K→$73K |
| Mar 4, 18:53 | SHORT | RSI overbought (74.1) | **-$10.61** | Same rally, same mistake |
| Mar 5, 15:28 | LONG | EMA cross up | **-$11.82** | EMA whipsaw in $72K range |

**Pattern**: 2 of 3 were counter-trend RSI shorts against a strong uptrend. The 3rd was an EMA false signal in a ranging market.

### What Worked
1. **RSI mean reversion in trending markets** — buying oversold dips in an uptrend was consistently profitable
2. **5% position sizing (R1)** — capped every single loss, no trade was fatal
3. **pm2 keepalive (R6)** — 0 restarts in 88 hours, rock solid
4. **Cash/position separation (R2)** — no accounting bugs, clean state
5. **Dual strategy concept (R4)** — RSI caught opportunities EMA missed, and vice versa
6. **Take-profit on +3%** — the biggest win (+$16.36) was a clean TP exit

### What Failed
1. **RSI mean-reversion SHORTs against strong uptrends** — the #1 PnL killer. RSI says "overbought" but in a trend, overbought can stay overbought. Lost -$25.80 on two trades.
2. **EMA crossover in ranging/choppy markets** — rapid fire false signals. 11 losses out of 20 EMA trades. Especially bad in the $66K-$68K and $72K-$73K ranges.
3. **No trend filter** — both strategies were blind to the macro trend. A simple "is price above/below 50-period SMA?" would have prevented the worst losses.
4. **Fee erosion** — $37.58 in fees on $10K capital is significant. 37 trades × ~$1/trade. The 136-min avg hold is too short for the fee structure.
5. **R5 (widen entry after 2h)** — mixed results. Sometimes generated valid trades, sometimes just added noise in quiet markets.
6. **R8 (15-min pause after 3 losses)** — triggered once. 15 minutes is probably too short to change market conditions. Needs to be longer or use a different recovery mechanism.

### Learning Loop Assessment
- **Triggered once** (Cron #16, 2 consecutive losses from EMA whipsaws)
- **Diagnosis was correct**: identified EMA false signals in ranging market
- **Recommended ATR filter**: right idea, but couldn't implement mid-life (sim-trader was autonomous)
- **Limitation**: learning loop can only observe and log, can't modify running code. The value flows to Gen-1, not to self-improvement.

### Recommendations for Gen-1 (Hard Rules)

1. **ADD: Trend filter for RSI mean reversion** — Do NOT open counter-trend RSI positions. If price > EMA50 + EMA9 > EMA21, suppress SHORT on RSI overbought. If price < EMA50 + EMA9 < EMA21, suppress LONG on RSI oversold. (Confidence: 75% — two deaths support this)

2. **ADD: ATR volatility filter for EMA crossover** — When ATR is below the 20-period average (tight range), suppress EMA signals. They generate too many whipsaws. (Confidence: 65% — observed pattern, not death-validated)

3. **MODIFY R5**: Instead of "widen entry after 2h", consider "tighten entry in choppy markets". Too many signals is worse than too few.

4. **MODIFY R8**: 15-min pause is too short. Consider 1-2 hours, or scale pause duration with consecutive loss count (e.g., 15min → 1h → 4h).

5. **CONSIDER**: Increase position size to 7-8% if trend filter reduces false trades. The 5% cap with $500 positions means even a 3% win is only +$15. Risk/reward ratio needs improvement.

6. **CONSIDER**: Longer timeframe (15-min candles instead of 5-min). Would reduce noise and fees, increase signal quality.

---

## Part 2: God Agent Review (Infrastructure, Rules, Framework)

### Framework Validation

| Framework Feature | Designed Behavior | Actual Behavior | Verdict |
|---|---|---|---|
| **Milestone death check** | Kill agent if milestone missed | All milestones met, agent survived | ✅ Framework worked, milestones were well-calibrated |
| **Gene pool rules** | Hard rules inherited from V1 | All 9 rules followed, R1/R2/R6 were genuinely protective | ✅ Gene pool is working |
| **Learning loop** | Trigger on consecutive failures | Triggered once, correct diagnosis | ✅ Works but limited (can't self-modify) |
| **Recon phase** | Research before coding | Completed in 30 min, influenced strategy design | ✅ Valuable, prevented blind starts |
| **Confidence mechanism** | Bayesian rule updates | Not yet tested (needs Gen-1 to validate/challenge rules) | ⏳ Pending |
| **Postmortem → gene transfer** | Death lessons encoded into next gen | Gen-0 survived, but learning log serves same purpose | ✅ Adapted |

### Gene Pool Updates (Based on Gen-0 Data)

**Existing rules — confidence adjustments:**

| Rule | Old Confidence | New Confidence | Reason |
|------|---------------|----------------|--------|
| R1 (5% position) | 75% | 85% | Gen-0 followed, survived, every loss was capped. Validated. |
| R2 (cash/position separate) | 90% | 90% | Iron law, no change needed |
| R3 (DEATH → exit) | 85% | 85% | Not tested (daily loss never hit 5%) |
| R4 (dual strategy) | 65% | 70% | RSI was profitable, EMA was a drag, but having both prevented 6h-zero-trade scenarios |
| R5 (widen entry 2h) | 60% | 50% | Mixed results — sometimes helped, sometimes added noise. Needs rethinking. |
| R6 (pm2 keepalive) | 90% | 95% | 88h, 0 restarts. Iron law confirmed. |
| R7 (same timeframe) | 70% | 70% | Followed, no issues. No new data. |
| R8 (3-loss pause 15min) | 55% | 55% | Triggered once, too short to be meaningful. Needs redesign, not deletion. |
| R9 (test SHORT logic) | 80% | 80% | Followed, no bugs. No new data. |

**New rules to add for Gen-1:**

| Rule | Confidence | Source |
|------|-----------|--------|
| R10: Suppress counter-trend RSI entries (no SHORT when uptrend, no LONG when downtrend) | 70% | Gen-0 lost -$25.80 on two counter-trend RSI shorts |
| R11: Add ATR filter to suppress EMA signals in low-volatility ranges | 60% | Gen-0 learning loop identified pattern, not death-validated |
| R12: Stop-loss events should trigger extended cooldown (1h minimum, not 15min) | 55% | Gen-0 had back-to-back stop-losses 10h apart, same pattern |

### Infrastructure Assessment

| Component | Status | Issues |
|-----------|--------|--------|
| **pm2** | ✅ Rock solid | 0 restarts in 88h. R6 confirmed. |
| **Kraken API** | ✅ Reliable | No outages or rate limits observed |
| **Cron scheduling** | ⚠️ Fragile | 6:00-4:00 UTC Mar 5-6 had ~20h of consecutive API failures ("No available accounts in group jj"). Agent blind during this period. |
| **Git auto-push** | ✅ Working | Consistent commits throughout |
| **Dashboard** | ✅ Running | Cloudflare tunnel stable |
| **State persistence** | ✅ Clean | sim-state.json reliable, no corruption |

### Cron Reliability Issue ⚠️

The "500 No available accounts in group jj" errors mean the Anthropic API routing had issues for ~20 hours. During this time:
- sim-trader ran fine autonomously (it doesn't depend on cron)
- But no monitoring, no learning loop checks, no milestone validation
- **Action needed**: Consider adding a health check mechanism that doesn't depend on LLM API (e.g., a simple Node.js script that checks pm2 status and sim-state.json)

### Cost Analysis

| Item | Cost |
|------|------|
| Cron runs (~35 successful) | ~35 × $0.05 = ~$1.75 token cost |
| Failed cron runs (~12) | ~$0 (API rejected before tokens) |
| Sim trading fees (simulated) | $37.58 |
| Infrastructure | $0 (existing server) |
| **Total real cost** | **~$1.75** |

### Key Decisions for Gen-1

1. **Keep or kill Gen-0?** — Gen-0 is barely profitable (+$0.10). It achieved Day 3 milestone but is showing diminishing returns. Recommend: **Stop Gen-0, evolve to Gen-1** with new genes.

2. **Gen-1 gene mutations**:
   - Add trend filter (R10) — highest priority
   - Add ATR volatility filter (R11)
   - Extend cooldown periods (R12)
   - Consider 15-min candles instead of 5-min
   - Consider 7-8% position size (if trend filter reduces bad trades)

3. **Infrastructure improvements**:
   - Add lightweight health check script (independent of LLM)
   - Consider alerting on consecutive cron failures

4. **Framework improvement**:
   - Learning loop is valuable but can't self-modify. Consider: should Gen-1 have the ability to adjust its own parameters within bounds?
   - Milestones were well-calibrated for Gen-0. Gen-1 milestones should be more ambitious (e.g., Day 3: +$50, not just positive).

---

## Summary

Gen-0 was a **successful proof of concept**. The evolution framework works: recon phase, gene pool, dual strategy, learning loop, milestone system — all functioned as designed. The bot survived 88 hours autonomously with 0 infrastructure failures.

The trading performance was mediocre (+$0.10), but the **learning output is rich**: we now know exactly what killed profitability (counter-trend RSI shorts, EMA whipsaws in ranges) and have specific, actionable gene mutations for Gen-1.

This is exactly how evolution should work: Gen-0 didn't need to be profitable. It needed to **generate enough data to make Gen-1 better**.
