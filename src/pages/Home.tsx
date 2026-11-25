import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import { useLang } from '../lib/i18n'
import { useProfile } from '../lib/profile'
import { fmtDate, todayISO } from '../lib/utils'

export default function Home() {
    const { L, n, lang } = useLang()
    const { role, shopName } = useProfile()
    const isDealer = role === 'dealer'

    const customers = useLiveQuery(() => db.customers.toArray(), [])
    const today = todayISO()

    const totalDue = customers?.reduce((s, c) => s + c.due, 0) ?? 0
    const overdue = (customers ?? []).filter(c => c.due > 0 && c.dueDate && c.dueDate < today)

    return (
        <main className="p-4 md:p-8">
            <h1 className="text-3xl font-bold">{shopName || L('ড্যাশবোর্ড', 'Dashboard')}</h1>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-brand p-6 text-white">
                    <p className="text-sm opacity-80">{isDealer ? L('মোট পাওনা', 'Total receivable') : L('মোট বাকি', 'Total due')}</p>
                    <p className="text-4xl font-bold">৳ {n(totalDue)}</p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-6">
                    <p className="text-sm opacity-80">{isDealer ? L('মোট দোকান', 'Total shops') : L('মোট কাস্টমার', 'Total customers')}</p>
                    <p className="text-4xl font-bold">{n(customers?.length ?? 0)}</p>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-6">
                    <p className="text-sm opacity-80">{L('মেয়াদ পেরিয়েছে', 'Overdue')}</p>
                    <p className="text-4xl font-bold text-red-500">{n(overdue.length)}</p>
                </div>
            </div>

            {overdue.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-xl font-bold">{L('এখনই তাগাদা দিন', 'Follow up now')}</h2>
                    <ul className="mt-3 grid gap-2 md:grid-cols-2">
                        {overdue.map(c => (
                            <li key={c.id} className="flex items-center justify-between rounded-xl border border-line bg-surface p-4">
                                <div>
                                    <p className="font-medium">{c.name}</p>
                                    <p className="text-sm font-bold text-red-500">
                                        {L('শেষ তারিখ ছিল ', 'Was due ')}
                                        {fmtDate(c.dueDate!, lang)}
                                    </p>
                                </div>
                                <b>৳ {n(c.due)}</b>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </main>
    )
}