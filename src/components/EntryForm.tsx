import { useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { db, type Item } from '../db/db'
import { useLang } from '../lib/i18n'
import { useProfile } from '../lib/profile'
import { inDays, toNum } from '../lib/utils'

interface Row {
    id: number
    name: string
    qty: string
    price: string
}

const qtyOf = (r: Row) => toNum(r.qty) || 1

export default function EntryForm({ onSaved }: { onSaved: () => void }) {
    const { L, n } = useLang()
    const { role } = useProfile()
    const isDealer = role === 'dealer'

    const nextId = useRef(1)
    const newRow = (): Row => ({ id: nextId.current++, name: '', qty: '1', price: '' })

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [rows, setRows] = useState<Row[]>(() => [newRow()])
    const [dueDate, setDueDate] = useState('')
    const [paid, setPaid] = useState('')
    const [error, setError] = useState('')

    const total = rows.reduce((s, r) => s + qtyOf(r) * toNum(r.price), 0)
    const field = 'rounded-xl border border-line bg-bg p-3'

    const update = (id: number, patch: Partial<Row>) =>
        setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)))

    async function save(e: React.FormEvent) {
        e.preventDefault()

        const items: Item[] = rows
            .filter(r => r.name.trim() && toNum(r.price) > 0)
            .map(r => ({ name: r.name.trim(), qty: qtyOf(r), price: toNum(r.price) }))

        if (!name.trim() || items.length === 0) {
            setError(L('নাম আর অন্তত একটি পণ্যের দাম দিন', 'Enter a name and at least one product with a price'))
            return
        }

        const sum = items.reduce((s, i) => s + i.qty * i.price, 0)
        const paidNow = Math.min(toNum(paid), sum)
        const nameT = name.trim()
        const phoneT = phone.trim()

        await db.transaction('rw', db.customers, db.txns, async () => {
            const existing = phoneT
                ? await db.customers.where('phone').equals(phoneT).first()
                : await db.customers.where('name').equals(nameT).first()

            const id: number =
                existing?.id ?? ((await db.customers.add({ name: nameT, phone: phoneT, due: 0, createdAt: Date.now() })) as number)

            const now = Date.now()
            await db.txns.add({ customerId: id, type: 'due', items, amount: sum, dueDate: dueDate || undefined, createdAt: now, synced: 0 })
            if (paidNow > 0) {
                await db.txns.add({ customerId: id, type: 'payment', amount: paidNow, createdAt: now, synced: 0 })
            }

            const newDue = (existing?.due ?? 0) + sum - paidNow
            await db.customers.update(id, {
                due: newDue,
                dueDate: newDue > 0 ? dueDate || existing?.dueDate : undefined,
            })
        })

        onSaved()
    }

    return (
        <form onSubmit={save} className="mt-4 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 md:p-6">
            <div className="grid gap-2 md:grid-cols-2">
                <input
                    className={field}
                    placeholder={isDealer ? L('দোকানের নাম', 'Shop name') : L('কাস্টমারের নাম', 'Customer name')}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    className={field}
                    placeholder={L('ফোন নম্বর', 'Phone number')}
                    inputMode="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-bold">{L('কোন পণ্য নিয়েছে', 'Products taken')}</p>
                {rows.map(r => (
                    <div key={r.id} className="grid grid-cols-[1fr_4rem_5.5rem_2.5rem] gap-2">
                        <input className={field} placeholder={L('পণ্যের নাম', 'Product')} value={r.name} onChange={e => update(r.id, { name: e.target.value })} />
                        <input className={field} placeholder={L('পরিমাণ', 'Qty')} inputMode="decimal" value={r.qty} onChange={e => update(r.id, { qty: e.target.value })} />
                        <input className={field} placeholder={L('দাম', 'Price')} inputMode="decimal" value={r.price} onChange={e => update(r.id, { price: e.target.value })} />
                        <button
                            type="button"
                            aria-label={L('পণ্য বাদ দিন', 'Remove product')}
                            disabled={rows.length === 1}
                            onClick={() => setRows(rs => rs.filter(x => x.id !== r.id))}
                            className="grid place-items-center rounded-xl border border-line disabled:opacity-30"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setRows(rs => [...rs, newRow()])}
                    className="flex h-11 w-fit items-center gap-2 rounded-xl border border-brand px-4 font-medium"
                >
                    <Plus size={18} />
                    {L('আরেকটি পণ্য', 'Add another product')}
                </button>
            </div>

            <div className="flex justify-between rounded-xl bg-sand p-4 text-lg font-bold">
                <span>{L('মোট', 'Total')}</span>
                <span>৳ {n(total)}</span>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-bold">{L('পরিশোধের শেষ তারিখ', 'Pay-by date')}</p>
                <input type="date" className={field} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                <div className="flex flex-wrap gap-2">
                    {[7, 15, 30].map(d => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => setDueDate(inDays(d))}
                            className="rounded-full border border-line bg-bg px-4 py-1.5 text-sm font-medium"
                        >
                            {L(`${n(d)} দিন`, `${d} days`)}
                        </button>
                    ))}
                </div>
            </div>

            <input
                className={field}
                placeholder={L('এখন কত টাকা দিল (ঐচ্ছিক)', 'Paid now (optional)')}
                inputMode="decimal"
                value={paid}
                onChange={e => setPaid(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button className="rounded-xl bg-amber p-3 text-lg font-bold text-[#17402A]">
                {L('যোগ করুন', 'Save')}
            </button>
        </form>
    )
}