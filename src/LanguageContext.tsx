import React, { createContext, useState, useContext, useEffect } from 'react'
import { translations, Language } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.de
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialisiere mit Browser-Sprache oder Deutsch als Fallback
  const getBrowserLanguage = (): Language => {
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('en')) return 'en'
    return 'de'
  }

  // Lade gespeicherte Sprache oder nutze Browser-Sprache
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language
    return savedLang || getBrowserLanguage()
  })

  // Speichere Sprache bei Änderung
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const value = {
    language,
    setLanguage,
    t: translations[language],
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

