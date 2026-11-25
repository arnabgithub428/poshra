const BN = '০১২৩৪৫৬৭৮৯'

// Bangla ba English, dui rokom digit-i bujhbe
export function toNum(s: string): number {
    const en = s.replace(/[০-৯]/g, d => String(BN.indexOf(d))).replace(/,/g, '').trim()
    const v = Number(en)
    return Number.isFinite(v) ? v : 0
}

const pad = (x: number) => String(x).padStart(2, '0')

export function toISO(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const todayISO = () => toISO(new Date())

export function inDays(n: number) {
    const d = new Date()
    d.setDate(d.getDate() + n)
    return toISO(d)
}

export function fmtDate(iso: string, lang: string) {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
        day: 'numeric',
        month: 'short',
    })
}