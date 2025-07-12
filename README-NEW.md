# 🚀 MERN Hackathon Boilerplate

A full-stack MERN (MongoDB, Express.js, React, Node.js) boilerplate designed for hackathon projects. Features include user authentication, request management system, and a modern dashboard interface.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React, Tailwind CSS, React Router
- **Authentication:** JWT (JSON Web Tokens)
- **Charts:** Recharts for data visualization
- **Development:** Concurrently for running both servers

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

1. **Install MongoDB (if not already installed):**
   ```bash
   # Run as Administrator
   .\install-mongodb.bat
   ```

2. **Setup and run the project:**
   ```bash
   node setup.js
   ```

### Option 2: Manual Setup

1. **Install MongoDB:**
   - Download from [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
   - Install with default settings
   - Ensure MongoDB is added to your PATH

2. **Install dependencies:**
   ```bash
   npm run install-all
   ```

3. **Start MongoDB (if not running as service):**
   ```bash
   mongod
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```

5. **Start the application:**
   ```bash
   npm run dev
   ```

## 🌐 Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api

## 👥 Default Login Credentials

- **Admin:** admin@example.com / password123
- **Manager:** manager@example.com / password123
- **User:** user@example.com / password123

## 🔧 Configuration

### Environment Variables

**Server (.env):**
```
MONGO_URI=mongodb://localhost:27017/hackathon-db
JWT_SECRET=your-generated-jwt-secret
PORT=5000
NODE_ENV=development
```

**Client (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Hackathon Boilerplate
```

## 📁 Project Structure

```
odooThon/
├── server/                 # Backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── scripts/           # Utility scripts
│   └── server.js          # Main server file
├── client/                # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── data/                  # MongoDB data directory
├── setup.js               # Automated setup script
├── install-mongodb.ps1    # MongoDB installer script
└── package.json           # Root package.json
```

## 🌟 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Manager, User)
- Protected routes and middleware
- Password hashing with bcrypt

### Request Management System
- Create, read, update, delete requests
- Request categories and priorities
- Status tracking and assignment
- User-specific request filtering

### Modern Dashboard
- Interactive charts and statistics
- Real-time data visualization
- Responsive design with Tailwind CSS
- Mobile-friendly interface

### API Features
- RESTful API design
- Input validation and sanitization
- Error handling and logging
- CORS configuration

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run server           # Start backend only
npm run client           # Start frontend only

# Setup
npm run setup            # Automated setup script
npm run install-all      # Install all dependencies
npm run seed             # Seed database with sample data

# Build
npm run build            # Build frontend for production
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Requests
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get request by ID
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in server/.env
   - Verify MongoDB service is started

2. **Port Already in Use:**
   - Change PORT in server/.env
   - Update REACT_APP_API_URL in client/.env

3. **Module Not Found:**
   - Run `npm run install-all`
   - Clear node_modules and reinstall

### Alternative MongoDB Setup

If local MongoDB installation fails, use MongoDB Atlas:

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update MONGO_URI in server/.env

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review the setup guide: `SETUP-GUIDE.md`
- Create an issue on GitHub

## 🚀 Deployment

Ready for deployment on platforms like:
- Heroku
- Vercel (Frontend)
- Railway
- DigitalOcean

---

**Happy Hacking! 🎉**
