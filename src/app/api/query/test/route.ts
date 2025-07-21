import { NextRequest, NextResponse } from 'next/server'
import { queryEngine } from '@/lib/api/query-engine'
import { ResponseProcessor } from '@/lib/api/response-processor'

// Test endpoint for query execution (development only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, platform, queryText, queryType = 'test' } = body

    if (!companyId || !platform || !queryText) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, platform, queryText' },
        { status: 400 }
      )
    }

    // Execute single query
    const result = await queryEngine.executeQuery(
      companyId,
      platform,
      queryText,
      queryType
    )

    // If successful, process the response
    let processingResult = null
    if (result.status === 'completed' && result.response) {
      processingResult = await ResponseProcessor.processResponse(
        result.id,
        companyId,
        result.response
      )
    }

    return NextResponse.json({
      query: result,
      processing: processingResult
    })

  } catch (error) {
    console.error('Query test error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Test endpoint for batch queries
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyId, templateId, platforms, variables, queryType } = body

    if (!companyId || !templateId || !platforms || !variables) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, templateId, platforms, variables' },
        { status: 400 }
      )
    }

    // Execute batch query
    const results = await queryEngine.executeBatchQuery({
      company_id: companyId,
      template_id: templateId,
      platforms,
      variables,
      query_type: queryType
    })

    // Process responses
    const processingResults = await Promise.all(
      results
        .filter(r => r.status === 'completed' && r.response)
        .map(r => ResponseProcessor.processResponse(r.id, companyId, r.response!))
    )

    return NextResponse.json({
      queries: results,
      processing: processingResults
    })

  } catch (error) {
    console.error('Batch query test error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}