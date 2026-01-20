# EmojiACM

A real-time multiplayer emoji guessing game built with React, Node.js, Express, and Socket.io.

## Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm** (Package manager)
- **MongoDB** (Local instance or Atlas connection string)

## Installation

1.  **Install Dependencies**
    From the root directory, run:
    ```bash
    pnpm install
    ```

2.  **Environment Setup**
    Create a `.env` file in the `server` directory (`server/.env`) with the following variables:

    ```env
    PORT=4000
    MONGO_URI=mongodb://localhost:27017/emoji-game
    MONGO_URI_InfoTrek=mongodb://localhost:27017/infotrek-dummy
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=24h
    CLIENT_ORIGIN=http://localhost:5173
    ```

    > **Note:** `MONGO_URI_InfoTrek` is required by the configuration but can point to the same instance or a dummy one for local testing.

## Running the Application

To start both the client and server in development mode:

```bash
pnpm dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:4000

## Seeding Data

To populate the database with dummy data (movies, etc.):

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Run the seed script:
    ```bash
    npx ts-node scripts/seed_dummy.ts
    ```
    *Alternatively, from the root:* `pnpm --filter server seed:dummy`

## Stress Testing

The project includes scripts to simulate multiple users connecting and playing the game.

### 1. Generate Stress Test Users
First, you need to generate dummy users and authentication tokens. This script will create users in the database and output a `users.csv` file in the server directory.

```bash
cd server
npx ts-node scripts/generate_stress_tokens.ts
```

### 2. Run the Stress Test
Once the tokens are generated, you can run the stress test script which mimics game flow (connecting, joining lobby, starting game, sending icons/guesses).

**Option A: Custom Typescript Script (Recommended)**
```bash
cd server
npx ts-node scripts/custom_stress.ts
```

**Option B: Artillery**
If you have Artillery installed or want to use the YAML configuration:
```bash
cd server
npx artillery run stress-test.yml
```
