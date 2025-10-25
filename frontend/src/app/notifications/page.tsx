'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Activity, User, Clock, MapPin, Shield } from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const mockActivityLogs = [
  {
    _id: '1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    action: 'CREATE_LEAD',
    entityType: 'LEAD',
    entityId: 'lead1',
    description: 'Created new lead: Alice Johnson (alice@example.com)',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    _id: '2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    action: 'UPDATE_LEAD',
    entityType: 'LEAD',
    entityId: 'lead2',
    description: 'Updated lead: Bob Wilson (bob@example.com)',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    _id: '3',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    action: 'DELETE_LEAD',
    entityType: 'LEAD',
    entityId: 'lead3',
    description: 'Deleted lead: Charlie Brown (charlie@example.com)',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
  },
  {
    _id: '4',
    userId: 'user3',
    userName: 'Admin User',
    userEmail: 'admin@example.com',
    action: 'IMPORT_LEADS',
    entityType: 'SYSTEM',
    entityId: 'import1',
    description: 'Imported 50 leads from CSV file',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() // 6 hours ago
  },
  {
    _id: '5',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    action: 'EXPORT_LEADS',
    entityType: 'SYSTEM',
    entityId: 'export1',
    description: 'Exported 25 leads to Excel file',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() // 8 hours ago
  }
]

interface ActivityLog {
  _id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  entityType: string
  entityId?: string
  description: string
  ipAddress: string
  userAgent: string
  oldData?: any
  newData?: any
  metadata?: any
  createdAt: string
}

export default function NotificationsPage() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityLogs()
  }, [currentPage, actionFilter, entityFilter])

  useEffect(() => {
    setFilteredLogs(activityLogs)
  }, [activityLogs])

  const fetchActivityLogs = async () => {
    try {
      setLoading(true)
      // Use mock data for demonstration
      setTimeout(() => {
        let filteredData = mockActivityLogs

        if (actionFilter && actionFilter !== 'all') {
          filteredData = filteredData.filter(log => log.action === actionFilter)
        }

        if (entityFilter && entityFilter !== 'all') {
          filteredData = filteredData.filter(log => log.entityType === entityFilter)
        }

        // Simple pagination simulation
        const startIndex = (currentPage - 1) * 20
        const endIndex = startIndex + 20
        const paginatedData = filteredData.slice(startIndex, endIndex)

        setActivityLogs(paginatedData)
        setTotalPages(Math.ceil(filteredData.length / 20))
        setLoading(false)
      }, 500) // Simulate API delay
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE_LEAD': return 'bg-green-100 text-green-800'
      case 'UPDATE_LEAD': return 'bg-blue-100 text-blue-800'
      case 'DELETE_LEAD': return 'bg-red-100 text-red-800'
      case 'IMPORT_LEADS': return 'bg-purple-100 text-purple-800'
      case 'EXPORT_LEADS': return 'bg-orange-100 text-orange-800'
      case 'LOGIN': return 'bg-gray-100 text-gray-800'
      case 'LOGOUT': return 'bg-gray-100 text-gray-800'
      case 'FULL_ACCESS_GRANTED': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'LEAD': return 'bg-blue-100 text-blue-800'
      case 'USER': return 'bg-green-100 text-green-800'
      case 'SYSTEM': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading activity logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
              <p className="text-muted-foreground">Track all user activities and system events</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityLogs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lead Operations</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityLogs.filter(log => log.entityType === 'LEAD').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Events</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activityLogs.filter(log => log.entityType === 'SYSTEM').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(activityLogs.map(log => log.userId)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE_LEAD">Create Lead</SelectItem>
                  <SelectItem value="UPDATE_LEAD">Update Lead</SelectItem>
                  <SelectItem value="DELETE_LEAD">Delete Lead</SelectItem>
                  <SelectItem value="IMPORT_LEADS">Import Leads</SelectItem>
                  <SelectItem value="EXPORT_LEADS">Export Leads</SelectItem>
                  <SelectItem value="LOGIN">Login</SelectItem>
                  <SelectItem value="LOGOUT">Logout</SelectItem>
                  <SelectItem value="FULL_ACCESS_GRANTED">Full Access Granted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="LEAD">Lead</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="SYSTEM">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <p className="text-sm text-muted-foreground">Detailed log of all system activities (auto-deleted after 24 hours)</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-sm text-muted-foreground">{log.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(log.action)}>
                        {formatAction(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEntityColor(log.entityType)}>
                        {log.entityType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={log.description}>
                        {log.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">{log.ipAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activity logs found</p>
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span>Page {currentPage} of {totalPages}</span>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}