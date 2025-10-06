cat > README.md <<'EOL'
# 💰 Personal Finance Tracker

A full-stack application designed to help users track their income and expenses, visualize their financial habits, and manage their personal budgets effectively.



## ✨ Features

* **User Authentication**: Secure JWT-based authentication with Role-Based Access Control (Admin, User, Read-Only).
* **Transaction Management**: Full CRUD capabilities for income and expenses.
* **Interactive Dashboard**: Data visualization with charts (Pie, Line, Bar) for monthly/yearly overviews and category breakdowns.
* **Performance Optimized**: Built with performance in mind, featuring caching, pagination, and lazy loading.
* **Secure**: Implements standard security practices to prevent common vulnerabilities like XSS and SQL Injection.

---

## 🛠️ Tech Stack

* **Frontend**: React 18+, Chart.js / Recharts
* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL
* **Caching**: Redis
* **Authentication**: JSON Web Tokens (JWT)
* **Deployment**: Vercel (Frontend), Render (Backend)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (v18 or later recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [PostgreSQL](https://www.postgresql.org/download/)
* [Redis](https://redis.io/docs/getting-started/installation/)

### Installation & Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jatinbishnoi/Financetracker
    cd <your-repo-name>
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    # Create a .env file from the example
    cp .env.example .env 
    ```
    Next, fill in your environment variables in the newly created `backend/.env` file. (See the Environment Variables section below).

3.  **Setup the Frontend:**
    ```bash
    cd ../frontend
    npm install
    # Create a .env file from the example
    cp .env.example .env
    ```
    Fill in the `frontend/.env` file with your backend server's local URL.

4.  **Run the application:**
    * To start the backend server (from the `/backend` directory):
      ```bash
      npm start
      ```
      The backend will be running on `http://localhost:5000` (or your configured `PORT`).

    * To start the frontend development server (from the `/frontend` directory):
      ```bash
      npm run dev
      ```
      Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ Environment Variables

You'll need to create `.env` files for both the backend and frontend. It's recommended to copy the provided `.env.example` files first.

### Backend (`backend/.env`)
```env
# Server Configuration
PORT=5000
MONGODB_URL=yourstring


# JWT Secret
JWT_SECRET=your_super_strong_secret_key

```

## 📖 API Endpoints Overview

The following table lists the core API endpoints for the application.

| Method | Endpoint                    | Description                     | Auth Required |
| :----- | :-------------------------- | :------------------------------ | :------------ |
| `POST` | `/api/auth/register`        | Register a new user             | No            |
| `POST` | `/api/auth/login`           | Login and get a JWT token       | No            |
| `GET`  | `/api/users/me`             | Fetch logged-in user details    | Yes           |
| `PUT`  | `/api/users/update`         | Update user profile             | Yes           |
| `POST` | `/api/transactions/add`     | Add a new transaction           | Yes           |
| `GET`  | `/api/transactions`         | Get all transactions of a user  | Yes           |
| `GET`  | `/api/transactions/summary` | Get analytics summary           | Yes           |
| `GET`  | `/api/admin/users`          | List all users (Admin only)     | Yes (Admin)   |

**Note**: For all protected routes, you must include the `Authorization: Bearer <token>` header in your request.

7.	Start the frontend
8.	npm run dev
9.	Open your browser at:
👉 http://localhost:5173

