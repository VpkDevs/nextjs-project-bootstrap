import { NextRequest, NextResponse } from 'next/server'
import { startBuild, listBuilds } from '@/lib/nativefier-builder'
import { getApp, upsertApp } from '@/lib/storage'
import type { AppConfig } from '@/types'

// GET /api/build – list all builds in memory
export async function GET() {
  return NextResponse.json({ builds: listBuilds() })
}

// POST /api/build – start a new build
// Body: { appId: string } | AppConfig (inline, not saved)
export async function POST(request: NextRequest) {
  const body = (await request.json()) as { appId?: string } & Partial<AppConfig>

  let config: AppConfig | undefined

  if (body.appId) {
    const record = await getApp(body.appId)
    if (!record) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }
    config = record.config
  } else if (body.url && body.name) {
    // Inline one-off build without saving
    config = body as AppConfig
  } else {
    return NextResponse.json(
      { error: 'Provide either appId or a full app config (url + name)' },
      { status: 400 }
    )
  }

  const job = await startBuild(config)

  // Attach the job to the app record if we have one
  if (body.appId) {
    const record = await getApp(body.appId)
    if (record) {
      record.lastBuild = {
        id: job.id,
        status: job.status,
        finishedAt: job.finishedAt,
        outputPath: job.outputPath,
      }
      await upsertApp(record)
    }
  }

  return NextResponse.json({ build: job }, { status: 202 })
}
