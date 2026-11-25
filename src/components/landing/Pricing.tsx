import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useLang } from '../../lib/i18n'

export default function Pricing() {
    const { L, n } = useLang()

    const plans = [
        {
            name: L('ফ্রি', 'Free'),
            price: `৳ ${n(0)}`,
            note: L('সবসময়', 'forever'),
            features: [L('বাকির খাতা', 'Due ledger'), L('কাস্টমার তালিকা', 'Customer list'), L('অফলাইন সাপোর্ট', 'Offline support')],
            highlight: false,
        },
        {
            name: L('প্রিমিয়াম', 'Premium'),
            price: `৳ ${n(300)}`,
            note: L('প্রতি মাসে', 'per month'),
            features: [
                L('ফ্রি-র সব কিছু', 'Everything in Free'),
                L('অটো SMS রিমাইন্ডার', 'Auto SMS reminders'),
                L('স্টক অ্যালার্ট', 'Stock alerts'),
                L('সাপ্তাহিক রিপোর্ট', 'Weekly report'),
            ],
            highlight: true,
        },
    ]

    return (
        <section id="pricing" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 md:px-8">
            <h2 className="text-center text-3xl font-bold">{L('সহজ মূল্য', 'Simple pricing')}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {plans.map(p => (
                    <div
                        key={p.name}
                        className={`flex flex-col gap-4 rounded-3xl p-8 ${p.highlight ? 'bg-brand text-white' : 'border border-line bg-surface'}`}
                    >
                        <h3 className="text-xl font-bold">{p.name}</h3>
                        <p className="text-4xl font-bold">
                            {p.price} <span className="text-base font-normal opacity-80">{p.note}</span>
                        </p>
                        <ul className="flex flex-col gap-2">
                            {p.features.map(f => (
                                <li key={f} className="flex items-center gap-2"><Check size={18} /> {f}</li>
                            ))}
                        </ul>
                        <Link
                            to="/signup"
                            className={`mt-2 flex h-12 items-center justify-center rounded-xl font-bold ${p.highlight ? 'bg-amber text-[#17402A]' : 'border border-brand'}`}
                        >
                            {L('শুরু করুন', 'Get started')}
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}