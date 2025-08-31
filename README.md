# Stayzio 🏠

A modern accommodation booking platform built with the MERN stack, inspired by Airbnb. Stayzio demonstrates scalable, production-ready web application development with comprehensive features for property management and booking.

![Stayzio Banner](https://via.placeholder.com/800x400/4f46e5/ffffff?text=Stayzio+-+Modern+Accommodation+Platform)

## 🌟 Features

### User Experience
- **Secure Authentication** - Sign up and log in with email/username and password
- **Property Listings** - Create and manage detailed accommodation listings
- **Interactive Browse** - Explore all available stays with an integrated map
- **Photo Management** - Upload and organize property images with cloud storage
- **Reviews & Ratings** - Leave feedback and ratings to build community trust
- **Responsive Design** - Seamless experience across all devices

### Technical Highlights
- **Full-Stack MERN Architecture** - MongoDB, Express.js, React, Node.js
- **RESTful API Design** - Clean, scalable backend with proper error handling
- **Session-Based Authentication** - Secure user management with Passport.js
- **Geolocation Integration** - Interactive maps powered by Mapbox API
- **Cloud Storage** - Image uploads handled via Cloudinary
- **Production Deployment** - Hosted on Render with MongoDB Atlas

## 🚀 Tech Stack

**Frontend**
- HTML5/CSS3
- JavaScript (ES6+)
- Responsive Web Design

**Backend**
- Node.js
- Express.js
- RESTful APIs
- Session Management

**Database**
- MongoDB
- Mongoose ODM
- Schema Validation

**Authentication & Security**
- Passport.js
- bcrypt Password Hashing
- Session-based Auth

**Third-Party Services**
- Mapbox API (Maps & Geolocation)
- Cloudinary (Image Storage)
- Render (Deployment)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v20 or higher)
- MongoDB
- npm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stayzio.git
   cd stayzio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=mongodb_connection
   SESSION_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_KEY=your-cloudinary-key
   CLOUDINARY_SECRET=your-cloudinary-secret
   MAPBOX_TOKEN=your-mapbox-token
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the application**
   Open [http://localhost:8080](http://localhost:8080) in your browser

## 📁 Project Structure

```
stayzio/
├──controllers/         # All logic for routes 
├── seeds/              # Database seed data
├── models/             # MongoDB schemas and models
├── routes/             # Express.js route handlers
├── views/              # EJS templates
├── public/             # Static assets (CSS, JS, images)
├── middleware/         # Custom middleware functions
├── utils/              # Utility functions and helpers
├── config/             # Configuration files
└── app.js              # Main application file
```

## 🎯 Key Functionalities

### User Management
- User registration and login
- Profile management
- Session handling and security

### Property Management
- Create new listings with details
- Upload multiple property images
- Edit and delete existing listings
- Location mapping and visualization

### Review System
- Submit reviews and ratings
- Display average ratings
- Review moderation and management

### Interactive Features
- Search and filter properties
- Map-based property exploration
- Responsive image galleries

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Home page with listings |
| POST | `/register` | User registration |
| POST | `/login` | User authentication |
| GET | `/listings` | All property listings |
| POST | `/listings/new` | Create new listing |
| GET | `/listings/:id` | Specific listing details |
| PUT | `/listings/:id` | Update listing |
| DELETE | `/listings/:id` | Delete listing |
| POST | `/listings/:id/reviews` | Add review |

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- Input validation and sanitization
- Secure file uploads
- Environment variable protection

## 🚀 Deployment

The application is deployed on **Render** with:
- Automatic deployments from GitHub
- MongoDB Atlas for database hosting
- Environment variable management

**Live Demo**: [https://stayzio-app.onrender.com]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Your Name** - Piyush Prajapati  
**Project Link** - [https://github.com/PiyushTechie/Stayzio_Complete]

---

⭐ **Star this repository if you find it helpful!**
