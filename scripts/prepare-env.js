const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = process.cwd();
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

function writeDefaultEnv() {
  const secret = crypto.randomBytes(32).toString('hex');
  const content = [
    'DATABASE_URL="file:./tea-app.db"',
    `JWT_SECRET="${secret}"`,
    'NEXT_PUBLIC_APP_NAME="TEA-APP"',
    'DEFAULT_SUPER_ADMIN_EMAIL="admin@theedifyingassembly.org"',
    'DEFAULT_SUPER_ADMIN_PASSWORD="ChangeMe@12345"',
    ''
  ].join('\n');
  fs.writeFileSync(envPath, content);
}

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(examplePath)) {
    const source = fs.readFileSync(examplePath, 'utf8');
    const withSecret = source.replace(/JWT_SECRET="[^"]*"/, `JWT_SECRET="${crypto.randomBytes(32).toString('hex')}"`);
    fs.writeFileSync(envPath, withSecret.endsWith('\n') ? withSecret : `${withSecret}\n`);
  } else {
    writeDefaultEnv();
  }
  console.log('Created .env for local development. Update it before production deployment.');
} else {
  console.log('.env already exists.');
}
