import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, File } from "lucide-react"
import axios from "axios"

interface ExportDropdownProps {
  sourceFilter?: string
  statusFilter?: string
}

export function ExportDropdown({ sourceFilter, statusFilter }: ExportDropdownProps) {
  const handleExport = async (format: string) => {
    try {
      const params = new URLSearchParams()
      params.append('format', format)
      if (sourceFilter) params.append('source', sourceFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await axios.get(`http://localhost:5000/api/v1/export/leads?${params}`, {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url

      const extension = format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'
      link.setAttribute('download', `leads_export.${extension}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          Export to PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <File className="mr-2 h-4 w-4" />
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}