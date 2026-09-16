# Arabic Question Solution Platform

Solve Arabic exam questions from past exams with a modern and user-friendly web application, and receive instant feedback.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

**ArabicQuestion** is a digital question-solving platform developed for students preparing for university exams, YÖK exams, and other Arabic language exams. The application presents real exam questions from previous years in an interactive way and supports learning by instantly showing explanations when incorrect answers are given.

### Target Audience

- University and YÖK exam candidates (AUZEF, DGS, YDS, etc.)
- Faculty of Theology and Arabic department students
- Language course participants
- Individuals wanting to learn Arabic

## Features

✨ **Core Features**

- 📚 **Extensive Question Pool:** Real exam questions from previous years
- ⚡ **Instant Feedback:** Right/wrong check as soon as you answer
- 🎯 **Detailed Solutions:** Explanatory solution texts for incorrect answers
- 🌐 **RTL Support:** Full right-to-left writing support for Arabic texts
- 🔍 **Filtering:** Filter questions by course, exam type, and year
- 📱 **Responsive Design:** Mobile and desktop compatible interface

🚀 **Planned Features**

- User account and progress tracking
- Scoreboard and statistics
- Topic-based question categories
- Quiz mode (sessions with a specific number of questions)
- Question import (Excel/JSON)
- Dark mode support

## Technology Stack

| Layer | Technology | Version |
|--------|-----------|----------|
| **Backend** | .NET Core Web API | 8.0 / 9.0 |
| **Frontend** | React.js | 18+ |
| **Database** | MySQL | 8.0+ |
| **ORM** | Entity Framework Core | 8.0 |
| **Language** | C#, JavaScript | - |
| **Encoding** | utf8mb4 | Arabic character support |

## Installation

### Requirements

- .NET SDK 8.0 or higher
- Node.js 18+ and npm
- MySQL 8.0 or higher

### Backend Installation

```bash
# Navigate to backend folder
cd Backend/ArapcaSoruApi/ArapcaSoruApi

# Restore dependencies
dotnet restore

# Edit appsettings.json (MySQL connection information)

# Apply database migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will run by default at `https://localhost:5001`.

### Frontend Installation

```bash
# Navigate to frontend folder
cd Frontend

# Install dependencies
npm install

# Create .env file and set API URL
echo "VITE_API_URL=https://localhost:5001" > .env

# Start development server
npm run dev
```

The frontend application will be accessible at `http://localhost:5173`.

### Database Setup

Configure your MySQL database with the following settings:

```sql
CREATE DATABASE ArabicQuiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> **Important:** `utf8mb4` encoding must be used for correct storage of Arabic characters.

## Usage

1. Open the application in your browser (`http://localhost:5173`)
2. Select a course from the homepage (Arabic-2 or Arabic-4)
3. Select exam type (Midterm, Final, Summer School, etc.)
4. Select year
5. Start solving questions
6. When you click on an option:
   - ✅ **Correct answer:** Highlighted in green
   - ❌ **Incorrect answer:** Highlighted in red and the correct answer is shown
   - 💡 **Solution:** Explanation text is automatically displayed

## Project Structure

```
soru-cozum/
├── Backend/
│   └── ArapcaSoruApi/
│       └── ArapcaSoruApi/
│           ├── Controllers/      # API endpoints
│           │   └── QuestionsController.cs
│           ├── Models/           # Data models
│           │   └── Question.cs
│           ├── Data/             # Database context
│           │   └── AppDbContext.cs
│           └── Program.cs        # Application entry point
├── Frontend/
│   └── src/
│       ├── components/           # React components
│       │   ├── HomeScreen.jsx
│       │   ├── QuestionCard.jsx
│       │   └── ...
│       ├── services/             # API services
│       │   └── questionService.js
│       ├── App.jsx               # Main application
│       └── main.jsx              # Entry point
├── docs/                         # Documentation
└── README.md                     # This file
```

## API Endpoints

### Questions

| Method | Endpoint | Description |
|--------|----------|----------|
| GET | `/api/questions` | Get all questions |
| GET | `/api/questions?course=Arapca-2&examType=Final&year=2021` | Get filtered questions |
| GET | `/api/questions/{id}` | Get a specific question |
| POST | `/api/questions` | Add new question (Admin) |
| PUT | `/api/questions/{id}` | Update question (Admin) |
| DELETE | `/api/questions/{id}` | Delete question (Admin) |

### Example Request

```bash
curl -X GET "https://localhost:5001/api/questions?course=Arapca-2&examType=Final&year=2021"
```

### Example Response

```json
{
  "id": 1,
  "courseName": "Arapca-2",
  "examType": "Final",
  "year": 2021,
  "imagePath": "/images/soru1.png",
  "correctOption": "C",
  "explanation": "The word in this question..."
}
```

## Development

### Code Quality

- Backend: ESLint + Prettier
- Frontend: ESLint + Prettier

### Testing

```bash
# Backend tests
cd Backend/ArapcaSoruApi/ArapcaSoruApi
dotnet test

# Frontend tests
cd Frontend
npm test
```

## Contributing

We welcome your contributions! Please follow these steps:

1. Fork the project
2. Create a new branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push your branch (`git push origin feature/NewFeature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Contact:** You can open an issue for questions about the project.

**Happy learning! 🎓**