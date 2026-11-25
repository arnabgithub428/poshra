import { Link } from 'react-router-dom'
import { useLang } from '../../lib/i18n'

export default function Hero() {
  const { L, n } = useLang()

  const sample = [
    { name: L('করিম স্টোর', 'Karim Store'), due: 2400 },
    { name: L('রহিমা বেগম', 'Rahima Begum'), due: 850 },
    { name: L('সালাম ভাই', 'Salam Bhai'), due: 1200 },
  ]

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
      <div className="flex flex-col gap-5">
        <span className="w-fit rounded-full bg-sand px-4 py-1.5 text-sm font-medium">
          {L('ছোট দোকানদারদের জন্য ডিজিটাল খাতা', 'A digital khata for small shopkeepers')}
        </span>
        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          {L('আপনার দোকানের হিসাব, এখন হাতের মুঠোয়', 'Your shop’s accounts, now in your hand')}
        </h1>
        <p className="text-lg leading-relaxed text-muted md:text-xl">
          {L(
            'বাকি, বিক্রি আর স্টকের হিসাব রাখুন সহজে। ইন্টারনেট না থাকলেও চলবে, সব বাংলায়।',
            'Track dues, sales and stock with ease. Works even without internet, fully in Bangla.'
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/signup" className="flex h-[52px] items-center rounded-2xl bg-brand px-7 text-lg font-bold text-white">
            {L('বিনামূল্যে শুরু করুন', 'Start for free')}
          </Link>
          <Link to="/app" className="flex h-[52px] items-center rounded-2xl border border-brand px-7 text-lg font-medium">
            {L('ডেমো দেখুন', 'See demo')}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl bg-brand p-6 text-white">
        <p className="text-sm opacity-85">{L('মোট বাকি', 'Total due')}</p>
        <p className="text-5xl font-bold">৳ {n(12500)}</p>
        {sample.map(s => (
          <div key={s.name} className="flex justify-between rounded-xl bg-surface p-4 text-ink">
            <span>{s.name}</span>
            <b>৳ {n(s.due)}</b>
          </div>
        ))}
      </div>
    </section>
  )
}