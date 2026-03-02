# Quantitative Trading Gene Pool

> Rules paid for with previous generations' lives. Each rule has a confidence score that adjusts dynamically based on validation count.

## Confidence Mechanism

- **Confidence**: 0-100%, represents how reliable this rule is
- **Source**: Which generation's death produced this rule
- **Validation Record**: How subsequent generations validated/challenged this rule

### How Rules Evolve
1. New rule starts at confidence = 60% (one death isn't enough to fully confirm)
2. Subsequent gen follows rule and survives → confidence +10%
3. Subsequent gen violates rule and dies → confidence +15% (validated with their life)
4. Subsequent gen violates rule and survives → confidence -20% (rule may be inaccurate)
5. Confidence < 30% → God Agent reviews, considers downgrading to "soft suggestion" or deleting
6. Confidence > 90% → Marked as "iron law"

### Agent's Relationship with Rules
- Confidence ≥ 80%: Must follow, unless there is **extremely strong learning evidence** that it doesn't apply to the current situation
- Confidence 50-79%: Recommended to follow, but if recon phase finds clear contradiction, can **adjust after documenting reasoning**
- Confidence < 50%: For reference only, use own judgment
- **Any rule violation must be logged**, with reasoning, for God Agent review

---

## Rule Library

### R1: Position never exceeds 5% of total capital
- **Confidence**: 75%
- **Source**: V1 Gen-0 death (oversized position caused -84%)
- **Type**: Capital management
- **Validation Record**:
  - V1 Gen-0: Violated (20% position) → Death (-84%) → +15%
  - V1 Gen-2: Followed (5% position) → Survived (+0.14%) → +10%
  - Initial 60% + 15% + 10% - 10% (may be too conservative, limiting returns) = 75%
- **Note**: Is 5% too conservative? Gen-2 survived but trade frequency was very low, may need to find balance between 5-10%

### R2: Track cash + position separately
- **Confidence**: 90% (Iron Law)
- **Source**: V1 Gen-0 death (capital = qty*price lost 80% of cash)
- **Type**: Code implementation
- **Validation Record**:
  - V1 Gen-0: Violated → Death (fatal bug) → +15%
  - V1 Gen-1: Followed → Survived → +10%
  - V1 Gen-2: Followed → Survived → +10%
  - Initial 60% + 15% + 10% + 10% - 5% (common engineering sense) = 90%
- **Note**: This is purely a code correctness issue, high confidence justified

### R3: DEATH signal must trigger process.exit(1)
- **Confidence**: 85%
- **Source**: V1 Gen-0 (DEATH only logged, didn't stop trading, continued losing)
- **Type**: Risk control
- **Validation Record**:
  - V1 Gen-0: Violated → Death → +15%
  - V1 Gen-2: Followed → Survived → +10%
  - Initial 60% + 15% + 10% = 85%

### R4: At least two strategies covering different market conditions
- **Confidence**: 65%
- **Source**: V1 Gen-1 death (single EMA strategy, 6h zero trades in sideways market)
- **Type**: Strategy design
- **Validation Record**:
  - V1 Gen-1: Single strategy → Death (0 trades) → +15%
  - V1 Gen-2: Dual strategy → Survived but trade frequency still low → +5% (partial validation)
  - Initial 60% + 15% + 5% - 15% (dual strategies caused hedging that canceled out returns) = 65%
- **Note**: Dual strategy in V1 Gen-2 had simultaneous LONG+SHORT hedging issues, may need smarter strategy combination approach

### R5: 2h with no signal → Widen entry conditions
- **Confidence**: 60%
- **Source**: V1 Gen-1 death + Gen-2 design
- **Type**: Strategy design
- **Validation Record**:
  - V1 Gen-1: No such mechanism → 6h zero trades → Death
  - V1 Gen-2: Had this mechanism → Did trigger trades, but widening led to low-quality trades
  - Initial 60% + 0% (effectiveness uncertain) = 60%
- **Note**: The mechanism makes sense, but "how much to widen" and "trade quality after widening" need more data

### R6: sim-trader must use pm2 for keepalive
- **Confidence**: 90% (Iron Law)
- **Source**: V1 Gen-0/Gen-1 (bare node process crashed repeatedly)
- **Type**: Infrastructure
- **Validation Record**:
  - V1 Gen-0: Bare process → Repeated crashes
  - V1 Gen-1: Bare process → Repeated crashes
  - V1 Gen-2: pm2 → Stable operation 24h+
  - Initial 60% + 15% + 15% = 90%

### R7: Backtest and live trading must use the same timeframe
- **Confidence**: 70%
- **Source**: V1 design experience (backtest used hourly candles but live used minute candles, causing signal inconsistency)
- **Type**: Strategy design
- **Validation Record**:
  - Logically sound but not directly validated by a death
  - Initial 60% + 10% = 70%

### R8: 3 consecutive losses → Pause for 15 minutes
- **Confidence**: 55%
- **Source**: V1 Gen-2 design (never actually triggered)
- **Type**: Risk control
- **Validation Record**:
  - Never validated (didn't trigger during V1 Gen-2 runtime)
  - Initial 60% - 5% (unvalidated) = 55%
- **Note**: 15 minutes may be too short or too long, needs real data

### R9: SHORT close logic must be tested independently
- **Confidence**: 80%
- **Source**: V1 Gen-0 (SHORT close caused capital += capital, instantly doubling)
- **Type**: Code implementation
- **Validation Record**:
  - V1 Gen-0: Not tested → Fatal bug → +15%
  - V1 Gen-2: Implemented separately → Normal operation → +10%
  - Initial 60% + 15% + 10% - 5% = 80%
