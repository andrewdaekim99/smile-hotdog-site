import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get table structure
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'customers' })
      .catch(() => {
        // Fallback: query information_schema directly
        return supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable, column_default')
          .eq('table_name', 'customers')
          .eq('table_schema', 'public')
      })

    if (columnError) {
      console.error('Error fetching table structure:', columnError)
      return NextResponse.json(
        { error: 'Failed to fetch table structure' },
        { status: 500 }
      )
    }

    // Get sample data
    const { data: sampleData, error: sampleError } = await supabase
      .from('customers')
      .select('*')
      .limit(1)

    return NextResponse.json({
      tableStructure: columns,
      sampleData: sampleData,
      sampleError: sampleError
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 