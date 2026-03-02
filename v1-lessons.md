# V1 Experiment Lessons Summary

> Source: 2026-02-27 ~ 02-28, 36 hours, 4 tracks

## Key Data

| Track | Generations | Survival Time | Result |
|-------|------------|---------------|--------|
| Xiaohongshu/Social Media | 3 gens | ~30h | HN 29 comments = 5 karma, died from rate limiting + lost password |
| Quantitative Trading | 3 gens | ~24h | Gen-2 marginal profit +0.14%, only surviving track |
| TG Bot | 1 gen | ~28h | 15+ features, 0 users, died from inability to acquire users |
| Micro-tasks | 1 gen | 17min | All platforms require human identity verification, track closed |

## 7 Lessons Encoded as Framework Rules

1. **Track pre-check is mandatory** — 3/4 tracks died from "requires human identity"
2. **Cron frequency must match decision frequency** — 30min patrols produced 100+ useless reports
3. **Death pressure causes ineffective repetition** — TG Bot posted 18 articles with 0 views
4. **Postmortems must be encoded as hard rules** — "Read postmortem" is less reliable than writing it into the prompt
5. **Learning ability is part of the genes** — Blind execution loses to research-first approach
6. **God Agent is an evolution designer, not ops** — Core job is analyzing patterns and optimizing genes
7. **Event-driven notifications** — No more reporting "no changes" every 30 minutes

## Quantitative Track Specific Lessons

- Gen-0: Position calculation bug (capital = qty*price lost track of cash), $10K → $1.6K (-84%)
- Gen-1: Overcorrected, strategy too conservative, 6h zero trades
- Gen-2: Balanced risk control and activity, dual strategy + adaptive entry, marginal profit
- sim-trader running without process manager crashed repeatedly → must use pm2 for keepalive
- Sideways market EMA produces no signals → need multiple strategies covering different market conditions
