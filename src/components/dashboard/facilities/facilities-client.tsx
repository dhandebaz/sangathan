'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createFacility, bookFacility, updateBookingStatus } from '@/actions/facilities'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function FacilitiesClient({ 
  facilities, 
  bookings, 
  isAdmin 
}: { 
  facilities: any[], 
  bookings: any[], 
  isAdmin: boolean 
}) {
  const [isFacilityOpen, setIsFacilityOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  
  const [facilityForm, setFacilityForm] = useState({ name: '', description: '', capacity: '', hourly_rate: '' })
  const [bookingForm, setBookingForm] = useState({ facility_id: '', start_time: '', end_time: '', notes: '' })

  const handleCreateFacility = async () => {
    try {
      await createFacility({
        name: facilityForm.name,
        description: facilityForm.description,
        capacity: facilityForm.capacity ? Number(facilityForm.capacity) : undefined,
        hourly_rate: facilityForm.hourly_rate ? Number(facilityForm.hourly_rate) : undefined
      })
      toast.success()
      setIsFacilityOpen(false)
      setFacilityForm({ name: '', description: '', capacity: '', hourly_rate: '' })
    } catch (e: any) {
      toast.error()
    }
  }

  const handleBook = async () => {
    try {
      await bookFacility(bookingForm)
      toast.success()
      setIsBookingOpen(false)
      setBookingForm({ facility_id: '', start_time: '', end_time: '', notes: '' })
    } catch (e: any) {
      toast.error()
    }
  }

  const handleStatusUpdate = async (id: string, status: any) => {
    try {
      await updateBookingStatus({ booking_id: id, status })
      toast.success()
    } catch (e: any) {
      toast.error()
    }
  }

  return (
    <Tabs defaultValue="bookings" className="w-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          {isAdmin && (
            <Dialog open={isFacilityOpen} onOpenChange={setIsFacilityOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Facility</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Facility</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={facilityForm.name} onChange={e => setFacilityForm({...facilityForm, name: e.target.value})} placeholder="e.g. Clubhouse" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={facilityForm.description} onChange={e => setFacilityForm({...facilityForm, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Capacity</Label>
                      <Input type="number" value={facilityForm.capacity} onChange={e => setFacilityForm({...facilityForm, capacity: e.target.value})} placeholder="50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hourly Rate (INR)</Label>
                      <Input type="number" value={facilityForm.hourly_rate} onChange={e => setFacilityForm({...facilityForm, hourly_rate: e.target.value})} placeholder="0" />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleCreateFacility}>Save Facility</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogTrigger asChild>
              <Button><Calendar className="w-4 h-4 mr-2" /> Book Facility</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Request Booking</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Facility</Label>
                  <Select value={bookingForm.facility_id} onValueChange={v => setBookingForm({...bookingForm, facility_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select facility" /></SelectTrigger>
                    <SelectContent>
                      {facilities.filter(f => f.status === 'available').map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name} {f.hourly_rate ? `(₹${f.hourly_rate}/hr)` : '(Free)'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="datetime-local" value={bookingForm.start_time} onChange={e => setBookingForm({...bookingForm, start_time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="datetime-local" value={bookingForm.end_time} onChange={e => setBookingForm({...bookingForm, end_time: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Purpose / Notes</Label>
                  <Textarea value={bookingForm.notes} onChange={e => setBookingForm({...bookingForm, notes: e.target.value})} placeholder="Birthday party..." />
                </div>
                <Button className="w-full" onClick={handleBook}>Request Booking</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TabsContent value="bookings" className="space-y-4">
        {bookings.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            No bookings found.
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map(b => (
              <Card key={b.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{b.facilities?.name}</h3>
                  <div className="text-sm text-slate-500 mt-1">
                    {new Date(b.start_time).toLocaleString()} - {new Date(b.end_time).toLocaleString()}
                  </div>
                  {isAdmin && <div className="text-sm font-medium mt-1">Booked by: {b.profiles?.full_name}</div>}
                  {b.notes && <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded">"{b.notes}"</div>}
                </div>
                <div className="flex flex-col items-end gap-3">
                  {b.status === 'pending' && <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-amber-100 text-amber-700"><Clock className="w-4 h-4"/> Pending</span>}
                  {b.status === 'approved' && <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700"><CheckCircle className="w-4 h-4"/> Approved</span>}
                  {b.status === 'rejected' && <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-rose-100 text-rose-700"><XCircle className="w-4 h-4"/> Rejected</span>}
                  {b.status === 'cancelled' && <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-slate-100 text-slate-700">Cancelled</span>}
                  
                  {isAdmin && b.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-emerald-600" onClick={() => handleStatusUpdate(b.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-rose-600" onClick={() => handleStatusUpdate(b.id, 'rejected')}>Reject</Button>
                    </div>
                  )}
                  {!isAdmin && b.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(b.id, 'cancelled')}>Cancel Request</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="facilities" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {facilities.map((f) => (
          <Card key={f.id} className="p-6">
            <h3 className="font-semibold text-lg mb-2">{f.name}</h3>
            {f.description && <p className="text-sm text-slate-500 mb-4">{f.description}</p>}
            <div className="flex justify-between items-center text-sm">
              <div>
                <div className="font-medium">Capacity: {f.capacity || 'N/A'}</div>
                <div className="font-medium mt-1">Rate: {f.hourly_rate ? `₹${f.hourly_rate}/hr` : 'Free'}</div>
              </div>
              <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${f.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {f.status}
              </span>
            </div>
          </Card>
        ))}
        {facilities.length === 0 && (
          <div className="col-span-3 text-center py-8 text-slate-500 border-2 border-dashed rounded-xl">
            No facilities available.
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
