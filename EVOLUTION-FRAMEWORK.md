# AI Agent Evolution Framework v2

> Humans provide only goals and budget. AI automatically finds the optimal execution path through evolution.

---

## 1. Core Philosophy

### 1.1 Natural Selection Analogy

| Biological Evolution | Agent Evolution |
|---------------------|----------------|
| Genes | System Prompt |
| Individual | One generation of Agent (Gen-N) |
| Environment | Tools/infrastructure/coordination built by God Agent |
| Natural Selection | Milestone-based death judgment |
| Last Words/Fossils | Postmortem |
| Genetic Mutation | God Agent rewrites next generation's Prompt |
| Individual Learning | Agent actively researches and adapts during its lifetime |
| Species Adaptation | Final converged perfect Prompt + perfect environment |

### 1.2 Ultimate Goal

Through massive Agent deaths and learning, brute-force converge on:
- **Perfect execution genes** (System Prompt) — instinctively knows what to do
- **Perfect runtime environment** (tools/infrastructure/coordination) — everything needed at hand
- **Perfect learning ability** (metacognitive genes) — knows how to learn when facing the unknown

All three co-evolve and adapt to each other.

---

## 2. System Architecture

```
┌─────────────────────────────────────────┐
│              Human (Adrian)              │
│      Provides: Goals + Budget + Decisions│
│      Does NOT provide: How to do it      │
└──────────────────┬──────────────────────┘
                   │ Goals/Budget/Major Decisions
                   ▼
┌─────────────────────────────────────────┐
│           God Agent (Romi)               │
│                                          │
│  Responsibilities:                       │
│  ① Track Pre-check — Can it survive?     │
│  ② Environment Building — Build tools    │
│  ③ Gene Design — Write/optimize Prompts  │
│  ④ Generation Review — Analyze deaths    │
│  ⑤ Meta-ability Optimization — Improve   │
│     the "learning" strategy itself        │
│                                          │
│  Triggers:                               │
│  - When Agent dies (postmortem trigger)   │
│  - Periodic review (low freq, 1-2x/day)  │
│  - Human intervention                    │
└──────────────────┬──────────────────────┘
                   │ Prompt + Environment + Tools
                   ▼
┌─────────────────────────────────────────┐
│          Execution Agent (Gen-N)         │
│                                          │
│  Lifecycle:                              │
│  ① Birth — Inherit genes (Prompt)        │
│  ② Recon — Research domain best practices│
│  ③ Execute — Work toward goals           │
│  ④ Perceive — Observe results, detect    │
│     anomalies                            │
│  ⑤ Learn — Actively research when results│
│     are poor                             │
│  ⑥ Adapt — Adjust behavior based on      │
│     learning                             │
│  ⑦ Death or Survival → Pass on last words│
└─────────────────────────────────────────┘
```

---

## 3. Three-Layer Evolution Mechanism

### 3.1 Environment Evolution (God Agent's responsibility)

God Agent continuously optimizes the execution Agent's runtime environment:

- **Tool layer**: What capabilities does the Agent need? Search, browser, API, database?
- **Infrastructure layer**: Process keepalive (pm2), state persistence, logging system
- **Coordination layer**: Information sharing between tracks (SHARED-STATE), linkage mechanisms
- **Monitoring layer**: Anomaly detection, auto-recovery

**Evolution signal**: Infrastructure gaps repeatedly mentioned in Agent postmortems → God Agent fills them.

### 3.2 Behavioral Evolution (Cross-generation Prompt optimization)

Each generation's System Prompt is its "genes." God Agent optimizes through postmortem review:

**Encoding rules**:
- Lessons from postmortems → Encoded as **hard constraints** (not "suggested reading: postmortem")
- Example: Gen-0 position bug → Gen-1 Prompt hardcodes "position never exceeds 5%, track cash+position separately"
- Example: Gen-1 too conservative → Gen-2 Prompt hardcodes "2h with no signal → widen entry conditions by 20%"

**Gene format**:
```markdown
## Hard Rules (Paid for with previous generations' lives)
- [ ] Position never exceeds 5% of total capital
- [ ] 2 hours with no signal → Auto-widen entry conditions
- [ ] DEATH signal must trigger process.exit(1)

## Soft Strategies (Can be adjusted based on learning)
- Prefer mean reversion strategy
- Suggested check interval: 30 minutes
```

Hard rules only grow (unless God Agent determines a rule is outdated). Soft strategies can be adjusted by the Agent based on learning.

### 3.3 Meta-ability Evolution (Optimizing the learning ability itself)

Learning behavior parameters are also part of the genes and subject to evolutionary selection:

| Parameter | Initial Value | Evolution Direction |
|-----------|--------------|-------------------|
| Recon time ratio | 20% | Adjust based on cause of death: died from "no research" → increase; died from "too much research, no action" → decrease |
| Learning trigger condition | 2 consecutive ineffective actions | Adjustable threshold and criteria |
| Learning source priority | Search > Competitor analysis > Docs | Rank by which sources actually helped survival |
| Learning depth | Quick scan of 3-5 cases | Adjust based on task complexity |
| Feedback detection frequency | After each action | Some tasks may need batch actions before detecting |

God Agent observes during generation reviews: "Was this generation's learning behavior effective?" and adjusts the next generation's learning genes.

---

## 4. Track Pre-check (Life-or-death judgment before birth)

**Before any Agent is born**, God Agent must complete a track feasibility assessment:

### Pre-check Checklist

```markdown
## Track Pre-check: [Track Name]

### Closed-loop Check
- [ ] Can Agent autonomously register/open accounts? (No phone, ID, or face verification needed)
- [ ] Can Agent autonomously acquire first users/traffic? (Distribution channels that don't require human identity)
- [ ] Can Agent autonomously complete the transaction/monetization loop?
- [ ] Are there any steps in the pipeline that require human intervention?

### Environment Check
- [ ] Does the target platform have an API or automation interface?
- [ ] Are there anti-scraping/anti-automation mechanisms? (Cloudflare, CAPTCHA, IP rate limiting)
- [ ] Are there special network requirements? (VPN, China mainland IP, etc.)

### Cost Check
- [ ] Estimated per-generation Agent runtime cost (tokens + time)
- [ ] Estimated number of generations to converge
- [ ] Within budget?

### Human Dependencies (if any)
- Explicitly list which steps require human intervention
- Mark as BLOCKER, resolve before Agent birth
```

**Conclusion**:
- ✅ All passed → Launch track
- ⚠️ Has human dependencies but resolvable → Resolve first, then launch
- ❌ Has insurmountable hard constraints → Abandon track

---

## 5. Execution Agent Lifecycle

### 5.1 Birth

```markdown
Agent receives a Prompt containing:
1. Goals and constraints
2. Hard rules (genes inherited from previous generations)
3. Learning behavior instructions
4. Available tools and environment description
5. Key lessons from previous generations (encoded, not raw postmortems)
```

### 5.2 Recon Phase (Driven by learning genes)

Agent must complete reconnaissance before execution:

```
1. Search for 3-5 successful cases in the target domain
2. Analyze their common patterns
3. Check if own plan aligns with these patterns
4. If not, adjust the plan
5. Record recon findings to logs
```

Recon time must not exceed [learning time ratio]% of total available time (controlled by learning genes).

### 5.3 Execution Phase

Execute toward goals. Record results after each action.

### 5.4 Perceive → Learn → Adapt (Loop)

```
if N consecutive actions fail to meet expectations:
    pause execution
    search "why [specific problem] doesn't work"
    analyze search results
    propose alternatives
    choose best alternative and continue
    record learning process to logs
```

### 5.5 Death and Last Words

When milestones are not met by deadline, Agent writes its last words:

```markdown
## Postmortem Template

### Who I Am
Gen-N, [Track Name], survived [duration]

### What I Did
[List key actions chronologically]

### What Worked
[Which actions produced positive results]

### What Didn't Work
[Which actions wasted time]

### Cause of Death Analysis
- Root cause: [one sentence]
- Type: Environment issue / Strategy issue / Insufficient learning / Track not viable

### Advice for Next Generation
- Hard rule suggestions: [what hard constraints to add]
- Strategy suggestions: [how to adjust strategy]
- Learning suggestions: [what to learn / how to learn]

### Advice for God Agent
- Environment improvements: [what tools/infrastructure are missing]
- Prompt improvements: [which instructions were unclear/ambiguous]
```

---

## 6. God Agent's Generation Review Process

Whenever a generation dies or completes its lifecycle, God Agent executes:

```
1. Read postmortem/final report
2. Classify cause of death:
   a. Environment/infrastructure issue → Optimize environment
   b. Behavior/strategy issue → Optimize next generation's Prompt
   c. Learning ability issue → Optimize learning genes
   d. Track not viable → Close track
3. Extract hard rules (lessons paid for with lives)
4. Evaluate whether learning behavior was effective:
   - Did Agent learn when it should have?
   - Were the learning sources and depth appropriate?
   - Did learning actually change behavior?
5. Write next generation's Prompt
6. Update track Playbook
7. If necessary, adjust cron frequency, timeout settings, and other runtime parameters
```

---

## 7. Notification and Frequency Design

### Principle: Event-driven, not polling-driven

| Event | Notify human? | Method |
|-------|--------------|--------|
| Agent death | ✅ Yes | Brief cause of death + next gen plan |
| Milestone reached | ✅ Yes | One-line confirmation |
| Human decision needed | ✅ Yes | Clear question + options |
| Normal operation | ❌ No | Silent operation |
| Blocker requiring human intervention | ✅ Yes | Notify once, don't nag |

### Suggested Cron Frequencies

| Role | Frequency | Rationale |
|------|-----------|-----------|
| God Agent (review) | Triggered on Agent death + 1x daily | On-demand, not scheduled |
| Execution Agent (short-cycle tasks) | 1-4 hours | Match actual decision frequency |
| Execution Agent (long-cycle tasks, e.g. quant) | 2-6 hours | No need for frequent checks during sideways markets |
| Monitoring (health check) | 6-12 hours | Only check if process is alive |

---

## 8. Lessons from V1 Experiment (Encoded)

The following lessons come from the first experiment on 2026-02-27, now encoded as framework rules:

1. **Track pre-check is mandatory** — 3 out of 4 tracks died from "requires human identity" hard constraints
2. **Cron frequency must match decision frequency** — 30-minute patrols produced 100+ useless reports
3. **Death pressure causes ineffective repetition** — "Fail and you die" made Agent spam articles nobody read
4. **Postmortems must be encoded as hard rules** — "Read postmortem" is less reliable than writing it into the prompt
5. **Learning ability is part of the genes** — Agent needs to actively research while alive, not blindly execute
6. **God Agent is an evolution designer, not ops** — Core job is analyzing patterns and optimizing genes
7. **Only notify humans on state changes** — Avoid information overload

---

## 9. Next Steps

- [ ] Select new tracks based on this framework (filtered through pre-check checklist)
- [ ] Redesign God Agent's Prompt (from ops → evolution designer)
- [ ] Design first execution Agent Prompt template (with learning genes)
- [ ] Determine reasonable cron frequencies and notification strategy
- [ ] Begin V2 experiment
