# 🧠 Online Quiz Maker

An interactive web application that allows users to **create**, **attempt**, and **analyze** quizzes. Designed for educators, students, and knowledge-sharing communities.

---

## 🚀 Features

- 📝 **Quiz Creation** – Create quizzes with multiple-choice questions.
- 🧪 **Quiz Attempting** – Users can take quizzes and get instant feedback.
- 🏆 **Leaderboard** – Shows top scorers for each quiz.
- 🔒 **Authentication** – Secure login/register for quiz creators.
- 📊 **Analytics** – Track attempts and quiz performance over time.

---

## 🛠️ Tech Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React (Vite), TailwindCSS   |
| Backend     | Node.js, Express.js         |
| Database    | MongoDB Atlas               |
| Auth        | JWT (JSON Web Tokens)       |
| Deployment  | Vercel (frontend), Render(backend)|

//Setup Backend (server)
cd server
npm install
//Create a .env file:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
//Start the backend:
npm start

//Setup Frontend (client)
cd ../client
npm install
npm run dev

📈 API Endpoints
POST /api/auth/register - Register new user

POST /api/auth/login - Login

POST /api/quiz/create - Create a quiz

GET /api/quiz/ - List all quizzes

POST /api/quiz/attempt/:id - Attempt a quiz

GET /api/quiz/leaderboard/:id - Get quiz leaderboard
