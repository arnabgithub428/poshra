import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Lang = 'bn' | 'en'

interface Ctx {
    lang: Lang
    toggle: () => void
    L: (bn: string, en: string) => string
    n: (value: number) => string
}

const LangContext = createContext<Ctx | null>(null)

function initial(): Lang {
    try {
        const saved = localStorage.getItem('lang')
        if (saved === 'bn' || saved === 'en') return saved
    } catch {
        /* storage blocked */
    }
    return 'bn'
}

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>(initial)

    useEffect(() => {
        document.documentElement.lang = lang
        try {
            localStorage.setItem('lang', lang)
        } catch {
            /* ignore */
        }
    }, [lang])

    const value: Ctx = {
        lang,
        toggle: () => setLang(l => (l === 'bn' ? 'en' : 'bn')),
        L: (bn, en) => (lang === 'bn' ? bn : en),
        n: v => v.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US'),
    }

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
    const ctx = useContext(LangContext)
    if (!ctx) throw new Error('useLang must be used inside LangProvider')
    return ctx
}