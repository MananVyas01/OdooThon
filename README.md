# 🌟 ReWear - Community Clothing Exchange

A full-stack MERN (MongoDB, Express.js, React, Node.js) platform for sustainable fashion sharing. Features include user authentication, clothing exchange system, community events, and environmental impact tracking.

## 🔗 Repository

**GitHub Repository:** https://github.com/MananVyas01/OdooThon

## 🎯 Problem Statement

The fashion industry is one of the world's largest polluters, with millions of tons of clothing ending up in landfills annually. Meanwhile, many people struggle with:
- Overcrowded closets filled with rarely-worn items
- Limited budgets for new clothing
- Lack of sustainable alternatives to fast fashion
- Difficulty finding unique, quality pieces
- Social isolation in increasingly digital communities

## 💡 Solution

ReWear addresses these challenges by creating a hyperlocal clothing exchange platform that:
- **Reduces Waste**: Extends the lifecycle of clothing through community sharing
- **Builds Community**: Connects neighbors through sustainable fashion practices
- **Saves Money**: Provides access to quality clothing without purchasing new items
- **Promotes Sustainability**: Encourages circular economy principles in fashion
- **Enhances Discovery**: Helps users find unique pieces and styles

## 🏗️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React, Tailwind CSS, React Router
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time Features:** Socket.io for instant messaging
- **Maps Integration:** Google Maps API for location services
- **Charts:** Recharts for impact visualization
- **Development:** Concurrently for running both servers
- **Data Validation:** Express-validator for input validation
- **Email Service:** Nodemailer for notifications

### Backend Features
- **RESTful API**: Clean, well-documented endpoints
- **User Authentication**: JWT-based secure authentication
- **Real-time Messaging**: Socket.io for user communication
- **Location Services**: Google Maps integration
- **Email Notifications**: Automated email updates
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Robust error handling middleware

### Frontend (React + Tailwind CSS)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Authentication Flow**: Login/Register with protected routes
- **Interactive Dashboard**: Statistics, charts, and impact visualization
- **Clothing Management**: List, browse, and manage clothing items
- **Exchange System**: Request, approve, and track exchanges
- **Community Features**: Events, groups, and user profiles
- **Real-time Chat**: Instant messaging between users
- **Mobile Responsive**: Works perfectly on all devices

## 📦 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Maps API key
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
MONGO_URI=mongodb://localhost:27017/rewear-db
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@rewear.com
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=ReWear
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
```

## 🔐 Demo Credentials

After seeding the database, you can use these demo accounts:

- **Admin**: admin@rewear.com / password123
- **Community Manager**: manager@rewear.com / password123
- **User**: user@rewear.com / password123

## 📁 Project Structure

```
odooThon/
├── client/                         # React frontend application
│   ├── public/                     # Static files
│   │   ├── index.html             # Main HTML template
│   │   └── favicon.ico            # App icon
│   ├── src/                       # React source code
│   │   ├── components/            # Reusable UI components
│   │   │   ├── common/            # Common components
│   │   │   │   ├── Button.js      # Custom button component
│   │   │   │   ├── Input.js       # Input field component
│   │   │   │   ├── Modal.js       # Modal dialog component
│   │   │   │   ├── Toast.js       # Toast notification component
│   │   │   │   ├── Loading.js     # Loading spinner component
│   │   │   │   └── ImageUpload.js # Image upload component
│   │   │   ├── layout/            # Layout components
│   │   │   │   ├── Navbar.js      # Navigation bar
│   │   │   │   ├── Footer.js      # Footer component
│   │   │   │   └── Sidebar.js     # Sidebar navigation
│   │   │   ├── clothing/          # Clothing-related components
│   │   │   │   ├── ClothingCard.js    # Clothing item card
│   │   │   │   ├── ClothingFilter.js  # Filter component
│   │   │   │   └── ClothingUpload.js  # Upload form
│   │   │   ├── exchange/          # Exchange components
│   │   │   │   ├── ExchangeRequest.js # Exchange request form
│   │   │   │   └── ExchangeHistory.js # Exchange history
│   │   │   ├── chat/              # Chat components
│   │   │   │   ├── ChatBox.js     # Chat interface
│   │   │   │   └── MessageList.js # Message list
│   │   │   └── maps/              # Map components
│   │   │       ├── LocationPicker.js # Location selection
│   │   │       └── ExchangeMap.js    # Exchange locations map
│   │   ├── pages/                 # Page components
│   │   │   ├── auth/              # Authentication pages
│   │   │   │   ├── Login.js       # Login page
│   │   │   │   ├── Register.js    # Registration page
│   │   │   │   └── Profile.js     # User profile page
│   │   │   ├── dashboard/         # Dashboard pages
│   │   │   │   ├── Dashboard.js   # Main dashboard
│   │   │   │   ├── Analytics.js   # Impact analytics
│   │   │   │   └── UserStats.js   # User statistics
│   │   │   ├── clothing/          # Clothing pages
│   │   │   │   ├── ClothingList.js    # Browse clothing
│   │   │   │   ├── ClothingDetails.js # Item details
│   │   │   │   ├── AddClothing.js     # Add new item
│   │   │   │   └── MyClothing.js      # User's items
│   │   │   ├── exchange/          # Exchange pages
│   │   │   │   ├── ExchangeList.js    # Exchange requests
│   │   │   │   ├── ExchangeDetails.js # Exchange details
│   │   │   │   └── ExchangeHistory.js # Exchange history
│   │   │   ├── community/         # Community pages
│   │   │   │   ├── Events.js      # Community events
│   │   │   │   ├── Groups.js      # Local groups
│   │   │   │   └── Members.js     # Community members
│   │   │   └── messages/          # Messaging pages
│   │   │       ├── ChatList.js    # Chat conversations
│   │   │       └── ChatRoom.js    # Individual chat
│   │   ├── context/               # React Context providers
│   │   │   ├── AuthContext.js     # Authentication context
│   │   │   ├── ClothingContext.js # Clothing management context
│   │   │   └── ChatContext.js     # Chat context
│   │   ├── utils/                 # Utility functions
│   │   │   ├── api.js             # API service functions
│   │   │   ├── cloudinary.js      # Cloudinary utilities
│   │   │   ├── location.js        # Location utilities
│   │   │   └── constants.js       # App constants
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useAuth.js         # Authentication hook
│   │   │   ├── useSocket.js       # Socket.io hook
│   │   │   └── useLocation.js     # Location hook
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # React entry point
│   ├── .env                       # Frontend environment variables
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── postcss.config.js          # PostCSS configuration
├── server/                        # Node.js backend API
│   ├── controllers/               # Route controllers
│   │   ├── authController.js      # Authentication logic
│   │   ├── clothingController.js  # Clothing management logic
│   │   ├── exchangeController.js  # Exchange logic
│   │   ├── userController.js      # User management logic
│   │   ├── eventController.js     # Event management logic
│   │   └── chatController.js      # Chat functionality
│   ├── models/                    # Mongoose database models
│   │   ├── User.js                # User model schema
│   │   ├── Clothing.js            # Clothing item model
│   │   ├── Exchange.js            # Exchange request model
│   │   ├── Event.js               # Community event model
│   │   ├── Message.js             # Chat message model
│   │   └── Group.js               # Community group model
│   ├── routes/                    # API routes
│   │   ├── auth.js                # Authentication routes
│   │   ├── clothing.js            # Clothing management routes
│   │   ├── exchange.js            # Exchange routes
│   │   ├── users.js               # User management routes
│   │   ├── events.js              # Event routes
│   │   └── chat.js                # Chat routes
│   ├── middleware/                # Custom middleware
│   │   ├── auth.js                # JWT authentication middleware
│   │   ├── upload.js              # File upload middleware
│   │   ├── validation.js          # Input validation middleware
│   │   └── errorHandler.js        # Error handling middleware
│   ├── config/                    # Configuration files
│   │   ├── database.js            # Database connection config
│   │   └── socket.js              # Socket.io configuration
│   ├── scripts/                   # Utility scripts
│   │   └── seed.js                # Database seeding script
│   ├── utils/                     # Backend utilities
│   │   ├── email.js               # Email service
│   │   ├── imageUpload.js         # Image upload utilities
│   │   └── analytics.js           # Analytics utilities
│   ├── .env                       # Backend environment variables
│   ├── package.json               # Backend dependencies
│   └── server.js                  # Main server file
├── data/                          # MongoDB data directory (local)
│   ├── db/                        # Database files
│   └── log/                       # MongoDB logs
├── docs/                          # Documentation
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── FEATURES.md                # Feature documentation
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
- `npm run build` - Build frontend for production

### Backend (./server)
- `npm run dev` - Start with nodemon (development)
- `npm start` - Start production server
- `npm run seed` - Seed database
- `npm test` - Run backend tests

### Frontend (./client)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Clothing Management
- `GET /api/clothing` - Get all clothing items (with filters)
- `GET /api/clothing/:id` - Get single clothing item
- `POST /api/clothing` - Add new clothing item
- `PUT /api/clothing/:id` - Update clothing item
- `DELETE /api/clothing/:id` - Delete clothing item
- `GET /api/clothing/user/:userId` - Get user's clothing items
- `POST /api/clothing/:id/favorite` - Favorite/unfavorite item

### Exchange System
- `GET /api/exchanges` - Get all exchanges
- `GET /api/exchanges/:id` - Get single exchange
- `POST /api/exchanges` - Create exchange request
- `PUT /api/exchanges/:id` - Update exchange status
- `DELETE /api/exchanges/:id` - Cancel exchange
- `GET /api/exchanges/user/:userId` - Get user's exchanges
- `POST /api/exchanges/:id/accept` - Accept exchange request
- `POST /api/exchanges/:id/reject` - Reject exchange request

### Community Features
- `GET /api/events` - Get community events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/join` - Join event
- `POST /api/events/:id/leave` - Leave event

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/stats` - Get user statistics
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user

### Chat System
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/conversations/:id` - Get conversation messages
- `POST /api/chat/conversations` - Create new conversation
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/messages/:id/read` - Mark message as read

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics
- `GET /api/analytics/impact` - Get environmental impact data
- `GET /api/analytics/community` - Get community statistics

## 🎨 Customization

### Styling
- Modify `client/src/index.css` for global styles
- Update `client/tailwind.config.js` for theme customization
- Colors, fonts, and spacing can be easily adjusted
- Component-specific styles in respective component files

### Database Schema
- Add new fields to existing models in `server/models/`
- Create new models as needed
- Update seed data in `server/scripts/seed.js`
- Add appropriate indexes for performance

### API Features
- Add new routes in `server/routes/`
- Create corresponding controllers in `server/controllers/`
- Add validation rules using express-validator
- Implement new middleware as needed

### Frontend Features
- Add new components in `client/src/components/`
- Create new pages in `client/src/pages/`
- Add custom hooks in `client/src/hooks/`
- Extend context providers for state management

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 for process management
3. Deploy to Heroku, DigitalOcean, or AWS
4. Configure MongoDB Atlas for production
5. Set up Cloudinary for image storage
6. Configure email service (SendGrid, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or serve static files
3. Configure environment variables on hosting platform
4. Set up custom domain and SSL certificate

### Database
- Use MongoDB Atlas for production
- Ensure proper indexing for performance
- Set up automated backups
- Configure connection pooling

## 📊 Impact Tracking

### Environmental Metrics
- **Items Exchanged**: Total number of clothing pieces shared
- **Waste Diverted**: Estimated pounds of textile waste prevented
- **Carbon Footprint**: Reduction in fashion-related emissions
- **Water Saved**: Estimated water conservation from reduced production

### Community Metrics
- **Active Users**: Number of regularly engaged community members
- **Exchanges Completed**: Successful clothing exchanges
- **Events Hosted**: Community swap events organized
- **Money Saved**: Economic impact on community members

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness
- Test across different browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Hackathon Customization Ideas

### For Sustainability Focus
- Add carbon footprint calculator
- Implement eco-friendly packaging options
- Track environmental impact metrics
- Add sustainability challenges and rewards

### For Community Building
- Implement neighborhood-based groups
- Add community leaderboards
- Create local swap event calendars
- Add social features like user following

### For Social Impact
- Add donation options for charitable causes
- Implement size-inclusive features
- Create accessibility-focused UI improvements
- Add multilingual support

### For Technology Innovation
- Implement AI-powered style recommendations
- Add AR try-on features
- Create blockchain-based ownership tracking
- Add IoT integration for smart closets

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string in .env
- Ensure network connectivity
- Check MongoDB Atlas IP whitelist

**Image Upload Issues**
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper image formats
- Check network connectivity

**Authentication Problems**
- Verify JWT secret configuration
- Check token expiration settings
- Ensure proper CORS setup
- Verify frontend API URL

**Real-time Chat Issues**
- Check Socket.io configuration
- Verify WebSocket support
- Check firewall settings
- Ensure proper event handling

### Performance Tips
- Use MongoDB indexes for frequently queried fields
- Implement pagination for large datasets
- Add caching with Redis for production
- Optimize images with Cloudinary transformations
- Use lazy loading for components
- Implement virtual scrolling for large lists

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the API documentation
3. Search existing issues on GitHub
4. Create a new issue with detailed description
5. Join our Discord community for real-time help

## 🔮 Future Roadmap

### Phase 1 (MVP)
- ✅ User authentication and profiles
- ✅ Clothing listing and browsing
- ✅ Basic exchange system
- ✅ Real-time messaging

### Phase 2 (Community Features)
- 🔄 Community events and groups
- 🔄 Advanced filtering and search
- 🔄 Mobile app development
- 🔄 Push notifications

### Phase 3 (Advanced Features)
- 📅 AI-powered recommendations
- 📅 AR try-on integration
- 📅 Blockchain verification
- 📅 Multi-language support

### Phase 4 (Scale & Partnerships)
- 📅 Brand partnerships
- 📅 Global expansion
- 📅 Enterprise features
- 📅 API for third-party integrations

---

**Happy Sustainable Fashion Sharing! 🌱👗**

Built with ❤️ for a more sustainable future and stronger communities.
