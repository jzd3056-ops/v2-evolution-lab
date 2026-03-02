# Gen-0 侦察报告
> 2026-03-02 11:09 UTC

## 来源
- Investopedia: Algorithmic Trading Basics
- Gene pool: 前代死因分析
- 内建知识: 加密货币交易策略

## 关键发现

### 策略选择
1. **EMA Crossover (趋势跟踪)**: 短期EMA(9) vs 中期EMA(21)，适合趋势市
2. **RSI Mean Reversion (均值回归)**: RSI超买/超卖反转，适合震荡市
3. 两策略互补：趋势市用EMA，震荡市用RSI

### 前代致命错误（基因库总结）
1. `capital = qty * price` 导致资金计算错误 → 必须用 cash + position 分离
2. SHORT平仓逻辑未单独测试 → 需要专门测试
3. 止损太窄频繁止损 / 太宽亏损过大 → 回测校准
4. 裸跑node挂掉 → pm2保活
5. 单策略无法适应市况变化 → 双策略

### 常见algo trading错误
- 过拟合回测数据
- 忽略滑点和手续费（模拟盘也要模拟0.1%手续费）
- 情绪化修改参数（应该基于数据）
- 仓位过大（限制5%）

## 策略设计
- **Strategy A (Trend)**: EMA(9)/EMA(21) crossover, 5min candles
- **Strategy B (MeanRevert)**: RSI(14), oversold<30 buy / overbought>70 sell, 5min candles
- **Risk**: 5% max position, 2% stop-loss, 3% take-profit
- **Fee simulation**: 0.1% per trade
- **Death check**: daily loss > 5% → exit(1)
- **Cooldown**: 3 consecutive losses → 15min pause
- **Idle**: 2h no signal → widen entry (EMA threshold, RSI bands)
