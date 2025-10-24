# UrbanCruise Lead Management System (LMS)

A comprehensive lead management system built with Node.js, Express, MongoDB, MySQL, and Next.js.

## 🚀 Features

- **Multi-Source Lead Collection**: Website, Meta Ads (Facebook/Instagram), Google Ads
- **Real-time Dashboard**: Live lead tracking with analytics and charts
- **Lead Management**: CRUD operations with status tracking and assignment
- **Import/Export**: Excel, CSV, and URL-based data import/export
- **Notifications**: Email and SMS alerts for new leads
- **Authentication**: JWT-based user authentication with role management
- **Responsive UI**: Modern dashboard with filtering and sorting

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for document storage
- **MySQL** for relational data
- **JWT** for authentication
- **Multer** for file uploads
- **Nodemailer** for email notifications
- **Twilio** for SMS notifications

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** for components
- **Recharts** for data visualization
- **Axios** for API calls

## 📁 Project Structure

```
urbancruise-lms/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── leadController.js
│   │   ├── metaController.js
│   │   ├── googleController.js
│   │   ├── importController.js
│   │   ├── exportController.js
│   │   └── notificationController.js
│   ├── models/
│   │   ├── User.js              # MongoDB User model
│   │   ├── Lead.js              # MongoDB Lead model
│   │   └── mysql/
│   │       └── Leads.js         # MySQL Lead model
│   ├── routes/
│   │   ├── auth.js
│   │   ├── leads.js
│   │   ├── meta.js
│   │   ├── google.js
│   │   ├── import.js
│   │   └── export.js
│   ├── middleware/
│   │   └── auth.js
│   ├── sql/
│   │   ├── create_tables.sql    # MySQL schema
│   │   └── sample_data.sql      # Sample data
│   ├── uploads/                 # File upload directory
│   ├── .env                     # Environment variables
│   ├── server.js                # Main server file
│   └── package.json
├── forntend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── components/
│   │       ├── ui/              # Shadcn/ui components
│   │       └── dashboard/       # Dashboard components
│   ├── public/
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- MySQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urbancruise-lms
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../forntend
   npm install
   ```

4. **Database Setup**

   **MongoDB:**
   - Install MongoDB and start the service
   - Default connection: `mongodb://localhost:27017/lms`

   **MySQL:**
   - Install MySQL and create database
   - Run the SQL scripts:
   ```bash
   mysql -u root -p < sql/create_tables.sql
   mysql -u root -p < sql/sample_data.sql
   ```

5. **Environment Configuration**

   Copy `.env` file and update values:
   ```bash
   cd backend
   cp .env.example .env
   ```

   Update the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/lms
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=lms
   JWT_SECRET=your_jwt_secret
   ```

6. **Start the Application**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd forntend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Leads Management
- `GET /api/v1/leads` - Get all leads (with pagination/filtering)
- `GET /api/v1/leads/:id` - Get lead by ID
- `POST /api/v1/leads` - Create new lead
- `PUT /api/v1/leads/:id` - Update lead
- `DELETE /api/v1/leads/:id` - Delete lead

### Import/Export
- `POST /api/v1/import/leads` - Import leads from file
- `POST /api/v1/import/leads/url` - Import leads from URL
- `GET /api/v1/export/leads` - Export leads to Excel/PDF/CSV

### Third-party Integrations
- `POST /api/v1/meta/fetch-leads` - Fetch Meta Ads leads
- `POST /api/v1/google/fetch-leads` - Fetch Google Ads leads
- `POST /api/v1/website/leads` - Website lead submission

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/lms` |
| `MYSQL_HOST` | MySQL host | `localhost` |
| `MYSQL_USER` | MySQL username | `root` |
| `MYSQL_PASSWORD` | MySQL password | `` |
| `MYSQL_DATABASE` | MySQL database name | `lms` |
| `JWT_SECRET` | JWT secret key | Required |

### API Keys (Optional)
- `META_APP_ID` - Meta/Facebook App ID
- `META_APP_SECRET` - Meta App Secret
- `META_ACCESS_TOKEN` - Meta Access Token
- `GOOGLE_ADS_CLIENT_ID` - Google Ads Client ID
- `EMAIL_USER` - SMTP email user
- `TWILIO_SID` - Twilio Account SID

## 📈 Features Overview

### Dashboard
- **Real-time Statistics**: Total leads, new leads, conversions
- **Interactive Charts**: Source distribution and trends
- **Lead Table**: Sortable, filterable with status management
- **New Lead Highlighting**: Green indicators for recent leads

### Lead Management
- **Multi-source Integration**: Website forms, Meta Ads, Google Ads
- **Status Tracking**: New → Contacted → Qualified → Converted
- **Assignment System**: Assign leads to team members
- **Notes System**: Add comments and follow-ups

### Import/Export
- **File Import**: Excel (.xlsx), CSV files
- **URL Import**: Fetch data from external APIs
- **Smart Mapping**: Automatic field detection and mapping
- **Export Options**: Excel, PDF, CSV with filters

### Notifications
- **Email Alerts**: New lead notifications
- **SMS Alerts**: Instant SMS for critical leads
- **Configurable Recipients**: Admin and manager notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@urbancruise.in
- Documentation: Check the `/api` endpoint for API docs

---

**UrbanCruise LMS** - Streamlining lead management for travel businesses 🚗✈️