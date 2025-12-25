'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Permission {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface Role {
  id: string
  name: string
  created_at: string
  role_permissions: Array<{
    permission: Permission
  }>
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'permissions' | 'roles' | 'nl'>('permissions')
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [rolePermissionDialogOpen, setRolePermissionDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [nlCommand, setNlCommand] = useState('')
  const [nlLoading, setNlLoading] = useState(false)
  const router = useRouter()

  const [permissionForm, setPermissionForm] = useState({
    name: '',
    description: '',
  })

  const [roleForm, setRoleForm] = useState({
    name: '',
  })

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [permsRes, rolesRes] = await Promise.all([
        fetch('/api/permissions'),
        fetch('/api/roles'),
      ])

      if (permsRes.ok) {
        const permsData = await permsRes.json()
        setPermissions(permsData.permissions)
      }

      if (rolesRes.ok) {
        const rolesData = await rolesRes.json()
        setRoles(rolesData.roles)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const openPermissionDialog = (permission?: Permission) => {
    if (permission) {
      setEditingPermission(permission)
      setPermissionForm({
        name: permission.name,
        description: permission.description || '',
      })
    } else {
      setEditingPermission(null)
      setPermissionForm({ name: '', description: '' })
    }
    setPermissionDialogOpen(true)
  }

  const openRoleDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role)
      setRoleForm({ name: role.name })
    } else {
      setEditingRole(null)
      setRoleForm({ name: '' })
    }
    setRoleDialogOpen(true)
  }

  const savePermission = async () => {
    try {
      const url = editingPermission
        ? `/api/permissions/${editingPermission.id}`
        : '/api/permissions'
      const method = editingPermission ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: permissionForm.name,
          description: permissionForm.description || null,
        }),
      })

      if (response.ok) {
        setPermissionDialogOpen(false)
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save permission')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  const saveRole = async () => {
    try {
      const url = editingRole ? `/api/roles/${editingRole.id}` : '/api/roles'
      const method = editingRole ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roleForm.name }),
      })

      if (response.ok) {
        setRoleDialogOpen(false)
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to save role')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  const deletePermission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this permission?')) return

    try {
      const response = await fetch(`/api/permissions/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete permission')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  const deleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return

    try {
      const response = await fetch(`/api/roles/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete role')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  const openRolePermissionDialog = (role: Role) => {
    setSelectedRole(role)
    setRolePermissionDialogOpen(true)
  }

  const updateRolePermissions = async (permissionIds: string[]) => {
    if (!selectedRole) return

    try {
      const response = await fetch(`/api/roles/${selectedRole.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissionIds }),
      })

      if (response.ok) {
        setRolePermissionDialogOpen(false)
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update permissions')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  const handleNlCommand = async () => {
    if (!nlCommand.trim()) return

    setNlLoading(true)
    try {
      // Use OpenAI API to parse the command
      const response = await fetch('/api/nl-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: nlCommand }),
      })

      const data = await response.json()

      if (response.ok) {
        setNlCommand('')
        fetchData()
        alert(data.message || 'Command executed successfully')
      } else {
        alert(data.error || 'Failed to execute command')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setNlLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">RBAC Configurator</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'permissions'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600'
            }`}
          >
            Permissions
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'roles'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600'
            }`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab('nl')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'nl'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600'
            }`}
          >
            Natural Language
          </button>
        </div>

        {activeTab === 'permissions' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>Manage application permissions</CardDescription>
                </div>
                <Button onClick={() => openPermissionDialog()}>Create Permission</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell>{permission.description || '-'}</TableCell>
                      <TableCell>
                        {new Date(permission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPermissionDialog(permission)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePermission(permission.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {permissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No permissions found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'roles' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Roles</CardTitle>
                  <CardDescription>Manage user roles and their permissions</CardDescription>
                </div>
                <Button onClick={() => openRoleDialog()}>Create Role</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        {role.role_permissions.length > 0
                          ? role.role_permissions.map((rp) => rp.permission.name).join(', ')
                          : 'No permissions'}
                      </TableCell>
                      <TableCell>
                        {new Date(role.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRolePermissionDialog(role)}
                        >
                          Manage Permissions
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(role)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRole(role.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {roles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        No roles found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'nl' && (
          <Card>
            <CardHeader>
              <CardTitle>Natural Language Configuration</CardTitle>
              <CardDescription>
                Use plain English to manage your RBAC settings. Example: "Give the role 'Content Editor' the permission to 'edit articles'"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nl-command">Command</Label>
                <Textarea
                  id="nl-command"
                  placeholder="Give the role 'Content Editor' the permission to 'edit articles'"
                  value={nlCommand}
                  onChange={(e) => setNlCommand(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleNlCommand} disabled={nlLoading || !nlCommand.trim()}>
                {nlLoading ? 'Processing...' : 'Execute Command'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Permission Dialog */}
      <Dialog open={permissionDialogOpen} onOpenChange={setPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPermission ? 'Edit Permission' : 'Create Permission'}
            </DialogTitle>
            <DialogDescription>
              {editingPermission
                ? 'Update the permission details'
                : 'Create a new permission for your application'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perm-name">Name</Label>
              <Input
                id="perm-name"
                value={permissionForm.name}
                onChange={(e) =>
                  setPermissionForm({ ...permissionForm, name: e.target.value })
                }
                placeholder="e.g., can_edit_articles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-desc">Description</Label>
              <Textarea
                id="perm-desc"
                value={permissionForm.description}
                onChange={(e) =>
                  setPermissionForm({ ...permissionForm, description: e.target.value })
                }
                placeholder="A brief description of this permission"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePermission}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? 'Update the role name'
                : 'Create a new role for your application'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Name</Label>
              <Input
                id="role-name"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                placeholder="e.g., Content Editor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Permission Dialog */}
      <Dialog open={rolePermissionDialogOpen} onOpenChange={setRolePermissionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Manage Permissions for {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              Select the permissions to assign to this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {permissions.map((permission) => {
              const isSelected = selectedRole?.role_permissions.some(
                (rp) => rp.permission.id === permission.id
              )
              return (
                <div key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`perm-${permission.id}`}
                    checked={isSelected}
                    onChange={(e) => {
                      const currentIds = selectedRole?.role_permissions.map(
                        (rp) => rp.permission.id
                      ) || []
                      if (e.target.checked) {
                        updateRolePermissions([...currentIds, permission.id])
                      } else {
                        updateRolePermissions(currentIds.filter((id) => id !== permission.id))
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor={`perm-${permission.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{permission.name}</div>
                    {permission.description && (
                      <div className="text-sm text-gray-500">{permission.description}</div>
                    )}
                  </label>
                </div>
              )
            })}
            {permissions.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No permissions available. Create permissions first.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRolePermissionDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

