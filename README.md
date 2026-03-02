# V2 Evolution Lab

AI Agent 进化实验 V2 —— 通过死亡、遗言和学习，进化出完美的执行 Agent。

## 设计哲学

人类只给目标和预算，AI 通过进化自动找到最优执行路径。详见 [EVOLUTION-FRAMEWORK.md](./EVOLUTION-FRAMEWORK.md)。

## V2 实验：量化交易

专注单一赛道，验证进化框架的有效性。

## 结构

```
v2-evolution-lab/
├── EVOLUTION-FRAMEWORK.md    # 进化框架设计文档
├── README.md
├── god-agent/                # 上帝 Agent 的状态和复盘记录
│   ├── playbook.md           # 跨代经验库
│   ├── environment.md        # 环境/基建清单
│   └── reviews/              # 代际复盘记录
├── quant/                    # 量化赛道
│   ├── PRECHECK.md           # 赛道预检结果
│   ├── generations/          # 每一代 Agent 的代码和日志
│   │   └── gen-0/
│   │       ├── prompt.md     # 这一代的基因（System Prompt）
│   │       ├── src/          # 代码
│   │       ├── logs/         # 运行日志
│   │       └── postmortem.md # 遗言（死亡后生成）
│   └── gene-pool.md          # 累积的硬性规则（基因库）
└── v1-lessons.md             # V1 实验教训总结
```
