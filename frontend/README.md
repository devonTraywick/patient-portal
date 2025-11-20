📌 Patient Portal Dashboard

A Full-Stack Healthcare Web Application (React + Node.js + PostgreSQL + JWT)

🩺 Overview

The Patient Portal Dashboard is a secure, full-stack web application that allows patients to access and manage their healthcare information. It includes account creation, appointment management, medical records access, secure messaging, and more — built using modern, maintainable, industry-standard tech.

This project uses:

React for the frontend

Node.js (Express) for the backend REST API

PostgreSQL for persistent storage

JWT Authentication for secure login sessions

Sequelize ORM for database communication

Everything is designed to be modular, scalable, and easy to extend.

🚀 Features
🔐 Authentication

Secure login & registration

JWT-based session handling

Password hashing using bcrypt

Protected routes for patient data

👤 Patient Dashboard

View profile information

Update personal details

View upcoming and past appointments

Access medical records (labs, medications, visits)

📅 Appointment Management

Schedule appointments

Cancel appointments

View appointment history

💬 Secure Messaging (Optional Feature)

Simple message inbox

Contact healthcare providers securely

⚙️ Admin / Provider Tools (Future)

Manage patients

Approve/reject appointment requests

Update medical records

🏗️ Tech Stack
Layer	Technology
Frontend	React, Vite, Tailwind (optional)
Backend	Node.js, Express.js
Database	PostgreSQL
ORM	Sequelize
Auth	JWT, bcrypt
Environment	macOS, JavaScript
📁 Folder Structure
patient-portal/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   ├── routes/
│   └── utils/
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── hooks/
    │   └── App.jsx
    └── vite.config.js

⚙️ Installation & Setup (macOS)
1. Clone the Repository
git clone https://github.com/yourusername/patient-portal.git
cd patient-portal

🗄️ Backend Setup (Node.js + PostgreSQL)

Navigate into the backend folder:

cd backend

2. Install backend dependencies
npm install

3. Create a .env file
touch .env


Paste:

PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgres://username:password@localhost:5432/patient_portal

4. Create PostgreSQL database
createdb patient_portal

5. Run Sequelize migrations (if applicable)
npx sequelize-cli db:migrate

6. Start backend
npm run dev


Backend will run at:

http://localhost:5000

🎨 Frontend Setup (React)

Navigate into the frontend folder:

cd ../frontend

1. Install frontend dependencies
npm install

2. Start frontend
npm run dev


Frontend will run at:

http://localhost:5173/

🔑 How Authentication Works
Login Flow

User enters email + password

Backend compares hashed password

Backend generates a JWT token

Token is stored in localStorage

Protected pages verify token before loading

Protected Routes

React checks:

if (!localStorage.getItem("token")) redirect("/login");


Backend checks:

req.headers.authorization => "Bearer TOKEN"

🧪 Testing
Backend tests (Jest / Supertest)
npm test

Frontend tests (React Testing Library)
npm run test

🧱 Roadmap
Phase 1 — Core (Completed / In Progress)

Patient login & registration

JWT authentication

Profile dashboard

Appointment system

Database models

Phase 2 — Enhancements

Messaging between patients and providers

Insurance information

Notifications

Phase 3 — Admin Portal

Provider login

Patient management

Appointment approval system

🛡️ Security Considerations

All passwords hashed

JWT access tokens expire

Role-based middleware planned

SQL injection protection via Sequelize

Input validation (Yup / Zod recommended)

🤝 Contributing

Pull requests welcome!
Please follow conventional commits and create a new branch per feature.

📄 License

MIT License — feel free to use, modify, or adapt for your own projects.

🙌 Credits

Designed and built by Devon Traywick with AI assistance.
Built with ❤️ using modern JavaScript tooling.