'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { LeadsChart } from '@/components/dashboard/LeadsChart'
import { Filters } from '@/components/dashboard/Filters'
import { LeadsTable } from '@/components/dashboard/LeadsTable'
import { ExportDropdown } from '@/components/dashboard/ExportDropdown'
import { ImportDropdown } from '@/components/dashboard/ImportDropdown'
import { AddLeadForm } from '@/components/dashboard/AddLeadForm'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from '@/components/theme-toggle'
import { Bell } from 'lucide-react'
import Link from 'next/link'

interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  service: string
  vehicle?: string
  city?: string
  source: string
  campaign: string
  status: string
  assignedTo?: { name: string; email: string }
  notes?: string[]
  createdAt: string
  updatedAt?: string
}

// Sample data for demonstration
const sampleLeads: Lead[] = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543210',
    service: 'Car Rental',
    vehicle: 'Toyota Camry',
    city: 'Mumbai',
    source: 'website',
    campaign: 'Summer Deal 2024',
    status: 'new',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    _id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543211',
    service: 'Bike Rental',
    vehicle: 'Honda Activa',
    city: 'Delhi',
    source: 'meta',
    campaign: 'Facebook Ads',
    status: 'contacted',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    _id: '3',
    name: 'Amit Singh',
    email: 'amit.singh@email.com',
    phone: '+91-9876543212',
    service: 'Car Rental',
    vehicle: 'Mahindra Scorpio',
    city: 'Bangalore',
    source: 'google',
    campaign: 'Google Search',
    status: 'qualified',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    _id: '4',
    name: 'Sneha Patel',
    email: 'sneha.patel@email.com',
    phone: '+91-9876543213',
    service: 'Bike Rental',
    vehicle: 'Royal Enfield',
    city: 'Ahmedabad',
    source: 'website',
    campaign: 'Referral Program',
    status: 'converted',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
  {
    _id: '5',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@email.com',
    phone: '+91-9876543214',
    service: 'Car Rental',
    vehicle: 'Hyundai Creta',
    city: 'Pune',
    source: 'meta',
    campaign: 'Instagram Ads',
    status: 'new',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
  },
  {
    _id: '6',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@email.com',
    phone: '+91-9876543215',
    service: 'Bike Rental',
    vehicle: 'Bajaj Pulsar',
    city: 'Hyderabad',
    source: 'google',
    campaign: 'Google Display',
    status: 'contacted',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    _id: '7',
    name: 'Rohit Gupta',
    email: 'rohit.gupta@email.com',
    phone: '+91-9876543216',
    service: 'Car Rental',
    vehicle: 'Maruti Suzuki Swift',
    city: 'Chennai',
    source: 'website',
    campaign: 'Direct Visit',
    status: 'qualified',
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
  },
  {
    _id: '8',
    name: 'Meera Iyer',
    email: 'meera.iyer@email.com',
    phone: '+91-9876543217',
    service: 'Bike Rental',
    vehicle: 'TVS Jupiter',
    city: 'Kolkata',
    source: 'meta',
    campaign: 'WhatsApp Campaign',
    status: 'converted',
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
  },
  {
    _id: '9',
    name: 'Suresh Nair',
    email: 'suresh.nair@email.com',
    phone: '+91-9876543218',
    service: 'Car Rental',
    vehicle: 'Tata Nexon',
    city: 'Kochi',
    source: 'google',
    campaign: 'YouTube Ads',
    status: 'new',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
  },
  {
    _id: '10',
    name: 'Anjali Mehta',
    email: 'anjali.mehta@email.com',
    phone: '+91-9876543219',
    service: 'Bike Rental',
    vehicle: 'Hero Splendor',
    city: 'Jaipur',
    source: 'website',
    campaign: 'Email Newsletter',
    status: 'contacted',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
  }
]

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [sourceFilter, setSourceFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [newLeadIds, setNewLeadIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Enable real-time data fetching
    fetchLeads()
  }, [currentPage, sourceFilter, statusFilter])

  useEffect(() => {
    let filtered = leads || []

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.service.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply source filter
    if (sourceFilter && sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter)
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // Sort by creation date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredLeads(filtered)
  }, [leads, searchTerm, sourceFilter, statusFilter])

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(sourceFilter !== 'all' && { source: sourceFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })
      const response = await axios.get(`http://localhost:5000/api/v1/leads?${params}`)
      const newLeads = response.data.data?.leads || response.data.leads || []

      // Track new leads (created in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const newlyAddedIds = new Set<string>(
        (newLeads || [])
          .filter((lead: Lead) => new Date(lead.createdAt) > fiveMinutesAgo)
          .map((lead: Lead) => lead._id)
      )
      setNewLeadIds(newlyAddedIds)

      setLeads(newLeads)
      setTotalPages(response.data.data?.pagination?.totalPages || response.data.totalPages || 1)
    } catch (error) {
      console.error('Error fetching leads:', error)
      // Use sample data when API is not available
      console.log('Using sample data for demonstration')

      // Apply filters to sample data
      let filteredSampleData = sampleLeads

      if (sourceFilter && sourceFilter !== 'all') {
        filteredSampleData = filteredSampleData.filter(lead => lead.source === sourceFilter)
      }

      if (statusFilter && statusFilter !== 'all') {
        filteredSampleData = filteredSampleData.filter(lead => lead.status === statusFilter)
      }

      // Pagination
      const startIndex = (currentPage - 1) * 10
      const endIndex = startIndex + 10
      const paginatedData = filteredSampleData.slice(startIndex, endIndex)

      // Track new leads (created in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const newlyAddedIds = new Set<string>(
        sampleLeads
          .filter((lead: Lead) => new Date(lead.createdAt) > fiveMinutesAgo)
          .map((lead: Lead) => lead._id)
      )
      setNewLeadIds(newlyAddedIds)

      setLeads(paginatedData)
      setTotalPages(Math.ceil(filteredSampleData.length / 10))
    }
  }

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/leads/${id}`, { status })
      fetchLeads()
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const handleLeadAdded = () => {
    fetchLeads()
  }

  const deleteLead = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/leads/${id}`)
      fetchLeads()
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  const totalLeads = filteredLeads.length
  const newLeads = filteredLeads.filter(l => l.status === 'new').length
  const convertedLeads = filteredLeads.filter(l => l.status === 'converted').length
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

  const chartData = [
    { name: 'Website', leads: filteredLeads.filter(l => l.source === 'website').length },
    { name: 'Meta', leads: filteredLeads.filter(l => l.source === 'meta').length },
    { name: 'Google', leads: filteredLeads.filter(l => l.source === 'google').length },
  ]

  // Generate monthly data from actual leads
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentYear = new Date().getFullYear()

    return months.map((month, index) => {
      const monthLeads = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt)
        return leadDate.getMonth() === index && leadDate.getFullYear() === currentYear
      })

      return {
        month,
        leads: monthLeads.length,
        website: monthLeads.filter(l => l.source === 'website').length,
        meta: monthLeads.filter(l => l.source === 'meta').length,
        google: monthLeads.filter(l => l.source === 'google').length
      }
    })
  }

  const monthlyData = generateMonthlyData()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Lead Management Dashboard</h1>
          <div className="flex items-center gap-4">
            <AddLeadForm onLeadAdded={handleLeadAdded} />
            <ImportDropdown onImportComplete={handleLeadAdded} />
            <ExportDropdown sourceFilter={sourceFilter} statusFilter={statusFilter} />
            <Button variant="outline" asChild>
              <Link href="/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <StatsCards
          totalLeads={totalLeads}
          newLeads={newLeads}
          convertedLeads={convertedLeads}
          conversionRate={conversionRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of leads across different channels</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Monthly Lead Trend</CardTitle>
                <p className="text-sm text-muted-foreground">Overview of lead generation over time</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Leads']} />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <LeadsTable
          leads={filteredLeads}
          onUpdateStatus={updateLeadStatus}
          onDeleteLead={deleteLead}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          newLeadIds={newLeadIds}
        />
      </div>
    </div>
  )
}
