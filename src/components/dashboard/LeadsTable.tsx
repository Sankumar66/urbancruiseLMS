import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import axios from "axios"

interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  service: string
  vehicle?: string
  city?: string
  rentalDays?: string
  rentalMonths?: string
  source: string
  campaign: string
  status: string
  assignedTo?: { name: string; email: string }
  notes?: string[]
  createdAt: string
  updatedAt?: string
}

interface LeadsTableProps {
  leads: Lead[]
  onUpdateStatus: (id: string, status: string) => void
  onDeleteLead?: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  newLeadIds?: Set<string>
}

export function LeadsTable({ leads, onUpdateStatus, onDeleteLead, currentPage, totalPages, onPageChange, newLeadIds = new Set() }: LeadsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'contacted': return 'bg-yellow-500'
      case 'qualified': return 'bg-green-500'
      case 'converted': return 'bg-purple-500'
      case 'lost': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'meta': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      case 'google': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Rental Days</TableHead>
              <TableHead>Rental Months</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Create Date</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, index) => {
              const isNewLead = newLeadIds.has(lead._id)
              return (
                <TableRow
                  key={lead._id}
                  className={`${isNewLead ? 'bg-green-50 border-l-4 border-green-500 dark:bg-green-900/20 dark:border-green-400' : 'bg-background'} hover:bg-muted/50 transition-colors`}
                >
                  <TableCell className="font-mono text-sm font-bold text-foreground">
                    {(currentPage - 1) * 10 + index + 1}
                    {isNewLead && <span className="ml-2 text-green-600 dark:text-green-400 text-xs font-bold">NEW</span>}
                  </TableCell>
                <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                <TableCell className="text-foreground">{lead.email}</TableCell>
                <TableCell className="text-foreground">{lead.phone}</TableCell>
                <TableCell className="text-foreground">{lead.service}</TableCell>
                <TableCell className="text-foreground">{lead.vehicle || 'N/A'}</TableCell>
                <TableCell className="text-foreground">{lead.city || 'N/A'}</TableCell>
                <TableCell className="text-foreground">{lead.rentalDays || 'N/A'}</TableCell>
                <TableCell className="text-foreground">{lead.rentalMonths || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={getSourceColor(lead.source)}>{lead.source}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate text-foreground" title={lead.notes?.[0] || 'No description'}>
                  {lead.notes?.[0] || 'No description'}
                </TableCell>
                <TableCell className="text-foreground">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-foreground">
                  {lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : new Date(lead.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={lead.status}
                      onValueChange={(value) => onUpdateStatus(lead._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    {onDeleteLead && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the lead for {lead.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteLead(lead._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-foreground">Page {currentPage} of {totalPages}</span>
          <Button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}