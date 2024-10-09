# 🦆 Ducky

Welcome to **Ducky**! 🖼️ A collaborative event photo-sharing platform designed for groups and communities to capture and share memories. Think of it as an album-first social experience, making it easy to create, share, and enjoy photo albums for every occasion. 📸

## 🚀 Project Overview
Ducky is built to bring people together through shared albums. With features like album collaboration, role-based access, and image organization, it’s the perfect solution for event photo-sharing. Whether it’s a party, a vacation, or just a day out with friends, Ducky makes it simple and fun to relive the best moments together.

## 🌐 Ducky Website
Check out the live site here: [https://www.ducky.pics/](https://www.ducky.pics/)

## 🧑‍💻 Tech Stack
Here’s a rundown of the technologies that power Ducky:

- **Frontend**: [Next.js](https://nextjs.org/), **TypeScript**, **TailwindCSS**
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), **Python**
- **Authentication**: [Auth.js (formerly Next-Auth)](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.com/) (Postgres)
- **Image Storage**: Supabase Storage Bucket

## ✨ Features
- **Sign Up & Login** with Google and Email authentication
- **Home Page** to view and filter albums
- **Create & Manage Albums** (public or private)
- **Photo Upload & Sorting** with Supabase Storage
- **Profile Management** with roles and permissions
- **Admin Controls** for album privacy and user management
- **Responsive Design** for a smooth experience on all devices

## 🛠️ Setup & Installation
To get started with Ducky locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/AlejandroV01/Ducky.git
cd Ducky
```

### 2. Install Dependencies
For both frontend and backend, you'll need to install dependencies.

#### Frontend (Next.js)
```bash
cd client
npm install
```

#### Backend (FastAPI)
First, set up a virtual environment, then install dependencies:
```bash
cd server
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables
To run Ducky, you need to configure the environment variables.

#### Frontend
Create a `.env.local` file in the `/frontend` directory with the following:
```bash
N/A
```

#### Backend
Create a `.env` file in the `/backend` directory with the following:
```bash
SUPABASE_URL=your_supabase_database_url
SUPABASE_KEY=your_supabase_storage_key
```

### 4. Run the Application
#### Frontend (Next.js)
```bash
npm run dev
```
This will start the frontend server on `http://localhost:3000`.

#### Backend (FastAPI)
```bash
uvicorn main:app --reload
```
This will start the backend server on `http://localhost:8000`.

## 📋 Contributing
We welcome contributions to make Ducky even better! Here’s how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

For any questions or help, feel free to reach out via the Issues section.

## 📞 Contact & Support
For further questions or support, please reach out to the project maintainer at [alexvera0109@gmail.com](mailto:alexvera0109@gmail.com).

---

Thank you for being a part of Ducky! 🎉 Together, let’s make sharing memories as easy and fun as possible. Happy coding! 💻🚀
