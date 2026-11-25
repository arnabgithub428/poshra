import { Link } from 'react-router-dom'
import { useLang } from '../../lib/i18n'

export default function Cta() {
    const { L } = useLang()
    return (
        <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
            <div className="flex flex-col items-center gap-4 rounded-3xl bg-brand px-6 py-12 text-center text-white">
                <h2 className="text-3xl font-bold">{L('আজই পসরা দিয়ে হিসাব শুরু করুন', 'Start your accounts with Poshra today')}</h2>
                <p className="opacity-90">{L('বেসিক খাতা সম্পূর্ণ ফ্রি।', 'The basic ledger is completely free.')}</p>
                <Link to="/signup" className="flex h-[52px] items-center rounded-2xl bg-amber px-8 text-lg font-bold text-[#17402A]">
                    {L('বিনামূল্যে সাইন আপ', 'Sign up for free')}
                </Link>
            </div>
        </section>
    )
}