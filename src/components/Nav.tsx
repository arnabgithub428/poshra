import { Link, NavLink } from 'react-router-dom'
import { useLang } from '../lib/i18n'
import { useProfile } from '../lib/profile'

export default function Nav() {
    const { L } = useLang()
    const { role } = useProfile()

    const tabs = [
        { to: '/app', label: L('হোম', 'Home') },
        { to: '/app/customers', label: role === 'dealer' ? L('দোকান', 'Shops') : L('খাতা', 'Khata') },
    ]

    return (
        <nav className="fixed bottom-0 left-0 z-10 flex w-full border-t border-line bg-surface md:top-0 md:w-56 md:flex-col md:gap-2 md:border-r md:border-t-0 md:p-4">
            <Link to="/" className="mb-6 hidden text-3xl font-bold md:block">
                {L('পসরা', 'Poshra')}
            </Link>

            {tabs.map(t => (
                <NavLink
                    key={t.to}
                    to={t.to}
                    end={t.to === '/app'}
                    className={({ isActive }: { isActive: boolean }) =>
                        `flex-1 py-4 text-center text-lg font-medium md:flex-none md:rounded-xl md:px-4 md:text-left ${isActive ? 'bg-brand text-white' : 'text-ink hover:bg-ink/10'
                        }`
                    }
                >
                    {t.label}
                </NavLink>
            ))}
        </nav>
    )
}