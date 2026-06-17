'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash, Shield, User } from 'lucide-react'
import { createCustomRole, updateRole, deleteRole } from '@/actions/roles'
import { toast } from 'sonner'

interface Role {
  id: string
  name: string
  description?: string
  permissions: Record<string, boolean>
  is_system: boolean
  created_at: string
}

interface RoleManagerProps {
  initialRoles: Role[]
  organisationId: string
  lang: string
}

type Permissions = Record<string, boolean>

const defaultPermissions: Permissions = {
  can_view_finances: false,
  can_manage_members: false,
  can_manage_polls: false,
  can_manage_events: false,
  can_manage_forms: false
}

export function RoleManager({ initialRoles, organisationId, lang }: RoleManagerProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [showNewRole, setShowNewRole] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: { ...defaultPermissions }
  })

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await createCustomRole({
        organisationId,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      })
      if (result.success) {
        toast.success('Role created successfully')
        setShowNewRole(false)
        // Refresh roles
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to create role')
      }
    } catch (err) {
      toast.error('An error occurred')
    }
  }

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRole) return
    try {
      const result = await updateRole({
        id: editingRole.id,
        organisationId,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions
      })
      if (result.success) {
        toast.success('Role updated successfully')
        setEditingRole(null)
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to update role')
      }
    } catch (err) {
      toast.error('An error occurred')
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return
    try {
      const result = await deleteRole(roleId, organisationId)
      if (result.success) {
        toast.success('Role deleted successfully')
        setRoles(roles.filter(r => r.id !== roleId))
      } else {
        toast.error(result.error || 'Failed to delete role')
      }
    } catch (err) {
      toast.error('An error occurred')
    }
  }

  const startEditing = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: { ...defaultPermissions, ...role.permissions }
    })
  }

  const cancelEditing = () => {
    setEditingRole(null)
    setFormData({
      name: '',
      description: '',
      permissions: { ...defaultPermissions }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-600" />
            Custom Roles
          </h1>
          <p className="text-muted-foreground mt-1">Define granular permissions for specialized members</p>
        </div>
        {!showNewRole && !editingRole && (
          <Button onClick={() => setShowNewRole(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        )}
      </div>

      {/* New Role Form */}
      {showNewRole && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Role</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Treasurer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.keys(defaultPermissions).map((permKey) => (
                    <div key={permKey} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={permKey}
                        checked={formData.permissions[permKey]}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            [permKey]: e.target.checked
                          }
                        })}
                      />
                      <label htmlFor={permKey} className="text-sm">
                        {permKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Role</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNewRole(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Role Form */}
      {editingRole && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Role: {editingRole.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateRole} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Role Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.keys(defaultPermissions).map((permKey) => (
                    <div key={permKey} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`edit-${permKey}`}
                        checked={formData.permissions[permKey]}
                        onChange={(e) => setFormData({
                          ...formData,
                          permissions: {
                            ...formData.permissions,
                            [permKey]: e.target.checked
                          }
                        })}
                      />
                      <label htmlFor={`edit-${permKey}`} className="text-sm">
                        {permKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Update Role</Button>
                <Button type="button" variant="secondary" onClick={cancelEditing}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Roles List */}
      {!showNewRole && !editingRole && (
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  {role.description && <p className="text-sm text-muted-foreground mt-1">{role.description}</p>}
                </div>
                {role.is_system && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">System</span>}
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(role.permissions).filter(([, val]) => val).map(([key]) => (
                      <span key={key} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded">
                        {key.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                {!role.is_system && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => startEditing(role)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteRole(role.id)}>
                      <Trash className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {roles.length === 0 && !showNewRole && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-gray-500 mb-4">No custom roles defined yet.</p>
          <Button onClick={() => setShowNewRole(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first role
          </Button>
        </div>
      )}
    </div>
  )
}
