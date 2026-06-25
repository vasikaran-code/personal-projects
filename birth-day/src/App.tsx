import { useEffect } from 'react'
import Background from './components/Background'
import Hero from './components/Hero'
import MessageCard from './components/MessageCard'
import Timeline from './components/Timeline'
import Gallery from './components/Gallery'
import Reasons from './components/Reasons'
import Countdown from './components/Countdown'
import GiftBox from './components/GiftBox'
import MusicPlayer from './components/MusicPlayer'
import FinalMessage from './components/FinalMessage'
import Footer from './components/Footer'
import { softRain } from './lib/confetti'

function App() {
  // A gentle confetti shower to greet the visitor.
  useEffect(() => {
    const t = setTimeout(() => softRain(), 400)
    return () => clearTimeout(t)
  }, [])

  const scrollToMessage = () => {
    document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen w-full">
      <Background />

      <main>
        <Hero onOpen={scrollToMessage} />
        <MessageCard />
        <Timeline />
        <Gallery />
        <Reasons />
        <Countdown />
        <GiftBox />
        <MusicPlayer />
        <FinalMessage />
      </main>

      <Footer />
    </div>
  )
}

export default App
