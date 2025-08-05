import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../../contexts/SupabaseContext'
import { TABLES } from '../../lib/supabase'
import { 
  Users, 
  Star, 
  Video, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react'
import Navbar from '../../components/Navbar'

const AdminDashboard = () => {
  const { supabase } = useSupabase()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCelebrities: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalRevenue: 0
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all stats
      const [
        { count: usersCount },
        { count: celebritiesCount },
        { count: requestsCount },
        { count: pendingCount },
        { count: completedCount },
        { data: recentRequestsData }
      ] = await Promise.all([
        supabase.from(TABLES.USERS).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.CELEBRITIES).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.SHOUTOUT_REQUESTS).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.SHOUTOUT_REQUESTS).select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from(TABLES.SHOUTOUT_REQUESTS).select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from(TABLES.SHOUTOUT_REQUESTS)
          .select(`
            *,
            celebrities (
              name,
              image_url
            ),
            users (
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5)
      ])

      // Calculate total revenue (simplified calculation)
      const totalRevenue = completedCount * 500 // Assuming average price of $500

      setStats({
        totalUsers: usersCount || 0,
        totalCelebrities: celebritiesCount || 0,
        totalRequests: requestsCount || 0,
        pendingRequests: pendingCount || 0,
        completedRequests: completedCount || 0,
        totalRevenue
      })

      setRecentRequests(recentRequestsData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'approved':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />
      case 'pending':
        return <Clock size={16} />
      case 'approved':
        return <AlertCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of CelebsBridge platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Star className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celebrities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCelebrities}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Video className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/admin/celebrities"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium">Manage Celebrities</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              
              <Link
                to="/admin/requests"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Video className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium">Handle Requests</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
              
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600 mr-3" />
                  <span className="font-medium">Manage Users</span>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={request.celebrities?.image_url || 'https://via.placeholder.com/40'}
                        alt={request.celebrities?.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{request.celebrities?.name}</p>
                        <p className="text-sm text-gray-600">{request.users?.email}</p>
                      </div>
                    </div>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{stats.totalRequests}</div>
            <div className="text-gray-600">Total Requests</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.completedRequests}</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingRequests}</div>
            <div className="text-gray-600">Pending</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard 