# Travel Package Booking System

A full-stack MERN application that allows users to browse, customize, and book travel packages. Administrators can manage packages, view bookings, and access user analytics.


## Features

### User Features
- **Authentication**
  - Email & password login
  - Google OAuth integration
  - JWT-based secure sessions

- **Package Browsing**
  - Search packages by location and dates
  - Sort packages by price
  - View detailed package information
  - Server-side and client-side pagination

- **Booking Management**
  - Customize package options (food, accommodation)
  - Real-time price calculation
  - View all bookings with status filters (upcoming, active, completed)

- **Profile Management**
  - Update personal information
  - Upload profile pictures (Cloudinary integration)
  - Update address information

### Admin Features
- **Package Management**
  - Create, edit, and delete travel packages
  - Set included services and prices
  - Add dynamic destination images

- **User Management**
  - View all registered users
  - Access detailed user information
  - View user booking history

- **Booking Administration**
  - View all bookings across the platform
  - Update booking statuses
  - Generate package analytics

- **Dashboard & Analytics**
  - View package statuses (upcoming, active, completed)
  - Track booking counts and revenue
  - Monitor user growth

## Tech Stack

### Frontend
- **React.js** - UI library
- **Context API** - State management
- **React Router** - Navigation
- **Formik & Yup** - Form handling and validation
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Toastify** - Notifications
- **Date-fns** - Date handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File uploads

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (for image uploads)
- Google Developer account (for OAuth)

### Environment Variables

#### Server (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/travel-booking
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Client (.env)
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/travel-booking-app.git
cd travel-booking-app
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**
- Create `.env` files in both the server and client directories using the templates above

5. **Create an admin user**
```bash
cd ../server
node create-admin.js
```

6. **Start the development servers**

In the server directory:
```bash
npm run dev
```

In the client directory:
```bash
npm start
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Usage

### User Access
1. Register a new account or log in with existing credentials
2. Browse available packages
3. Select a package and customize options
4. Book the package
5. View bookings in the profile section

### Admin Access
1. Log in with admin credentials (email: admin@example.com, password: admin123)
2. Access the admin dashboard
3. Manage packages, users, and bookings
4. View analytics

## Deployment

### Backend
1. Deploy server to a service like Heroku, AWS, or DigitalOcean
2. Configure environment variables in your hosting platform
3. Ensure MongoDB connection is properly set up

### Frontend
1. Build the React application:
```bash
cd client
npm run build
```
2. Deploy the build folder to a service like Netlify, Vercel, or Firebase Hosting
3. Configure environment variables in your hosting platform

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Unsplash for providing destination images
- Tailwind CSS for the UI components
- MongoDB Atlas for database hosting
- Cloudinary for image storage solutions