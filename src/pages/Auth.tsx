import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useLang } from '../lib/i18n'
import LangToggle from '../components/LangToggle'
import { saveProfile, type Role } from '../lib/profile'

interface Account {
  role: Role
  name: string
  shopName: string
  category?: string
  phone: string
  password: string
}

const ACC_KEY = 'accounts'

function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACC_KEY)
    if (raw) return JSON.parse(raw) as Account[]
  } catch {
    /* ignore */
  }
  return []
}

function saveAccounts(list: Account[]) {
  try {
    localStorage.setItem(ACC_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

const BN = '০১২৩৪৫৬৭৮৯'
const normPhone = (s: string) =>
  s.replace(/[০-৯]/g, d => String(BN.indexOf(d))).replace(/[^\d]/g, '')

const cats = [
  { key: 'grocery', bn: 'মুদি দোকান', en: 'Grocery' },
  { key: 'pharmacy', bn: 'ফার্মেসি', en: 'Pharmacy' },
  { key: 'tailor', bn: 'টেইলার্স', en: 'Tailor' },
  { key: 'mobile', bn: 'মোবাইল শপ', en: 'Mobile shop' },
  { key: 'tea', bn: 'চায়ের দোকান', en: 'Tea stall' },
  { key: 'home', bn: 'হোম বিজনেস', en: 'Home business' },
  { key: 'other', bn: 'অন্যান্য', en: 'Other' },
]

const input = 'rounded-xl border border-line bg-bg p-3'

interface RoleOptionProps {
  active: boolean
  onClick: () => void
  title: string
  hint: string
}

function RoleOption({ active, onClick, title, hint }: RoleOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`flex items-start gap-3 rounded-2xl border p-4 text-left ${
        active ? 'border-brand bg-sand' : 'border-line bg-bg'
      }`}
    >
      <span
        className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 ${
          active ? 'border-brand' : 'border-line'
        }`}
      >
        {active && <span className="size-2.5 rounded-full bg-brand" />}
      </span>
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
    </button>
  )
}

interface PasswordInputProps {
  value: string
  onChange: (v: string) => void
  placeholder: string
}

function PasswordInput({ value, onChange, placeholder }: PasswordInputProps) {
  const { L } = useLang()
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        className={`${input} w-full pr-12`}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        aria-label={show ? L('পাসওয়ার্ড লুকান', 'Hide password') : L('পাসওয়ার্ড দেখান', 'Show password')}
        className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const isLogin = mode === 'login'
  const { L } = useLang()
  const navigate = useNavigate()

  const [role, setRole] = useState<Role>('shopkeeper')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [category, setCategory] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const isDealer = role === 'dealer'
  const mismatch = !isLogin && confirm.length > 0 && password !== confirm

  function chooseRole(r: Role) {
    setRole(r)
    setCategory('')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const phoneN = normPhone(phone)
    const accounts = loadAccounts()

    if (isLogin) {
      const acc = accounts.find(
        a =>
          a.role === role &&
          a.phone === phoneN &&
          a.name.trim().toLowerCase() === name.trim().toLowerCase() &&
          a.password === password
      )
      if (!acc) {
        setError(L('নাম, নম্বর বা পাসওয়ার্ড মেলেনি', 'Name, number or password did not match'))
        return
      }
      saveProfile({ role: acc.role, shopName: acc.shopName, category: acc.category })
      navigate('/app')
      return
    }

    if (!name.trim() || !shopName.trim()) {
      setError(L('নাম আর দোকানের নাম দিন', 'Enter your name and shop name'))
      return
    }
    if (phoneN.length < 10) {
      setError(L('সঠিক ফোন নম্বর দিন', 'Enter a valid phone number'))
      return
    }
    if (password.length < 6) {
      setError(L('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'Password must be at least 6 characters'))
      return
    }
    if (password !== confirm) {
      setError(L('দুটি পাসওয়ার্ড মেলেনি', 'The two passwords do not match'))
      return
    }
    if (accounts.some(a => a.role === role && a.phone === phoneN)) {
      setError(L('এই নম্বরে আগেই অ্যাকাউন্ট আছে, লগ ইন করুন', 'An account with this number already exists, please log in'))
      return
    }

    const acc: Account = {
      role,
      name: name.trim(),
      shopName: shopName.trim(),
      category: category.trim() || undefined,
      phone: phoneN,
      password,
    }
    saveAccounts([...accounts, acc])
    saveProfile({ role, shopName: acc.shopName, category: acc.category })
    navigate('/app')
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 font-medium">
          <ArrowLeft size={18} />
          {L('হোমে ফিরুন', 'Back to home')}
        </Link>
        <LangToggle />
      </div>

      <div className="grid place-items-center px-4 py-6">
        <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-line bg-surface p-6 md:p-8">
          <Link to="/" className="text-3xl font-bold">{L('পসরা', 'Poshra')}</Link>
          <h1 className="text-xl font-bold">
            {isLogin ? L('লগ ইন', 'Log in') : L('অ্যাকাউন্ট খুলুন', 'Create an account')}
          </h1>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted">{L('আপনি কে?', 'I am a')}</p>
            <div role="radiogroup" aria-label={L('আপনি কে?', 'I am a')} className="grid gap-2">
              <RoleOption
                active={!isDealer}
                onClick={() => chooseRole('shopkeeper')}
                title={L('দোকানদার', 'Shopkeeper')}
                hint={L('কাস্টমারের বাকির হিসাব রাখব', 'Track my customers’ dues')}
              />
              <RoleOption
                active={isDealer}
                onClick={() => chooseRole('dealer')}
                title={L('ডিলার / পরিবেশক', 'Dealer / distributor')}
                hint={L('দোকানে মাল দিই, দোকানের বাকি দেখব', 'I supply shops and track what they owe')}
              />
            </div>
          </div>

          <input
            className={input}
            placeholder={L('আপনার নাম', 'Your name')}
            value={name}
            onChange={e => setName(e.target.value)}
          />

          {!isLogin && (
            <>
              <input
                className={input}
                placeholder={isDealer ? L('ব্যবসা বা এজেন্সির নাম', 'Business or agency name') : L('দোকানের নাম', 'Shop name')}
                value={shopName}
                onChange={e => setShopName(e.target.value)}
              />

              {!isDealer ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-muted">{L('দোকানের ধরন', 'Type of shop')}</p>
                  <div className="flex flex-wrap gap-2">
                    {cats.map(c => (
                      <button
                        key={c.key}
                        type="button"
                        aria-pressed={category === c.key}
                        onClick={() => setCategory(c.key)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium ${
                          category === c.key ? 'border-brand bg-brand text-white' : 'border-line bg-bg'
                        }`}
                      >
                        {L(c.bn, c.en)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <input
                  className={input}
                  placeholder={L('কোম্পানি বা পণ্যের ধরন (ঐচ্ছিক)', 'Company or product type (optional)')}
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                />
              )}
            </>
          )}

          <input
            className={input}
            placeholder={L('ফোন নম্বর', 'Phone number')}
            inputMode="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder={L('পাসওয়ার্ড', 'Password')}
          />

          {!isLogin && (
            <PasswordInput
              value={confirm}
              onChange={setConfirm}
              placeholder={L('পাসওয়ার্ড আবার দিন', 'Confirm password')}
            />
          )}

          {mismatch && (
            <p className="-mt-2 text-sm text-red-500">{L('দুটি পাসওয়ার্ড মেলেনি', 'The two passwords do not match')}</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button className="rounded-xl bg-amber p-3 text-lg font-bold text-[#17402A]">
            {isLogin ? L('লগ ইন', 'Log in') : L('সাইন আপ', 'Sign up')}
          </button>

          <p className="text-center text-xs text-muted">
            {L('ডেমো: এখন তথ্য শুধু এই ফোনেই থাকবে', 'Demo: for now your data stays on this device only')}
          </p>
          <Link to={isLogin ? '/signup' : '/login'} className="text-center text-sm underline">
            {isLogin
              ? L('নতুন? সাইন আপ করুন', 'New here? Sign up')
              : L('আগে থেকেই অ্যাকাউন্ট আছে? লগ ইন', 'Already have an account? Log in')}
          </Link>
        </form>
      </div>
    </div>
  )
}