import { useState } from 'react'
import { Download } from './components/Download'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Showcase } from './components/Showcase'
import { SpoBanner } from './components/SpoBanner'
import { Steps } from './components/Steps'
import { WebModal } from './components/WebModal'
import { useReveal, useTheme } from './hooks'

export function App() {
  const [webModal, setWebModal] = useState(false)
  const [theme, setTheme] = useTheme()
  const pageRef = useReveal()
  const openWebModal = () => setWebModal(true)
  const closeWebModal = () => setWebModal(false)

  return (
    <div ref={pageRef}>
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <main id='top'>
        <Hero onWebClick={openWebModal} />
        <SpoBanner />
        <Showcase suspended={webModal} />
        <Steps />
        <Download onWebClick={openWebModal} />
        <Faq />
      </main>

      <Footer />

      {webModal && <WebModal onClose={closeWebModal} />}
    </div>
  )
}
