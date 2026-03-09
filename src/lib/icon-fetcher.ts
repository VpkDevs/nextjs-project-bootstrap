/**
 * Fetch the best available icon for a given URL.
 * Tries multiple sources in priority order:
 *  1. apple-touch-icon (highest quality, usually 180×180+)
 *  2. og:image (often large, but may be a banner rather than icon)
 *  3. link[rel=icon] with size hints
 *  4. DuckDuckGo favicon API (reliable fallback)
 *  5. Clearbit Logo API (brand-quality, 200×200)
 *  6. Google S2 favicon service (low resolution, last resort)
 */

import * as cheerio from 'cheerio'
import type { IconResult } from '@/types'

const FETCH_TIMEOUT_MS = 5_000

async function fetchWithTimeout(url: string): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; NativefierStudio/1.0; icon-fetcher)',
      },
    })
    return res
  } finally {
    clearTimeout(timer)
  }
}

function absoluteUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).href
  } catch {
    return relative
  }
}

export async function fetchIcons(pageUrl: string): Promise<IconResult[]> {
  const results: IconResult[] = []

  let html = ''
  try {
    const res = await fetchWithTimeout(pageUrl)
    if (res.ok) html = await res.text()
  } catch {
    // network error – fall through to fallback sources
  }

  if (html) {
    const $ = cheerio.load(html)

    // 1. apple-touch-icon
    $('link[rel~="apple-touch-icon"]').each((_i, el) => {
      const href = $(el).attr('href')
      if (href) {
        results.push({
          url: absoluteUrl(pageUrl, href),
          source: 'apple-touch',
        })
      }
    })

    // 2. og:image
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) {
      results.push({ url: absoluteUrl(pageUrl, ogImage), source: 'og' })
    }

    // 3. <link rel="icon"> with largest size hint first
    const faviconLinks: Array<{ href: string; size: number }> = []
    $('link[rel~="icon"], link[rel~="shortcut icon"]').each((_i, el) => {
      const href = $(el).attr('href')
      const sizes = $(el).attr('sizes') ?? ''
      const sizeNum = parseInt(sizes.split('x')[0] ?? '0', 10) || 0
      if (href) faviconLinks.push({ href, size: sizeNum })
    })
    faviconLinks
      .sort((a, b) => b.size - a.size)
      .forEach(({ href }) => {
        results.push({ url: absoluteUrl(pageUrl, href), source: 'favicon' })
      })
  }

  // 4. DuckDuckGo favicon API
  try {
    const origin = new URL(pageUrl).hostname
    results.push({
      url: `https://icons.duckduckgo.com/ip3/${origin}.ico`,
      source: 'duckduckgo',
    })
  } catch {
    // invalid URL
  }

  // 5. Clearbit Logo API
  try {
    const origin = new URL(pageUrl).hostname
    results.push({
      url: `https://logo.clearbit.com/${origin}`,
      source: 'clearbit',
    })
  } catch {
    // invalid URL
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  return results.filter(({ url }) => {
    if (seen.has(url)) return false
    seen.add(url)
    return true
  })
}

export async function fetchBestIcon(pageUrl: string): Promise<IconResult | null> {
  const icons = await fetchIcons(pageUrl)
  // Priority: apple-touch > clearbit > duckduckgo > og > favicon
  const priority: IconResult['source'][] = [
    'apple-touch',
    'clearbit',
    'duckduckgo',
    'og',
    'favicon',
  ]
  for (const source of priority) {
    const match = icons.find((i) => i.source === source)
    if (match) return match
  }
  return icons[0] ?? null
}
