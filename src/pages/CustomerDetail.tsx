import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { db } from '../db/db'
import { useLang } from '../lib/i18n'
import { useProfile } from '../lib/profile'
import { fmtDate, toNum, todayISO } from '../lib/utils'

export default function CustomerDetail() {
  const { id } = useParams()
  const cid = Number(id)
  const { L, n, lang } = useLang()
  const { shopName } = useProfile()
  const [paid, setPaid] = useState('')
  const [error, setError] = useState('')

  const c = useLiveQuery(() => db.customers.get(cid), [cid])
  const txns = useLiveQuery(
    async () => (await db.txns.where('customerId').equals(cid).sortBy('createdAt')).reverse(),
    [cid]
  )

  if (!c) {
    return (
      <main className="p-4 md:p-8">
        <Link to="/app/customers" className="underline">{L('← ফিরে যান', '← Go back')}</Link>
      </main>
    )
  }

  const overdue = c.due > 0 && !!c.dueDate && c.dueDate < todayISO()

  async function receive(e: React.FormEvent) {
    e.preventDefault()
    const amount = Math.min(toNum(paid), c!.due)
    if (amount <= 0) {
      setError(L('সঠিক টাকার অঙ্ক দিন', 'Enter a valid amount'))
      return
    }
    setError('')

    await db.transaction('rw', db.customers, db.txns, async () => {
      const fresh = await db.customers.get(cid)
      if (!fresh) return
      const pay = Math.min(amount, fresh.due)
      const newDue = fresh.due - pay
      await db.txns.add({ customerId: cid, type: 'payment', amount: pay, createdAt: Date.now(), synced: 0 })
      await db.customers.update(cid, { due: newDue, dueDate: newDue > 0 ? fresh.dueDate : undefined })
    })
    setPaid('')
  }

  const smsText = L(
    `আসসালামু আলাইকুম ${c.name}, ${shopName || 'দোকান'}-এ আপনার ৳${n(c.due)} বাকি আছে।${
      c.dueDate ? ` অনুগ্রহ করে ${fmtDate(c.dueDate, 'bn')}-এর মধ্যে পরিশোধ করবেন।` : ''
    } ধন্যবাদ।`,
    `Hello ${c.name}, you have ৳${n(c.due)} due at ${shopName || 'our shop'}.${
      c.dueDate ? ` Please pay by ${fmtDate(c.dueDate, 'en')}.` : ''
    } Thank you.`
  )

  const field = 'rounded-xl border border-line bg-bg p-3'

  return (
    <main className="p-4 md:p-8">
      <Link to="/app/customers" className="mb-4 flex h-11 w-fit items-center gap-2 rounded-xl border border-line bg-surface px-4 font-medium">
        <ArrowLeft size={18} />
        {L('ফিরে যান', 'Back')}
      </Link>

      <h1 className="text-2xl font-bold md:text-3xl">{c.name}</h1>
      {c.phone && <p className="text-muted">{c.phone}</p>}

      <div className="mt-5 rounded-2xl bg-brand p-6 text-white">
        <p className="text-sm opacity-80">{L('মোট বাকি', 'Total due')}</p>
        <p className="text-4xl font-bold">৳ {n(c.due)}</p>
        {c.due > 0 && c.dueDate && (
          <p className={`mt-1 text-sm ${overdue ? 'font-bold text-amber' : 'opacity-85'}`}>
            {overdue ? L('মেয়াদ শেষ: ', 'Overdue: ') : L('শেষ তারিখ: ', 'Due by: ')}
            {fmtDate(c.dueDate, lang)}
          </p>
        )}
      </div>

      {c.due > 0 ? (
        <form onSubmit={receive} className="mt-4 flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 md:flex-row">
          <input
            className={`${field} md:flex-1`}
            placeholder={L('কত টাকা পেলেন', 'Amount received')}
            inputMode="decimal"
            value={paid}
            onChange={e => setPaid(e.target.value)}
          />
          <button className="rounded-xl bg-amber p-3 text-lg font-bold text-[#17402A] md:px-8">
            {L('টাকা পেলাম', 'Received')}
          </button>
          <button
            type="button"
            onClick={() => setPaid(String(c.due))}
            className="rounded-xl border border-line bg-bg p-3 font-medium md:px-5"
          >
            {L('পুরোটা', 'Full amount')}
          </button>
        </form>
      ) : (
        <p className="mt-4 rounded-2xl bg-sand p-4 font-medium">{L('কোনো বাকি নেই', 'Nothing due')}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {c.phone && c.due > 0 && (
        <a
          href={`sms:${c.phone}?body=${encodeURIComponent(smsText)}`}
          className="mt-3 flex h-12 w-fit items-center gap-2 rounded-xl border border-brand px-5 font-medium"
        >
          <MessageSquare size={18} />
          {L('SMS-এ তাগাদা দিন', 'Send SMS reminder')}
        </a>
      )}

      <h2 className="mt-8 text-xl font-bold">{L('লেনদেনের ইতিহাস', 'History')}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {txns?.map(t => (
          <li key={t.id} className="flex items-start justify-between gap-3 rounded-xl border border-line bg-surface p-4">
            <div className="min-w-0">
              <p className="font-medium">{t.type === 'due' ? L('বাকি দেওয়া হয়েছে', 'Credit given') : L('টাকা পাওয়া গেছে', 'Payment received')}</p>
              {t.items && (
                <p className="text-sm text-muted">{t.items.map(i => `${i.name} × ${n(i.qty)}`).join(', ')}</p>
              )}
              <p className="text-xs text-muted">{new Date(t.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB')}</p>
            </div>
            <b className={t.type === 'payment' ? 'text-brand' : ''}>
              {t.type === 'payment' ? '−' : '+'} ৳ {n(t.amount)}
            </b>
          </li>
        ))}
      </ul>
      {txns?.length === 0 && <p className="mt-3 text-muted">{L('এখনো কোনো লেনদেন নেই', 'No transactions yet')}</p>}
    </main>
  )
}