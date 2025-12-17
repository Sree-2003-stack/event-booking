# Event Booking & RSVP Management System (MERN Stack)

## 📖 Project Overview
This is a full-stack **Event Booking and RSVP Management application** built using the **MERN stack**.
Users can register, log in, view events, and RSVP to events while respecting strict capacity limits.
The application is designed to handle **concurrent RSVP requests safely**, ensuring that event capacity is never exceeded.

## 🔗 Live Application
- **Frontend (Vercel):** https://your-frontend-url.vercel.app
- **Backend (Render):** https://event-booking-backend-gwi8.onrender.com

## 🛠 Tech Stack
### Frontend
- React (Vite)
- TypeScript
- React Router
- Tailwind CSS
- Context API
### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 🧠 RSVP Capacity & Concurrency Handling

### Problem Statement
When multiple users attempt to RSVP for the same event simultaneously, the system must:
- Prevent capacity overflow
- Avoid duplicate RSVPs
- Maintain data consistency

### Solution Strategy
The backend uses **atomic MongoDB document updates** via Mongoose to safely manage concurrent RSVP requests.

### Implementation Logic
- Check event capacity before allowing RSVP
- Verify user has not already RSVPed
- Update the attendees list in a single atomic operation


## ✅ Project Status
✔ Fully Functional  
✔ Production Deployed  
✔ Concurrency Safe  
✔ Interview Ready




