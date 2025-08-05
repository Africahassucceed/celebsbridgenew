import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useSupabase } from '../../contexts/SupabaseContext'
import { TABLES } from '../../lib/supabase'
import { 
  Calendar, 
  MessageSquare, 
  Upload, 
  Star,
  ArrowLeft,
  Video
} from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'

const RequestShoutout = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  
  const [formData, setFormData] = useState({
    celebrityId: searchParams.get('celebrity') || '',
    message: '',
    occasion: '',
    deliveryDate: '',
    referenceFile: null
  })
  
  const [celebrities, setCelebrities] = useState([])
  const [selectedCelebrity, setSelectedCelebrity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchCelebrities()
  }, [])

  useEffect(() => {
    if (formData.celebrityId) {
      const celebrity = celebrities.find(c => c.id === formData.celebrityId)
      setSelectedCelebrity(celebrity)
    }
  }, [formData.celebrityId, celebrities])

  const fetchCelebrities = async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CELEBRITIES)
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCelebrities(data || [])
    } catch (error) {
      console.error('Error fetching celebrities:', error)
      toast.error('Failed to load celebrities')
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    
    if (name === 'referenceFile') {
      setFormData({
        ...formData,
        referenceFile: files[0] || null
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const validateForm = () => {
    if (!formData.celebrityId) {
      toast.error('Please select a celebrity')
      return false
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message')
      return false
    }
    if (!formData.occasion.trim()) {
      toast.error('Please specify the occasion')
      return false
    }
    if (!formData.deliveryDate) {
      toast.error('Please select a delivery date')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setFormLoading(true)

    try {
      // Upload reference file if provided
      let referenceUrl = null
      if (formData.referenceFile) {
        const fileName = `${user.id}/${Date.now()}_${formData.referenceFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('shoutouts')
          .upload(fileName, formData.referenceFile)

        if (uploadError) throw uploadError
        referenceUrl = uploadData.path
      }

      // Create shoutout request
      const { error } = await supabase
        .from(TABLES.SHOUTOUT_REQUESTS)
        .insert({
          user_id: user.id,
          celebrity_id: formData.celebrityId,
          message: formData.message,
          occasion: formData.occasion,
          delivery_date: formData.deliveryDate,
          reference_file: referenceUrl,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Shoutout request submitted successfully!')
      navigate('/my-bookings')
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Request a Shoutout</h1>
          <p className="text-gray-600 mt-2">
            Get a personalized video message from your favorite celebrity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Celebrity Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Celebrity *
                  </label>
                  <select
                    name="celebrityId"
                    value={formData.celebrityId}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Choose a celebrity...</option>
                    {celebrities.map((celebrity) => (
                      <option key={celebrity.id} value={celebrity.id}>
                        {celebrity.name} - ${celebrity.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    placeholder="Write your personalized message for the celebrity..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Be specific about what you want the celebrity to say
                  </p>
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occasion *
                  </label>
                  <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Birthday, Graduation, Anniversary..."
                    required
                  />
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Reference File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference File (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      name="referenceFile"
                      onChange={handleChange}
                      accept="image/*,video/*"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-500 font-medium">
                        Upload a file
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Images or videos up to 10MB
                    </p>
                  </div>
                  {formData.referenceFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {formData.referenceFile.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary w-full flex items-center justify-center py-3"
                >
                  {formLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Video className="h-5 w-5 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {selectedCelebrity && (
              <div className="card sticky top-8">
                <div className="text-center mb-6">
                  <img
                    src={selectedCelebrity.image_url || 'https://via.placeholder.com/150x150?text=No+Image'}
                    alt={selectedCelebrity.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCelebrity.name}</h3>
                  <p className="text-gray-600">{selectedCelebrity.categories?.name}</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-primary-600">${selectedCelebrity.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-semibold">3-5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-semibold">HD Video</span>
                  </div>
                </div>

                {selectedCelebrity.description && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">About</h4>
                    <p className="text-sm text-gray-600">{selectedCelebrity.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestShoutout 