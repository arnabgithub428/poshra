import { Link, Outlet } from 'react-router-dom'
import Nav from '../components/Nav'
import LangToggle from '../components/LangToggle'
import { useLang } from '../lib/i18n'
import { useProfile } from '../lib/profile'

export default function AppLayout() {
    const { L } = useLang()
    const { role, shopName } = useProfile()

    return (
        <div className="min-h-screen pb-20 md:pb-0 md:pl-56">
            <div className="mx-auto w-full max-w-5xl">
                <div className="flex items-center justify-between gap-3 px-4 pt-4 md:px-8">
                    <div className="min-w-0">
                        <p className="truncate font-bold">{shopName || L('আমার দোকান', 'My shop')}</p>
                        <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium">
                            {role === 'dealer' ? L('ডিলার', 'Dealer') : L('দোকানদার', 'Shopkeeper')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <LangToggle />
                        <Link to="/login" className="flex h-11 items-center rounded-xl border border-line bg-surface px-4 text-sm font-medium">
                            {L('লগ আউট', 'Log out')}
                        </Link>
                    </div>
                </div>
                <Outlet />
            </div>
            <Nav />
        </div>
    )
}