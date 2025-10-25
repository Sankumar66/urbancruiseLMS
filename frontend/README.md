# Urban Cruise LMS Frontend

Urban Cruise is a bus rental company providing One Stop Solution for hiring Car, SUV, Luxury Car & SUV, Tempo Traveller, Urbania, MiniBus, Luxury Buses, & Semi/Sleeper Bus on rent for all your Travel needs. We are available in 15+ Cities of India- Mumbai, Pune, Thane, Delhi, Noida, Gurgaon, Ghaziabad, Agra, Varanasi, Lucknow, Jaipur, Dehradun, Ahmedabad, Chandigarh, Bangalore.

This is the frontend component of the Urban Cruise Lead Management System (LMS), a comprehensive solution for managing leads from multiple digital platforms.

## 📁 Repository Structure

```
UrbancruiseLMS/
├── frontend/          # Next.js Frontend Application
└── backend/           # Node.js Backend API
```

## 🎯 Frontend Application (Next.js)

### 🚀 Features

- **Professional Dashboard**: Clean, modern interface with real-time data visualization
- **Lead Management**: Complete CRUD operations with advanced filtering and pagination
- **Multi-Source Analytics**: Visual representation of leads by source (Website, Meta, Google)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization with backend API
- **Interactive Charts**: Built-in analytics with Recharts library
- **Advanced Filtering**: Search, source, and status-based filtering
- **Status Management**: One-click lead status updates
- **Pagination**: Efficient data handling for large datasets
- **Sample Data**: Includes sample data for demonstration when API is unavailable

### 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Turbopack (Next.js built-in)

### 📁 Frontend Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Main dashboard page
│   │   ├── globals.css         # Global styles
│   │   └── notifications/      # Notifications page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── card.tsx        # Card component
│   │   │   ├── button.tsx      # Button component
│   │   │   ├── input.tsx       # Input field component
│   │   │   ├── select.tsx      # Select dropdown component
│   │   │   ├── table.tsx       # Table component
│   │   │   ├── badge.tsx       # Badge component
│   │   │   └── tabs.tsx        # Tabs component
│   │   └── dashboard/          # Dashboard-specific components
│   │       ├── StatsCards.tsx  # Statistics overview cards
│   │       ├── LeadsChart.tsx  # Analytics chart component
│   │       ├── Filters.tsx     # Filtering controls
│   │       ├── LeadsTable.tsx  # Leads data table
│   │       ├── AddLeadForm.tsx # Add new lead form
│   │       ├── ExportDropdown.tsx # Export functionality
│   │       └── ImportDropdown.tsx # Import functionality
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.ts             # Next.js configuration
├── components.json            # Shadcn/ui configuration
├── package.json               # Dependencies and scripts
├── vercel.json               # Vercel deployment configuration
└── README.md                  # This file
```

### 🚀 Frontend Build & Deployment

#### Development
```bash
cd frontend
npm install
npm run dev          # Start development server
```

#### Production Build
```bash
npm run build
npm run start
```

#### Environment Variables
For production deployment, set:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 🔧 Backend API (Node.js/Express)

### 🚀 Backend Features

- **RESTful API**: Complete REST API for lead management
- **Database Integration**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **File Upload**: Multer for handling file uploads
- **Email Integration**: Nodemailer for email notifications
- **Cron Jobs**: Automated tasks and scheduling
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: Input validation with Joi
- **CORS**: Cross-origin resource sharing configuration

### 🛠️ Backend Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Joi
- **Security**: Helmet, CORS
- **Scheduling**: Node-cron

### 📁 Backend Project Structure

```
backend/
├── config/                    # Configuration files
├── controllers/               # Route controllers
├── middleware/                # Custom middleware
├── models/                    # Database models
├── routes/                    # API routes
├── utils/                     # Utility functions
├── uploads/                   # File upload directory
├── sql/                       # SQL scripts (if needed)
├── .env                       # Environment variables
├── server.js                  # Main server file
├── package.json               # Dependencies and scripts
└── README.md                  # Backend documentation
```

### 🚀 Backend Setup & Installation

#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

#### Installation
```bash
cd backend
npm install
```

#### Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms_lead_management
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

#### Running the Backend
```bash
npm start          # Production mode
npm run dev        # Development mode with nodemon
```

## 🔄 API Integration

### Frontend-Backend Connection

The frontend connects to the backend API at `http://localhost:5000/api/v1`:

```typescript
// Example API calls
const response = await axios.get(`http://localhost:5000/api/v1/leads`)
await axios.post(`http://localhost:5000/api/v1/leads`, leadData)
await axios.put(`http://localhost:5000/api/v1/leads/${id}`, { status })
await axios.delete(`http://localhost:5000/api/v1/leads/${id}`)
```

### Sample Data

The frontend includes sample data that displays when the backend API is unavailable, ensuring the dashboard always shows content for demonstration purposes.

## 📊 Dashboard Features

### Statistics Overview
- **Total Leads**: Overall lead count
- **New Leads**: Recently acquired leads
- **Converted Leads**: Successfully converted leads
- **Conversion Rate**: Percentage of converted leads

### Analytics Charts
- **Leads by Source**: Bar chart showing distribution across Website, Meta, and Google
- **Monthly Trends**: Line chart showing lead generation over time

### Lead Management
- **Advanced Filtering**: Search by name/email, filter by source and status
- **Status Updates**: One-click status changes (New, Contacted, Qualified, Converted)
- **Pagination**: Efficient handling of large datasets
- **CRUD Operations**: Create, Read, Update, Delete leads

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect GitHub repository to Vercel
2. Vercel automatically detects Next.js project
3. Set environment variables in Vercel dashboard
4. Deploy automatically on git push to main branch

### Backend Deployment
1. Choose hosting platform (Heroku, Railway, DigitalOcean, etc.)
2. Set environment variables
3. Deploy using platform-specific commands
4. Ensure MongoDB connection is configured

## 📄 License

This project is licensed under the MIT License.

---

**Urban Cruise LMS**
Built with modern web technologies for optimal performance and user experience.
