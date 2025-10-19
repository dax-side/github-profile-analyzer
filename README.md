# GitHub Profile Analyzer

A TypeScript API that analyzes GitHub profiles and estimates developer skill levels based on repository activity, language usage, and contribution patterns.

Built with Domain-Driven Design principles - [Read about the journey](https://daxside.hashnode.dev/day-1-i-finally-get-domain-driven-design)

## What It Does

Send a GitHub username, get back:
- Profile info (repos, followers, bio)
- Top programming languages with percentages
- Estimated total commits
- Most active repositories
- Activity status
- Skill level assessment (Beginner → Expert)

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Logging**: Winston + Morgan
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier

## Quick Start

```bash
# Clone and install
git clone https://github.com/dax-side/github-profile-analyzer.git
cd github-profile-analyzer
npm install

# Set up environment (optional - for higher rate limits)
echo "GITHUB_TOKEN=your_token_here" > .env

# Run in development
npm run dev

# Or build and run production
npm run build
npm start
```

## API Usage

**Endpoint**: `POST /analyze`

**Request**:
```json
{
  "username": "octocat",
  "token": "your_github_token"  // Optional
}
```

**Response**:
```json
{
  "username": "octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
  "bio": "Developer at GitHub",
  "publicRepos": 8,
  "followers": 6035,
  "following": 9,
  "primaryLanguages": [
    {"language": "JavaScript", "percentage": 60},
    {"language": "HTML", "percentage": 30},
    {"language": "CSS", "percentage": 10}
  ],
  "totalCommits": 150,
  "mostActiveRepos": [
    {
      "name": "Hello-World",
      "stars": 100,
      "forks": 50,
      "lastUpdated": "2023-10-01T00:00:00Z"
    }
  ],
  "recentActivity": {
    "activeReposCount": 2,
    "lastActivity": "2023-10-01T00:00:00Z"
  },
  "isActive": true,
  "skillLevel": {
    "level": "Intermediate",
    "score": 65
  }
}
```

## Rate Limits

GitHub's API has rate limits:
- **Without token**: 60 requests/hour (~6 profile analyses)
- **With token**: 5,000 requests/hour (~500 analyses)

The API makes ~10 requests per analysis. Using a personal access token is recommended for frequent use.

## Project Structure

```
src/
├── domain/          # Business logic (DDD approach)
│   ├── entities/    # Profile, Repository, SkillLevel
│   └── services/    # ProfileAnalysisService
├── services/        # Infrastructure (GitHub API integration)
├── controllers/     # HTTP request handlers
├── routes/          # API route definitions
└── types/           # TypeScript type definitions

tests/
└── github.service.test.ts  # Unit tests
```

## Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code style
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format with Prettier
npm run build        # Compile TypeScript
npm start            # Run compiled code
```

## Architecture

This project uses **Domain-Driven Design** (DDD):

- **Domain Layer**: Pure business logic (skill calculation, scoring rules)
- **Application Layer**: Infrastructure concerns (API calls, data transformation)

Business rules are separated from technical implementation, making the code testable and maintainable.

[Read the full breakdown](https://daxside.hashnode.dev/day-1-i-finally-get-domain-driven-design) of how DDD was applied.

## Example

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"username": "dax-side"}'
```

## Notes

- Skill level calculation is a simple heuristic based on repos, commits, stars, and account age
- Logs are written to `combined.log` and `error.log`
- The API is idempotent - repeated requests return consistent results

---

**Day 1** of 100 Days of TypeScript Backend APIs  
[Follow the journey →](https://daxside.hashnode.dev/)

## License

MIT
