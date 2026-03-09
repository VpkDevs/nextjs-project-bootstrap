/**
 * Pre-configured app templates for popular services.
 * Each template sets sane defaults so the user just clicks and builds.
 */

import type { AppTemplate } from '@/types'

export const APP_TEMPLATES: AppTemplate[] = [
  // ── Productivity ──────────────────────────────────────────────────────────
  {
    id: 'notion',
    name: 'Notion',
    url: 'https://www.notion.so',
    description: 'All-in-one workspace for notes, docs, and projects',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/notion.so',
    config: {
      width: 1400, height: 900,
      singleInstance: true,
      internalUrls: 'https?://.*\\.notion\\.so.*',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      tray: 'false',
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian (Web)',
    url: 'https://obsidian.md',
    description: 'Knowledge base and markdown note-taking',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/obsidian.md',
    config: { width: 1400, height: 900, singleInstance: true },
  },
  {
    id: 'todoist',
    name: 'Todoist',
    url: 'https://app.todoist.com',
    description: 'Task manager and to-do list',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/todoist.com',
    config: {
      width: 1200, height: 800,
      singleInstance: true,
      tray: 'true',
      internalUrls: 'https?://.*\\.todoist\\.com.*',
    },
  },
  {
    id: 'linear',
    name: 'Linear',
    url: 'https://linear.app',
    description: 'Issue tracking and project management',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/linear.app',
    config: { width: 1400, height: 900, singleInstance: true },
  },
  {
    id: 'airtable',
    name: 'Airtable',
    url: 'https://airtable.com',
    description: 'Spreadsheet-database hybrid',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/airtable.com',
    config: { width: 1400, height: 900 },
  },
  {
    id: 'trello',
    name: 'Trello',
    url: 'https://trello.com',
    description: 'Kanban-style project boards',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/trello.com',
    config: { width: 1280, height: 800 },
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    url: 'https://docs.google.com',
    description: 'Online document editing',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/docs.google.com',
    config: {
      width: 1400, height: 900,
      internalUrls: 'https?://.*\\.google\\.com.*',
    },
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    url: 'https://sheets.google.com',
    description: 'Online spreadsheet editing',
    category: 'Productivity',
    iconUrl: 'https://logo.clearbit.com/sheets.google.com',
    config: {
      width: 1400, height: 900,
      internalUrls: 'https?://.*\\.google\\.com.*',
    },
  },

  // ── Communication ─────────────────────────────────────────────────────────
  {
    id: 'gmail',
    name: 'Gmail',
    url: 'https://mail.google.com',
    description: 'Google email client',
    category: 'Communication',
    iconUrl: 'https://logo.clearbit.com/gmail.com',
    config: {
      width: 1400, height: 900,
      singleInstance: true,
      notificationBadge: true,
      tray: 'true',
      internalUrls: 'https?://.*\\.google\\.com.*',
    },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Web',
    url: 'https://web.whatsapp.com',
    description: 'WhatsApp messaging in a desktop window',
    category: 'Communication',
    iconUrl: 'https://logo.clearbit.com/whatsapp.com',
    config: {
      width: 1200, height: 800,
      singleInstance: true,
      tray: 'true',
      notificationBadge: true,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  },
  {
    id: 'telegram',
    name: 'Telegram Web',
    url: 'https://web.telegram.org/k/',
    description: 'Telegram messaging in a desktop window',
    category: 'Communication',
    iconUrl: 'https://logo.clearbit.com/telegram.org',
    config: {
      width: 1200, height: 800,
      singleInstance: true,
      tray: 'true',
      notificationBadge: true,
    },
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discord.com/app',
    description: 'Discord without the full client bloat',
    category: 'Communication',
    iconUrl: 'https://logo.clearbit.com/discord.com',
    config: {
      width: 1280, height: 800,
      singleInstance: true,
      tray: 'true',
      internalUrls: 'https?://.*\\.discord\\.com.*',
    },
  },
  {
    id: 'slack',
    name: 'Slack',
    url: 'https://app.slack.com',
    description: 'Lightweight Slack without the heavy native client',
    category: 'Communication',
    iconUrl: 'https://logo.clearbit.com/slack.com',
    config: {
      width: 1280, height: 800,
      singleInstance: true,
      tray: 'true',
      notificationBadge: true,
      internalUrls: 'https?://.*\\.slack\\.com.*',
    },
  },
  {
    id: 'teams',
    name: 'Microsoft Teams Web',
    url: 'https://teams.microsoft.com',
    description: 'Microsoft Teams without the full client',
    category: 'Communication',
    iconUrl: 'https://logo.clearbit.com/microsoft.com',
    config: {
      width: 1280, height: 800,
      singleInstance: true,
      internalUrls: 'https?://.*\\.microsoft\\.com.*|https?://.*\\.microsoftonline\\.com.*',
    },
  },

  // ── Development ───────────────────────────────────────────────────────────
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    description: 'Code hosting and collaboration',
    category: 'Development',
    iconUrl: 'https://logo.clearbit.com/github.com',
    config: {
      width: 1400, height: 900,
      internalUrls: 'https?://.*\\.github\\.com.*|https?://.*\\.githubusercontent\\.com.*',
    },
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    url: 'https://gitlab.com',
    description: 'DevOps platform and code hosting',
    category: 'Development',
    iconUrl: 'https://logo.clearbit.com/gitlab.com',
    config: { width: 1400, height: 900 },
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI ChatGPT as a desktop app',
    category: 'Development',
    iconUrl: 'https://logo.clearbit.com/openai.com',
    config: {
      width: 1200, height: 900,
      singleInstance: true,
      internalUrls: 'https?://.*\\.openai\\.com.*',
    },
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai',
    description: "Anthropic's Claude AI assistant as a desktop app",
    category: 'Development',
    iconUrl: 'https://logo.clearbit.com/anthropic.com',
    config: { width: 1200, height: 900, singleInstance: true },
  },
  {
    id: 'vercel',
    name: 'Vercel Dashboard',
    url: 'https://vercel.com/dashboard',
    description: 'Vercel deployment dashboard',
    category: 'Development',
    iconUrl: 'https://logo.clearbit.com/vercel.com',
    config: { width: 1400, height: 900 },
  },
  {
    id: 'codesandbox',
    name: 'CodeSandbox',
    url: 'https://codesandbox.io',
    description: 'Online code editor and sandbox',
    category: 'Development',
    iconUrl: 'https://logo.clearbit.com/codesandbox.io',
    config: { width: 1600, height: 1000 },
  },

  // ── Entertainment ─────────────────────────────────────────────────────────
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    description: 'YouTube without browser distractions',
    category: 'Entertainment',
    iconUrl: 'https://logo.clearbit.com/youtube.com',
    config: {
      width: 1280, height: 800,
      adBlocking: true,
      internalUrls: 'https?://.*\\.youtube\\.com.*|https?://.*\\.youtu\\.be.*|https?://.*\\.googlevideo\\.com.*',
    },
  },
  {
    id: 'netflix',
    name: 'Netflix',
    url: 'https://www.netflix.com',
    description: 'Netflix streaming desktop window',
    category: 'Entertainment',
    iconUrl: 'https://logo.clearbit.com/netflix.com',
    config: {
      width: 1280, height: 800,
      fullscreen: false,
      internalUrls: 'https?://.*\\.netflix\\.com.*',
    },
  },
  {
    id: 'spotify',
    name: 'Spotify Web Player',
    url: 'https://open.spotify.com',
    description: 'Spotify web player as a desktop app',
    category: 'Entertainment',
    iconUrl: 'https://logo.clearbit.com/spotify.com',
    config: {
      width: 1080, height: 700,
      singleInstance: true,
      tray: 'true',
    },
  },
  {
    id: 'twitch',
    name: 'Twitch',
    url: 'https://www.twitch.tv',
    description: 'Twitch live streaming',
    category: 'Entertainment',
    iconUrl: 'https://logo.clearbit.com/twitch.tv',
    config: {
      width: 1280, height: 800,
      adBlocking: true,
    },
  },

  // ── Social ────────────────────────────────────────────────────────────────
  {
    id: 'twitter-x',
    name: 'X / Twitter',
    url: 'https://x.com',
    description: 'X (formerly Twitter) as a standalone app',
    category: 'Social',
    iconUrl: 'https://logo.clearbit.com/x.com',
    config: {
      width: 1200, height: 900,
      adBlocking: true,
      internalUrls: 'https?://.*\\.x\\.com.*|https?://.*\\.twitter\\.com.*',
    },
  },
  {
    id: 'reddit',
    name: 'Reddit',
    url: 'https://www.reddit.com',
    description: 'Reddit without browser clutter',
    category: 'Social',
    iconUrl: 'https://logo.clearbit.com/reddit.com',
    config: {
      width: 1200, height: 900,
      adBlocking: true,
    },
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com',
    description: 'LinkedIn professional network',
    category: 'Social',
    iconUrl: 'https://logo.clearbit.com/linkedin.com',
    config: { width: 1200, height: 900 },
  },

  // ── Finance ───────────────────────────────────────────────────────────────
  {
    id: 'coinmarketcap',
    name: 'CoinMarketCap',
    url: 'https://coinmarketcap.com',
    description: 'Cryptocurrency market data',
    category: 'Finance',
    iconUrl: 'https://logo.clearbit.com/coinmarketcap.com',
    config: { width: 1400, height: 900, adBlocking: true },
  },
  {
    id: 'tradingview',
    name: 'TradingView',
    url: 'https://www.tradingview.com',
    description: 'Financial charting and trading platform',
    category: 'Finance',
    iconUrl: 'https://logo.clearbit.com/tradingview.com',
    config: { width: 1600, height: 1000, adBlocking: true },
  },

  // ── Design ────────────────────────────────────────────────────────────────
  {
    id: 'figma',
    name: 'Figma',
    url: 'https://www.figma.com',
    description: 'Figma collaborative design (lighter than the electron app)',
    category: 'Design',
    iconUrl: 'https://logo.clearbit.com/figma.com',
    config: {
      width: 1600, height: 1000,
      singleInstance: true,
      internalUrls: 'https?://.*\\.figma\\.com.*',
    },
  },
  {
    id: 'canva',
    name: 'Canva',
    url: 'https://www.canva.com',
    description: 'Graphic design platform',
    category: 'Design',
    iconUrl: 'https://logo.clearbit.com/canva.com',
    config: { width: 1400, height: 900 },
  },

  // ── News ──────────────────────────────────────────────────────────────────
  {
    id: 'hn',
    name: 'Hacker News',
    url: 'https://news.ycombinator.com',
    description: 'Y Combinator tech news aggregator',
    category: 'News',
    iconUrl: 'https://logo.clearbit.com/ycombinator.com',
    config: { width: 1000, height: 900 },
  },

  // ── Education ─────────────────────────────────────────────────────────────
  {
    id: 'duolingo',
    name: 'Duolingo',
    url: 'https://www.duolingo.com',
    description: 'Language-learning platform',
    category: 'Education',
    iconUrl: 'https://logo.clearbit.com/duolingo.com',
    config: { width: 1000, height: 700, singleInstance: true },
  },
  {
    id: 'udemy',
    name: 'Udemy',
    url: 'https://www.udemy.com',
    description: 'Online courses and learning',
    category: 'Education',
    iconUrl: 'https://logo.clearbit.com/udemy.com',
    config: { width: 1280, height: 800 },
  },
]

export function getTemplateById(id: string): AppTemplate | undefined {
  return APP_TEMPLATES.find((t) => t.id === id)
}

export function getTemplatesByCategory(category: string): AppTemplate[] {
  return APP_TEMPLATES.filter((t) => t.category === category)
}

export const TEMPLATE_CATEGORIES = [
  ...new Set(APP_TEMPLATES.map((t) => t.category)),
] as const
