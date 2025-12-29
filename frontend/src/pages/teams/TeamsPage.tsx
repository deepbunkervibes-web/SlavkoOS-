import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'

export function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Teams</h1>
            <p className="page-description">
              Manage teams and collaborate effectively.
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Team
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first team to start collaborating.
          </p>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </button>
        </div>
      </div>
    </div>
  )
}