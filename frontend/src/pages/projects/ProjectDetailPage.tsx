import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Edit, Calendar, User, CheckSquare } from 'lucide-react'
import { projectService } from '@/services/projectService'
import { ProjectWithRelations } from '@enterprise/shared'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: projectData, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error || !projectData?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Project not found</p>
      </div>
    )
  }

  const project = projectData.data as ProjectWithRelations

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center space-x-4">
          <Link
            to="/projects"
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <div className="flex-1">
            <h1 className="page-title">{project.name}</h1>
            <p className="page-description">{project.description}</p>
          </div>
          <button className="btn btn-primary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </button>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Project Information</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start Date</p>
                      <p className="text-sm text-gray-500">
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Owner</p>
                      <p className="text-sm text-gray-500">
                        {project.owner?.firstName} {project.owner?.lastName}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">End Date</p>
                      <p className="text-sm text-gray-500">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckSquare className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Tasks</p>
                      <p className="text-sm text-gray-500">{project._count?.tasks || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
            </div>
            <div className="card-body">
              {project.tasks && project.tasks.length > 0 ? (
                <div className="space-y-3">
                  {project.tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="badge badge-info">{task.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No tasks yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body space-y-3">
              <button className="btn btn-primary w-full">
                Add Task
              </button>
              <button className="btn btn-outline w-full">
                View Reports
              </button>
              <button className="btn btn-outline w-full">
                Export Data
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Tags</h3>
            </div>
            <div className="card-body">
              {project.tags && project.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string, index: number) => (
                    <span key={index} className="badge badge-gray">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tags</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}