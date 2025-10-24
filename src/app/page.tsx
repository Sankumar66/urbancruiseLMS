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
