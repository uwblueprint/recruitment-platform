const { existsSync, copyFileSync, chmodSync } = require('fs');
const path = require('path');

// Skip in CI — hooks are irrelevant there
if (process.env.CI) process.exit(0);

const root = path.join(__dirname, '..');
const gitHooksDir = path.join(root, '.git', 'hooks');

if (!existsSync(gitHooksDir)) process.exit(0);

for (const hook of ['pre-commit', 'post-merge']) {
  const src = path.join(root, 'hooks', hook);
  const dst = path.join(gitHooksDir, hook);
  if (existsSync(src)) {
    copyFileSync(src, dst);
    chmodSync(dst, 0o755);
    console.log(`git hook installed: ${hook}`);
  }
}
