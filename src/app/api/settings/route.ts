import { NextRequest, NextResponse } from 'next/server'
import { readSettings, writeSettings } from '@/lib/storage'
import type { UserSettings } from '@/types'

export async function GET() {
  const settings = await readSettings()
  return NextResponse.json({ settings })
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as UserSettings
  await writeSettings(body)
  return NextResponse.json({ settings: body })
}
