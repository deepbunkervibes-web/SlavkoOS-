import { useQuery } from '@tanstack/react-query'
import { DashboardStats } from '@enterprise/shared'
import { dashboardService } from '@/services/dashboardService'
import { StatCard } from '@/components/StatCard'
import { ProjectChart } from '@/components/ProjectChart'
import { TaskChart } from '@/components/TaskChart'
import { RecentActivity } from '@/components/RecentActivity'
import {
  FolderKanban,
  CheckSquare,
  Users,
  Clock
} from 'lucide-react'

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats()
  })

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ['dashboard-projects'],
    queryFn: () => dashboardService.getProjectChartData()
  })

  const { data: taskData, isLoading: taskLoading } = useQuery({
    queryKey: ['dashboard-tasks'],
    queryFn: () => dashboardService.getTaskChartData()
  })

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: () => dashboardService.getActivityChartData()
  })

  if (statsLoading || projectLoading || taskLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const statsData = stats?.data as DashboardStats

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back! Here's an overview of your project management dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={statsData?.totalProjects || 0}
          icon={FolderKanban}
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={statsData?.activeProjects || 0}
          icon={Clock}
          color="green"
        />
        <StatCard
          title="Total Tasks"
          value={statsData?.totalTasks || 0}
          icon={CheckSquare}
          color="purple"
        />
        <StatCard
          title="Team Members"
          value={statsData?.teamMembers || 0}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Project Completion</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Completed Projects</span>
                  <span className="font-medium">{statsData?.completedProjects || 0}</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ 
                      width: `${statsData?.totalProjects ? 
                        ((statsData.completedProjects / statsData.totalProjects) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Task Completion</span>
                  <span className="font-medium">{statsData?.productivity || 0}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${statsData?.productivity || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Priority Tasks</h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overdue</span>
                <span className="badge badge-error">{statsData?.overdueTasks || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Due Today</span>
                <span className="badge badge-warning">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Upcoming</span>
                <span className="badge badge-info">7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="space-y-2">
              <button className="btn btn-primary w-full">
                Create New Project
              </button>
              <button className="btn btn-outline w-full">
                Add Team Member
              </button>
              <button className="btn btn-outline w-full">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectChart data={projectData?.data || []} />
        <TaskChart data={taskData?.data} />
      </div>

      {/* Recent Activity */}
      <RecentActivity data={activityData?.data} />
    </div>
  )
}