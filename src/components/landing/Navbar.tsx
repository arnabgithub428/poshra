import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../../lib/useTheme'
import { useLang } from '../../lib/i18n'
import LangToggle from '../LangToggle'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const { theme, toggle } = useTheme()
    const { L } = useLang()

    const links = [
        { href: '#features', label: L('ফিচার', 'Features') },
        { href: '#how', label: L('কীভাবে কাজ করে', 'How it works') },
        { href: '#pricing', label: L('মূল্য', 'Pricing') },
        { href: '#faq', label: L('প্রশ্নোত্তর', 'FAQ') },
    ]

    return (
        <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
                <Link to="/" className="text-2xl font-bold">{L('পসরা', 'Poshra')}</Link>

                <nav className="hidden gap-8 md:flex">
                    {links.map(l => (
                        <a key={l.href} href={l.href} className="font-medium hover:text-amber">{l.label}</a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <LangToggle />
                    <button
                        onClick={toggle}
                        aria-label={L('দিন বা রাত মোড বদলান', 'Toggle light or dark mode')}
                        className="grid size-11 place-items-center rounded-xl border border-line bg-surface"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link to="/login" className="hidden h-11 items-center rounded-xl border border-brand px-5 font-medium sm:flex">
                        {L('লগ ইন', 'Log in')}
                    </Link>
                    <Link to="/signup" className="hidden h-11 items-center rounded-xl bg-amber px-5 font-bold text-[#17402A] sm:flex">
                        {L('সাইন আপ', 'Sign up')}
                    </Link>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label={L('মেনু', 'Menu')}
                        className="grid size-11 place-items-center rounded-xl border border-line md:hidden"
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="flex flex-col gap-1 border-t border-line bg-bg px-4 py-3 md:hidden">
                    {links.map(l => (
                        <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-lg font-medium">
                            {l.label}
                        </a>
                    ))}
                    <div className="mt-2 flex gap-2 sm:hidden">
                        <Link to="/login" className="flex h-12 flex-1 items-center justify-center rounded-xl border border-brand font-medium">{L('লগ ইন', 'Log in')}</Link>
                        <Link to="/signup" className="flex h-12 flex-1 items-center justify-center rounded-xl bg-amber font-bold text-[#17402A]">{L('সাইন আপ', 'Sign up')}</Link>
                    </div>
                </div>
            )}
        </header>
    )
}