import { useLang } from '../../lib/i18n'

export default function Footer() {
    const { L } = useLang()

    const cols = [
        {
            title: L('প্রোডাক্ট', 'Product'),
            links: [[L('ফিচার', 'Features'), '#features'], [L('কীভাবে কাজ করে', 'How it works'), '#how'], [L('মূল্য', 'Pricing'), '#pricing']],
        },
        {
            title: L('কোম্পানি', 'Company'),
            links: [[L('আমাদের সম্পর্কে', 'About us'), '#'], [L('প্রাইভেসি পলিসি', 'Privacy policy'), '#'], [L('শর্তাবলী', 'Terms'), '#']],
        },
        {
            title: L('যোগাযোগ', 'Contact'),
            links: [['your@email.com', '#'], ['01XXXXXXXXX', '#'], [L('চট্টগ্রাম, বাংলাদেশ', 'Chattogram, Bangladesh'), '#']],
        },
    ]

    return (
        <footer className="bg-[#17402A] px-4 pb-6 pt-12 text-[#FAF6EC] md:px-8">
            <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <p className="text-3xl font-bold">{L('পসরা', 'Poshra')}</p>
                    <p className="mt-2 text-[#E9E2CC]">{L('আপনার পসরা, আপনার হিসাব।', 'Your shop, your accounts.')}</p>
                </div>
                {cols.map(c => (
                    <div key={c.title}>
                        <p className="mb-2 font-bold">{c.title}</p>
                        {c.links.map(([label, href]) => (
                            <a key={label} href={href} className="block py-1.5 text-[#E9E2CC] hover:text-amber">{label}</a>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mx-auto mt-8 max-w-6xl border-t border-white/20 pt-5 text-sm text-[#E9E2CC]">
                {L('© ২০২৬ পসরা। সর্বস্বত্ব সংরক্ষিত।', '© 2026 Poshra. All rights reserved.')}
            </div>
        </footer>
    )
}