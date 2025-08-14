# REST API Template

A production-ready REST API template built with Express.js, TypeScript, and comprehensive code quality tools.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript with strict configuration
- **MongoDB** - Database integration with Mongoose
- **Pino** - High-performance JSON logger
- **Zod** - TypeScript-first schema validation
- **JWT** - JSON Web Token authentication
- **Code Quality Tools** - ESLint, Prettier, Husky, lint-staged
- **Conventional Commits** - Standardized commit messages
- **ES Modules** - Modern JavaScript module system

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local or cloud instance)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd rest-api

# Install all dependencies
npm install
```

### 2. Package Installation Breakdown

#### Production Dependencies

```bash
npm install express zod config cors mongoose pino pino-pretty dayjs bcrypt jsonwebtoken lodash nanoid
```

#### Development Dependencies

```bash
npm install -D @types/body-parser @types/config @types/cors @types/express @types/node @types/pino @types/bcrypt @types/jsonwebtoken @types/lodash @types/nanoid ts-node-dev typescript @commitlint/config-conventional @commitlint/cli husky lint-staged prettier eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin @eslint/js globals typescript-eslint rimraf eslint-config-prettier eslint-plugin-prettier tsx
```

## ⚙️ Configuration Files

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

### ESLint Configuration (`eslint.config.mts`)

- **Strict TypeScript rules** with type checking
- **Prettier integration** for consistent formatting
- **Custom rules** for code quality
- **Test file exceptions** for flexibility

### Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "auto"
}
```

## 🔧 Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm start`            | Start production server                  |
| `npm run build`        | Build for production                     |
| `npm run clean`        | Remove build directory                   |
| `npm run type-check`   | Run TypeScript type checking             |
| `npm run lint`         | Run ESLint                               |
| `npm run lint:fix`     | Fix ESLint issues automatically          |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check if code is formatted               |
| `npm run check-all`    | Run all checks (type, lint, format)      |

## 🎯 Git Hooks (Husky)

### Pre-commit Hook

- Runs TypeScript type checking
- Runs lint-staged for changed files

### Pre-push Hook

- Runs production build to ensure compilation

### Commit Message Hook

- Validates conventional commit format

## 📝 Lint-staged Configuration

Automatically formats and lints staged files:

- **TypeScript/JavaScript files**: ESLint fix + Prettier format
- **JSON/Markdown/YAML files**: Prettier format only

## 🏗️ Project Structure

```
rest-api/
├── src/
│   ├── index.ts              # Main application entry
│   ├── routes/
│   │   └── index.ts          # API routes
│   └── utils/
│       ├── logger.ts         # Pino logger setup
│       └── database.ts       # MongoDB connection
├── config/
│   ├── default.json          # Default configuration
│   └── production.json       # Production configuration
├── .husky/                   # Git hooks
├── dist/                     # Build output (generated)
├── eslint.config.mts         # ESLint configuration
├── tsconfig.json             # TypeScript configuration
├── .prettierrc               # Prettier configuration
├── .prettierignore           # Prettier ignore patterns
└── package.json              # Dependencies and scripts
```

## 🚦 Getting Started

### 1. Environment Setup

Create environment-specific config files in the `config/` directory:

```json
// config/development.json
{
  "mongoUri": "mongodb://localhost:27017/rest-api-dev",
  "jwtSecret": "your-dev-jwt-secret"
}
```

### 2. Start Development

```bash
# Start development server
npm run dev

# The server will start on http://localhost:3000
# Health check available at http://localhost:3000/health
```

### 3. Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🧪 Code Quality Workflow

### Before Committing

```bash
# Check everything is working
npm run check-all

# This runs:
# - TypeScript type checking
# - ESLint linting
# - Prettier format checking
```

### Commit Messages

Use conventional commit format:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update API documentation"
```

### Common Types

| Type         | Description                                                                        |
| ------------ | ---------------------------------------------------------------------------------- |
| **feat**     | A new feature                                                                      |
| **fix**      | A bug fix                                                                          |
| **docs**     | Documentation changes only                                                         |
| **style**    | Code style changes (formatting, missing semi-colons, etc.) — no code logic changes |
| **refactor** | Code change that neither fixes a bug nor adds a feature                            |
| **perf**     | Performance improvements                                                           |
| **test**     | Adding or updating tests                                                           |
| **build**    | Changes to build process or dependencies                                           |
| **ci**       | CI/CD configuration changes                                                        |
| **chore**    | Maintenance tasks not related to src or tests (e.g., dependency updates)           |
| **revert**   | Reverting a previous commit                                                        |

### Examples

#### ✅ Valid

- feat(auth): add JWT refresh token support
- fix(user): prevent crash when email is missing
- docs(readme): update installation guide
- style(api): format code using prettier
- refactor(db): migrate from mongoose to prisma
- perf(api): improve query performance
- test(user): add password reset unit tests
- chore(deps): update express to v5
- ci(github): add lint check workflow
- revert: revert "feat(auth): add JWT refresh token support"

### Guidelines

- **Use the imperative mood**: "add" not "added" or "adds".
- **Limit summary to 72 characters**.
- **Use a scope** (inside parentheses) to indicate the area of change.
- **Body** should explain _what_ and _why_, not _how_.
- **Footer** is used for breaking changes or referencing issues.

## 🔍 Code Quality Tools Setup

### ESLint Rules

- **Strict TypeScript** checking with type information
- **Prettier integration** via `eslint-config-prettier` and `eslint-plugin-prettier`
- **Custom rules** for unused variables, explicit types
- **Modern JavaScript** features (nullish coalescing, optional chaining)
- **Consistent type imports** enforcement
- **Test file exceptions** for flexibility

### Prettier Integration

- **Automatic formatting** on save (if IDE configured)
- **Pre-commit formatting** via lint-staged
- **Consistent code style** across the project
- **ESLint integration** for unified workflow

### Husky Git Hooks

- **Pre-commit**: Type check + lint staged files
- **Pre-push**: Build verification
- **Commit-msg**: Conventional commit validation
- **Modern structure** (v9+) without legacy `_` directory

## 📚 Dependencies Explained

### Core Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **zod**: Schema validation
- **pino**: High-performance logger
- **config**: Configuration management
- **cors**: Cross-origin resource sharing
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dayjs**: Date manipulation
- **lodash**: Utility functions
- **nanoid**: Unique ID generation

### Development Dependencies

- **typescript**: TypeScript compiler
- **ts-node-dev**: Development server with hot reload
- **eslint**: Code linting with TypeScript support
- **prettier**: Code formatting
- **eslint-config-prettier**: Disables conflicting ESLint rules
- **eslint-plugin-prettier**: Runs Prettier as ESLint rule
- **husky**: Git hooks (v9+ with simplified structure)
- **lint-staged**: Run linters on staged files
- **commitlint**: Commit message linting
- **rimraf**: Cross-platform rm -rf
- **typescript-eslint**: TypeScript ESLint integration

## 🚀 Next Steps

1. **Add Authentication**: Implement JWT-based auth routes
2. **Add Validation**: Use Zod schemas for request validation
3. **Add Testing**: Set up Jest or Vitest for unit tests
4. **Add Documentation**: Generate API docs with Swagger
5. **Add Monitoring**: Implement health checks and metrics
6. **Add Rate Limiting**: Protect against abuse
7. **Add CORS Configuration**: Configure for your frontend

## 📄 License

ISC
