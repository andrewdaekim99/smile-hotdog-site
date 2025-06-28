import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.')
  console.error('Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('Current values:')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
}

// Create Supabase client with fallback for missing env vars
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Customer Management
export const customerAPI = {
  // Create new customer account (using admin client to bypass RLS)
  async createCustomer(customerData) {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .insert([customerData])
      .select()
      .single()
    
    return { data, error }
  },

  // Get customer by email
  async getCustomerByEmail(email) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()
    
    return { data, error }
  },

  // Get customer by ID
  async getCustomerById(id) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // Update customer profile
  async updateCustomer(id, updates) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    return { data, error }
  },

  // Get customer rewards
  async getCustomerRewards(customerId) {
    const { data, error } = await supabase
      .from('rewards_transactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  }
}

// Product Management
export const productAPI = {
  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })
    
    return { data, error }
  },

  // Get all products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('available', true)
      .order('id', { ascending: true })
    
    return { data, error }
  },

  // Get products by category
  async getProductsByCategory(categoryId) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('category_id', categoryId)
      .eq('available', true)
      .order('id', { ascending: true })
    
    return { data, error }
  },

  // Get single product
  async getProduct(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('id', id)
      .single()
    
    return { data, error }
  }
}

// Order Management
export const orderAPI = {
  // Create new order
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()
    
    return { data, error }
  },

  // Add items to order
  async addOrderItems(orderItems) {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()
    
    return { data, error }
  },

  // Get customer orders
  async getCustomerOrders(customerId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          subtotal,
          special_instructions
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Get order by ID
  async getOrder(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_price,
          quantity,
          subtotal,
          special_instructions
        )
      `)
      .eq('id', orderId)
      .single()
    
    return { data, error }
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()
    
    return { data, error }
  }
}

// Booking Management
export const bookingAPI = {
  // Create new booking
  async createBooking(bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single()
    
    return { data, error }
  },

  // Get customer bookings
  async getCustomerBookings(customerId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_id', customerId)
      .order('event_date', { ascending: true })
    
    return { data, error }
  },

  // Get booking by ID
  async getBooking(bookingId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()
    
    return { data, error }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()
    
    return { data, error }
  }
}

// Rewards Management
export const rewardsAPI = {
  // Add rewards transaction
  async addRewardsTransaction(transactionData) {
    const { data, error } = await supabase
      .from('rewards_transactions')
      .insert([transactionData])
      .select()
      .single()
    
    return { data, error }
  },

  // Get customer points balance
  async getCustomerPoints(customerId) {
    const { data, error } = await supabase
      .from('customers')
      .select('points, total_spent')
      .eq('id', customerId)
      .single()
    
    return { data, error }
  },

  // Calculate points for order
  calculatePointsForOrder(orderTotal) {
    return Math.floor(orderTotal) // 1 point per $1 spent
  }
}

// Authentication helpers
export const authAPI = {
  // Sign up with Supabase Auth
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    return { data, error }
  },

  // Sign in with Supabase Auth
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
} 