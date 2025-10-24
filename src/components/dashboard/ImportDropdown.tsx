import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Upload, FileText, FileSpreadsheet, File, Link } from "lucide-react"
import axios from "axios"

interface ImportDropdownProps {
  onImportComplete: () => void
}

export function ImportDropdown({ onImportComplete }: ImportDropdownProps) {
  const [isImporting, setIsImporting] = useState(false)

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('http://localhost:5000/api/v1/import/leads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Import completed successfully!')
      onImportComplete()
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleUrlImport = async () => {
    const url = prompt('Enter the URL to import data from:')
    if (!url) return

    setIsImporting(true)
    try {
      await axios.post('http://localhost:5000/api/v1/import/leads/url', { url })
      alert('Import completed successfully!')
      onImportComplete()
    } catch (error) {
      console.error('Import failed:', error)
      alert('Import failed. Please try again.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleCsvImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = (e) => handleFileImport(e as any)
    input.click()
  }

  const handleExcelImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.xlsx,.xls'
    input.onchange = (e) => handleFileImport(e as any)
    input.click()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isImporting}>
          <Upload className="mr-2 h-4 w-4" />
          {isImporting ? 'Importing...' : 'Import'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleUrlImport}>
          <Link className="mr-2 h-4 w-4" />
          Import from URL
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExcelImport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Import Excel File
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCsvImport}>
          <FileText className="mr-2 h-4 w-4" />
          Import CSV File
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.xlsx,.xls,.csv,.txt'
          input.onchange = (e) => handleFileImport(e as any)
          input.click()
        }}>
          <File className="mr-2 h-4 w-4" />
          Import Any File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}