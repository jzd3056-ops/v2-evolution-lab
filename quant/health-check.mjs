// Gen-1 Health Check Script — no LLM dependency
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VARIANTS = [
  { name: 'gen1a-sim', dir: 'generations/gen-1/gen-1a', label: 'Gen-1A (Control)' },
  { name: 'gen1b-sim', dir: 'generations/gen-1/gen-1b', label: 'Gen-1B (Trend Filter)' },
  { name: 'gen1c-sim', dir: 'generations/gen-1/gen-1c', label: 'Gen-1C (15-min)' },
];

const MAX_STALE_MS = 2 * 60 * 60 * 1000; // 2 hours

function checkPm2(processName) {
  try {
    const out = execSync(`npx pm2 jlist 2>/dev/null`, { encoding: 'utf8' });
    const list = JSON.parse(out);
    const proc = list.find(p => p.name === processName);
    if (!proc) return { running: false, status: 'not found' };
    return { running: proc.pm2_env.status === 'online', status: proc.pm2_env.status };
  } catch {
    return { running: false, status: 'pm2 error' };
  }
}

function checkState(dir) {
  const stateFile = path.join(__dirname, dir, 'sim-state.json');
  try {
    const stat = fs.statSync(stateFile);
    const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    const staleMs = Date.now() - stat.mtimeMs;
    return {
      exists: true,
      stale: staleMs > MAX_STALE_MS,
      lastModified: new Date(stat.mtimeMs).toISOString(),
      staleMinutes: Math.round(staleMs / 60000),
      cash: state.cash,
      totalPnL: state.totalPnL,
      totalTrades: state.totalTrades,
      position: state.position?.side || 'NONE',
    };
  } catch {
    return { exists: false, stale: true };
  }
}

const alerts = [];
const statuses = [];

for (const v of VARIANTS) {
  const pm2 = checkPm2(v.name);
  const state = checkState(v.dir);

  let status = `${v.label}: `;
  if (!pm2.running) {
    alerts.push(`🔴 ${v.label} — pm2 process "${v.name}" is ${pm2.status}`);
    status += `DOWN (${pm2.status})`;
  } else {
    status += 'RUNNING';
  }

  if (!state.exists) {
    alerts.push(`🔴 ${v.label} — sim-state.json missing`);
  } else if (state.stale) {
    alerts.push(`🟡 ${v.label} — state not updated in ${state.staleMinutes} min (>${MAX_STALE_MS / 60000} min threshold)`);
  }

  if (state.exists) {
    status += ` | Cash: $${state.cash?.toFixed(2)} | PnL: $${state.totalPnL?.toFixed(2)} | Trades: ${state.totalTrades} | Pos: ${state.position} | Updated: ${state.lastModified}`;
  }

  statuses.push(status);
}

console.log('=== Gen-1 Health Check ===');
console.log(`Time: ${new Date().toISOString()}\n`);
statuses.forEach(s => console.log(s));

if (alerts.length > 0) {
  console.log('\n⚠️ ALERTS:');
  alerts.forEach(a => console.log(a));
  process.exit(1);
} else {
  console.log('\n✅ All variants healthy');
}
