# Installation Instructions

## Quick Install

Run these commands to install all dependencies:

```bash
# Fix NPM permissions first (if needed)
sudo chown -R $(whoami) ~/.npm

# Install Puck with legacy peer deps flag
npm install @measured/puck --legacy-peer-deps

# Install TypeScript and dev dependencies
npm install --save-dev typescript @types/react @types/react-dom prettier

# Verify installation
npm list @measured/puck typescript
```

## Alternative: Install All at Once

```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm

# Install everything in one go
npm install --legacy-peer-deps
```

## Troubleshooting

### Permission Errors

If you see `EACCES` or `EPERM` errors:

```bash
# Option 1: Fix npm cache
sudo chown -R $(whoami) ~/.npm

# Option 2: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # or ~/.zshrc
nvm install 18
nvm use 18
npm install --legacy-peer-deps
```

### React 19 Peer Dependency Warnings

This is expected! The `--legacy-peer-deps` flag handles this. Puck may not officially support React 19 yet, but it works fine.

### Missing Types

If you see TypeScript errors about missing types:

```bash
npm install --save-dev @types/react @types/react-dom
```

## Verify Installation

After installation, verify everything is set up correctly:

```bash
# Check for TypeScript errors
npm run typecheck

# Check for linting errors
npm run lint

# View installed packages
npm list --depth=0
```

You should see:
- ✅ `@measured/puck@0.15.0` (or similar)
- ✅ `typescript@5.3.0` (or similar)
- ✅ `@types/react@18.2.0` (or similar)

## Next Steps

Once dependencies are installed, follow the main [README.md](./README.md) for:
1. Setting up your Airtable table
2. Configuring custom properties
3. Building your first Puck page!

