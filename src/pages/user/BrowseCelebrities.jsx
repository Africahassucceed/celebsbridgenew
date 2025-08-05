import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupabase } from '../../contexts/SupabaseContext'
import { TABLES } from '../../lib/supabase'
import { Search, Filter, Star, Video } from 'lucide-react'
import Navbar from '../../components/Navbar'

const BrowseCelebrities = () => {
  const { supabase } = useSupabase()
  const [celebrities, setCelebrities] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .order('name')

      setCategories(categoriesData || [])

      // Fetch celebrities with category info
      const { data: celebritiesData, error } = await supabase
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
      setCelebrities(celebritiesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCelebrities = celebrities
    .filter(celebrity => {
      const matchesSearch = celebrity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          celebrity.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || celebrity.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return 0
      }
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
          <h1 className="text-3xl font-bold text-gray-900">Browse Celebrities</h1>
          <p className="text-gray-600 mt-2">
            Find your favorite African and diaspora celebrities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search celebrities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCelebrities.length} of {celebrities.length} celebrities
          </p>
        </div>

        {/* Celebrities Grid */}
        {filteredCelebrities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCelebrities.map((celebrity) => (
              <div key={celebrity.id} className="card hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <img
                    src={celebrity.image_url || 'https://via.placeholder.com/200x200?text=No+Image'}
                    alt={celebrity.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{celebrity.name}</h3>
                  <p className="text-gray-600 mb-2">{celebrity.categories?.name}</p>
                  {celebrity.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {celebrity.description}
                    </p>
                  )}
                  <div className="flex items-center justify-center mb-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-600 mb-4">
                    ${celebrity.price}
                  </div>
                  <Link
                    to={`/request-shoutout?celebrity=${celebrity.id}`}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Request Shoutout
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No celebrities found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseCelebrities 