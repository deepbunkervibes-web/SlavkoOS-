import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface TaskChartProps {
  data: {
    statusBreakdown: Array<{ status: string; _count: { status: number } }>
    priorityBreakdown: Array<{ priority: string; _count: { priority: number } }>
    recentTasks: Array<any>
  }
}

const COLORS = {
  TODO: '#94a3b8',
  'IN_PROGRESS': '#3b82f6',
  'IN_REVIEW': '#f59e0b',
  DONE: '#10b981',
  BLOCKED: '#ef4444',
}

const statusLabels = {
  TODO: 'To Do',
  'IN_PROGRESS': 'In Progress',
  'IN_REVIEW': 'In Review',
  DONE: 'Done',
  BLOCKED: 'Blocked',
}

export function TaskChart({ data }: TaskChartProps) {
  const chartData = data.statusBreakdown.map(item => ({
    name: statusLabels[item.status as keyof typeof statusLabels] || item.status,
    value: item._count.status,
    status: item.status,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{`${payload[0].value} tasks`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-medium text-gray-900">Task Status Distribution</h3>
        <p className="mt-1 text-sm text-gray-500">
          Breakdown of tasks by current status
        </p>
      </div>
      <div className="card-body">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.status as keyof typeof COLORS] || '#94a3b8'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Status Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {Object.entries(statusLabels).map(([key, label]) => {
            const count = data.statusBreakdown.find(item => item.status === key)?._count.status || 0
            if (count === 0) return null
            return (
              <div key={key} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded mr-2" 
                  style={{ backgroundColor: COLORS[key as keyof typeof COLORS] }}
                ></div>
                <span className="text-gray-600">{label}: {count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}