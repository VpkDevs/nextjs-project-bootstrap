import { NextRequest, NextResponse } from 'next/server'
import { readApps, upsertApp } from '@/lib/storage'
import { readSettings } from '@/lib/storage'
import type { AppConfig, AppRecord } from '@/types'
import { v4 as uuid } from 'uuid'

// GET /api/apps – list all apps
export async function GET() {
  const apps = await readApps()
  return NextResponse.json({ apps })
}

// POST /api/apps – create a new app record
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<AppConfig>

  if (!body.url || !body.name) {
    return NextResponse.json(
      { error: 'url and name are required' },
      { status: 400 }
    )
  }

  const settings = await readSettings()
  const now = new Date().toISOString()

  const config: AppConfig = {
    id: uuid(),
    name: body.name,
    url: body.url,
    platform: body.platform ?? settings.defaultPlatform,
    arch: body.arch ?? settings.defaultArch,
    width: body.width ?? settings.defaultWidth,
    height: body.height ?? settings.defaultHeight,
    out: body.out ?? settings.defaultOutputDir,
    createdAt: now,
    updatedAt: now,
    // spread all other optional fields
    ...Object.fromEntries(
      Object.entries(body).filter(
        ([k]) => !['id', 'createdAt', 'updatedAt'].includes(k)
      )
    ),
  }

  const record: AppRecord = { config }
  await upsertApp(record)
  return NextResponse.json({ app: record }, { status: 201 })
}
