import { useLang } from '../../lib/i18n'

export default function HowItWorks() {
    const { L, n } = useLang()

    const steps = [
        { title: L('সাইন আপ করুন', 'Sign up'), text: L('ফোন নম্বর দিয়ে এক মিনিটে অ্যাকাউন্ট খুলুন।', 'Create an account in a minute.') },
        { title: L('কাস্টমার যোগ করুন', 'Add customers'), text: L('নাম আর নম্বর লিখে বাকি-জমা তুলতে থাকুন।', 'Enter a name and number, then record dues and payments.') },
        { title: L('রিপোর্ট দেখুন', 'View reports'), text: L('লাভ-ক্ষতি আর বাকির হিসাব নিজে নিজেই সাজানো থাকবে।', 'Profit, loss and dues are organized for you.') },
    ]

    return (
        <section id="how" className="scroll-mt-20 bg-sand px-4 py-16 md:px-8">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-center text-3xl font-bold">{L('তিন ধাপে শুরু', 'Get started in 3 steps')}</h2>
                <div className="mt-10 grid gap-8 md:grid-cols-3">
                    {steps.map((s, i) => (
                        <div key={s.title} className="flex flex-col gap-2">
                            <div className="grid size-12 place-items-center rounded-full bg-brand text-xl font-bold text-white">
                                {n(i + 1)}
                            </div>
                            <h3 className="text-xl font-bold">{s.title}</h3>
                            <p className="text-muted">{s.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}