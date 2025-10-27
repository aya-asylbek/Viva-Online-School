🎓 Viva Online School 

Welcome to Viva Online School — a full-stack e-learning management platform where instructors can create and manage courses, and students can enroll, track grades, and monitor their academic progress.
The project demonstrates object-oriented programming principles, JWT authentication, and a seamless React + Node.js + PostgreSQL integration.

📚 Table of Contents

About the Project

Technology Stack

Features

Database Schema

Installation & Setup

Screenshots & UI Flow

Acknowledgements

🧩 About the Project

Viva Online School (VLearnFlow) is designed as a complete learning management system (LMS) that enables:

👩‍🏫 Teachers to create, edit, and manage courses, assign grades, and monitor student progress.

🎓 Students to enroll in courses, view grades, and track GPA in real-time.

🧱 Built following OOP principles for scalability and clean architecture.

This project was developed as part of a full-stack engineering assignment to demonstrate mastery in backend and frontend integration.

⚙️ Technology Stack
Category	Technologies
Frontend	React (Vite), JavaScript, Context API, CSS
Backend	Node.js, Express.js
Database	PostgreSQL
Authentication	JWT (JSON Web Token)
Testing	Vitest
Development Tooling	Concurrently
Version Control	Git + GitHub
🚀 Features
🧑‍💻 Authentication & Authorization

Secure JWT-based login and registration

Role-based access for students and teachers

Centralized AuthContext for managing global user state

🧠 User Management

CRUD operations for users (create, read, update, delete)

Search users by ID, name, or email

Input validation and duplicate prevention

Role-based dashboards (Student / Teacher)

📘 Course Management

Add, edit, and delete courses

Set prerequisites and enrollment limits

Display available seats dynamically

Prevent duplicate or invalid course entries

🧾 Enrollment Management

Enroll and unenroll students

Bulk enrollment option

Check prerequisites before allowing enrollment

Show available vs enrolled students lists

🧮 Grades & GPA

Assign grades (A+ to F)

Auto-calculated GPA

Color-coded grade visualization

Track assignment dates for each grade

💡 Additional Highlights

Middleware-based route protection

Organized folder structure with MVC pattern

Modular React components for each feature

Unit testing with Vitest

🗃️ Database Schema
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'teacher'))
);

-- Courses
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  credits INTEGER,
  prerequisite_id INTEGER REFERENCES courses(id),
  capacity INTEGER DEFAULT 30
);

-- Enrollments
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  enrolled_on TIMESTAMP DEFAULT NOW(),
  grade VARCHAR(2)
);

🛠️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/aya-asylbek/Viva-Online-School.git
cd Viva-Online-School

2️⃣ Install Dependencies
cd client && npm install
cd ../server && npm install

3️⃣ Environment Variables

Create a .env file in /server with:

PORT=5432
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/viva_school
JWT_SECRET=aj12!sX9rT_2025secret


✅ Add .env to .gitignore.

4️⃣ Initialize PostgreSQL Database
cd server
psql postgres -f schema.sql


Or copy-paste the SQL schema above.

5️⃣ Run the Project
Option 1: Run separately
cd client && npm run dev
# open new terminal
cd server && npm start

Option 2: Run both together with Concurrently

In root package.json:

"scripts": {
  "dev": "concurrently \"cd client && npm run dev\" \"cd server && npm start\""
}


Then run:

npm run dev


Frontend: http://localhost:5173

Backend: http://localhost:5000

🖼️ Screenshots & UI Flow

Login/Register Page – Secure JWT login and signup

Navbar – Dynamic links for teachers/students

Student Dashboard – GPA, enrolled courses, grades

Teacher Dashboard – Manage courses, assign grades
(You can later add screenshots under /client/public/screenshots/)

✅ Testing

Run Vitest to execute unit tests:

npm run test

🙌 Acknowledgements

A big thank you to:

Techtonica program for full-stack training and guidance

Mentors and peers for review and feedback

PostgreSQL, Express, and React communities for great documentation

👩‍💻 Author

Aya Asylbek
📍 Sunnyvale, California
🔗 GitHub
 | LinkedIn