# 🚀 MERN Hackathon Boilerplate

A full-stack MERN (MongoDB, Express.js, React, Node.js) boilerplate designed for hackathon projects. Features include user authentication, request management system, and a modern dashboard interface.

## 🔗 Repository

**GitHub Repository:** https://github.com/MananVyas01/OdooThon

## �️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React, Tailwind CSS, React Router
- **Authentication:** JWT (JSON Web Tokens)
- **Charts:** Recharts for data visualization
- **Development:** Concurrently for running both servers
- **Data Validation**: Express-validator for input validation
- **Error Handling**: Comprehensive error handling middleware
- **Database Seeding**: Sample data for quick testing

### Frontend (React + Tailwind CSS)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication Flow**: Login/Register with protected routes
- **Interactive Dashboard**: Statistics, charts, and data visualization
- **Request Management**: Create, view, edit, and delete requests
- **Real-time Updates**: Live status updates and notifications
- **Mobile Responsive**: Works perfectly on all devices

## 🛠 Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS, Recharts, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Development**: Concurrently, Nodemon, PostCSS, Autoprefixer

## 📦 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MananVyas01/OdooThon.git
   cd odooThon
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install-all
   ```

3. **Set up environment variables**
   
   **Backend (.env)**:
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your values
   ```
   
   **Frontend (.env)**:
   ```bash
   cd client
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas connection string

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📝 Environment Variables

### Backend (.env)
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/hackathon-db
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Hackathon Boilerplate
```

## 🔐 Demo Credentials

After seeding the database, you can use these demo accounts:

- **Admin**: admin@example.com / password123
- **Manager**: manager@example.com / password123
- **User**: user@example.com / password123

## 📁 Project Structure

```
odooThon/
├── client/                         # React frontend application
│   ├── public/                     # Static files
│   │   ├── index.html             # Main HTML template
│   │   └── favicon.ico            # App icon
│   ├── src/                       # React source code
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Button.js          # Custom button component
│   │   │   ├── Input.js           # Input field component
│   │   │   ├── Select.js          # Select dropdown component
│   │   │   ├── Modal.js           # Modal dialog component
│   │   │   ├── Toast.js           # Toast notification component
│   │   │   ├── Loading.js         # Loading spinner component
│   │   │   ├── Navbar.js          # Navigation bar
│   │   │   └── ProtectedRoute.js  # Route protection component
│   │   ├── pages/                 # Page components
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Dashboard.js       # Main dashboard with charts
│   │   │   ├── RequestList.js     # Request listing page
│   │   │   ├── RequestForm.js     # Request creation/editing form
│   │   │   └── RequestDetails.js  # Request details page
│   │   ├── context/               # React Context providers
│   │   │   └── AuthContext.js     # Authentication context
│   │   ├── utils/                 # Utility functions
│   │   │   └── api.js             # API service functions
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # React entry point
│   ├── .env                       # Frontend environment variables
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── postcss.config.js          # PostCSS configuration
├── server/                        # Node.js backend API
│   ├── controllers/               # Route controllers
│   │   ├── authController.js      # Authentication logic
│   │   └── requestController.js   # Request management logic
│   ├── models/                    # Mongoose database models
│   │   ├── User.js                # User model schema
│   │   └── Request.js             # Request model schema
│   ├── routes/                    # API routes
│   │   ├── auth.js                # Authentication routes
│   │   └── requests.js            # Request management routes
│   ├── middleware/                # Custom middleware
│   │   ├── auth.js                # JWT authentication middleware
│   │   └── errorHandler.js        # Error handling middleware
│   ├── config/                    # Configuration files
│   │   └── database.js            # Database connection config
│   ├── scripts/                   # Utility scripts
│   │   └── seed.js                # Database seeding script
│   ├── .env                       # Backend environment variables
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Main server file
├── data/                          # MongoDB data directory (local)
│   ├── db/                        # Database files
│   └── log/                       # MongoDB logs
├── setup.js                       # Automated setup script
├── install-mongodb.bat            # MongoDB installer (Windows)
├── install-mongodb.ps1            # MongoDB installer (PowerShell)
├── install-mongo-simple.bat       # Simple MongoDB installer
├── setup-and-run.bat              # Complete setup and run script
├── SETUP-GUIDE.md                 # Detailed setup instructions
├── SETUP-COMPLETE.txt             # Setup completion guide
├── .gitignore                     # Git ignore rules
├── package.json                   # Root package.json with scripts
└── README.md                      # Project documentation
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run client` - Start only frontend
- `npm run server` - Start only backend
- `npm run install-all` - Install all dependencies
- `npm run seed` - Seed database with sample data

### Backend (./server)
- `npm run dev` - Start with nodemon (development)
- `npm start` - Start production server
- `npm run seed` - Seed database

### Frontend (./client)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Requests
- `GET /api/requests` - Get all requests (with filters)
- `GET /api/requests/:id` - Get single request
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `POST /api/requests/:id/comments` - Add comment
- `GET /api/requests/dashboard/stats` - Get dashboard statistics

## 🎨 Customization

### Styling
- Modify `client/src/index.css` for global styles
- Update `client/tailwind.config.js` for theme customization
- Colors, fonts, and spacing can be easily adjusted

### Database Schema
- Add new fields to existing models in `server/models/`
- Create new models as needed
- Update seed data in `server/scripts/seed.js`

### API Features
- Add new routes in `server/routes/`
- Create corresponding controllers in `server/controllers/`
- Add validation rules using express-validator

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 for process management
3. Deploy to Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or serve static files

### Database
- Use MongoDB Atlas for production
- Ensure proper indexing for performance
- Set up automated backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Hackathon Tips

### For Civic Tech Projects
- Modify the Request model for issue reporting
- Add location-based filtering
- Implement citizen feedback systems

### For Sustainability Projects
- Track environmental impact metrics
- Add carbon footprint calculations
- Implement green initiative tracking

### For Public Services
- Add service request categories
- Implement priority-based routing
- Add notification systems

### For Marketplace Ideas
- Convert requests to products/services
- Add payment integration
- Implement rating systems

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string in .env
- Ensure network connectivity

**Port Already in Use**
- Change PORT in server/.env
- Kill existing processes: `pkill -f node`

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

### Performance Tips
- Use MongoDB indexes for frequently queried fields
- Implement pagination for large datasets
- Add caching with Redis for production
- Optimize images and assets

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed description

---

**Happy Hacking! 🚀**

Built with ❤️ for the hackathon community.
