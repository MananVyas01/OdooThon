# � ReWear - Sustainable Fashion Exchange Platform

[![Build Status](https://github.com/MananVyas01/OdooThon/actions/workflows/ci.yml/badge.svg)](https://github.com/MananVyas01/OdooThon/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/MananVyas01/OdooThon.svg)](https://github.com/MananVyas01/OdooThon/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/MananVyas01/OdooThon.svg)](https://github.com/MananVyas01/OdooThon/issues)
[![Demo Video](https://img.shields.io/badge/Demo-Video-red.svg)](https://loom.com/share/rewear-demo)

> **Transforming Fashion Through Sustainable Exchange** 🌍♻️

ReWear is a cutting-edge platform that revolutionizes how we approach fashion consumption by enabling users to swap, trade, and exchange clothing items in a sustainable, community-driven ecosystem. Built for the modern conscious consumer, ReWear combines advanced technology with environmental responsibility.

## � Quick Start

Get up and running in under 5 minutes:

```bash
# Clone the repository
git clone https://github.com/MananVyas01/OdooThon.git
cd OdooThon

# Install dependencies
npm install
cd server && npm install && cd ../client && npm install && cd ..

# Seed the database with sample data
cd server && npm run seed:reset && cd ..

# Start the development environment
npm run dev
```

� **That's it!** Visit [http://localhost:3000](http://localhost:3000) to see ReWear in action.

## 🔐 Test Credentials

Use these pre-seeded accounts to explore different user roles:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| 👑 **Admin** | admin@rewear.com | admin123 | Full system access, user management, analytics |
| 🏢 **Manager** | manan@rewear.com | manan123 | Item moderation, user support, reporting |
| 👤 **User** | shrey@rewear.com | shrey123 | Standard user with posting and swapping privileges |
| 👤 **User** | malhar@rewear.com | malhar123 | Standard user account for testing swaps |
| 👤 **User** | om@rewear.com | om123 | Standard user account for community interactions |

**Quick Login:** Scan this QR code to go directly to the login page:
```
[QR CODE - Login Page]
```
## 📚 Features

### 🔐 Stage 1: Authentication & User Management
- **Secure Registration/Login** - JWT-based authentication with role-based access
- **User Profiles** - Customizable profiles with avatar upload and preferences
- **Role Management** - Admin, Manager, and User roles with distinct permissions
- **Account Security** - Password hashing, secure tokens, and session management

### 📱 Stage 2: Core Item Management
- **Item Upload** - Rich item creation with multiple image support
- **Advanced Search** - Filter by category, size, condition, brand, and location
- **Item Moderation** - Admin approval system for quality control
- **Inventory Management** - Track item status, availability, and history

### 🔄 Stage 3: Smart Swapping System
- **Swap Requests** - Intelligent matching between users and items
- **Dual Exchange Modes** - Item-for-item swaps and points-based exchanges
- **Negotiation System** - Built-in messaging for swap coordination
- **Transaction Tracking** - Complete audit trail of all exchanges

### �️ Stage 4: Administrative Excellence
- **Comprehensive Dashboard** - Real-time analytics and system monitoring
- **User Management** - Role assignments, account status, and activity tracking
- **Content Moderation** - Item approval/rejection with detailed feedback
- **System Analytics** - Usage statistics, popular items, and trend analysis

### 🌍 Stage 5: Sustainability Intelligence
- **Environmental Impact** - Track CO₂ savings, water conservation, and waste reduction
- **Sustainability Metrics** - Personal and community environmental impact scores
- **Eco-Friendly Recommendations** - AI-powered suggestions for sustainable choices
- **Carbon Footprint Tracking** - Measure and reduce fashion-related emissions

### ✨ Stage 6: Enhanced User Experience
- **Eco Impact Widgets** - Real-time visualization of environmental benefits
- **Smart Tag Suggestions** - AI-powered auto-complete for item tagging
- **Fuzzy Search** - Intelligent search with typo tolerance and suggestions
- **Enhanced Notifications** - Beautiful, contextual toast notifications
- **Professional Image Gallery** - Zoom, thumbnails, and carousel navigation

### 📋 Stage 7: Production Excellence
- **Automated Testing** - Comprehensive test suite with CI/CD integration
- **API Documentation** - Interactive Swagger documentation
- **Database Seeding** - Automated data population for development and testing
- **Performance Monitoring** - Real-time application performance tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI with hooks and concurrent features
- **Tailwind CSS** - Utility-first styling with responsive design
- **Lucide React** - Beautiful icon library
- **Fuse.js** - Fuzzy search functionality
- **Swiper.js** - Touch-friendly image carousels
- **React Hot Toast** - Elegant notification system

### Backend
- **Node.js & Express** - Fast, scalable server architecture
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure token-based auth
- **Bcrypt** - Password hashing and security
- **Multer & Cloudinary** - File upload and image management
- **Express Rate Limit** - API rate limiting and protection

### Development & DevOps
- **GitHub Actions** - CI/CD pipeline with automated testing
- **Swagger** - API documentation and testing
- **Postman** - API collection and integration tests
- **ESLint & Prettier** - Code quality and formatting
- **Jest & Testing Library** - Comprehensive testing framework

## 🎞️ Demo Video

**Watch our comprehensive demo showing all features in action:**

[![ReWear Demo Video](https://img.shields.io/badge/Watch-Demo-red.svg)](https://loom.com/share/rewear-demo)

### Video Breakdown:
- **0:00 - 0:20** - Platform introduction and sustainable fashion mission
- **0:20 - 2:20** - Core features demonstration (signup, item upload, searching)
- **2:20 - 3:40** - Swapping system and user interactions
- **3:40 - 4:30** - Admin dashboard and moderation tools
- **4:30 - 5:00** - Environmental impact and sustainability features
- **5:00 - 5:30** - Call to action and future roadmap

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Setup
```bash
# Initialize commit hooks
npx husky-init
npm test  # This runs on pre-commit

# Follow conventional commits
git commit -m "feat: add user profile avatars"
git commit -m "fix: resolve image upload issue"
git commit -m "docs: update API documentation"
```

### Commit Message Format
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

### Pull Request Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with detailed description

## 👥 Team

Meet the passionate team behind ReWear:

| Name | Role | LinkedIn | Contribution |
|------|------|----------|-------------|
| **Manan Vyas** | Tech Lead & Full-Stack Developer | [LinkedIn](https://linkedin.com/in/mananvyas01) | System architecture, backend development, deployment |
| **Shrey Patel** | Frontend Developer & UI/UX Designer | [LinkedIn](https://linkedin.com/in/shreypatel) | React development, user interface design, user experience |
| **Malhar Shah** | Backend Developer & DevOps | [LinkedIn](https://linkedin.com/in/malharshah) | API development, database design, CI/CD pipeline |
| **OM Patel** | Product Manager & QA Engineer | [LinkedIn](https://linkedin.com/in/ompatel) | Product strategy, testing, documentation |

### Hackathon Context
This project was developed for the **[OdooThon Hackathon](https://example.com/odooThon)** - a 48-hour intensive coding challenge focused on sustainable technology solutions. The problem statement challenged teams to create innovative solutions for environmental sustainability in the fashion industry.

## 📊 API Documentation

### Interactive Documentation
Explore our comprehensive API documentation:
- **Swagger UI:** [http://localhost:5001/api/docs](http://localhost:5001/api/docs)
- **OpenAPI Spec:** [openapi.yaml](./openapi.yaml)

### Postman Collection
Import our complete API collection for testing:
- **Collection File:** [ReWear.postman_collection.json](./ReWear.postman_collection.json)
- **Environment:** Pre-configured with all endpoints and authentication

### Key Endpoints
- **Authentication:** `POST /api/auth/login`, `POST /api/auth/register`
- **Items:** `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`
- **Swaps:** `GET /api/swaps`, `POST /api/swaps`, `PUT /api/swaps/:id`
- **Admin:** `GET /api/admin/dashboard`, `GET /api/admin/users`

## 🚀 Deployment

### Production Deployment
```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for production
pm2 start ecosystem.config.js
```

### Environment Variables
```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
MONGO_URI=mongodb://localhost:27017/rewear-production
MONGO_URI_TEST=mongodb://localhost:27017/rewear-test

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

### API Testing
```bash
# Run Postman collection tests
newman run ReWear.postman_collection.json

# Run with environment
newman run ReWear.postman_collection.json -e postman-environment.json
```

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### No Warranty Disclaimer
This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

## 🙏 Acknowledgments

- **Open Source Community** - For the amazing tools and libraries
- **Sustainable Fashion Movement** - For inspiring this project
- **OdooThon Organizers** - For providing the platform and challenge
- **Beta Testers** - For their valuable feedback and testing

## 📞 Support

### Getting Help
- **Documentation:** [GitHub Wiki](https://github.com/MananVyas01/OdooThon/wiki)
- **Issues:** [GitHub Issues](https://github.com/MananVyas01/OdooThon/issues)
- **Discussions:** [GitHub Discussions](https://github.com/MananVyas01/OdooThon/discussions)
- **Email:** support@rewear.com

### Community
- **Discord:** [ReWear Community](https://discord.gg/rewear)
- **Twitter:** [@ReWearPlatform](https://twitter.com/ReWearPlatform)
- **LinkedIn:** [ReWear Company](https://linkedin.com/company/rewear)

---

<div align="center">

**Made with ❤️ and ♻️ by the ReWear Team**

[⭐ Star this repository](https://github.com/MananVyas01/OdooThon) | [� Report Bug](https://github.com/MananVyas01/OdooThon/issues) | [💡 Request Feature](https://github.com/MananVyas01/OdooThon/issues/new)

</div>

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

- **Admin**: admin@rewear.com / admin123
- **Community Manager**: manan@rewear.com / manan123
- **User**: shrey@rewear.com / shrey123

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
