import { Clock, FolderKanban, CheckSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
  data?: {
    recentProjects: Array<any>
    recentTasks: Array<any>
  }
}

export function RecentActivity({ data }: RecentActivityProps) {
  const activities = [
    ...(data?.recentProjects?.slice(0, 3).map(project => ({
      id: project.id,
      type: 'project',
      title: `Created project "${project.name}"`,
      description: `Status: ${project.status}`,
      author: project.owner?.firstName + ' ' + project.owner?.lastName,
      timestamp: project.createdAt,
      icon: FolderKanban,
      color: 'blue'
    })) || []),
    ...(data?.recentTasks?.slice(0, 3).map(task => ({
      id: task.id,
      type: 'task',
      title: `Created task "${task.title}"`,
      description: `Project: ${task.project?.name}`,
      author: 'System',
      timestamp: task.createdAt,
      icon: CheckSquare,
      color: 'green'
    })) || [])
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <p className="mt-1 text-sm text-gray-500">
          Latest updates from your projects and tasks
        </p>
      </div>
      <div className="card-body">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activity yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a project or task.
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => {
                const Icon = activity.icon
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              activity.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                            }`}
                          >
                            <Icon 
                              className={`h-4 w-4 ${
                                activity.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                              }`} 
                            />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={activity.timestamp}>
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        
        <div className="mt-6">
          <button className="btn btn-outline w-full">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  )
}