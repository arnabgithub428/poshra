import { useLang } from '../../lib/i18n'

export default function Faq() {
    const { L } = useLang()

    const faqs = [
        {
            q: L('ইন্টারনেট না থাকলে কি চলবে?', 'Does it work without internet?'),
            a: L('হ্যাঁ। ডেটা আপনার ফোনেই সেভ হয়, নেট এলে সিঙ্ক হবে।', 'Yes. Data is saved on your phone and syncs when you are back online.'),
        },
        {
            q: L('পসরা কি ফ্রি?', 'Is Poshra free?'),
            a: L('বেসিক বাকির খাতা সম্পূর্ণ ফ্রি। অতিরিক্ত সুবিধার জন্য প্রিমিয়াম আছে।', 'The basic due ledger is completely free. Premium adds extra features.'),
        },
        {
            q: L('আমার ডেটা কি নিরাপদ?', 'Is my data safe?'),
            a: L('আপনার হিসাব শুধু আপনিই দেখতে পাবেন।', 'Only you can see your accounts.'),
        },
        {
            q: L('ফোনে কীভাবে ইনস্টল করব?', 'How do I install it on my phone?'),
            a: L('ব্রাউজার থেকে "Add to Home Screen" চাপলেই অ্যাপের মতো ব্যবহার করা যাবে।', 'Tap "Add to Home Screen" in your browser and use it like an app.'),
        },
    ]

    return (
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 md:px-8">
            <h2 className="text-center text-3xl font-bold">{L('সাধারণ প্রশ্নোত্তর', 'Frequently asked questions')}</h2>
            <div className="mt-8 flex flex-col gap-3">
                {faqs.map(f => (
                    <details key={f.q} className="rounded-2xl border border-line bg-surface p-5">
                        <summary className="cursor-pointer text-lg font-medium">{f.q}</summary>
                        <p className="mt-3 text-muted">{f.a}</p>
                    </details>
                ))}
            </div>
        </section>
    )
}