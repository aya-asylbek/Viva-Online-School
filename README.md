# 🎓 Viva Online School

Welcome to **Viva Online School** — a full-stack e-learning management platform where instructors can create and manage courses, and students can enroll, track grades, and monitor their academic progress. The project demonstrates object-oriented programming principles, JWT authentication, and a seamless React + Node.js + PostgreSQL integration.

## 📚 Table of Contents
- [About the Project](#about-the-project)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Database Schema](#database-schema)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Screenshots & UI Flow](#screenshots--ui-flow)
- [Testing](#testing)
- [Acknowledgements](#acknowledgements)

## About the Project

Viva Online School is designed as a complete learning management system (LMS) that enables:

- **👩‍🏫 Teachers** to create, edit, and manage courses, assign grades, and monitor student progress
- **🎓 Students** to enroll in courses, view grades, and track GPA in real-time
- **🧱 Built** following OOP principles for scalability and clean architecture

## Technology Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React (Vite), JavaScript, Context API, CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT (JSON Web Token) |
| Testing | Vitest |
| Development Tooling | Concurrently |
| Version Control | Git + GitHub |

## Features

### Authentication & Authorization
- Secure JWT-based login and registration
- Role-based access for students and teachers
- Centralized AuthContext for managing global user state

### User Management
- CRUD operations for users (create, read, update, delete)
- Search users by ID, name, or email
- User details pages with course history and grades
- Role-based dashboards (Student / Teacher)

### Course Management
- Add, edit, and delete courses
- Set prerequisites and enrollment limits
- Display available seats dynamically
- Inline editing for quick course updates

### Prerequisites System
- Define course prerequisites
- Visual indicators for required courses
- Automatic prerequisite checking before enrollment

### Enrollment Management
- Enroll and unenroll students
- Capacity management and seat tracking
- Check prerequisites before allowing enrollment

### Grades & GPA
- Assign grades (A+ to F scale)
- Auto-calculated GPA
- Color-coded grade visualization
- Track assignment dates for each grade
- Student grade history

### Additional Highlights
- Middleware-based route protection
- Organized folder structure with MVC pattern
- Modular React components for each feature
- Responsive design for all devices

## Database Schema

```sql
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
  name VARCHAR(255) NOT NULL,
  credits INTEGER,
  enrollment_limit INTEGER DEFAULT 30
);

-- Prerequisites
CREATE TABLE prerequisites (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  prerequisite_id INTEGER REFERENCES courses(id)
);

-- Enrollments
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  enrolled_at TIMESTAMP DEFAULT NOW()
);

-- Grades
CREATE TABLE grades (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  grade VARCHAR(2),
  date_assigned TIMESTAMP DEFAULT NOW()
);

```

Installation & Setup
1️⃣ Clone the Repository
```
git clone https://github.com/aya-asylbek/Viva-Online-School.git
cd Viva-Online-School
```
2️⃣ Install Dependencies
```
# Frontend dependencies
cd client && npm install
```
# Backend dependencies  
```
cd ../server && npm install
```

3️⃣ Environment Variables

Create a .env file in /server with:
```
env
PORT=5000
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/viva_school
JWT_SECRET=your_jwt_secret_key_here
```
4️⃣ Database Setup
```
# Initialize PostgreSQL database
psql -U your_username -d viva_school -f server/schema.sql
```

5️⃣ Run the Project
Option 1: Run separately


# Frontend (http://localhost:5173)
```
cd client && npm run dev
```
# Backend (http://localhost:5000) - new terminal
cd server && npm start

Option 2: Run both together

# From root directory

npm run dev


```
API Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/login	User login	Public
POST	/api/auth/register	User registration	Public
GET	/api/users	Get all users	Teacher
GET	/api/users/:id	Get user details	Teacher
GET	/api/courses	Get all courses	All
POST	/api/courses	Create course	Teacher
PUT	/api/courses/:id	Update course	Teacher
GET	/api/grades/student/:id	Get student grades	Student/Owner
POST	/api/grades	Assign grade	Teacher

```
Screenshots & UI Flow
Register page
<img width="1440" height="900" alt="register page" src="https://github.com/user-attachments/assets/0654ff0b-40d2-40e5-97ba-3641d9259bef" />

Student Flow:
Login → Dashboard (GPA, enrolled courses, grades) → Courses (enroll) → Grades (view progress)
<img width="1440" height="900" alt="login page" src="https://github.com/user-attachments/assets/85c37436-76e7-45de-88b4-066bfe67ac53" />
<img width="1440" height="900" alt="student dashboard" src="https://github.com/user-attachments/assets/2c6c14b7-746c-4064-b7c8-f7075af22fc9" />
<img width="1440" height="900" alt="courses managment" src="https://github.com/user-attachments/assets/a0888c62-b604-419a-a296-fb0a15972b8a" />
<img width="1440" height="900" alt="my grade history" src="https://github.com/user-attachments/assets/05f45294-1160-47e4-ab69-c5b963b5461e" />
<img width="1440" height="900" alt="my courses enrollment" src="https://github.com/user-attachments/assets/b011fb0d-6109-4db1-8970-4be9e7cd63f2" />

Teacher Flow:
Login → Dashboard (overview) → Courses (manage) → Users (search) → Grades (assign)
<img width="1440" height="900" alt="login as a techer" src="https://github.com/user-attachments/assets/6ccece3d-2284-4a02-a2fd-fa28c6a743c2" />
<img width="1440" height="900" alt="teacher dashboard" src="https://github.com/user-attachments/assets/00729f61-3f56-4014-bb6d-d955695f5731" />
<img width="1440" height="900" alt="courses managment and prerequisites" src="https://github.com/user-attachments/assets/482255b3-2c28-4ed4-9534-741fb07ec9e0" />
attachments/assets/5e73f780-f411-45f2-81a0-b43066e418da" />
<img width="1440" height="900" alt="grade managment" src="https://github.com/user-attachments/assets/e8dd1530-bf72-4e07-8bd0-267d78ec6687" />
<img width="1440" height="900" alt="manage enrollment" src="https://github.com/user-attachments/assets/dd46b07a-8012-4b77-9eec-3f5f588737a1" />
<img width="1440" height="900" alt="user managment" src="https://github.com/user-attachments/assets/98ee3296-899a-4531-ae08-fc79570f89cc" />
<img width="1440" height="900" alt="user details" src="https://github.com/user-attachments/assets/f661d5e8-ad34-402b-b11b-d9710d8fd5dc" />





Testing

# Run tests
```
npm run test
```
Acknowledgements

A big thank you to:

Techtonica program for full-stack training and guidance

Mentors and peers for review and feedback

PostgreSQL, Express, and React communities for great documentation

Author
Aya Asylbek
📍 Sunnyvale, California
🔗 GitHub | LinkedIn
