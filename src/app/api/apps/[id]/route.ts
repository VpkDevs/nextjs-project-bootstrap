import { NextRequest, NextResponse } from 'next/server'
import { getApp, upsertApp, deleteApp } from '@/lib/storage'
import type { AppConfig } from '@/types'

type Params = { params: Promise<{ id: string }> }

// GET /api/apps/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const record = await getApp(id)
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ app: record })
}

// PATCH /api/apps/[id] – partial update
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const record = await getApp(id)
  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = (await request.json()) as Partial<AppConfig>
  const updated: AppConfig = {
    ...record.config,
    ...body,
    id,
    updatedAt: new Date().toISOString(),
  }
  record.config = updated
  await upsertApp(record)
  return NextResponse.json({ app: record })
}

// DELETE /api/apps/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const removed = await deleteApp(id)
  if (!removed) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
