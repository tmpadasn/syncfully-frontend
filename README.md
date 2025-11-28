# SyncFully Frontend

> Discover works across entertainment mediums - movies, books, music, series, and graphic novels.

A React-based web application for discovering, rating, and organizing entertainment content with personalized recommendations and social features.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Routes](#available-routes)
- [Search & Filtering](#search--filtering)
- [Environment Variables](#environment-variables)
- [Building for Production](#building-for-production)

## ✨ Features

- **Multi-Media Discovery** - Browse movies, books, music, series, and graphic novels
- **Advanced Search & Filtering** - Filter by type, year, genre, and rating with dynamic options from backend
- **User Authentication** - Login, account management, and profile editing
- **Personal Shelves** - Create and manage custom shelves with favorites support
- **Recommendations** - Get personalized suggestions based on your ratings
- **Social Features** - View other users' profiles, ratings, and follow activity

## 🛠 Tech Stack

- **React** 18.2 - UI library
- **React Router** 6.12 - Client-side routing
- **Axios** 1.4 - HTTP client
- **React Icons** 5.5 - Icon library
- **Create React App** 5.0 - Build tooling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm 
- Backend server running (see backend setup below)

### Backend Setup (Required First)

The frontend requires the backend API to be running:

1. **Navigate to backend directory**
   ```bash
   cd syncfully-backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up backend environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   PORT=3000
   NODE_ENV=production
   # MONGODB_URI=your-mongodb-connection-string  # For future database implementation
   ```

4. **Start the backend server**
   ```bash
   # production mode
   npm start
   ```

   The backend API will be available at `http://localhost:3000/api`

5. **Verify backend is running**
   ```bash
   curl http://localhost:3000/health
   ```

### Frontend Installation

1. **Navigate to frontend directory**
   ```bash
   cd syncfully-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if needed:
   ```env
   # API Configuration
   REACT_APP_API_URL=http://localhost:3000/api
   
   # Default Profile Images
   REACT_APP_DEFAULT_PROFILE_URL=http://localhost:3000/uploads/profiles/profile_picture.jpg
   REACT_APP_DEFAULT_AVATAR_URL=https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000` (or 3001 if port 3000 is taken by backend)

## 📁 Project Structure

```
src/
├── api/                    # API client and service modules
│   ├── client.js          # Axios instance and base configuration
│   ├── auth.js            # Authentication endpoints
│   ├── works.js           # Works/content endpoints
│   ├── users.js           # User management endpoints
│   ├── shelves.js         # Shelf management endpoints
│   ├── ratings.js         # Rating endpoints
│   └── search.js          # Search functionality
├── components/            # Reusable UI components
│   ├── Header.jsx         # Main navigation header
│   ├── FilterBar.jsx      # Dynamic filtering component
│   ├── WorkCard.jsx       # Work display card
│   ├── WorkCardCarousel.jsx
│   ├── HomeCarousel.jsx
│   ├── AddToShelfBtn.jsx
│   ├── Toast.jsx          # Notification system
│   ├── Skeleton.jsx       # Loading skeletons
│   ├── ErrorBoundary.jsx
│   ├── ErrorBoundaryTester.jsx
│   ├── PageErrorBoundary.jsx
│   └── users/             # User-specific components
│       ├── UserForm.jsx
│       ├── UserRatings.jsx
│       ├── UserDeleteButton.jsx
│       └── UserRecommendations.jsx
├── pages/                 # Route page components
│   ├── Home.jsx           # Landing page with popular works
│   ├── SearchResults.jsx  # Search with filters
│   ├── WorkDetails.jsx    # Individual work details
│   ├── Recommendations.jsx # Personalized recommendations
│   ├── Profile.jsx        # User profiles
│   ├── Account.jsx        # Current user account
│   ├── EditAccount.jsx    # Account editing
│   ├── Login.jsx          # Authentication page
│   ├── Shelves.jsx        # User shelves management
|
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Authentication state
│   ├── useShelves.js      # Shelf management
│   └── useNavigationWithClearFilters.js
├── context/               # React context providers
│   └── AuthContext.jsx    # Global auth state
├── router/                # Routing configuration
│   ├── AppRouter.jsx      # Route definitions
│   ├── ProtectedRoute.jsx # Auth-required wrapper
│   └── GuestRoute.jsx     # Guest-only wrapper
├── utils/                 # Utility functions
│   ├── logger.js          # Debug logging
│   ├── normalize.js       # Data normalization
├── config/                # Configuration constants
│   └── constants.js       # App-wide constants
└── styles/                # Global styles
    └── global.css
```

## 🗺 Available Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page with popular works and carousels |
| `/search` | Public | Search results with dynamic filters |
| `/works/:workId` | Public | Individual work details and ratings |
| `/recommendations` | Public | Personalized recommendations |
| `/profile/:userId` | Public | User profile and ratings |
| `/login` | Guest Only | Authentication page |
| `/account` | Protected | Current user account overview |
| `/account/edit` | Protected | Edit account settings |
| `/shelves` | Protected | Manage personal shelves |

**Protected Routes** require authentication. **Guest Routes** redirect authenticated users to home.

## 🔍 Search & Filtering

### URL Parameters

All filters are reflected in URL query parameters for bookmarking and sharing:

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `q` | string | `?q=inception` | Search query (title, description, creator) |
| `type` | string | `?type=movie` | Work type filter |
| `year` | string | `?year=2010` | Release year filter |
| `genre` | string | `?genre=Action` | Genre filter |
| `rating` | string | `?rating=4` | Minimum rating threshold (>=) |
| `addToShelf` | string | `?addToShelf=123` | Context for adding works to specific shelf |
| `shelfName` | string | `?shelfName=Favorites` | Display name for shelf context |

### Dynamic Filter Options

Filter options are **dynamically loaded from the backend** on component mount:

- **Types**: Extracted from all works in the database
- **Years**: Generated range from 1850 to current year
- **Genres**: Collected from all works' genre fields
- **Ratings**: Fixed scale (5, 4, 3, 2, 1)

Empty/"ALL" selection removes the parameter from URL for clean navigation.

### Filter Behavior

- Filters automatically clear when navigating away from `/search`
- Multiple filters can be applied simultaneously
- Backend performs the actual filtering logic
- Frontend applies client-side post-filtering for refined results

## 🔧 Environment Variables

All environment variables are optional with sensible defaults:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api

# Default Profile Images
REACT_APP_DEFAULT_PROFILE_URL=http://localhost:3000/uploads/profiles/profile_picture.jpg
REACT_APP_DEFAULT_AVATAR_URL=https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg
```

---

**Questions or issues?** Check the backend README at `syncfully-backend/README.md` for API documentation.

