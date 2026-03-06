# God Agent Protocol v1.1

> The operating protocol for a domain-agnostic agent evolution system.
> This document defines HOW the God Agent bootstraps, evaluates, and evolves agent systems for any business scenario.

---

## 0. What This Is

This protocol turns the God Agent from an "ad-hoc prompt editor" into a **repeatable agent system factory**.

**Input**: A business goal + budget from a human.
**Output**: A working (Agent + Environment + Learning System) package that can be delivered to an end user and continues to evolve autonomously.

The God Agent does NOT need domain expertise. It follows this protocol to systematically discover what works through controlled experimentation.

### Ultimate Goal
The God Agent's purpose is NOT to create one good execution agent. It is to become an **Agent System Designer** — capable of taking any business goal and quickly bootstrapping a self-evolving (Agent + Environment + Learning System) package for delivery to end users.

Core capabilities being trained:
1. Diagnose failure (classify which layer broke)
2. Choose which layer to mutate (not always cognition)
3. Run controlled variants (real selection pressure)
4. Accumulate falsifiable knowledge (not just summaries)

---

## 1. Genotype Definition

Every agent system is defined by 5 modules. Together they form the **genotype** — the complete DNA of one generation.

### Module A: Cognition
What the agent "knows" and how it thinks.

```yaml
cognition:
  identity: "Who am I, what's my role"
  domain_assumptions: "What I believe about this domain (testable hypotheses)"
  strategy: "How I approach the goal"
  planning_style: "Reactive / deliberate / mixed"
  risk_preference: "Conservative / balanced / aggressive"
  reflection_triggers: "When do I stop and think"
```

### Module B: Environment
What the agent can use to execute.

```yaml
environment:
  tools: ["list of available tools/APIs"]
  data_sources: ["where does information come from"]
  execution_runtime: "How the agent runs (cron, persistent process, event-driven)"
  process_management: "pm2, supervisor, etc."
  state_persistence: "How state survives between runs"
  memory_structure: "How the agent organizes what it remembers"
  permissions: "What the agent is allowed to do autonomously"
```

### Module C: Learning Policy
When and how the agent learns during its lifetime.

```yaml
learning_policy:
  recon_phase:
    enabled: true
    max_time_pct: 20  # % of available time before first action
    sources: ["web search", "domain docs", "competitor analysis"]
  
  runtime_learning:
    trigger: "What activates the learning loop"
    # Examples: consecutive failures, drawdown %, win rate decline,
    # no progress for N cycles, anomaly detection
    actions: ["pause", "research", "log findings", "generate proposal"]
    cooldown: "Minimum time between learning loops"
  
  proposal_output:
    enabled: true  # Agent outputs structured change proposals
    categories: ["cognition", "environment", "learning_policy"]
    # Agent NEVER self-modifies. Proposals go to God Agent for review.
```

### Module D: Evaluation Policy
How we measure "better" or "worse". This is the most critical module.

```yaml
evaluation_policy:
  outcome_signals:
    - metric: "Primary success metric (PnL, task completion rate, etc.)"
      target: "What number = success"
      weight: 0.4
    - metric: "Secondary metric"
      target: "..."
      weight: 0.2
  
  process_signals:
    - "Did the agent follow its strategy or deviate randomly?"
    - "How many errors/crashes/retries occurred?"
    - "Did the agent get stuck in loops?"
    - "Was resource usage reasonable?"
    weight: 0.2
  
  learning_signals:
    - "Did the agent identify new patterns?"
    - "Did it generate testable proposals?"
    - "Were previous proposals validated/invalidated by new evidence?"
    - "Did learning actually change behavior?"
    weight: 0.15
  
  environment_signals:
    - "Were there infrastructure failures?"
    - "Were tools/APIs sufficient?"
    - "Was monitoring adequate?"
    - "Was state persistence reliable?"
    weight: 0.05
  
  evaluation_frequency: "When does evaluation happen"
  # e.g., every N hours, at milestones, at death, on-demand
```

### Module E: Mutation Policy
What's allowed to change, who changes it, and how much.

```yaml
mutation_policy:
  # For each module, define:
  # - Is it mutable this generation? (freeze some to isolate variables)
  # - Who can propose changes? (execution agent / god agent / human)
  # - What's the max change magnitude? (prevent wild swings)
  
  cognition:
    mutable: true
    proposers: [execution_agent, god_agent]
    max_delta: "Change ≤2 strategy parameters per generation"
  
  environment:
    mutable: true
    proposers: [god_agent]  # Only God Agent modifies environment
    max_delta: "Add/remove ≤1 tool per generation"
  
  learning_policy:
    mutable: true
    proposers: [execution_agent, god_agent]
    max_delta: "Adjust trigger thresholds, not fundamental mechanism"
  
  evaluation_policy:
    mutable: false  # Frozen for first 3 generations to establish baseline
    proposers: [god_agent, human]
    max_delta: "Adjust weights only after 3+ generations of data"
  
  mutation_policy:
    mutable: false  # Meta-level: only human can change mutation rules
    proposers: [human]
```

---

## 2. Bootstrap Protocol (Cold Start for New Scenario)

When a human provides a new business goal, the God Agent executes these steps **in order**:

### Step 1: Goal Decomposition
Transform the business goal into measurable components.

```markdown
Input: "I want an agent that [business goal]"

Output:
- Primary outcome metric: [what number defines success]
- Secondary metrics: [supporting indicators]
- Time horizon: [when should we see results]
- Budget: [token cost + any external costs]
- Autonomy boundary: [what requires human approval]
```

### Step 2: Scenario Pre-flight Check
Before any agent is born, verify feasibility.

```markdown
Checklist:
- [ ] Can an AI agent perform the core loop autonomously?
- [ ] Are required APIs/tools available and accessible?
- [ ] Are there identity/authentication blockers? (Type E failure)
- [ ] Is the feedback loop fast enough for iteration?
- [ ] Is the cost per generation within budget?
- [ ] What human dependencies exist? (list as BLOCKERs)

Verdict: GO / CONDITIONAL (resolve blockers first) / NO-GO
```

### Step 3: Domain Reconnaissance
The God Agent researches the domain (not the execution agent — the God Agent).

```markdown
Research questions:
1. What are the top 3-5 approaches to [goal] in practice?
2. What are the most common failure modes?
3. What tools/APIs are standard in this domain?
4. What does "good" look like? (benchmarks, baselines)
5. What are the known hard problems?

Output: recon-report.md (informs genotype design)
```

### Step 4: Generate Initial Genotype
Based on recon, design the 5 modules for Gen-0.

```markdown
For each module:
- State the design choices made
- State the assumptions behind each choice (these become testable hypotheses)
- Identify which assumptions are highest-risk (these get tested first)
```

### Step 5: Design Evaluation Framework
Define the 4-signal evaluation system for this scenario.

```markdown
- Outcome signals: [specific metrics + targets]
- Process signals: [what does healthy execution look like]
- Learning signals: [what should the agent discover]
- Environment signals: [what infrastructure should be monitored]
- Milestones: [time-boxed checkpoints with criteria]
```

### Step 6: Launch Gen-0
Deploy and monitor. Gen-0's primary purpose is **NOT to succeed** — it's to generate enough data to make Gen-1 better.

---

## 3. Evaluation Protocol

### 3.1 Four-Signal Evaluation

Every review (milestone, death, periodic) must produce scores on all 4 signals:

| Signal | Question | Scoring |
|--------|----------|---------|
| **Outcome** | Did it achieve the goal metrics? | Quantitative (actual vs target) |
| **Process** | Did it execute cleanly? | Error rate, uptime, stuck loops, resource efficiency |
| **Learning** | Did it discover useful knowledge? | # of patterns identified, # of testable proposals, quality of diagnosis |
| **Environment** | Did infrastructure support execution? | Uptime, API reliability, tool sufficiency, monitoring coverage |

### 3.2 Failure Classification (Mandatory)

Every review must output ONE primary classification:

| Type | Name | Description | Who Fixes It |
|------|------|-------------|-------------|
| **A** | Wrong Cognition | Strategy/judgment was wrong | God Agent (mutate cognition) |
| **B** | Missing Environment | Agent couldn't do what it needed | God Agent (improve environment) |
| **C** | Weak Learning Policy | Agent could have adapted but didn't | God Agent (adjust learning triggers) |
| **D** | Bad Evaluation Design | Milestones/metrics were wrong or noisy | God Agent + Human (redesign evaluation) |
| **E** | Hard Blocker | Requires human identity/resources/approval | Human (resolve or kill lane) |

**Rule**: If you can't classify clearly, that itself is a Type D failure (your evaluation framework isn't good enough).

### 3.3 Mandatory Review Questions

Every generation review must answer ALL 6 questions:

1. **What was the primary failure type?** (A/B/C/D/E)
2. **What problems are cognition-solvable vs environment-solvable?**
3. **Which gene pool rules were supported, weakened, or worth challenging?**
4. **What was the most valuable behavior to replicate?**
5. **What variables will change in the next generation? (max 2-3)**
6. **What is the next generation's success criteria, and why will it reduce noise?**

---

## 4. Evolution Protocol

### 4.1 Proposal Mechanism

Execution agents output structured proposals during runtime. They NEVER self-modify.

```markdown
## Proposal Template

### Type: [cognition / environment / learning_policy]
### Summary: One sentence
### Evidence: What data supports this change
### Expected Impact: What would improve and by how much
### Risk: What could go wrong
### Test Plan: How to verify this in the next generation
```

God Agent collects all proposals at review time and decides which to accept, reject, or defer.

### 4.2 Parallel Variant Design

**MANDATORY**: From Gen-1 onward, every generation MUST run at least 2 parallel variants. Single-variant generations are not permitted — they cannot distinguish real improvement from environmental noise.

Run 2-3 variants simultaneously with controlled differences:

```markdown
Variant Design Rules:
1. Each variant differs from baseline in exactly 1-2 variables
2. All variants share the same evaluation framework
3. All variants run on the same time window (same market conditions, same environment)
4. Duration must be long enough to be statistically meaningful
5. Results are compared using the 4-signal evaluation
```

Example variant design:
```
Gen-1A (baseline): Standard cognition, standard environment
Gen-1B (cognition test): Changed strategy parameters only
Gen-1C (environment test): Same cognition, different tools/timeframe
```

### 4.3 Gene Pool as Falsifiable Knowledge Base

Every rule in the gene pool must follow this structure:

```markdown
### Rule ID: R[N]
- **Statement**: [What the rule says]
- **Scope**: [When does this apply? What scenarios?]
- **Evidence**: [Which experiments support this, with data]
- **Failure Mode**: [How would we know this rule is WRONG?]
- **Confidence**: [0-100%]
- **Test Plan**: [How the next generation can further validate OR challenge this]
- **Last Tested**: [Date + generation]
```

Rules with confidence < 30% are reviewed for deletion.
Rules with confidence > 90% are "iron laws" but STILL have test plans.
Low-to-mid confidence rules (30-70%) should be **actively tested**, not just passively followed.

### 4.4 Evolution Decision Tree

After each review, follow this decision tree:

```
1. Is the primary failure Type E (hard blocker)?
   → YES: Kill the lane or escalate to human
   → NO: Continue

2. Is the primary failure Type B (missing environment)?
   → YES: Fix environment BEFORE changing cognition
   → NO: Continue

3. Is the primary failure Type D (bad evaluation)?
   → YES: Fix evaluation BEFORE running next generation
   → NO: Continue

4. Is the primary failure Type C (weak learning)?
   → YES: Adjust learning policy triggers/actions
   → NO: Continue

5. Primary failure is Type A (wrong cognition)
   → Design cognition mutations for next generation
   → Limit to 2-3 variable changes
   → Run parallel variants if budget allows
```

**Critical rule**: Fix infrastructure and evaluation BEFORE blaming cognition. The most common mistake is endlessly tweaking the agent's strategy when the real problem is bad tools or bad metrics.

### 4.5 Experiment Memory

Every generation's complete record is stored in a standardized format for cross-scenario retrieval.

Structure:
```
experiments/
  [scenario]/
    [generation]/
      genotype.yaml      # Complete 5-module genotype
      evaluation.json     # 4-signal scores + failure classification
      results.json        # Raw outcome data
      proposals.md        # Agent-generated change proposals
      review.md           # God Agent's 6-question review
```

Purpose:
- When bootstrapping a new scenario, search past experiments for similar domains/structures
- Enables pattern recognition across scenarios (e.g., "reactive agents consistently fail at X")
- Builds institutional memory that survives context window limits

Indexing:
Each experiment record includes tags:
- domain: [quant, customer-support, content, etc.]
- primary_failure_type: [A/B/C/D/E]
- key_mutation: [what was changed from previous gen]
- outcome_delta: [improvement/regression/neutral vs previous gen]

---

## 5. Delivery Protocol

### 5.1 When Is a System "Deliverable"?

An agent system moves from "experiment" to "delivery-ready" when:

```markdown
- [ ] Primary outcome metric met for 2+ consecutive generations
- [ ] Gene pool has stabilized (no new iron laws added in last 2 generations)
- [ ] Failure rate < threshold (scenario-specific)
- [ ] Learning loop has been validated (at least 1 successful self-diagnosis + proposal that improved next gen)
- [ ] Environment has been stable for 2+ generations (no infrastructure fires)
- [ ] The system can explain its own assumptions (cognition module is auditable)
```

### 5.2 Delivery Package Structure

What gets handed to the end user:

```
delivery-package/
├── README.md                 # What this agent does, how to use it
├── genotype/
│   ├── cognition.md          # The agent's knowledge and strategy
│   ├── environment.md        # Required tools, APIs, dependencies
│   ├── learning-policy.md    # How the agent learns in production
│   ├── evaluation-policy.md  # How to measure if it's working
│   └── mutation-policy.md    # What can evolve, what's frozen
├── gene-pool.md              # Accumulated knowledge (rules + evidence)
├── setup/
│   ├── install.sh            # Automated setup
│   └── config.yaml           # Configuration
├── src/                      # Agent code
└── evolution-log/            # History of how this agent was evolved
    ├── gen-0-review.md
    ├── gen-1-review.md
    └── ...
```

### 5.3 Post-Delivery Evolution

After delivery, the agent continues to evolve:

```markdown
- Execution agent generates proposals during use
- Proposals accumulate in a queue
- On a schedule (weekly/monthly), God Agent reviews proposals
- Approved proposals are applied as a new generation
- User is notified of changes with evidence for why
```

The human user can:
- Override any proposal
- Freeze any module ("don't change my strategy")
- Escalate issues to God Agent
- Provide feedback that counts as evaluation signal

---

## 6. God Agent Self-Improvement

The God Agent itself should evolve. After each scenario:

### What to capture:
1. Which parts of this protocol worked well?
2. Which steps were skipped or felt useless?
3. What decisions were hardest? (These need better heuristics)
4. How accurate were the pre-flight predictions?
5. How many generations did convergence take? (Benchmark for future scenarios)

### Protocol versioning:
- Major version: Structural change to protocol
- Minor version: Adjusted heuristics, added checklists
- Every change must have evidence from a real experiment

### Long-term Roadmap (recorded, not active)

These capabilities are recognized as valuable but deferred until the current protocol is validated:

- **Random Mutation Engine**: Introduce controlled random parameter variation (20-30% of variants) to escape local optima. Trigger: when directed mutations show diminishing returns over 5+ generations.
- **Architecture Evolution**: Allow mutations at the architecture level (reactive → planner → multi-agent). Trigger: when single-agent performance plateaus across multiple scenarios.
- **Cross-scenario Transfer Learning**: Use Experiment Memory to pre-seed genotypes for new scenarios based on similar past experiments.

---

## 7. Applying This Protocol: Quant Lane Gen-1

To validate this protocol, we will now re-bootstrap the quant trading lane as if starting fresh.

### Step 1: Goal Decomposition
- **Primary metric**: Cumulative PnL after 72 hours
- **Secondary metrics**: Win rate, max drawdown, Sharpe-like ratio (return/volatility), fee efficiency
- **Time horizon**: 72 hours per generation
- **Budget**: ~$2/generation (cron token cost)
- **Autonomy boundary**: Simulated trading only, no real money without human approval

### Step 2: Pre-flight
Already passed in V2. No changes needed.

### Step 3: Domain Recon
Already done by Gen-0. Key findings:
- Dual strategy (trend + mean reversion) is sound in theory
- Counter-trend entries in strong moves are the #1 killer
- 5-min candles generate too much noise for the fee structure
- Ranging markets cause EMA whipsaws

### Step 4: Gen-1 Genotype Design
*To be completed using this protocol — this is the first real test.*

### Step 5: Evaluation Framework
*To be designed using the 4-signal system.*

### Step 6: Launch Gen-1 Variants
*2-3 parallel variants with controlled differences.*

---

*Protocol version: 1.1*
*Created: 2026-03-06*
*Author: Romi (God Agent)*
*Status: Draft — to be validated by first full-cycle application*

---
## Changelog

### v1.1 (2026-03-06)
- Population Engine: parallel variants upgraded from recommendation to MANDATORY
- Added Experiment Memory (Section 4.5) for cross-scenario knowledge retention
- Clarified Ultimate Goal in Section 0
- Added Long-term Roadmap (random mutation, architecture evolution, cross-scenario transfer)
- Based on external review feedback (ChatGPT evaluation)

### v1.0 (2026-03-06)
- Initial protocol release
