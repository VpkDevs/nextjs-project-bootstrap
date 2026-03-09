'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import AppCreator from '@/components/AppCreator'
import AppLibrary from '@/components/AppLibrary'
import TemplateGallery from '@/components/TemplateGallery'
import SettingsPanel from '@/components/SettingsPanel'
import type { AppTemplate } from '@/types'

export type ActiveView = 'create' | 'library' | 'templates' | 'settings'

export default function Home() {
  const [view, setView] = useState<ActiveView>('create')
  const [prefillTemplate, setPrefillTemplate] = useState<AppTemplate | null>(null)

  function handleUseTemplate(template: AppTemplate) {
    setPrefillTemplate(template)
    setView('create')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={view} onNavigate={setView} />

      <main className="flex-1 overflow-y-auto">
        {view === 'create' && (
          <AppCreator
            key={prefillTemplate?.id ?? 'blank'}
            template={prefillTemplate}
            onCreated={() => setView('library')}
          />
        )}
        {view === 'library' && (
          <AppLibrary onEditApp={(id) => { void id; setView('create') }} />
        )}
        {view === 'templates' && (
          <TemplateGallery onUseTemplate={handleUseTemplate} />
        )}
        {view === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
}
