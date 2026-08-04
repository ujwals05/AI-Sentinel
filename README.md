# Sentinel — Multi-tenant Quality Observability Platform

**Sentinel** integrates with **AI-powered applications** to continuously **monitor** and evaluate their outputs using a multi-judge LLM architecture. It assesses quality, correctness, safety, groundedness, and policy compliance, explains failures with evidence, assigns risk levels. Developers can use a **playground** for manual evaluation, an **API** for production integration, and an observability dashboard to monitor AI quality and detect regressions over time.

[DOCUMENT](https://www.notion.so/AI-Sentinel-3b2d5e5e00cb8020b32cee682d42282d?source=copy_link)

LIVE:
[LIVE](https://sentinel-eight-tau.vercel.app/login)
https://sentinel-eight-tau.vercel.app
### Test in Real-Time
[AI-Bot](https://chat-bot-ai-sentinel.vercel.app/)

This Ai-bot is integrated with my AI sentinel system, you can test it in real-time.

**Github** link for this ai-bot is mentioned below

[GITHUB](https://github.com/ujwals05/Chat-bot-AI-Sentinel.git)


***NOTE*** : THIS SENTINEL IS RUNNING SEPARATELY.
THIS IS DEFAULT CONGFIG WITH: 
Email: *user001@email.com* 
Password: *password*

# Problem
Companies are increasingly deploying **AI applications**, but they don't have a reliable way to continuously determine whether AI outputs are correct, relevant, safe, grounded, policy-compliant, or trustworthy.

---

## Features

User Authentication (JWT with HTTP-only cookies)  
API Integration with other ai powered system  
Multiple LLM for decision making
Implemepted Transaction to ensure security  
Multi tentent System  
Monitoring AI powered application  

---

## Tech Stack

### **Frontend**

- React (Vite)
- Tailwind CSS
- React Hot Toast (Notifications)
- Zustand (State Management)
- tanstack
- Axios for API Requests
- Lucide React (Icon Library)

### **Backend**

- Node.js + Express
- Prisma+PostgresSQL
- JSON Web Tokens (JWT)
- Bcrypt (Password Hashing)
- CORS + Cookie Parser
- Dotenv for Environment Variables

  ## Folder Structure

  ```
  sisa-ai-judge/
  ├── apps/
  │   │
  │   ├── web/                              
  │   │   ├── public/
  │   │   │
  │   │   └── src/
  │   │       ├── assets/
  │   │       │
  │   │       ├── components/
  │   │       │   └── ALL COMPONENTS
  │   │       │
  │   │       ├── pages/
  │   │       │   └── ALL PAGES
  │   │       │
  │   │       ├── hooks/
  │   │       │
  │   │       ├── services/
  │   │       │   └── api.ts
  │   │       │
  │   │       ├── stores/
  │   │       │
  │   │       ├── types/
  │   │       │
  │   │       ├── utils/
  │   │       │
  │   │       ├── App.tsx
  │   │       └── main.tsx
  │   │
  │   │
  │   └── backend/                              
  │       │
  │       ├── src/
  │       │   │
  │       │   ├── config/
  │       │   │   └── env.ts
  │       │   │
  │       │   ├── MODULES/
  │       │   │   └──ALL MODULES
  │       │   │
  │       │   ├── routes/
  │       │   │   └── ALL ROUTES
  │       │   │
  │       │   ├── middlewares/
  │       │   │   └── ALL MIDDLEWARES
  │       │   │
  │       │   ├── lib/
  │       │   │   └── prisma
  │       │   │
  │       │   ├── ai/
  │       │   │   │
  │       │   │   ├── models/
  │       │   │   │   ├── llm.factory.ts
  │       │   │   │   └── model.config.ts
  │       │   │   │
  │       │   │   ├── prompts/
  │       │   │   │   ├── quality.prompt.ts
  │       │   │   │   ├── safety.prompt.ts
  │       │   │   │   └── trust.prompt.ts
  │       │   │   │
  │       │   │   ├── schemas/
  │       │   │   │   ├── judge.schema.ts
  │       │   │   │   └── evaluation.schema.ts
  │       │   │   │
  │       │   │   ├── judges/
  │       │   │   │   ├── quality.judge.ts
  │       │   │   │   ├── safety.judge.ts
  │       │   │   │   └── trust.judge.ts
  │       │   │   │
  │       │   │   ├── graph/
  │       │   │   │   ├── state.ts
  │       │   │   │   ├── nodes/
  │       │   │   │   │   ├── validate-input.node.ts
  │       │   │   │   │   ├── prepare-context.node.ts
  │       │   │   │   │   ├── quality.node.ts
  │       │   │   │   │   ├── safety.node.ts
  │       │   │   │   │   ├── trust.node.ts
  │       │   │   │   │   ├── consensus.node.ts
  │       │   │   │   │   ├── risk.node.ts
  │       │   │   │   │   ├── human-review.node.ts
  │       │   │   │   │   └── finalize.node.ts
  │       │   │   │   │
  │       │   │   │   ├── edges/
  │       │   │   │   │   └── routing.ts
  │       │   │   │   │
  │       │   │   │   └── evaluation.graph.ts
  │       │   │   │
  │       │   │   ├── consensus/
  │       │   │   │   ├── consensus.engine.ts
  │       │   │   │   └── confidence.calculator.ts
  │       │   │   │
  │       │   │   ├── hallucination/
  │       │   │   │   ├── claim-extractor.ts
  │       │   │   │   ├── claim-verifier.ts
  │       │   │   │   └── hallucination-detector.ts
  │       │   │   │
  │       │   │   └── risk/
  │       │   │       └── risk.engine.ts
  │       │   │
  │       │   ├── types/
  │       │   │   ├── evaluation.types.ts
  │       │   │   ├── judge.types.ts
  │       │   │   └── risk.types.ts
  │       │   │
  │       │   ├── utils/
  │       │   │   └── ALL UTILS
  │       │   │
  │       │   ├── app.ts
  │       │   └── index.ts
  │       │
  │       ├── prisma/
  │       │   ├── schema.prisma
  │       │   └── migrations/
  │       │
  │       ├── tests/
  │       │   ├── unit/
  │       │   ├── integration/
  │       │   └── evaluation/
  │       │
  │       ├── package.json
  │       └── tsconfig.json
  │
  ├── packages/
  │   ├── shared/
  │   │   ├── types/
  │   │   └── schemas/
  │   │
  │   └── config/
  │
  ├── docs/
  │   ├── architecture/
  │   │   └── architecture-diagram.png
  │   │
  │   ├── evaluation-methodology.md
  │   ├── system-design.md
  │   └── api.md
  │
  ├── scripts/
  │   ├── seed.ts
  │   └── evaluate-dataset.ts
  │    ── .env.example
  │
  ├
  ├── .gitignore
  ├── README.md
  
  ```
  
  ## Multi-Judge Architecture
  Sentinel uses multiple specialized LLM judges instead of relying on a single evaluation prompt.
  
  # Quality Judge
  Evaluates the overall quality of an AI response.
  
  # It focuses on factors such as:

  Relevance
  Correctness
  Completeness
  Instruction adherence
  Response quality
  Safety Judge
  
  Evaluates whether an AI response presents potential safety or policy concerns.
  
  # It can identify:
  
  Unsafe content
  Policy violations
  Harmful responses
  High-risk behavior
  Trust Judge
  
  Evaluates the trustworthiness of the AI response.
  
  # It focuses on factors such as:
  
  Hallucination indicators
  Groundedness
  Reliability
  Factual consistency
  Confidence in the response
  Evaluation Aggregation
  
  After the individual judges complete their evaluation, Sentinel aggregates the results
  
  # The evaluation system produces:
  
  Overall Score
  Risk Level
  Decision
  Summary
  Quality Evaluation
  Safety Evaluation
  Trust Evaluation
  
  This provides a single high-level view of the AI response while preserving the individual judge results for deeper analysis.
  
  
  ## Installation & Setup - Locally
  
  ### Prerequisites
  
  Before running Sentinel locally, make sure you have the following installed:
  
  - Node.js 20+
  - npm
  - PostgreSQL database
  - Git
  - Google Gemini API Key
  
  ---
  
  ### Clone the Repository
  
  ```bash
  git clone https://github.com/ujwals05/AI-Sentinel.git
  cd AI-Sentinel
  ```


  ### Set-up Backend

  ```
  cd backend
  npm install
  ```

  ### Create a .env file in the backend directory:

  ```
  PORT = 5000
  POSTGRES = preisma 
  CORS_ORIGIN = http://localhost:5173

  

  ACCESS_TOKEN_SECRET = your_access_token
  ACCESS_TOKEN_EXPIRY = 1d

  REFRESH_TOKEN_SECRET = your_refresh_token
  REFRESH_TOKEN_EXPIRY = 10d

  # Google Gemini
  GOOGLE_API_KEY="your_google_gemini_api_key"

  NODE_ENV = development
  ```

  ### Set up database

  1. Generate the Prisma Client:
  ```
  npm run prisma:generate
  ```
  2. Apply the Prisma migrations to your PostgreSQL database:
  ```
  npx prisma migrate dev
  ```
  ### Run backend 
  ```
  npm run dev
  ```

  Backend will be running at 
  ```
  http://localhost:5000
  ```

  ### Set-up Front-end

  ```
  cd frontend
  npm install
  ```

  # Configure Frontend Environment Variables

  Create a **.env** file inside the **frontend** directory:
  ```
  VITE_API_URL="http://localhost:5000"
  ```

  ### Start frontend 
  ```
  npm run dev
  ```

  Frontend will be running at 
  ```
  http://localhost:5173
  ```

  # Architecture 


```
  ┌──────────────────────────┐
  │       React Frontend     │
  │    http://localhost:5173 │
  └────────────┬─────────────┘
               │
               │ REST API
               ▼
  ┌──────────────────────────┐
  │   Node.js + Express API  │
  │    http://localhost:5000 │
  └────────────┬─────────────┘
               │
              ┌┴───────────┐
              │            │
              ▼            ▼
       ┌────────────┐  ┌──────────────┐
       │ PostgreSQL │  │ Gemini LLM   │
       │  + Prisma  │  │ + LangGraph  │
       └────────────┘  └──────────────┘
```
### API Integration

To connect an external AI application with Sentinel, create an application from the Sentinel dashboard and generate an API key.

The external application can then send AI interactions to the Sentinel ingestion endpoint

```
POST /api/v1/ingest
X-API-Key: your_api_key
Idempotency-Key: unique_request_id
Content-Type: application/json
```
**The request can contain information such as:**

```
{
  "conversationId": "conversation-123",
  "messages": [
    {
      "role": "USER",
      "content": "Explain quantum computing."
    },
    {
      "role": "ASSISTANT",
      "content": "Quantum computing uses quantum mechanical phenomena..."
    }
  ]
}
```
 



https://github.com/ujwals05/AI-Sentinel.git