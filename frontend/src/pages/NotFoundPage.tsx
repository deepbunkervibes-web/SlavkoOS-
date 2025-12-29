import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Home className="h-12 w-12" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">404</h1>
          <p className="mt-2 text-sm text-gray-600">
            The page you're looking for doesn't exist.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="btn btn-primary w-full justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Or{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  sign in to your account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}