# UrbanCruise Lead Management System - Frontend

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

## 🎨 Design System

### Color Scheme
- **Primary Background**: Light gray (#f5f5f5)
- **Card Background**: White (#ffffff)
- **Text Color**: Black (#000000) for optimal readability
- **Accent Colors**:
  - Website Leads: Blue (#3b82f6)
  - Meta Leads: Pink (#ec4899)
  - Google Leads: Green (#10b981)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: Bold, various sizes for hierarchy
- **Body Text**: Regular weight, optimized for readability

### Components
- **Cards**: Clean white containers with subtle shadows
- **Buttons**: Modern rounded buttons with hover effects
- **Tables**: Professional data tables with hover states
- **Charts**: Interactive bar charts with tooltips
- **Badges**: Color-coded status indicators

## 📊 Dashboard Components

### 1. Statistics Overview
Four key metric cards displaying:
- **Total Leads**: Overall lead count
- **New Leads**: Recently acquired leads
- **Converted Leads**: Successfully converted leads
- **Conversion Rate**: Percentage of converted leads

### 2. Analytics Chart
Interactive bar chart showing lead distribution by source:
- Website leads (Blue)
- Meta/Facebook leads (Pink)
- Google Ads leads (Green)

### 3. Advanced Filters
Comprehensive filtering system:
- **Search Bar**: Real-time search by name or email
- **Source Filter**: Filter by lead source
- **Status Filter**: Filter by lead status

### 4. Leads Management Table
Complete data table with:
- **Pagination**: 10 leads per page
- **Sorting**: Clickable column headers
- **Status Updates**: Dropdown status changes
- **Responsive Design**: Mobile-optimized layout

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd urbancruise/forntend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file (optional, for production):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001`

## 🎯 Key Features Explained

### Real-time Data Fetching
- Automatic API calls on component mount
- Pagination support with query parameters
- Error handling with user-friendly messages

### Advanced Filtering
```typescript
// Filter implementation
const params = new URLSearchParams({
  page: currentPage.toString(),
  limit: '10',
  ...(sourceFilter !== 'all' && { source: sourceFilter }),
  ...(statusFilter !== 'all' && { status: statusFilter })
});
```

### Status Management
- One-click status updates
- Immediate UI feedback
- API synchronization

### Responsive Design
- **Desktop**: Full-width layout with sidebar potential
- **Tablet**: Adjusted grid layouts
- **Mobile**: Stacked components with touch-friendly controls

## 🔄 API Integration

### Backend Connection
The frontend connects to the backend API at `http://localhost:5000`:

```typescript
// Example API call
const response = await axios.get(`http://localhost:5000/api/leads?${params}`)
```

### Data Flow
1. **Component Mount**: Fetch initial data
2. **User Interaction**: Update filters, pagination
3. **Real-time Updates**: Reflect changes immediately
4. **Error Handling**: Graceful error states

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Customization

### Theme Customization
Modify `tailwind.config.ts` for custom colors and themes:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'urbancruise-blue': '#3b82f6',
        'urbancruise-pink': '#ec4899',
        'urbancruise-green': '#10b981',
      }
    }
  }
}
```

### Component Styling
All components use Tailwind CSS classes for easy customization:

```tsx
// Example custom styling
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-xl font-bold text-black mb-4">Custom Component</h3>
</div>
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

## 🧪 Testing

### Manual Testing Checklist
- [ ] Dashboard loads with statistics
- [ ] Chart displays correctly
- [ ] Filters work as expected
- [ ] Pagination functions properly
- [ ] Status updates save to backend
- [ ] Responsive design on mobile
- [ ] Error states handled gracefully

## 🔍 Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure backend server is running on port 5000
- Check CORS configuration
- Verify API endpoints are accessible

**Styling Issues**
- Clear Next.js cache: `rm -rf .next`
- Restart development server
- Check Tailwind CSS configuration

**TypeScript Errors**
- Run `npm run build` to check for type errors
- Ensure all dependencies are installed
- Check import paths

## 📈 Performance Optimization

### Code Splitting
- Automatic code splitting with Next.js App Router
- Lazy loading for heavy components
- Optimized bundle sizes

### Image Optimization
- Next.js built-in Image component
- Automatic format conversion
- Responsive image loading

### Caching Strategy
- API response caching
- Static asset optimization
- Service worker for offline functionality (future)

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with TypeScript
3. Test on multiple screen sizes
4. Ensure no TypeScript errors
5. Create pull request with description

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Component Structure**: Functional components with hooks

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Check the backend API documentation
- Review component implementations
- Test with different data scenarios
- Check browser console for errors

---

**UrbanCruise Lead Management System Frontend**
Built with modern web technologies for optimal performance and user experience.
