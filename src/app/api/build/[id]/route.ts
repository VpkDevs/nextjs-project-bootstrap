import { NextRequest, NextResponse } from 'next/server'
import { getBuild } from '@/lib/nativefier-builder'
import { getApp, upsertApp } from '@/lib/storage'

type Params = { params: Promise<{ id: string }> }

// GET /api/build/[id] – poll build status and logs
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const job = getBuild(id)
  if (!job) {
    return NextResponse.json({ error: 'Build not found' }, { status: 404 })
  }

  // Sync finished build status back to the app record
  if (job.status === 'success' || job.status === 'failed') {
    const record = await getApp(job.appId)
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

  return NextResponse.json({ build: job })
}
