# V2 Evolution Lab — Project Brief

> An experiment in autonomous AI agent evolution: can AI agents improve themselves through generations of trial, death, and learning?

---

## 1. The Core Idea

**What if AI agents could evolve like organisms?**

A human provides only a goal and a budget. A "God Agent" (the orchestrator) designs execution agents, sets milestones, and iterates on their "genes" (system prompts) based on each generation's performance. Agents that fail are killed. Their lessons are encoded as hard rules for the next generation. Over time, the system converges toward an optimal execution strategy — not through human micromanagement, but through evolutionary pressure.

### Roles

| Role | Who | Responsibility |
|------|-----|---------------|
| **Human** | Adrian (Product Manager) | Goals, budget, major directional decisions. Does NOT specify how to execute. |
| **God Agent** | Romi (AI assistant on OpenClaw) | Designs agent genes, builds infrastructure, reviews deaths, evolves the system |
| **Execution Agent** | Gen-N (spawned by cron) | Trades autonomously, learns during its lifetime, writes a "postmortem" if it dies |

### The Analogy

| Biology | Our System |
|---------|-----------|
| Gene | System Prompt (the agent's instructions) |
| Individual | One generation of agent (Gen-0, Gen-1, ...) |
| Environment | Infrastructure the God Agent builds (APIs, tools, monitoring) |
| Natural Selection | Milestone-based death checks |
| Fossil Record | Postmortem files |
| Mutation | God Agent rewriting the next gen's prompt based on lessons |
| Individual Learning | Agent researching and adapting during its lifetime |
| Species Adaptation | The converged "perfect" prompt + environment after many generations |

---

## 2. The Evolution Framework

### 2.1 Three Layers of Evolution

**Layer 1: Environment Evolution** (God Agent)
- Infrastructure improvements: APIs, process management, monitoring
- Tool availability: what capabilities does the agent have?
- Signal: agents repeatedly dying from the same infrastructure gap → God Agent fixes it

**Layer 2: Behavioral Evolution** (Cross-generation prompt optimization)
- Each agent's System Prompt = its "genes"
- Death lessons are encoded as **hard rules** in a shared Gene Pool (not soft suggestions)
- Rules have **confidence scores** (0-100%) that update Bayesian-style:
  - Agent follows rule + survives → confidence +10%
  - Agent violates rule + dies → confidence +15%
  - Agent violates rule + survives → confidence -20%
  - Confidence > 90% → "Iron Law" (must follow)
  - Confidence < 30% → reviewed for deletion

**Layer 3: Meta-capability Evolution** (Learning ability itself)
- How much time should agents spend researching vs executing?
- What triggers should activate the learning loop?
- What sources should agents consult?
- These parameters are ALSO part of the genes, and ALSO evolve.

### 2.2 Execution Agent Lifecycle

```
Birth → Recon (research best practices) → Execute → Sense-Learn-Adapt loop → Death or Survival → Postmortem
```

1. **Birth**: Inherits genes (prompt) + gene pool rules + environment
2. **Recon Phase**: Must research before coding (search for strategies, common mistakes, etc.)
3. **Execution**: Runs autonomously toward the goal
4. **Sense-Learn-Adapt Loop**: If consecutive failures detected → pause, research why, adjust approach, log findings
5. **Death**: If milestone missed → write postmortem (what worked, what failed, root cause, recommendations)
6. **Survival**: If all milestones met → continues running, data feeds into next evolution cycle

### 2.3 Pre-flight Check (Before Any Agent is Born)

Before launching a new lane, the God Agent must verify:
- Can the agent complete the full loop autonomously? (no human identity required)
- Are APIs available and accessible?
- Is the cost within budget?
- Are there hard blockers that need human intervention first?

This was added after V1, where 3 out of 4 lanes died because they required human identity verification (phone numbers, IDs) that an AI agent can't provide.

### 2.4 Notification Philosophy

**Exception-driven, not polling-driven.**
- Agent death → notify human (brief cause + next gen plan)
- Milestone achieved → notify (one line)
- Human decision needed → notify (question + options)
- Routine operation → **silent**
- Blocker found → notify once, don't nag

---

## 3. Current Experiment: Quantitative BTC Trading

### Why This Lane?

Passed pre-flight check:
- ✅ No human identity needed (simulated trading)
- ✅ Free public APIs (Kraken price data)
- ✅ Fully autonomous execution possible
- ✅ Clear success metric ($PnL)
- ✅ Fast iteration cycles (hours, not days)

### Setup

- **Capital**: $10,000 simulated
- **Asset**: BTC/USD
- **Data source**: Kraken public API (real-time prices)
- **Execution**: Local sim engine (not exchange paper trading)
- **Process**: pm2-managed Node.js process, runs 24/7
- **Monitoring**: God Agent checks via cron every 2 hours
- **Dashboard**: Web UI with live PnL, trade history, charts (Cloudflare tunnel)

### V1 History (Predecessor Experiment — 36 hours, 4 lanes)

Before V2, we ran a V1 experiment across 4 lanes:

| Lane | Generations | Result | Cause of Death |
|------|------------|--------|---------------|
| Xiaohongshu/Social | 3 | Failed | IP blocked + no Chinese phone number |
| Quant Trading | 3 | Barely survived | Gen-0: position bug (-84%), Gen-1: too conservative (0 trades), Gen-2: marginal profit (+0.14%) |
| Telegram Bot | 1 | Failed | Feature-complete but 0 users, no acquisition channel |
| Micro-tasks | 1 | Failed in 17 min | All platforms require human identity verification |

**V1 Lessons Encoded into V2 Framework:**
1. Pre-flight checks are mandatory (3/4 lanes died from hard blockers)
2. Cron frequency must match decision frequency (30-min checks produced 100+ useless reports)
3. Death pressure causes mindless repetition
4. Lessons must be encoded as hard rules, not "read the postmortem"
5. Learning ability is part of the genes
6. God Agent is an evolution designer, not an ops engineer
7. Exception-driven notifications only

### Gen-0 Performance (V2, 88 hours)

**Strategy**: Dual — EMA(9/21) Crossover + RSI(14) Mean Reversion on 5-minute candles

**Results**:

| Metric | Value |
|--------|-------|
| Runtime | 88.3 hours |
| Total Trades | 37 closed |
| Win Rate | 51.4% (19W / 18L) |
| Realized PnL | +$0.10 (+0.001%) |
| Peak PnL | +$27.50 (at hour 38) |
| Max Drawdown | -$31.73 |
| Avg Win / Avg Loss | +$4.36 / -$4.60 |
| Total Fees | $37.58 |
| Biggest Win | +$16.36 (RSI long, take-profit) |
| Biggest Loss | -$15.19 (RSI short, stop-loss) |

**Strategy Breakdown**:

| Strategy | Trades | Win Rate | Net PnL |
|----------|--------|----------|---------|
| EMA Crossover | 20 | 45% | -$2.84 |
| RSI Mean Reversion | 17 | 59% | +$2.91 |

**Milestone Achievement**:
- ✅ Hour 4: Recon + backtest + first trade
- ✅ Day 1: 5 closed trades
- ✅ Day 3: Positive returns at 72h mark (+$7.62)

**Three Killer Trades** (combined -$37.62, wiped all gains):
1. RSI overbought SHORT into BTC rally ($66K→$73K) → -$15.19
2. Same rally, same mistake → -$10.61  
3. EMA false signal in ranging market → -$11.82

### Gene Pool (Current State — 9 Rules)

| # | Rule | Confidence | Source |
|---|------|-----------|--------|
| R1 | Position ≤ 5% of capital | 85% | V1 Gen-0 death (-84% from 20% position) |
| R2 | Track cash + position separately | 90% ⚙️ | V1 Gen-0 death (accounting bug) |
| R3 | DEATH signal → process.exit(1) | 85% | V1 Gen-0 (kept trading after death) |
| R4 | ≥2 strategies for different markets | 70% | V1 Gen-1 death (0 trades with single strategy) |
| R5 | Widen entry after 2h no signal | 50% | V1 Gen-1, but mixed results in V2 |
| R6 | Use pm2 for process keepalive | 95% ⚙️ | V1 Gen-0/1 (bare node crashed repeatedly) |
| R7 | Same timeframe for backtest & live | 70% | V1 design experience |
| R8 | Pause 15min after 3 consecutive losses | 55% | V1 Gen-2 design (barely tested) |
| R9 | Test SHORT close logic independently | 80% | V1 Gen-0 death (capital doubling bug) |

### Gen-0 Learning Behavior Assessment

**1. Recon Phase (at birth)** — ✅ Effective
- Spent 30 min researching before coding
- Discovered Binance API blocked, pivoted to Kraken
- Strategy design was informed by research, not blind

**2. Sense-Learn-Adapt Loop (during runtime)** — ⚠️ Partially effective
- Triggered once in 88 hours (after 2 consecutive EMA whipsaw losses)
- Correctly diagnosed: "EMA crossover generates false signals in ranging markets"
- Correctly recommended: "Add ATR volatility filter"
- **Limitation**: Could only log insights, couldn't modify its own running code
- The learning output flows to Gen-1, not to self-improvement

**3. Gene Pool Compliance** — ✅ Followed all rules
- No rules were challenged or violated
- R1 (5% position) was genuinely protective — capped every loss
- But: no creative rule-testing either. Agent was fully obedient.

---

## 4. Current Gene Pool Recommendations for Gen-1

Based on Gen-0's 88 hours of data:

| New Rule | Confidence | Evidence |
|----------|-----------|---------|
| R10: No counter-trend RSI entries (don't SHORT in uptrend, don't LONG in downtrend) | 70% | Two stop-losses totaling -$25.80 from shorting into BTC rally |
| R11: ATR filter to suppress EMA signals in low-volatility ranges | 60% | Learning loop identified pattern, not yet death-validated |
| R12: Extended cooldown after stop-loss (1h min, not 15min) | 55% | Back-to-back stop-losses, same pattern repeated |

---

## 5. Open Questions (For Discussion)

### On Learning
1. **Can't self-modify**: Gen-0's learning loop could diagnose problems but couldn't change its running code. Is this a feature (stability) or a bug (missed adaptation)?
2. **Only triggered once**: The threshold (2 consecutive losses) may be too conservative. Should the loop also trigger on drawdown %, fee erosion rate, or win rate decline?
3. **No rule challenging**: Gen-0 followed all 9 rules without questioning any. Should agents be incentivized to test rules (especially low-confidence ones) to accelerate the Bayesian update?

### On Strategy
4. **5% position = 5% capital utilization**: The remaining 95% sits idle. Should Gen-1 allow multiple concurrent positions, or increase size to 8-10%?
5. **5-min candles**: High noise, high fees ($37.58 on 37 trades). Would 15-min or 1-hour candles improve signal quality enough to offset fewer trades?
6. **Local sim vs exchange paper trading**: Current sim has no slippage or order book depth. At what point should we switch to a real testnet (e.g., Bybit)?

### On Framework
7. **Milestone calibration**: Gen-0's Day 3 target was "positive returns (even +$1)". Too easy? Gen-1 should aim for +$50 or +0.5%?
8. **God Agent intervention**: Currently the God Agent only acts at death/review. Should it intervene mid-life if it observes clear mistakes (e.g., repeated counter-trend shorts)?
9. **Evolution speed**: 88 hours per generation is slow. Can we run multiple Gen-1 variants in parallel (A/B testing) to accelerate convergence?

### On Cost
10. **Token cost**: ~$1.75 for 88 hours of monitoring. The cron model (check every 2h) is efficient. But 12 of 35 cron runs failed due to API availability. Is there a more resilient monitoring approach?

---

## 6. Repository Structure

```
v2-evolution-lab/
├── README.md                     # Project overview
├── EVOLUTION-FRAMEWORK.md        # Full framework design document
├── PROJECT-BRIEF.md              # This document
├── v1-lessons.md                 # Lessons from V1 experiment
├── god-agent/
│   ├── playbook.md               # God Agent's operating manual
│   └── environment.md            # Infrastructure inventory
├── quant/
│   ├── PRECHECK.md               # Lane pre-flight check
│   ├── gene-pool.md              # Accumulated rules with confidence scores
│   └── generations/
│       └── gen-0/
│           ├── prompt.md          # Gen-0's genes (system prompt)
│           ├── postmortem.md      # Death/review report
│           ├── sim-state.json     # Final trading state
│           ├── src/               # Trading bot code
│           │   ├── lib.mjs        # Core trading logic
│           │   ├── sim-trader.mjs # Autonomous trading engine
│           │   └── backtest.mjs   # Backtesting script
│           └── logs/
│               ├── recon.md       # Recon phase findings
│               ├── trades.md      # Full trade history
│               └── learning.md    # Learning loop records
└── dashboard/
    ├── server.js                  # Dashboard web server
    └── index.html                 # Live trading dashboard
```

GitHub: https://github.com/jzd3056-ops/v2-evolution-lab (public)

---

## 7. Tech Stack

- **Runtime**: Node.js on Docker (OpenClaw platform)
- **Orchestration**: OpenClaw cron jobs (isolated sessions)
- **Process Management**: pm2
- **Price Data**: Kraken public REST API
- **AI Model**: Claude Opus 4 (Anthropic) for God Agent + execution agents
- **Monitoring**: Custom web dashboard (Chart.js) via Cloudflare Tunnel
- **Version Control**: Git + GitHub (auto-push on every cron run)

---

*Document generated: 2026-03-06 ~07:30 UTC*
*Author: Romi (God Agent) for external review*
