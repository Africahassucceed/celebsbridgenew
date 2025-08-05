import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSupabase } from '../../contexts/SupabaseContext'
import { TABLES } from '../../lib/supabase'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Play,
  Eye,
  Star
} from 'lucide-react'
import Navbar from '../../components/Navbar'

const MyBookings = () => {
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SHOUTOUT_REQUESTS)
        .select(`
          *,
          celebrities (
            name,
            image_url,
            price
          ),
          shoutout_videos (
            video_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
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
      case 'cancelled':
        return 'text-red-600 bg-red-100'
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
      case 'cancelled':
        return <AlertCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const downloadVideo = async (videoUrl) => {
    try {
      const { data, error } = await supabase.storage
        .from('shoutouts')
        .download(videoUrl)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = `shoutout-${Date.now()}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading video:', error)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (selectedStatus === 'all') return true
    return booking.status === selectedStatus
  })

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
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Track your shoutout requests and download completed videos
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending ({bookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setSelectedStatus('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'approved'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Approved ({bookings.filter(b => b.status === 'approved').length})
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Completed ({bookings.filter(b => b.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={booking.celebrities?.image_url || 'https://via.placeholder.com/60x60?text=No+Image'}
                      alt={booking.celebrities?.name}
                      className="w-15 h-15 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.celebrities?.name}
                        </h3>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Occasion</p>
                          <p className="font-medium">{booking.occasion}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Delivery Date</p>
                          <p className="font-medium">{formatDate(booking.delivery_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-medium text-primary-600">${booking.celebrities?.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested</p>
                          <p className="font-medium">{formatDate(booking.created_at)}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Your Message</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {booking.message}
                        </p>
                      </div>

                      {booking.shoutout_videos && booking.shoutout_videos.length > 0 && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => downloadVideo(booking.shoutout_videos[0].video_url)}
                            className="btn-secondary flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Video
                          </button>
                          <button
                            onClick={() => window.open(booking.shoutout_videos[0].video_url, '_blank')}
                            className="btn-outline flex items-center"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Preview
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {selectedStatus === 'all' 
                ? "You haven't made any shoutout requests yet."
                : `No ${selectedStatus} bookings found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings 