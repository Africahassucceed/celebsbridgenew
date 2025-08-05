# CelebsBridge - Celebrity Connection Platform

A full-stack web application for connecting fans with African and diaspora celebrities through personalized video shoutouts.

## 🚀 Features

- **Modern Landing Page** - Beautiful, responsive design with hero section and featured celebrities
- **User Authentication** - Secure signup/login with Supabase Auth
- **Celebrity Browsing** - Search and filter celebrities by category
- **Shoutout Requests** - Request personalized video shoutouts from celebrities
- **User Dashboard** - Track requests, view stats, and manage bookings
- **Admin Panel** - Complete admin interface for managing users, celebrities, and requests
- **Video Management** - Upload and manage shoutout videos
- **Mobile Responsive** - Works perfectly on all devices

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd celebsbridge
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the example environment file and fill in your Supabase credentials:
```bash
cp env.example .env
```

Edit `.env` and add your Supabase project URL and anon key:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase Database

Create the following tables in your Supabase database:

#### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Categories Table
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Celebrities Table
```sql
CREATE TABLE celebrities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Shoutout Requests Table
```sql
CREATE TABLE shoutout_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  celebrity_id UUID REFERENCES celebrities(id),
  message TEXT NOT NULL,
  occasion TEXT,
  delivery_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Shoutout Videos Table
```sql
CREATE TABLE shoutout_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES shoutout_requests(id),
  video_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Set up Storage Buckets

Create the following storage buckets in Supabase:
- `celebrity_profiles` - For celebrity profile images
- `shoutouts` - For shoutout videos

### 6. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   └── SupabaseContext.jsx
├── lib/               # Utility libraries
│   └── supabase.js
├── pages/             # Page components
│   ├── LandingPage.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── user/
│   │   ├── Dashboard.jsx
│   │   ├── BrowseCelebrities.jsx
│   │   ├── RequestShoutout.jsx
│   │   └── MyBookings.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminCelebrities.jsx
│       ├── AdminRequests.jsx
│       └── AdminUsers.jsx
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Key Features

### User Features
- **Browse Celebrities**: Search and filter by category
- **Request Shoutouts**: Fill out forms with personalized messages
- **Track Requests**: View status and download completed videos
- **Dashboard**: Overview of all activity and stats

### Admin Features
- **Manage Celebrities**: Add, edit, and remove celebrity profiles
- **Handle Requests**: Approve, reject, and manage shoutout requests
- **Upload Videos**: Upload completed shoutout videos
- **User Management**: View and manage user accounts

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you need help or have questions:
- Create an issue in the repository
- Contact: hello@celebsbridge.com

## 🎉 Acknowledgments

- Supabase for the amazing backend platform
- Tailwind CSS for the beautiful styling framework
- React team for the incredible frontend library 