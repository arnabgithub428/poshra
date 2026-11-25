import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Audience from '../components/landing/Audience'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Pricing from '../components/landing/Pricing'
import Faq from '../components/landing/Faq'
import Cta from '../components/landing/Cta'
import Footer from '../components/landing/Footer'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Audience />
        <Features />
        <HowItWorks />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}