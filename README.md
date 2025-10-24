# LMS Lead Management System - Frontend

A modern, responsive dashboard for managing leads collected from multiple digital platforms. Built with Next.js 14, TypeScript, and Tailwind CSS for optimal performance and user experience.

## 🚀 Features

- **Professional Dashboard**: Clean, modern interface with real-time data visualization
- **Lead Management**: Complete CRUD operations with advanced filtering and pagination
- **Multi-Source Analytics**: Visual representation of leads by source (Website, Meta, Google)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live data synchronization with backend API
- **Interactive Charts**: Built-in analytics with Recharts library
- **Advanced Filtering**: Search, source, and status-based filtering
- **Status Management**: One-click lead status updates
- **Pagination**: Efficient data handling for large datasets

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Turbopack (Next.js built-in)

## 📁 Project Structure

```
forntend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Main dashboard page
│   │   ├── globals.css         # Global styles
│   │   └── favicon.ico         # Application favicon
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
│   │       └── LeadsTable.tsx  # Leads data table
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
├── components.json            # Shadcn/ui configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
For production deployment, set:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 📄 License

This project is licensed under the MIT License.

---

**LMS Lead Management System Frontend**
Built with modern web technologies for optimal performance and user experience.
