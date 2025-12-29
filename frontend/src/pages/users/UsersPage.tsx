import { Plus, User } from 'lucide-react'

export function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Users</h1>
            <p className="page-description">
              Manage user accounts and permissions.
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-500">
            User management interface would be implemented here.
          </p>
        </div>
      </div>
    </div>
  )
}