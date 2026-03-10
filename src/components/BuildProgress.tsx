'use client'

import { useEffect, useRef, useState } from 'react'
import type { BuildJob } from '@/types'

interface Props {
  job: BuildJob
  onPollUpdate: (updated: BuildJob) => void
}

const STATUS_CONFIG = {
  pending:   { colour: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: '⏳', label: 'Pending' },
  running:   { colour: 'text-blue-400',   bg: 'bg-blue-400/10',   icon: '⚙️', label: 'Building…' },
  success:   { colour: 'text-green-400',  bg: 'bg-green-400/10',  icon: '✅', label: 'Success' },
  failed:    { colour: 'text-red-400',    bg: 'bg-red-400/10',    icon: '❌', label: 'Failed' },
  cancelled: { colour: 'text-slate-400',  bg: 'bg-slate-400/10',  icon: '⏹️', label: 'Cancelled' },
}

export default function BuildProgress({ job: initialJob, onPollUpdate }: Props) {
  const [job, setJob] = useState(initialJob)
  const logRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cfg = STATUS_CONFIG[job.status]
  const isActive = job.status === 'pending' || job.status === 'running'

  useEffect(() => {
    if (!isActive) return

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/build/${job.id}`)
        if (!res.ok) return
        const data = await res.json() as { build: BuildJob }
        setJob(data.build)
        onPollUpdate(data.build)

        if (data.build.status !== 'pending' && data.build.status !== 'running') {
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch {
        // swallow – will retry on next tick
      }
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [job.id, isActive, onPollUpdate])

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [job.logs])

  const elapsed = job.finishedAt
    ? Math.round((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)
    : Math.round((Date.now() - new Date(job.startedAt).getTime()) / 1000)

  return (
    <div className="card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Build: {job.appName}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Job ID: {job.id}</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${cfg.bg} ${cfg.colour}`}>
          <span className={isActive ? 'animate-spin-slow' : ''}>{cfg.icon}</span>
          {cfg.label}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-surface-900 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            job.status === 'success' ? 'bg-green-500 w-full'
            : job.status === 'failed' ? 'bg-red-500 w-full'
            : job.status === 'running' ? 'bg-brand-500 animate-pulse w-3/4'
            : 'bg-yellow-500 w-1/4'
          }`}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <StatBox label="Status" value={cfg.label} />
        <StatBox label="Elapsed" value={`${elapsed}s`} />
        <StatBox label="Log lines" value={String(job.logs.length)} />
      </div>

      {/* Success output */}
      {job.status === 'success' && job.outputPath && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
          <p className="text-sm font-medium text-green-300 mb-1">✅ App built successfully!</p>
          <p className="text-xs text-slate-400">Output location:</p>
          <code className="mt-1 block rounded bg-surface-900 px-3 py-2 text-xs font-mono text-green-300 break-all">
            {job.outputPath}
          </code>
        </div>
      )}

      {/* Error */}
      {job.status === 'failed' && job.errorMessage && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <p className="text-sm font-medium text-red-300 mb-1">❌ Build failed</p>
          <code className="block rounded bg-surface-900 px-3 py-2 text-xs font-mono text-red-300 break-all">
            {job.errorMessage}
          </code>
        </div>
      )}

      {/* Log output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label mb-0">Build Log</span>
          {isActive && (
            <span className="flex items-center gap-1.5 text-xs text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div
          ref={logRef}
          className="h-64 overflow-y-auto rounded-lg bg-black/50 border border-white/5 p-3 font-mono text-xs text-slate-400 space-y-0.5"
        >
          {job.logs.length === 0 ? (
            <span className="text-slate-600">Waiting for output…</span>
          ) : (
            job.logs.map((line, i) => (
              <div
                key={i}
                className={
                  line.includes('[stderr]') ? 'text-yellow-500' :
                  line.includes('error') || line.includes('Error') ? 'text-red-400' :
                  line.includes('✅') || line.includes('finished') ? 'text-green-400' :
                  line.startsWith('[studio]') ? 'text-brand-400' :
                  ''
                }
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-surface-900 p-2">
      <p className="text-slate-500">{label}</p>
      <p className="mt-0.5 font-mono font-medium text-slate-200">{value}</p>
    </div>
  )
}
