import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Users } from 'lucide-react'

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <Link
            to="/teams"
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="flex-1">
            <h1 className="page-title">Team Details</h1>
            <p className="page-description">View and manage team information</p>
          </div>
          <button className="btn btn-primary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Team
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <p className="text-center text-gray-500">
            Team detail page for team ID: {id}
          </p>
        </div>
      </div>
    </div>
  )
}