/**
 * File-based JSON storage for app records and user settings.
 * Stored under <project-root>/data/  (excluded from git via .gitignore)
 */

import path from 'path'
import fse from 'fs-extra'
import type { AppRecord, UserSettings } from '@/types'

const DATA_DIR = path.join(process.cwd(), 'data')
const APPS_FILE = path.join(DATA_DIR, 'apps.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

async function ensureDataDir() {
  await fse.ensureDir(DATA_DIR)
}

// ─── Apps ─────────────────────────────────────────────────────────────────────

export async function readApps(): Promise<AppRecord[]> {
  await ensureDataDir()
  if (!(await fse.pathExists(APPS_FILE))) return []
  try {
    return (await fse.readJson(APPS_FILE)) as AppRecord[]
  } catch {
    return []
  }
}

export async function writeApps(apps: AppRecord[]): Promise<void> {
  await ensureDataDir()
  await fse.writeJson(APPS_FILE, apps, { spaces: 2 })
}

export async function getApp(id: string): Promise<AppRecord | undefined> {
  const apps = await readApps()
  return apps.find((a) => a.config.id === id)
}

export async function upsertApp(record: AppRecord): Promise<void> {
  const apps = await readApps()
  const idx = apps.findIndex((a) => a.config.id === record.config.id)
  if (idx >= 0) {
    apps[idx] = record
  } else {
    apps.unshift(record)
  }
  await writeApps(apps)
}

export async function deleteApp(id: string): Promise<boolean> {
  const apps = await readApps()
  const filtered = apps.filter((a) => a.config.id !== id)
  if (filtered.length === apps.length) return false
  await writeApps(filtered)
  return true
}

// ─── Settings ─────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: UserSettings = {
  defaultOutputDir: path.join(process.env.HOME ?? process.cwd(), 'Desktop'),
  defaultPlatform: 'linux',
  defaultArch: 'x64',
  defaultWidth: 1280,
  defaultHeight: 800,
  theme: 'dark',
}

export async function readSettings(): Promise<UserSettings> {
  await ensureDataDir()
  if (!(await fse.pathExists(SETTINGS_FILE))) return DEFAULT_SETTINGS
  try {
    const saved = (await fse.readJson(SETTINGS_FILE)) as Partial<UserSettings>
    return { ...DEFAULT_SETTINGS, ...saved }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function writeSettings(settings: UserSettings): Promise<void> {
  await ensureDataDir()
  await fse.writeJson(SETTINGS_FILE, settings, { spaces: 2 })
}
