# Sentinel — Multi-tenant Quality Observability Platform

**Sentinel** integrates with **AI-powered applications** to continuously **monitor** and evaluate their outputs using a multi-judge LLM architecture. It assesses quality, correctness, safety, groundedness, and policy compliance, explains failures with evidence, assigns risk levels. Developers can use a **playground** for manual evaluation, an **API** for production integration, and an observability dashboard to monitor AI quality and detect regressions over time.

[DOCUMENT](https://www.notion.so/AI-Sentinel-3b2d5e5e00cb8020b32cee682d42282d?source=copy_link)

[LIVE](https://sentinel-eight-tau.vercel.app/)

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

Quality Judge

Evaluates the overall quality of an AI response.

It focuses on factors such as:

Relevance
Correctness
Completeness
Instruction adherence
Response quality
Safety Judge

Evaluates whether an AI response presents potential safety or policy concerns.

It can identify:

Unsafe content
Policy violations
Harmful responses
High-risk behavior
Trust Judge

Evaluates the trustworthiness of the AI response.

It focuses on factors such as:

Hallucination indicators
Groundedness
Reliability
Factual consistency
Confidence in the response
Evaluation Aggregation

After the individual judges complete their evaluation, Sentinel aggregates the results.

The evaluation system produces:

Overall Score
Risk Level
Decision
Summary
Quality Evaluation
Safety Evaluation
Trust Evaluation

This provides a single high-level view of the AI response while preserving the individual judge results for deeper analysis.



  Multi-Judge Architecture

Sentinel uses multiple specialized LLM judges instead of relying on a single evaluation prompt.

Quality Judge

Evaluates the overall quality of an AI response.

It focuses on factors such as:

Relevance
Correctness
Completeness
Instruction adherence
Response quality
Safety Judge

Evaluates whether an AI response presents potential safety or policy concerns.

It can identify:

Unsafe content
Policy violations
Harmful responses
High-risk behavior
Trust Judge

Evaluates the trustworthiness of the AI response.

It focuses on factors such as:

Hallucination indicators
Groundedness
Reliability
Factual consistency
Confidence in the response
Evaluation Aggregation

After the individual judges complete their evaluation, Sentinel aggregates the results.

The evaluation system produces:

Overall Score
Risk Level
Decision
Summary
Quality Evaluation
Safety Evaluation
Trust Evaluation

This provides a single high-level view of the AI response while preserving the individual judge results for deeper analysis.

  ## Installation & Setup -Locally

  ### Clone the repository

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
  PORT = 8001
  POSTGRES = preisma 
  CORS_ORIGIN = http://localhost:5173

  ACCESS_TOKEN_SECRET = your_access_token
  ACCESS_TOKEN_EXPIRY = 1d

  REFRESH_TOKEN_SECRET = your_refresh_token
  REFRESH_TOKEN_EXPIRY = 10d

  NODE_ENV = development
  ```

  ### Start backend

  ```
  npm run dev
  ```

  ### Set-up Front-end

  ```
  cd frontend
  npm install
  npm run dev
  ```

https://github.com/ujwals05/AI-Sentinel.git