# 📌 Leave Manager — HR Leave Management System

Leave Manager is a lightweight HR tool that enables organizations to manage employee leave requests efficiently. Employees can apply for leave, track their leave balance, while admins can approve or deny requests from a centralized dashboard.

---

## 🚀 Features

### 👨‍💼 Employee
- Apply for leave (Casual / Sick / Earned)
- View leave history
- Check remaining leave balance
- Responsive & clean UI

### 🛠️ Admin
- View all pending leave requests
- Approve / Deny with comments
- Filter & sort leave requests
- Manage leave records

---

## 🏗️ Tech Stack

| Category | Technology |
|---------|------------|
| Frontend | React, TypeScript, TailwindCSS, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | Basic login (local-storage based) with jwt |
| State/Data | API calls through service layer |

---

## 📂 Project Structure
```sh
Leave-Manager/
│
├── backend/
│ ├── models/ # MongoDB schemas(User, Leave History)
│ ├── routes/ # API routes for Auth & Leave operations
│ └── index.js # Express server entry point
│
└── frontend/
├── src/
│ ├── components/ # UI Components (Dashboard, Modals, Forms)
│ ├── pages/ # Employee & Admin pages
│ ├── services/ # API call handlers
│ ├── utils/ # Typescript types & helpers
│ ├── assets/ # Static files
│ └── App.tsx / main.tsx
└── index.html
```
---

## 🛠️ Setup Instructions

### ✅ Clone Repository
```sh
git clone https://github.com/luckyCohle/LeaveManager.git
cd LeaveManager
```
## Backend Setup
```sh
cd backend
npm install
```
## Create a .env file:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
```
## Run backend:
```sh
npm run dev
```
## 🔹 Frontend Setup
Open another terminal:
```sh
cd frontend
npm install
```

## Create .env file:
```sh
VITE_API_URL=http://localhost:5000
```

## Run frontend:
```sh
npm run dev
```
---

## ✅ Future Enhancements

- **JWT-based Authentication *
- **Better UI/UX Enhancements**
- **Calendar View** for leave booking
- **Admin Analytics Dashboard** (charts & statistics)
- **Attach Medical Certificate** for sick leave

---

## 🤝 Contributing

Feel free to **report issues** or **submit enhancements** via pull requests.  
All contributions that improve functionality, performance, or documentation are welcome!

---

## 📄 License

This project is created **for learning and interview assignment purposes**.  
You may use or modify it freely for educational and demonstration goals.

---