# Smart Helpdesk with Agentic Triage

[](https://reactjs.org/)
[](https://nodejs.org/)
[](https://www.mongodb.com/)
[](https://www.docker.com/)

An end-to-end web application where users can raise support tickets and an AI agent triages them by classifying the issue, fetching relevant knowledge-base articles, drafting a reply, and either auto-resolving or assigning it to a human support agent.

## 📋 Table of Contents

  - [Live Demo](https://www.google.com/search?q=%23-live-demo)
  - [✨ Key Features](https://www.google.com/search?q=%23-key-features)
  - [🏗️ Architecture](https://www.google.com/search?q=%23%EF%B8%8F-architecture)
  - [🛠️ Tech Stack](https://www.google.com/search?q=%23%EF%B8%8F-tech-stack)
  - [🚀 Getting Started](https://www.google.com/search?q=%23-getting-started)
  - [🤖 Agentic Triage Workflow](https://www.google.com/search?q=%23-agentic-triage-workflow)
  - [🔌 API Endpoints](https://www.google.com/search?q=%23-api-endpoints)
  - [🧪 Testing](https://www.google.com/search?q=%23-testing)
  - [📂 Project Structure & File Breakdown](https://www.google.com/search?q=%23-project-structure--file-breakdown)

-----

## 🎥 Live Demo

  - **Live Application:** `[Link to your deployed Vercel/Netlify/Cloud URL]`

-----

## ✨ Key Features

This application supports three user roles with distinct capabilities: 

#### **👤 End User**

  - Create and submit new support tickets.
  - View a list of their own tickets with current statuses. 
  - View a detailed conversation thread for each ticket, including replies from agents and the AI. 
  - Receive in-app notifications on status changes. 

#### **👨‍💼 Support Agent**

  - View a dashboard of all tickets assigned to them or waiting for a human. 
  - Review AI-generated suggestions, including the predicted category and a drafted reply. 
  - Edit the AI-drafted reply and send it to the user. 
  - Manually resolve, reopen, or re-assign tickets. 

#### **👑 Admin**

  - Full access to all agent functionalities.
  - **Knowledge Base Management**: Create, read, update, and delete (CRUD) KB articles. 
  - **AI Agent Configuration**: Set system-wide settings, such as enabling/disabling AI auto-resolution and adjusting the confidence threshold required for the AI to auto-close a ticket. 

-----

## 🏗️ Architecture

This project is built using the **MERN stack (MongoDB, Express, React, Node.js)** and is fully containerized with Docker for easy setup and deployment. 

#### **Architecture Diagram**

```
+----------------+      +------------------+      +-------------------+      +-----------------+
|   End User     |----->|   Client (React) |----->|  API (Node/Express) |----->|   MongoDB       |
| (Web Browser)  |      |   (Served by Nginx)|      |  (Agentic Logic)    |      | (Database)      |
+----------------+      +------------------+      +-------------------+      +-----------------+
```

#### **Rationale**

  - **React Frontend**: A modern, component-based library ideal for building a fast and responsive single-page application (SPA). Vite provides an extremely fast development experience.
  - **Node.js/Express Backend**: Node.js is perfect for a data-driven, I/O-heavy application like a helpdesk. The agentic workflow is implemented directly within the Node.js service, keeping the architecture simple and monolithic (MERN-only track). 
  - **MongoDB**: A NoSQL database that offers flexibility for storing varied data structures like tickets, user info, and logs. Its schema-less nature is well-suited for evolving application requirements.
  - **Docker & Docker Compose**: Containerization ensures a consistent development and production environment. The entire stack (client, API, database) can be spun up with a single command (`docker compose up`), simplifying the setup process immensely. 

-----

## 🛠️ Tech Stack

#### **Frontend**

| Technology        | Description                                       |
| ----------------- | ------------------------------------------------- |
| **React** | A JavaScript library for building user interfaces |
| **Vite** | Next-generation frontend tooling for development  |
| **Zustand** | A small, fast state-management solution           |
| **React Router** | Client-side routing for the SPA                   |
| **React Bootstrap** | UI component library for a consistent look & feel   |
| **Axios** | Promise-based HTTP client for API requests        |
| **Framer Motion** | Animation library for a fluid user experience     |

#### **Backend**

| Technology     | Description                                               |
| -------------- | --------------------------------------------------------- |
| **Node.js** | JavaScript runtime for the server                         |
| **Express** | Minimalist web framework for Node.js                      |
| **Mongoose** | Object Data Modeling (ODM) library for MongoDB            |
| **JWT** | JSON Web Tokens for secure authentication                 |
| **bcryptjs** | Library for hashing passwords                             |
| **Zod** | [cite\_start]TypeScript-first schema validation for API inputs [cite: 112]         |
| **Dotenv** | Loads environment variables from a `.env` file            |
| **Vitest** | A blazing fast unit-test framework powered by Vite        |

#### **Database & DevOps**

| Technology         | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| **MongoDB** | NoSQL database for storing all application data                    |
| **Docker** | Platform for developing, shipping, and running applications in containers |
| **Docker Compose** | Tool for defining and running multi-container Docker applications  |
| **Nginx** | Web server used to serve the static frontend build                 |

-----

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

#### **Prerequisites**

  - [Git](https://git-scm.com/)
  - [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose

#### **1. Clone the Repository**

```bash
git clone https://github.com/srikurmadasupraneeth/Smart_Helpdesk
cd smart-helpdesk
```

#### **2. Set Up Environment Variables**

Create a `.env` file inside the `server/` directory by copying the example:

```bash
cp server/.env.example server/.env
```

The default values in the `.env` file are pre-configured to work with the Docker setup. You can change the `JWT_SECRET` for better security.

#### **3. Run the Application**

Use Docker Compose to build the images and start all the services (client, api, mongo) with a single command from the project root:

```bash
docker compose up --build
```

  - Add the `-d` flag (`docker compose up --build -d`) to run the containers in detached mode (in the background).

#### **4. Seed the Database**

Once the containers are running, open a new terminal window and run the seed script. This will populate the database with sample users, KB articles, and tickets.

```bash
docker compose exec api node seed.js
```

You should see a "✅ Data Imported Successfully\!" message.

#### **5. Access the Application**

  - **Frontend Client**: [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
  - **Backend API**: [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)

**Default Login Credentials:**

| Role       | Email               | Password |
| :--------- | :------------------ | :------- |
| **Admin** | `admin@example.com` | `123456` |
| **Agent** | `agent@example.com` | `123456` |
| **User** | `user@example.com`  | `123456` |

-----

## 🤖 Agentic Triage Workflow

When a new ticket is created, a non-blocking, asynchronous triage process is initiated on the server. The workflow is deterministic and rule-based, ensuring it can run without requiring paid LLM API keys (`STUB_MODE=true`).

1.  **Plan**: The plan is hardcoded in `agentService.js` to follow a linear sequence of steps. 
2.  **Classify**: The ticket's title and description are analyzed for keywords. For example, words like "refund" or "invoice" map to `billing`. A pseudo-confidence score is calculated based on the number of keyword matches. 
3.  **Retrieve KB**: The system performs a keyword search against the Knowledge Base articles to find up to 3 relevant, published articles. 
4.  **Draft Reply**: A templated reply is generated, incorporating the titles of the retrieved KB articles as citations. 
5.  **Decision**: The agent checks the system `Config`. If `autoCloseEnabled` is true and the `confidence` score is above the `confidenceThreshold`, the ticket is automatically resolved, and the drafted reply is sent.  Otherwise, the ticket status is set to `waiting_human` for a support agent to review.
6.  **Logging**: Every step of this process—from starting the triage to the final decision—is recorded in the `AuditLog` collection with a consistent `traceId` for observability. 

-----

## 🔌 API Endpoints

The API is structured to be RESTful and uses JWT for authenticating and authorizing requests.

| Method | Endpoint                    | Protection       | Description                                        |
| :----- | :-------------------------- | :--------------- | :------------------------------------------------- |
| POST   | `/api/auth/register`        | Public           | Registers a new user.                              |
| POST   | `/api/auth/login`           | Public           | Logs in a user and returns a JWT.                  |
| GET    | `/api/kb`                   | User             | Gets all published KB articles (or all for admin). |
| POST   | `/api/kb`                   | Admin            | Creates a new KB article.                          |
| GET    | `/api/kb/:id`               | User             | Gets a single KB article by ID.                    |
| PUT    | `/api/kb/:id`               | Admin            | Updates a KB article.                              |
| DELETE | `/api/kb/:id`               | Admin            | Deletes a KB article.                              |
| GET    | `/api/tickets`              | User             | Gets tickets (user sees own, agent/admin sees all).|
| POST   | `/api/tickets`              | User             | Creates a new support ticket.                      |
| GET    | `/api/tickets/:id`          | User             | Gets a single ticket by ID.                        |
| GET    | `/api/tickets/:id/audit`    | User             | Gets the audit timeline for a ticket.              |
| POST   | `/api/tickets/:id/reply`    | Agent/Admin      | Posts a reply to a ticket.                         |
| POST   | `/api/tickets/:id/resolve`  | Agent/Admin      | Resolves a ticket.                                 |
| POST   | `/api/tickets/:id/reopen`   | Agent/Admin      | Reopens a resolved ticket.                         |
| GET    | `/api/agent/suggestion/:id` | Agent/Admin      | Gets the AI-generated suggestion for a ticket.     |
| GET    | `/api/config`               | Admin            | Gets the system configuration.                     |
| PUT    | `/api/config`               | Admin            | Updates the system configuration.                  |

-----

## 🧪 Testing

The project includes unit and integration tests for the backend to ensure core functionality is working as expected.

  - **Auth Tests**: Cover user registration and login success/failure cases.
  - **Triage Tests**: Verify that the deterministic LLM stub correctly classifies tickets and drafts replies based on keywords.

**To run the tests**, execute the following command in the `server` container:

```bash
docker compose exec api npm test
```

-----

## 📂 Project Structure & File Breakdown

### **Root Directory**

```
smart-helpdesk/
├── client/                 # React frontend application
├── server/                 # Node.js/Express backend API
├── .gitignore              # Specifies files for Git to ignore
├── docker-compose.yml      # Defines and configures all services for Docker
├── README.md               # This file
└── seed.js                 # Script to populate the database with initial data
```

  - **`docker-compose.yml`**: The master file for Docker. It defines the `client`, `api`, and `mongo` services, their build contexts, ports, environment variables, and dependencies. This allows the entire application to be started with one command.
  - **`seed.js`**: A Node.js script that connects to the MongoDB database and populates it with default users, KB articles, and tickets. Crucial for setting up a usable development environment quickly.

### **Client (`client/`)**

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Page-level components (mapped to routes)
│   ├── services/           # API communication layer
│   ├── store/              # Global state management (Zustand)
│   ├── App.jsx             # Main application component with routing
│   ├── App.css             # Global styles and theme variables
│   └── main.jsx            # Entry point of the React application
├── Dockerfile              # Instructions to build the client's Docker image
├── index.html              # The main HTML file for the SPA
├── nginx.conf              # Nginx configuration for serving the app
└── vite.config.js          # Vite configuration file
```

  - **`src/components/`**
      - `AuditTimeline.jsx`: Renders a vertical timeline of a ticket's history based on its audit logs.
      - `AuthGuard.jsx`: A higher-order component that protects routes, ensuring only authenticated and authorized (by role) users can access them.
      - `KBEditor.jsx`: A form component used by admins to create or edit Knowledge Base articles.
      - `Navbar.jsx`: The main navigation bar, which displays different links based on the user's authentication status and role.
      - `NotificationToast.jsx`: Displays success or error messages as small, temporary pop-ups (toasts).
  - **`src/pages/`**
      - `KBArticlePage.jsx`: Displays a single, published Knowledge Base article.
      - `KBPage.jsx`: The admin page for managing all KB articles (view, edit, delete).
      - `LoginPage.jsx`: The user login page.
      - `RegisterPage.jsx`: The user registration page.
      - `SettingsPage.jsx`: The admin page for configuring the AI agent's behavior.
      - `TicketDetailPage.jsx`: The core page for viewing a single ticket, its conversation history, audit log, and (for agents) the AI suggestion.
      - `TicketsListPage.jsx`: Displays a list of tickets. Users see their own; agents/admins see all.
  - **`src/services/api.js`**: Configures a central Axios instance for all API calls. It includes interceptors to automatically attach the JWT token to requests and handle 401 (Unauthorized) errors globally by logging the user out.
  - **`src/store/`**
      - `authStore.js`: A Zustand store for managing global authentication state (user, token) and persisting it to local storage.
      - `notificationStore.js`: A Zustand store for managing the state of toast notifications.
  - **`App.jsx`**: The root component that sets up the application layout and defines all the client-side routes using `react-router-dom`.
  - **`Dockerfile`**: A multi-stage Dockerfile that first builds the React application into static files and then uses a lightweight Nginx server to serve them.
  - **`nginx.conf`**: Configures Nginx to correctly serve the React single-page application, ensuring that all routes are directed to `index.html`.
  - **`vite.config.js`**: Configures the Vite development server, including the proxy to the backend API to avoid CORS issues during development.

### **Server (`server/`)**

```
server/
├── config/                 # Database configuration
├── controllers/            # Logic for handling requests
├── middleware/             # Express middleware functions
├── models/                 # Mongoose schemas and models
├── routes/                 # API route definitions
├── services/               # Business logic and external service integrations
├── tests/                  # Unit and integration tests
├── .env                    # Environment variables (ignored by Git)
├── Dockerfile              # Instructions to build the server's Docker image
└── index.js                # Entry point of the Express server
```

  - **`config/db.js`**: Contains the function to connect to the MongoDB database using Mongoose.
  - **`controllers/`**: Handles the business logic for each route. They take the incoming request, use services and models to perform operations, and send back a response.
      - `agentController.js`: Logic for fetching AI agent suggestions.
      - `authController.js`: Logic for user registration and login.
      - `configController.js`: Logic for getting and updating system settings.
      - `kbController.js`: Logic for CRUD operations on KB articles.
      - `ticketController.js`: Logic for all ticket-related actions (create, list, reply, etc.).
  - **`middleware/`**:
      - `authMiddleware.js`: Contains middleware to protect routes. `protect` verifies the JWT, while `admin` and `agent` check for specific user roles.
      - `errorMiddleware.js`: A catch-all error handler to ensure no stack traces are leaked to the client in production.
  - **`models/`**: Defines the Mongoose schemas for all database collections, enforcing data structure and types.
      - `AgentSuggestion.js`: Schema for the AI-generated triage data.
      - `Article.js`: Schema for Knowledge Base articles.
      - `AuditLog.js`: Schema for the immutable log of all actions on a ticket.
      - `Config.js`: Schema for the singleton document holding system settings.
      - `Ticket.js`: Schema for support tickets.
      - `User.js`: Schema for user accounts.
  - **`routes/`**: Defines the API endpoints. They map HTTP methods and URL paths to the corresponding controller functions and apply necessary middleware.
  - **`services/`**:
      - `agentService.js`: Orchestrates the entire agentic triage workflow, from classification to decision-making.
      - `llmProvider.js`: Implements the deterministic "LLM Stub." This class contains the rule-based logic for classifying tickets and drafting replies, allowing the system to run without a real LLM.
  - **`tests/`**: Contains test files (`*.test.js`) written with Vitest for testing API endpoints and services.
  - **`Dockerfile`**: Defines the steps to create a Docker image for the Node.js server, including installing dependencies and running the application.
  - **`index.js`**: The main entry point for the backend. It initializes the Express app, sets up middleware, connects the API routes, and starts the server.
