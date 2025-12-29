import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Filter } from 'lucide-react'
import { taskService } from '@/services/taskService'
import { Task, TaskStatus, Priority } from '@enterprise/shared'

const statusColors = {
  TODO: 'badge-gray',
  IN_PROGRESS: 'badge-blue',
  IN_REVIEW: 'badge-warning',
  DONE: 'badge-success',
  BLOCKED: 'badge-error',
}

const priorityColors = {
  LOW: 'badge-gray',
  MEDIUM: 'badge-info',
  HIGH: 'badge-warning',
  CRITICAL: 'badge-error',
}

export function TasksPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')

  const { data: tasksData, isLoading, error } = useQuery({
    queryKey: ['tasks', { search, status: statusFilter, priority: priorityFilter }],
    queryFn: () => taskService.getTasks({
      page: 1,
      limit: 50,
      search,
      status: statusFilter as TaskStatus,
      priority: priorityFilter as Priority,
    })
  })

  const tasks = tasksData?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load tasks</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-description">
              Manage and track all your tasks across projects.
            </p>
          </div>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 input"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>

            <button className="btn btn-outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      {tasks.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="text-gray-400 mb-4">
              <CheckSquare className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first task.
            </p>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Task</th>
                  <th className="table-header-cell">Project</th>
                  <th className="table-header-cell">Assignee</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Priority</th>
                  <th className="table-header-cell">Due Date</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {tasks.map((task: Task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {task.description}
                        </p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/projects/${task.project?.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {task.project?.name}
                      </Link>
                    </td>
                    <td className="table-cell">
                      {task.assignee ? (
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {task.assignee.firstName?.[0]}{task.assignee.lastName?.[0]}
                            </span>
                          </div>
                          <span className="ml-2 text-sm text-gray-900">
                            {task.assignee.firstName} {task.assignee.lastName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${statusColors[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="table-cell">
                      {task.dueDate ? (
                        <span className="text-sm">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">No due date</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-primary-600 hover:text-primary-900 text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}