import { useLang } from '../../lib/i18n'

export default function Audience() {
    const { L } = useLang()
    const types = [
        L('মুদি দোকান', 'Grocery'),
        L('ফার্মেসি', 'Pharmacy'),
        L('টেইলার্স', 'Tailor'),
        L('মোবাইল শপ', 'Mobile shop'),
        L('চায়ের দোকান', 'Tea stall'),
        L('হোম বিজনেস', 'Home business'),
        L('ডিলার / পরিবেশক', 'Dealer / distributor'),
    ]

    return (
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
                {L('দোকানদার থেকে ডিলার, সবার জন্য', 'For shopkeepers and dealers alike')}
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                {types.map(t => (
                    <span key={t} className="rounded-full border border-line bg-surface px-5 py-2 font-medium">{t}</span>
                ))}
            </div>
        </section>
    )
}