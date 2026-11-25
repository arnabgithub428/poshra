import { useLang } from '../lib/i18n'

export default function LangToggle() {
  const { lang, toggle } = useLang()
  return (
    <button
      onClick={toggle}
      aria-label={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
      className="grid size-11 place-items-center rounded-xl border border-line bg-surface text-sm font-bold"
    >
      {lang === 'bn' ? 'EN' : 'বাং'}
    </button>
  )
}