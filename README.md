# TEA-APP

TEA-APP for The Edifying Assembly.

## Tech Stack

Next.js, React, Node.js API routes, Prisma, SQLite, Tailwind CSS, PDF, XLSX, and CSV export.

## Local Setup

```bash
npm run setup
npm run dev
```

Open `http://localhost:3000`.

Default local login:

```text
Email: admin@theedifyingassembly.org
Password: ChangeMe@12345
```

Change these values in `.env` before production use.

## Environment Variables

```env
DATABASE_URL="file:./tea-app.db"
JWT_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_NAME="TEA-APP"
DEFAULT_SUPER_ADMIN_EMAIL="admin@theedifyingassembly.org"
DEFAULT_SUPER_ADMIN_PASSWORD="ChangeMe@12345"
```

SQLite is used by default. The database file is created by Prisma during setup.

## Database Commands

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

`npm run setup` runs installation, Prisma Client generation, schema sync, and seed.

## Production Build

```bash
npm run build
npm run start
```

## Dockploy / Hostinger Deployment

Use the included `Dockerfile` or `docker-compose.yml`.

Recommended production environment values:

```env
DATABASE_URL="file:/app/data/tea-app.db"
JWT_SECRET="use-a-long-random-production-secret"
DEFAULT_SUPER_ADMIN_EMAIL="admin@theedifyingassembly.org"
DEFAULT_SUPER_ADMIN_PASSWORD="set-a-strong-password"
NEXT_PUBLIC_APP_NAME="TEA-APP"
```

Mount persistent storage to `/app/data` so the SQLite database remains available after redeployments.

Container start command:

```bash
npx prisma db push && npm run db:seed && npm run start
```

The included Docker image already runs that command.

## Folder Structure

```text
app/                 Next.js pages and API routes
components/          Interface components
lib/                 Auth, database, reports, export, and shared logic
prisma/              SQLite schema, migration, and seed script
public/              The Edifying Assembly logo assets
scripts/             Setup helpers
Dockerfile           Container deployment file
docker-compose.yml   Local or server container deployment
```

## Reports and Exports

Reports are available as PDF, Excel, and CSV from the Reports and Exports page. The export route also accepts direct URLs:

```text
/api/reports/export?report=branch-membership&format=pdf
/api/reports/export?report=student-performance&format=xlsx
/api/reports/export?report=attendance&format=csv
```

Available report keys:

```text
branch-membership
birthday
family
training-set
student-performance
pass-rate
scores
attendance
evangelism
certificate-completion
worker-list
branch-comparison
users
training-types
training-levels
curriculum
sermons
```

Supported optional filters include `branch`, `from`, `to`, `month`, `year`, `trainingType`, `trainingLevel`, `trainingSet`, `reportType`, and `status`.

PDF export uses the application's built-in lightweight PDF generator, so report downloads do not depend on server font packages.

## Access Rules

Members and students do not have login accounts. Administrators and coordinators sign in through the login page. Students check results with their unique student code.

## Notes

Use a strong `JWT_SECRET` and change the default admin password before production deployment.

## NPM registry note

This package intentionally does not include a package-lock file. Generate a fresh lock file on the deployment machine so npm resolves packages from the public npm registry instead of any environment-specific registry captured from another machine.

If installation fails because npm is trying to use an inaccessible registry, delete `package-lock.json` and `node_modules`, then run:

```bash
npm cache clean --force
npm config set registry https://registry.npmjs.org/
npm install
npm run db:setup
npm run dev
```

For Dockploy/Hostinger, keep the included `.npmrc` file and use the provided Dockerfile. The SQLite database should be mounted to `/app/data` with `DATABASE_URL="file:/app/data/tea-app.db"`.

## Latest Fixes

This package includes corrected form value handling for string fields such as branch codes and phone numbers, select controls for related records, and dependency-free PDF generation for report and certificate downloads.
