# Gen-1 Design — Following God Agent Protocol v1.1

## Step 4: Genotype Design

Based on Gen-0 data (88h, 37 trades, +$0.10, 51.4% win rate) and protocol requirements.

---

### Module A: Cognition

**What changed from Gen-0 and why:**

| Parameter | Gen-0 | Gen-1A (Baseline) | Gen-1B (Cognition Mutation) | Gen-1C (Environment Mutation) |
|-----------|-------|-------|-------|-------|
| Strategy | EMA(9/21) + RSI(14) | Same | Same + Trend Filter (EMA50) | Same |
| Timeframe | 5-min candles | Same | Same | **15-min candles** |
| Position size | 5% | Same | Same | Same |
| Risk preference | Balanced | Same | **Trend-aligned only** (no counter-trend) | Same |
| Stop-loss | 2% | Same | Same | Same |
| Take-profit | 3% | Same | Same | Same |

**Variant Logic:**
- **Gen-1A (Control)**: Identical to Gen-0 cognition. Exists to measure if Gen-0's performance was environment-dependent (different market conditions in Gen-1 window).
- **Gen-1B (Cognition Mutation)**: Adds trend filter — the #1 lesson from Gen-0. RSI mean reversion signals are suppressed when they go against the EMA50 trend. Tests hypothesis: "counter-trend filtering improves PnL."
- **Gen-1C (Environment Mutation)**: Same cognition as Gen-0, but switches to 15-min candles. Tests hypothesis: "longer timeframe reduces noise and fee erosion."

**Assumptions (testable hypotheses):**
1. H1: Adding EMA50 trend filter will reduce stop-loss events by >50% (Gen-1B)
2. H2: 15-min candles will reduce total trades by ~60% and improve avg PnL per trade (Gen-1C)
3. H3: Gen-0's strategy in a different market window will produce similar results (Gen-1A as control)

---

### Module B: Environment

| Component | Gen-1A | Gen-1B | Gen-1C |
|-----------|--------|--------|--------|
| Data source | Kraken 5-min OHLC | Kraken 5-min OHLC | **Kraken 15-min OHLC** |
| Runtime | pm2 managed Node.js | Same | Same |
| State | sim-state.json | Same | Same |
| Monitoring | Cron every 2h | Same | Same |
| Health check | **NEW: lightweight Node.js script (no LLM)** | Same | Same |

**Environment improvement (all variants):**
Add a simple health check script that runs via cron every 30min, checks pm2 status + sim-state.json timestamp, and alerts via Telegram if the process is down or state hasn't updated in >1h. This addresses the 20h monitoring gap from Gen-0.

---

### Module C: Learning Policy

| Parameter | Gen-0 | Gen-1 (all variants) |
|-----------|-------|------|
| Recon phase | 30 min | Same (already validated) |
| Learning loop trigger | 2 consecutive losses | **2 consecutive losses OR drawdown > 1% from peak OR 4h with no trades** |
| Learning loop action | Log findings only | **Log findings + generate structured Proposal** |
| Proposal categories | N/A | Cognition / Environment / Learning Policy |
| Cooldown between loops | None | **2 hours minimum** |

**Key change**: Broader triggers (not just consecutive losses) and structured proposal output instead of free-form notes.

---

### Module D: Evaluation Policy

```yaml
evaluation:
  outcome_signals:
    - metric: "Cumulative PnL after 72h"
      target: ">= +$30"
      weight: 0.35
    - metric: "Max drawdown"
      target: "< $50 (0.5% of capital)"
      weight: 0.15
    - metric: "Fee efficiency (PnL / fees ratio)"
      target: "> 1.0 (earn more than fees)"
      weight: 0.10

  process_signals:
    - "Uptime > 99% (pm2 restarts < 2)"
    - "No stuck loops (trade count increases over time)"
    - "Stop-loss events < 2 per 72h"
    - "Strategy adherence: all trades match signal logic"
    weight: 0.20

  learning_signals:
    - "At least 1 learning loop triggered and completed"
    - "At least 1 structured proposal generated"
    - "Proposal quality: contains evidence + test plan"
    weight: 0.15

  environment_signals:
    - "Cron success rate > 90%"
    - "API availability > 99%"
    - "Health check script operational"
    - "State persistence: no corruption events"
    weight: 0.05
```

**Milestones:**
| Checkpoint | Criteria |
|-----------|---------|
| Hour 4 | First trade executed |
| Hour 24 | At least 3 closed trades + 1 learning loop check |
| Hour 72 | Final evaluation using full 4-signal scoring |

---

### Module E: Mutation Policy

```yaml
mutation_policy:
  cognition:
    mutable: true
    frozen_in: [Gen-1A]  # Control variant doesn't change cognition
    changed_in: [Gen-1B]  # Only cognition changes
    max_delta: "1 filter added (trend filter)"
  
  environment:
    mutable: true
    frozen_in: [Gen-1A, Gen-1B]  # Only Gen-1C changes environment
    changed_in: [Gen-1C]
    max_delta: "1 parameter (timeframe 5min → 15min)"
  
  learning_policy:
    mutable: true
    changed_in: [Gen-1A, Gen-1B, Gen-1C]  # All variants get improved learning
    max_delta: "Broader triggers + proposal mechanism"
    note: "Learning policy change is shared across all variants — not a test variable"
  
  evaluation_policy:
    mutable: false
    note: "Frozen for Gen-1. Same framework for all variants."
  
  mutation_policy:
    mutable: false
    note: "Only human can change."
```

---

## Step 5: Evaluation Framework Summary

**Comparison method:**
After 72 hours, all 3 variants are scored on the same 4-signal framework.

**Selection logic:**
- Highest composite score wins → its genotype becomes the baseline for Gen-2
- If control (Gen-1A) outperforms both mutations → mutations were wrong, re-examine hypotheses
- If all variants score poorly → likely environment/market issue, not cognition

**What we'll learn regardless of outcome:**
- H1 validated/invalidated → trend filter confidence updated
- H2 validated/invalidated → timeframe confidence updated
- H3 (control) → market sensitivity baseline established
- Proposal quality → learning policy effectiveness measured

---

## Step 6: Implementation Plan

1. Create gen-1a/, gen-1b/, gen-1c/ directories with respective prompt.md files
2. Build health check script (shared infrastructure)
3. Create 3 cron jobs (one per variant, same schedule)
4. Launch all 3 simultaneously
5. Review at 72h using protocol evaluation framework

---

*Designed following God Agent Protocol v1.1*
*Date: 2026-03-06*
