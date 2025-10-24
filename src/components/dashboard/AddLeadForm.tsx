import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from 'lucide-react'

interface AddLeadFormProps {
  onLeadAdded: () => void
}

export function AddLeadForm({ onLeadAdded }: AddLeadFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    vehicle: '',
    city: '',
    rentalDays: '',
    rentalMonths: '',
    source: 'website',
    description: ''
  })

  const addNewLead = async () => {
    try {
      const leadData = {
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        service: newLead.service,
        vehicle: newLead.vehicle,
        city: newLead.city,
        rentalDays: newLead.rentalDays,
        rentalMonths: newLead.rentalMonths,
        source: newLead.source,
        notes: [newLead.description]
      }

      await axios.post('http://localhost:5000/api/v1/leads', leadData)

      // Reset form
      setNewLead({
        name: '',
        email: '',
        phone: '',
        service: '',
        vehicle: '',
        city: '',
        rentalDays: '',
        rentalMonths: '',
        source: 'website',
        description: ''
      })
      setIsOpen(false)
      onLeadAdded()
    } catch (error) {
      console.error('Error adding lead:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Row 1: Name, Email, Phone */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newLead.name}
                onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Row 2: Service, Vehicle, City */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="service">Service</Label>
              <Select value={newLead.service} onValueChange={(value) => setNewLead({...newLead, service: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEDDING TRAVEL">WEDDING TRAVEL</SelectItem>
                  <SelectItem value="CORPORATE TRAVEL">CORPORATE TRAVEL</SelectItem>
                  <SelectItem value="VACATIONS">VACATIONS</SelectItem>
                  <SelectItem value="LOCAL TRAVEL">LOCAL TRAVEL</SelectItem>
                  <SelectItem value="ONE WAY">ONE WAY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select value={newLead.vehicle} onValueChange={(value) => setNewLead({...newLead, vehicle: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEMPO TRAVELLER - 9 To 26 Seater">TEMPO TRAVELLER - 9 To 26 Seater</SelectItem>
                  <SelectItem value="MINIBUS - 19 To 35 Seater">MINIBUS - 19 To 35 Seater</SelectItem>
                  <SelectItem value="LUXURY BUS - 36 To 50 Seater">LUXURY BUS - 36 To 50 Seater</SelectItem>
                  <SelectItem value="LUXURY CAR - 4 To 7 Seater">LUXURY CAR - 4 To 7 Seater</SelectItem>
                  <SelectItem value="CAR - 4 Seater">CAR - 4 Seater</SelectItem>
                  <SelectItem value="SUV - 6 To 7 Seater">SUV - 6 To 7 Seater</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={newLead.city} onValueChange={(value) => setNewLead({...newLead, city: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Thane">Thane</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Noida">Noida</SelectItem>
                  <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                  <SelectItem value="Ghaziabad">Ghaziabad</SelectItem>
                  <SelectItem value="Agra">Agra</SelectItem>
                  <SelectItem value="Varanasi">Varanasi</SelectItem>
                  <SelectItem value="Lucknow">Lucknow</SelectItem>
                  <SelectItem value="Jaipur">Jaipur</SelectItem>
                  <SelectItem value="Dehradun">Dehradun</SelectItem>
                  <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                  <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Indore">Indore</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Rental Days, Rental Months, Source */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rentalDays">Rental Days</Label>
              <Input
                id="rentalDays"
                type="number"
                value={newLead.rentalDays}
                onChange={(e) => setNewLead({...newLead, rentalDays: e.target.value})}
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <Label htmlFor="rentalMonths">Rental Months</Label>
              <Input
                id="rentalMonths"
                type="number"
                value={newLead.rentalMonths}
                onChange={(e) => setNewLead({...newLead, rentalMonths: e.target.value})}
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="meta">Meta</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newLead.description}
              onChange={(e) => setNewLead({...newLead, description: e.target.value})}
              placeholder="Lead requirements and details..."
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={addNewLead}>
            Add Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}