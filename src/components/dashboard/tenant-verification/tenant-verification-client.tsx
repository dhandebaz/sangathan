'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Printer } from 'lucide-react'

export default function TenantVerificationClient() {
  const [formData, setFormData] = useState({
    // Landlord
    landlordName: '',
    landlordFatherName: '',
    houseNo: '',
    gali: '',
    colony: '',
    area: '',
    district: '',
    pin: '',
    // Tenant
    tenantName: '',
    tenantFatherName: '',
    tenantVillage: '',
    tenantTehsil: '',
    tenantDistrict: '',
    tenantState: '',
    idType: '',
    idNumber: '',
    phone: '',
    // Property
    floor: '',
    rooms: '',
    rentAmount: '',
    rentStartDate: '',
    purpose: '',
    // Police
    policeStation: '',
    previousTenant: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Editor Section */}
      <div className="print:hidden space-y-6">
        <div className="flex justify-end">
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Form
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Landlord Details</CardTitle>
              <CardDescription>Details of the property owner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="landlordName">Name</Label>
                  <Input id="landlordName" name="landlordName" value={formData.landlordName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landlordFatherName">Father's Name</Label>
                  <Input id="landlordFatherName" name="landlordFatherName" value={formData.landlordFatherName} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Input placeholder="House No" name="houseNo" value={formData.houseNo} onChange={handleInputChange} />
                  <Input placeholder="Gali/Block" name="gali" value={formData.gali} onChange={handleInputChange} />
                  <Input placeholder="Colony/Sector" name="colony" value={formData.colony} onChange={handleInputChange} />
                  <Input placeholder="Area" name="area" value={formData.area} onChange={handleInputChange} />
                  <Input placeholder="District" name="district" value={formData.district} onChange={handleInputChange} />
                  <Input placeholder="PIN Code" name="pin" value={formData.pin} onChange={handleInputChange} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tenant Details</CardTitle>
              <CardDescription>Details of the person renting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Name</Label>
                  <Input id="tenantName" name="tenantName" value={formData.tenantName} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenantFatherName">Father's Name</Label>
                  <Input id="tenantFatherName" name="tenantFatherName" value={formData.tenantFatherName} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Permanent Address</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Input placeholder="Village/City" name="tenantVillage" value={formData.tenantVillage} onChange={handleInputChange} />
                  <Input placeholder="Tehsil/Taluka" name="tenantTehsil" value={formData.tenantTehsil} onChange={handleInputChange} />
                  <Input placeholder="District" name="tenantDistrict" value={formData.tenantDistrict} onChange={handleInputChange} />
                  <Input placeholder="State" name="tenantState" value={formData.tenantState} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <Select value={formData.idType} onValueChange={(v) => handleSelectChange('idType', v)}>
                    <SelectTrigger id="idType">
                      <SelectValue placeholder="Select ID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="Voter ID">Voter ID</SelectItem>
                      <SelectItem value="PAN">PAN Card</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                      <SelectItem value="Driving License">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property & Tenancy Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input id="floor" name="floor" placeholder="e.g. Ground, First" value={formData.floor} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rooms">Number of Rooms</Label>
                  <Input id="rooms" name="rooms" type="number" value={formData.rooms} onChange={handleInputChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Monthly Rent (₹)</Label>
                  <Input id="rentAmount" name="rentAmount" type="number" value={formData.rentAmount} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentStartDate">Rent Start Date</Label>
                  <Input id="rentStartDate" name="rentStartDate" type="date" value={formData.rentStartDate} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select value={formData.purpose} onValueChange={(v) => handleSelectChange('purpose', v)}>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select Purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="policeStation">Local Police Station</Label>
                <Input id="policeStation" name="policeStation" placeholder="Name of SHO Office / Thana" value={formData.policeStation} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousTenant">Previous Tenant Name (Optional)</Label>
                <Input id="previousTenant" name="previousTenant" value={formData.previousTenant} onChange={handleInputChange} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable Area */}
      <div className="hidden print:block font-serif text-black p-8 bg-white max-w-4xl mx-auto h-screen">
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">Tenant Verification Form</h1>
          <h2 className="text-xl font-semibold mb-1">किरायेदार सत्यापन फॉर्म</h2>
          <p className="text-sm italic">For Submission to Local Police Station (SHO Office)</p>
          {formData.policeStation && (
            <p className="mt-2 font-bold text-lg">To: SHO, Police Station {formData.policeStation}</p>
          )}
        </div>

        <div className="space-y-6 text-sm leading-loose">
          <section>
            <h3 className="font-bold text-lg mb-3 uppercase underline">1. Property Owner Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="font-semibold">Name:</span> <span className="border-b border-dotted border-black px-2">{formData.landlordName || '________________________'}</span>
              </div>
              <div>
                <span className="font-semibold">Father's Name:</span> <span className="border-b border-dotted border-black px-2">{formData.landlordFatherName || '________________________'}</span>
              </div>
              <div className="col-span-2 mt-2">
                <span className="font-semibold">Address:</span> <span className="border-b border-dotted border-black px-2">
                  {[formData.houseNo, formData.gali, formData.colony, formData.area, formData.district, formData.pin].filter(Boolean).join(', ') || '___________________________________________________________________________________'}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-3 uppercase underline mt-6">2. Tenant Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="font-semibold">Name:</span> <span className="border-b border-dotted border-black px-2">{formData.tenantName || '________________________'}</span>
              </div>
              <div>
                <span className="font-semibold">Father's Name:</span> <span className="border-b border-dotted border-black px-2">{formData.tenantFatherName || '________________________'}</span>
              </div>
              <div className="col-span-2 mt-2">
                <span className="font-semibold">Permanent Address:</span> <span className="border-b border-dotted border-black px-2">
                  {[formData.tenantVillage, formData.tenantTehsil, formData.tenantDistrict, formData.tenantState].filter(Boolean).join(', ') || '___________________________________________________________________________________'}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">ID Proof ({formData.idType || 'Type'}):</span> <span className="border-b border-dotted border-black px-2">{formData.idNumber || '________________________'}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Phone:</span> <span className="border-b border-dotted border-black px-2">{formData.phone || '________________________'}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-3 uppercase underline mt-6">3. Property Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="font-semibold">Floor:</span> <span className="border-b border-dotted border-black px-2">{formData.floor || '__________________'}</span>
              </div>
              <div>
                <span className="font-semibold">No. of Rooms:</span> <span className="border-b border-dotted border-black px-2">{formData.rooms || '__________________'}</span>
              </div>
              <div>
                <span className="font-semibold">Monthly Rent:</span> <span className="border-b border-dotted border-black px-2">{formData.rentAmount ? `Rs. ${formData.rentAmount}` : '__________________'}</span>
              </div>
              <div>
                <span className="font-semibold">Start Date:</span> <span className="border-b border-dotted border-black px-2">{formData.rentStartDate || '__________________'}</span>
              </div>
              <div>
                <span className="font-semibold">Purpose:</span> <span className="border-b border-dotted border-black px-2">{formData.purpose || '__________________'}</span>
              </div>
              <div>
                <span className="font-semibold">Previous Tenant:</span> <span className="border-b border-dotted border-black px-2">{formData.previousTenant || '__________________'}</span>
              </div>
            </div>
          </section>

          <section className="mt-8 border-2 border-black p-4">
            <h3 className="font-bold text-lg mb-2 uppercase underline">4. Declaration</h3>
            <p className="text-justify italic">
              "I hereby declare that the above information is true and correct to the best of my knowledge. I undertake to inform the local police station immediately if the tenant vacates the premises."
            </p>
          </section>

          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="border-b border-black w-3/4 mx-auto mb-2"></div>
              <span className="font-semibold">Landlord Signature</span>
            </div>
            <div>
              <div className="border-b border-black w-3/4 mx-auto mb-2"></div>
              <span className="font-semibold">Tenant Signature</span>
            </div>
            <div>
              <div className="border-b border-black w-3/4 mx-auto mb-2"></div>
              <span className="font-semibold">Witness Signature</span>
            </div>
          </div>
          <div className="mt-8">
            <span className="font-semibold">Date:</span> <span className="border-b border-dotted border-black px-8"></span>
          </div>
        </div>
      </div>
    </div>
  )
}
