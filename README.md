# V2 Evolution Lab

AI Agent Evolution Experiment V2 — Evolving the perfect execution Agent through death, last words, and learning.

## Design Philosophy

Humans provide only goals and budget. AI automatically finds the optimal execution path through evolution. See [EVOLUTION-FRAMEWORK.md](./EVOLUTION-FRAMEWORK.md) for details.

## V2 Experiment: Quantitative Trading

Focused on a single track to validate the evolution framework.

## Structure

```
v2-evolution-lab/
├── EVOLUTION-FRAMEWORK.md    # Evolution framework design doc
├── README.md
├── god-agent/                # God Agent state and review records
│   ├── playbook.md           # Cross-generation experience base
│   ├── environment.md        # Environment/infrastructure checklist
│   └── reviews/              # Generation review records
├── quant/                    # Quantitative trading track
│   ├── PRECHECK.md           # Track pre-check results
│   ├── generations/          # Code and logs for each generation
│   │   └── gen-0/
│   │       ├── prompt.md     # This generation's genes (System Prompt)
│   │       ├── src/          # Code
│   │       ├── logs/         # Runtime logs
│   │       └── postmortem.md # Last words (generated after death)
│   └── gene-pool.md          # Accumulated hard rules (gene pool)
└── v1-lessons.md             # V1 experiment lessons summary
```
