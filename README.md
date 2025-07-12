
# OdooThon MERN Hackathon Boilerplate

This project helps you quickly build web apps using the MERN stack (MongoDB, Express.js, React, Node.js). It includes user login, request management, and a modern dashboard.

## What’s Inside?

- **Backend:** Handles data and user accounts (Node.js, Express.js, MongoDB)
- **Frontend:** Shows the website (React, Tailwind CSS)
- **Login System:** Secure login with JWT
- **Dashboard:** See stats and charts
- **Request System:** Make, view, and manage requests

## How to Start

1. **Install Node.js and MongoDB** on your computer.
2. **Clone this project:**
   ```bash
   git clone https://github.com/MananVyas01/OdooThon.git
   cd odooThon
   ```
3. **Install all packages:**
   ```bash
   npm install
   npm run install-all
   ```
4. **Set up environment files:**
   - Copy `.env.example` to `.env` in both `server` and `client` folders, then fill in your details.
5. **Start MongoDB** (run `mongod` or use MongoDB Atlas).
6. **Seed the database** (optional):
   ```bash
   npm run seed
   ```
7. **Run the app:**
   ```bash
   npm run dev
   ```

Now open your browser:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Demo Logins

After seeding, you can use:
- Admin: admin@example.com / password123
- Manager: manager@example.com / password123
- User: user@example.com / password123

## Project Folders

- `client/` – Frontend code (React)
- `server/` – Backend code (Node.js)
- `data/` – MongoDB data (local)
- Scripts for setup and install

## Useful Commands

- `npm run dev` – Start both frontend and backend
- `npm run client` – Start only frontend
- `npm run server` – Start only backend
- `npm run install-all` – Install all packages
- `npm run seed` – Add demo data

## API Examples

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Get requests: `GET /api/requests`
- Add request: `POST /api/requests`

## Customizing

- Change styles in `client/src/index.css`
- Edit backend models in `server/models/`
- Add new features in `server/routes/` and `server/controllers/`

## Deploying

- Backend: Use PM2, Heroku, DigitalOcean, or AWS
- Frontend: Build and deploy to Netlify or Vercel
- Database: Use MongoDB Atlas for cloud

## Common Problems

- **MongoDB not connecting:** Make sure MongoDB is running and your `.env` is correct.
- **Port in use:** Change the port in `.env` or stop other apps using it.
- **Build errors:** Delete `node_modules` and reinstall with `npm install`.

## Need Help?

Check the troubleshooting section, search issues, or create a new issue with details.

---

Happy Hacking! 🚀
