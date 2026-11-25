import { BookOpen, Boxes, Mic, BarChart3, WifiOff, Bell } from 'lucide-react'
import { useLang } from '../../lib/i18n'

export default function Features() {
    const { L } = useLang()

    const items = [
        { icon: BookOpen, title: L('বাকির খাতা', 'Due ledger'), text: L('কার কত বাকি, এক নজরে দেখুন।', 'See who owes how much at a glance.') },
        { icon: Bell, title: L('অটো রিমাইন্ডার', 'Auto reminders'), text: L('বাকির জন্য কাস্টমারকে SMS পাঠান।', 'Send customers an SMS about their dues.') },
        { icon: Boxes, title: L('স্টক অ্যালার্ট', 'Stock alerts'), text: L('মাল কমে গেলে আগে থেকেই জানুন।', 'Know before your stock runs out.') },
        { icon: Mic, title: L('বলে এন্ট্রি', 'Voice entry'), text: L('টাইপ নয়, বাংলায় বললেই হিসাব লেখা হবে।', 'Just speak in Bangla and the entry is written.') },
        { icon: BarChart3, title: L('সাপ্তাহিক রিপোর্ট', 'Weekly report'), text: L('কোন পণ্যে লাভ বেশি, প্রতি সপ্তাহে জানুন।', 'Find out each week which products earn the most.') },
        { icon: WifiOff, title: L('অফলাইনে চলে', 'Works offline'), text: L('নেট না থাকলেও খাতা লেখা বন্ধ হবে না।', 'Keep writing your khata even without internet.') },
    ]

    return (
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:px-8">
            <h2 className="text-center text-3xl font-bold">
                {L('দোকান চালানোর সব সুবিধা এক জায়গায়', 'Everything to run your shop, in one place')}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="rounded-2xl border border-line bg-surface p-7">
                        <Icon className="text-amber" size={28} />
                        <h3 className="mt-3 text-xl font-bold">{title}</h3>
                        <p className="mt-2 leading-relaxed text-muted">{text}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}