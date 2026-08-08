'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Award, Plus, UserPlus, Search, Sparkles, Tag, Users, Loader2 } from 'lucide-react'
import { getDefaultUnionPosts } from '@/lib/posts'
import { createUnionPostAction, assignMemberPostAction } from '@/actions/union-posts'
import { toast } from 'sonner'
import type { UnionPost } from '@/types/posts'

interface PostsManagerClientProps {
  organisationId: string
  members: { id: string; full_name: string; email?: string | null; designation?: string | null }[]
  dbRoles: any[]
}

export default function PostsManagerClient({ members, dbRoles }: PostsManagerClientProps) {
  // Merge default posts with custom posts from DB
  const defaultPosts = getDefaultUnionPosts()
  const customDbPosts: UnionPost[] = dbRoles.map((r, i) => ({
    id: r.id,
    title_en: r.name,
    title_hi: r.name,
    category: 'custom',
    is_custom: true,
    display_order: defaultPosts.length + i + 1,
    description_en: r.description
  }))

  const [posts, setPosts] = useState<UnionPost[]>([...defaultPosts, ...customDbPosts])
  const [search, setSearch] = useState('')
  const [showAddPost, setShowAddPost] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Custom Post State
  const [newTitleEn, setNewTitleEn] = useState('')
  const [newTitleHi, setNewTitleHi] = useState('')
  const [newCategory, setNewCategory] = useState<'executive' | 'secretariat' | 'departmental' | 'hostel' | 'cell_or_wing' | 'custom'>('custom')
  const [newDesc, setNewDesc] = useState('')

  // Assignment State
  const [selectedPostTitle, setSelectedPostTitle] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState('')

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitleEn) return
    setLoading(true)

    try {
      const res = await createUnionPostAction({
        title_en: newTitleEn,
        title_hi: newTitleHi,
        category: newCategory,
        description: newDesc
      })

      if (res.success && res.data) {
        toast.success('Custom Union Post saved to database!')
        const newPost: UnionPost = {
          id: res.data.id,
          title_en: newTitleEn,
          title_hi: newTitleHi || newTitleEn,
          category: newCategory,
          is_custom: true,
          display_order: posts.length + 1,
          description_en: newDesc
        }
        setPosts([...posts, newPost])
        setShowAddPost(false)
        setNewTitleEn('')
        setNewTitleHi('')
        setNewDesc('')
      } else {
        toast.error(res.error || 'Failed to create post')
      }
    } catch {
      toast.error('An error occurred while creating post')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPostTitle || !selectedMemberId) return
    setLoading(true)

    try {
      const res = await assignMemberPostAction({
        memberId: selectedMemberId,
        postTitle: selectedPostTitle,
      })

      if (res.success) {
        toast.success('Member designation assigned in database!')
        setShowAssignModal(false)
        setSelectedPostTitle('')
        setSelectedMemberId('')
        window.location.reload()
      } else {
        toast.error(res.error || 'Failed to assign post')
      }
    } catch {
      toast.error('An error occurred during assignment')
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title_en.toLowerCase().includes(search.toLowerCase()) ||
    p.title_hi.includes(search)
  )

  const assignedMembers = members.filter(m => m.designation)

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white p-6 rounded-2xl border border-amber-900/50 shadow-xl">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-xl font-bold">Union Posts (पद) & Designation Registry</h2>
            <p className="text-slate-300 text-sm mt-1">
              Manage official student union posts (President, Vice President, General Secretary, etc.) and create custom post types in Supabase.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddPost(true)}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl transition shadow"
          >
            <Plus className="w-4 h-4" />
            Create Custom Post (पद)
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition shadow"
          >
            <UserPlus className="w-4 h-4" />
            Assign Post to Member
          </button>
        </div>
      </div>

      {/* Add Custom Post Form */}
      {showAddPost && (
        <Card className="border-2 border-amber-200 shadow-xl bg-white">
          <CardHeader className="border-b bg-amber-50/50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Create Custom Union Post Type (नया पद जोड़ें)
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleCreatePost}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Post Title (English)</label>
                  <input
                    type="text"
                    required
                    value={newTitleEn}
                    onChange={e => setNewTitleEn(e.target.value)}
                    placeholder="e.g. Cultural Secretary / Unit President"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Post Title in Hindi (पद का हिंदी नाम)</label>
                  <input
                    type="text"
                    value={newTitleHi}
                    onChange={e => setNewTitleHi(e.target.value)}
                    placeholder="e.g. सांस्कृतिक सचिव / इकाई अध्यक्ष"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="executive">Executive Office (अध्यक्षीय / कार्यकारी)</option>
                    <option value="secretariat">Secretariat (सचिवालय)</option>
                    <option value="departmental">Departmental Representative (विभाग प्रतिनिधि)</option>
                    <option value="hostel">Hostel & Inmate Council (छात्रावास प्रतिनिधि)</option>
                    <option value="cell_or_wing">Specialized Cell / Wing (प्रकोष्ठ / विंग)</option>
                    <option value="custom">Custom Designation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Brief description of responsibilities"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </CardContent>
            <div className="border-t bg-slate-50 p-4 flex justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowAddPost(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save New Post to DB
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Assign Member Form */}
      {showAssignModal && (
        <Card className="border-2 border-indigo-200 shadow-xl bg-white">
          <CardHeader className="border-b bg-indigo-50/50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Assign Union Post to Member (पद आवंटन)
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleAssignPost}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Union Post (पद)</label>
                  <select
                    required
                    value={selectedPostTitle}
                    onChange={e => setSelectedPostTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="">-- Choose Union Post --</option>
                    {posts.map(p => (
                      <option key={p.id} value={`${p.title_en} (${p.title_hi})`}>
                        {p.title_en} ({p.title_hi})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Member</label>
                  <select
                    required
                    value={selectedMemberId}
                    onChange={e => setSelectedMemberId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="">-- Choose Member --</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.email || 'Member'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
            <div className="border-t bg-slate-50 p-4 flex justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm Post Assignment
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Database Assigned Office Bearers */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Database Assigned Office Bearers ({assignedMembers.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {assignedMembers.map(m => (
            <div key={m.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-bold text-slate-900 text-base">{m.designation}</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned Member: <strong className="text-slate-800">{m.full_name}</strong>
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                Active Office Bearer
              </span>
            </div>
          ))}

          {assignedMembers.length === 0 && (
            <p className="text-xs text-slate-500 p-6 text-center">No office bearer designations assigned yet in database.</p>
          )}
        </CardContent>
      </Card>

      {/* Configured Union Posts Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            Configured Union Posts Directory ({filteredPosts.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search post name or पद..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map(p => (
            <Card key={p.id} className="border hover:border-amber-400 transition shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{p.title_en}</h4>
                    <p className="text-amber-700 font-bold text-sm">{p.title_hi}</p>
                  </div>
                  {p.is_custom ? (
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-0.5 rounded">DB Custom</span>
                  ) : (
                    <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded uppercase">Standard</span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {p.description_en || p.description_hi || 'Official office position within union administration.'}
                </p>

                <div className="pt-2 border-t flex justify-between items-center text-xs text-slate-400">
                  <span className="capitalize">Category: {p.category.replace('_', ' ')}</span>
                  <span>Order #{p.display_order}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
