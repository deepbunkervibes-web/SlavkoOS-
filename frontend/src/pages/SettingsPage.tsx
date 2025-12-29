import { User, Bell, Shield, Database } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-description">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Settings
              </h3>
            </div>
            <div className="card-body">
              <p className="text-gray-500">Profile settings would be implemented here.</p>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </h3>
            </div>
            <div className="card-body">
              <p className="text-gray-500">Notification preferences would be configured here.</p>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security
              </h3>
            </div>
            <div className="card-body">
              <p className="text-gray-500">Security settings would be implemented here.</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System
              </h3>
            </div>
            <div className="card-body">
              <p className="text-gray-500">System settings would be available here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}