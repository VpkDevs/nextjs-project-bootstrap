import { NextRequest, NextResponse } from 'next/server'
import { fetchIcons } from '@/lib/icon-fetcher'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    const icons = await fetchIcons(url)
    return NextResponse.json({ icons })
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to fetch icons: ${String(err)}` },
      { status: 500 }
    )
  }
}
