import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, X } from 'lucide-react'
import { db } from '../db/db'
import { useLang } from '../lib/i18n'
import { useProfile } from '../lib/profile'
import { fmtDate, todayISO } from '../lib/utils'
import EntryForm from '../components/EntryForm'
import { Link } from 'react-router-dom'

export default function Customers() {
    const { L, n, lang } = useLang()
    const { role } = useProfile()
    const isDealer = role === 'dealer'
    const [open, setOpen] = useState(false)
    const today = todayISO()

    const list = useLiveQuery(() => db.customers.toArray(), [])
    const sorted = list?.slice().sort((a, b) => b.due - a.due)

    return (
        <main className="p-4 md:p-8">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold md:text-3xl">
                    {isDealer ? L('দোকানসমূহ', 'Shops') : L('কাস্টমার', 'Customers')}
                </h1>
                <button
                    onClick={() => setOpen(o => !o)}
                    className="flex h-11 items-center gap-2 rounded-xl bg-brand px-4 font-bold text-white"
                >
                    {open ? <X size={18} /> : <Plus size={18} />}
                    {open ? L('বন্ধ করুন', 'Close') : L('নতুন এন্ট্রি', 'New entry')}
                </button>
            </div>

            {open && <EntryForm onSaved={() => setOpen(false)} />}

            <ul className="mt-6 grid gap-2 md:grid-cols-2">
                {sorted?.map(c => {
                    const overdue = c.due > 0 && !!c.dueDate && c.dueDate < today
                    return (
                        <li key={c.id}>
                            <Link
                                to={`/app/customers/${c.id}`}
                                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4 hover:border-brand"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium">{c.name}</p>
                                    {c.phone && <p className="text-sm text-muted">{c.phone}</p>}
                                    {c.due > 0 && c.dueDate && (
                                        <p className={`text-sm ${overdue ? 'font-bold text-red-500' : 'text-muted'}`}>
                                            {overdue ? L('মেয়াদ শেষ: ', 'Overdue: ') : L('শেষ তারিখ: ', 'Due by: ')}
                                            {fmtDate(c.dueDate, lang)}
                                        </p>
                                    )}
                                </div>
                                <span className="text-lg font-bold">৳ {n(c.due)}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            {sorted?.length === 0 && (
                <p className="mt-10 text-center text-muted">
                    {L('এখনো কোনো এন্ট্রি নেই। "নতুন এন্ট্রি" চাপুন।', 'No entries yet. Tap "New entry".')}
                </p>
            )}
        </main>
    )
}