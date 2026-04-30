# 🏦 GCP Bank App — React Frontend

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)
![GCP](https://img.shields.io/badge/GCP-Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)
![Cost](https://img.shields.io/badge/Cost-FREE%20₹0-brightgreen)

> React Banking Dashboard — GCP Cloud Run deployed with JWT Auth & Real-time Transactions

## 🚀 Live Demo

🔗 **[https://bank-frontend-340118508666.asia-south1.run.app](https://bank-frontend-340118508666.asia-south1.run.app)**
Email: test@bank.com
Password: Test@123

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 JWT Authentication | Secure login & token-based auth |
| 📊 Dashboard | Account balance & transaction overview |
| 💳 Transactions | Real-time deposit & withdraw |
| 🚨 Fraud Alerts | Live fraud detection notifications |
| 🤖 AI Chatbot | Telugu & English Vertex AI assistant |
| 📱 Responsive | Mobile 375px + Tablet 768px support |

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| HTTP | Axios |
| Auth | JWT Tokens |
| Routing | React Router DOM |
| AI Chat | Vertex AI Gemini (via API) |
| Deploy | GCP Cloud Run |
| Container | Docker |

## 📁 Project Structure
bank-project-frontend/
├── src/
│   ├── components/
│   │   ├── Login.js        # JWT Login
│   │   ├── Dashboard.js    # Account Overview
│   │   ├── Transactions.js # Deposit/Withdraw
│   │   ├── FraudAlerts.js  # Fraud Notifications
│   │   ├── Chatbot.js      # AI Assistant
│   │   └── Navbar.js       # Navigation
│   ├── App.js              # Routes + Auth
│   └── App.css             # Styling
├── Dockerfile
└── package.json

## 🚀 Setup & Deploy

```bash
# Clone
git clone https://github.com/krishnancloud-KC/bank-project-frontend.git
cd bank-project-frontend

# Install
npm install

# Run locally
npm start

# Deploy to GCP
gcloud run deploy banking-frontend --source . --region asia-south1
```

## 📸 Pages

- **Login** — JWT authentication
- **Dashboard** — Balance + recent transactions  
- **Transactions** — Deposit & Withdraw
- **Fraud Alerts** — Real-time alerts
- **Chatbot** — Telugu & English AI assistant

---
*GCP Bank App | krishnancloud-KC | April 2026 | Cost: FREE ₹0*

