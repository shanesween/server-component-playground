# 🏈 Sports Database Seeding Guide

## Overview

This project now includes a comprehensive standalone seeding system that allows you to seed sports data without running the Next.js server.

## 🚀 Quick Start

### Basic Usage

```bash
# Seed all sports
npm run seed

# Seed only NFL teams
npm run seed:nfl

# Check what would be seeded (dry run)
npm run seed:dry-run

# Force seed even if data exists
npm run seed:force
```

### Advanced Usage

```bash
# Check specific sport
npm run seed -- --check nfl

# Verbose logging
npm run seed -- --verbose

# Show help
npm run seed -- --help
```

## 📁 Project Structure

```
scripts/
├── utils/
│   ├── env.ts          # Environment loading
│   ├── db.ts           # Database connection
│   └── logger.ts       # Logging utilities
├── seed/
│   ├── nfl-teams.ts    # NFL teams seeding
│   └── index.ts        # Seed coordination
└── run-seed.ts         # Main CLI interface
```

## 🛠️ Available Commands

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run seed`         | Seed all sports                |
| `npm run seed:nfl`     | Seed NFL teams only            |
| `npm run seed:all`     | Alias for `npm run seed`       |
| `npm run seed:check`   | Check what would be seeded     |
| `npm run seed:dry-run` | Show what would be seeded      |
| `npm run seed:force`   | Force seed even if data exists |

## 🎯 Features

### ✅ **No Server Required**

- Direct database connection
- No Next.js dependencies in scripts
- Works in any environment

### ✅ **Environment Agnostic**

- Automatic `.env` file loading
- Support for `.env.local`, `.env.production`
- Environment variable validation

### ✅ **Developer Friendly**

- Simple npm commands
- Comprehensive help system
- Verbose logging options
- Dry-run mode for testing

### ✅ **CI/CD Ready**

- Command-line interface
- Exit codes for automation
- Error handling and logging

### ✅ **Flexible Options**

- Force seeding (override existing data)
- Dry-run mode (see what would happen)
- Sport-specific seeding
- Check mode (validate without seeding)

## 🔧 Technical Details

### Environment Loading

- Loads from multiple `.env` files in priority order
- Validates required environment variables
- Supports development and production modes

### Database Connection

- Uses Drizzle ORM with Neon database
- Connection testing and validation
- Proper error handling and cleanup

### Logging System

- Structured logging with timestamps
- Different log levels (debug, info, warn, error)
- Emoji indicators for better readability
- Development vs production logging

## 🚀 Usage Examples

### Development

```bash
# Check what's in the database
npm run seed:check

# Test seeding without actually doing it
npm run seed:dry-run

# Seed NFL teams
npm run seed:nfl
```

### Production/CI

```bash
# Force seed all sports
npm run seed:force

# Seed with verbose logging
npm run seed -- --verbose
```

### Troubleshooting

```bash
# Check database connection
npm run seed:check

# See help
npm run seed -- --help
```

## 🔄 Migration from Old System

The old `scripts/seed-nfl-teams.ts` file has been updated to use the new system but is now deprecated. Use the new commands instead:

**Old way:**

```bash
npx tsx scripts/seed-nfl-teams.ts
```

**New way:**

```bash
npm run seed:nfl
```

## 🎉 Benefits

1. **No Server Required** - Direct database access
2. **Environment Agnostic** - Works anywhere
3. **Developer Friendly** - Simple commands
4. **CI/CD Ready** - Automation friendly
5. **Extensible** - Easy to add new sports
6. **Robust** - Proper error handling
7. **Flexible** - Multiple options and modes

## 🔮 Future Enhancements

- Add MLB, NBA, NHL seeding
- Add team logo downloads
- Add historical data seeding
- Add player data seeding
- Add game schedule seeding
