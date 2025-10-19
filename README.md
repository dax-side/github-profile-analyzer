# GitHub Profile Analyzer

A TypeScript API that pulls data from GitHub profiles and runs some analysis on them. It looks at repositories, languages, commits, and tries to estimate skill levels.

## What It Does

Takes a GitHub username and returns:
- Basic profile info (repos, followers, bio)
- Top programming languages with percentages
- Estimated total commits from recent repos
- Most active repositories
- Whether the account seems active
- A rough skill level assessment

## Tech Stack

- Node.js with Express
- TypeScript
- Axios for GitHub API calls
- Winston and Morgan for logging
- Jest for tests
- ESLint and Prettier for code style

## Quick Start

1. Clone this repo
2. Run `npm install`
3. Add your GitHub token to a `.env` file if you want higher rate limits
4. Run `npm run dev` to start the server

## API Usage

Send a POST request to `/analyze` with:
```json
{
  "username": "some-github-user",
  "token": "your-github-token" // optional
}
```

You'll get back profile data, language stats, activity info, and a skill level estimate.

## Project Structure

```
src/
├── domain/          # Business logic and data models
├── services/        # GitHub API calls and data processing
├── controllers/     # HTTP request handling
├── routes/          # URL routing
└── types/           # TypeScript type definitions
```

I built this with domain-driven design in mind, so the business rules live separately from the API plumbing.

## Development

- `npm run dev` - starts the dev server with hot reload
- `npm test` - runs the Jest tests
- `npm run lint` - checks code style
- `npm run build` - compiles TypeScript to JavaScript

## Notes

GitHub's API has rate limits. Without a token you get 60 requests per hour. With a personal access token you get 5000. The app works either way but goes faster with a token.

The skill level calculation is just a simple scoring system based on repo count, stars, commits, and account age. It's not scientific, just a rough estimate.

---

[Read about how I built this](https://daxside.hashnode.dev/day-1-i-finally-get-domain-driven-design) - Day 1 of my coding journey

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start the server: `npm run dev`

## Usage

### Endpoint

- `POST /analyze`

### Request

Send a POST request with JSON body containing the GitHub username. Optionally, include a personal access token to avoid rate limits (recommended for frequent use).

```json
{
  "username": "octocat",
  "token": "your_github_token"  // Optional, increases rate limit from 60 to 5000 requests/hour
}
```

**Note:** Without a token, GitHub limits requests to 60 per hour. The API makes ~10 requests per analysis, so you can analyze ~6 profiles per hour. With a token, you can do ~500 analyses per hour.

### Response

The API returns a JSON object with profile analysis.

Example response:

```json
{
  "username": "octocat",
  "avatarUrl": "https://avatars.githubusercontent.com/u/583231?v=4",
  "bio": null,
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
    {"name": "Hello-World", "stars": 100, "forks": 50, "lastUpdated": "2023-10-01T00:00:00Z"}
  ],
  "recentActivity": {"activeReposCount": 2, "lastActivity": "2023-10-01T00:00:00Z"},
  "isActive": true,
  "skillLevel": "Intermediate"
}
```

## Development

- `npm run build`: Compile TypeScript
- `npm run dev`: Run in development mode with ts-node
- `npm start`: Run the compiled JavaScript
- `npm test`: Run unit tests with Jest
- `npm run test:watch`: Run tests in watch mode
- `npm run lint`: Check code quality with ESLint
- `npm run lint:fix`: Auto-fix ESLint issues
- `npm run format`: Format code with Prettier

Logs are saved to `combined.log` and `error.log` files.

## Development

- `npm run build`: Compile TypeScript
- `npm run dev`: Run in development mode with ts-node
- `npm start`: Run the compiled JavaScript

```
github-profile-analyzer
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── controllers
│   │   └── profileController.ts # Handles profile analysis requests
│   ├── routes
│   │   └── profileRoutes.ts     # Defines API routes
│   ├── services
│   │   └── githubService.ts      # Interacts with the GitHub API
│   └── types
│       └── index.ts             # Type definitions
├── package.json                 # NPM package configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd github-profile-analyzer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run start
   ```

## API Usage

### Analyze GitHub Profile

- **Endpoint:** `POST /analyze`
- **Request Body:**
  ```json
  {
    "username": "github-username"
  }
  ```
- **Response:**
  ```json
  {
    "repos": [...],
    "languageStats": {...},
    "contributionConsistency": {...}
  }
  ```

## Examples

### Request Example

```bash
curl -X POST http://localhost:3000/analyze -H "Content-Type: application/json" -d '{"username": "octocat"}'
```

### Response Example

```json
{
  "repos": [
    {
      "name": "Hello-World",
      "language": "JavaScript",
      "stars": 10
    }
  ],
  "languageStats": {
    "JavaScript": 80,
    "HTML": 20
  },
  "contributionConsistency": {
    "consistent": true,
    "streak": 5
  }
}
```

## License

This project is licensed under the MIT License.
