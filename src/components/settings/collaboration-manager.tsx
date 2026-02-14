'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCollaborationRequest, respondToCollaborationRequest } from '@/actions/collaboration'
import { searchOrganisations } from '@/actions/search'
import { useRouter } from 'next/navigation'
import { Loader2, X, Check, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Partner {
  id: string
  name: string
  slug: string
}

interface CollaborationRequest {
  id: string
  requester?: Partner
  responder?: Partner
  created_at: string
}

export function CollaborationManager({ 
  orgId, 
  activePartners, 
  pendingRequests 
}: { 
  orgId: string, 
  activePartners: Partner[], 
  pendingRequests: { incoming: CollaborationRequest[], outgoing: CollaborationRequest[] } 
}) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Partner[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (searchQuery.length < 3) return
    setIsSearching(true)
    const results = await searchOrganisations(searchQuery)
    setSearchResults(results.filter((r) => r.id !== orgId)) // Filter self
    setIsSearching(false)
  }

  const handleInvite = async (targetId: string) => {
    setLoading(true)
    const res = await createCollaborationRequest(targetId)
    setLoading(false)
    if (res.success) {
      setSearchQuery('')
      setSearchResults([])
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  const handleRespond = async (linkId: string, status: 'active' | 'rejected') => {
    setLoading(true)
    const res = await respondToCollaborationRequest(linkId, status)
    setLoading(false)
    if (res.success) {
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Coalition Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activePartners.length === 0 ? (
              <p className="text-sm text-gray-500">No active collaborations.</p>
            ) : (
              <div className="grid gap-4">
                {activePartners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{partner.name}</h4>
                      <p className="text-xs text-gray-500">@{partner.slug}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {(pendingRequests.incoming.length > 0 || pendingRequests.outgoing.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Incoming */}
            {pendingRequests.incoming.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Incoming Requests</h4>
                {pendingRequests.incoming.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div>
                      <h4 className="font-medium">{req.requester?.name}</h4>
                      <p className="text-xs text-gray-500">wants to collaborate</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleRespond(req.id, 'rejected')} disabled={loading}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700" onClick={() => handleRespond(req.id, 'active')} disabled={loading}>
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Outgoing */}
            {pendingRequests.outgoing.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Sent Requests</h4>
                {pendingRequests.outgoing.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-75">
                    <div>
                      <h4 className="font-medium">{req.responder?.name}</h4>
                      <p className="text-xs text-gray-500">Waiting for response...</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Invite New Partner */}
      <Card>
        <CardHeader>
          <CardTitle>Invite New Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Search by organisation name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching || searchQuery.length < 3}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2 border rounded-lg p-2 max-h-48 overflow-y-auto">
              {searchResults.map((org) => (
                <div key={org.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group">
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs text-gray-500">@{org.slug}</div>
                  </div>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => handleInvite(org.id)} disabled={loading}>
                    Invite
                  </Button>
                </div>
              ))}
            </div>
          )}
          {searchQuery.length >= 3 && searchResults.length === 0 && !isSearching && (
             <p className="text-sm text-gray-500 text-center py-2">No organizations found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
