import { config } from '../config'

export default function Footer() {
  return (
    <footer className="relative px-5 pb-12 text-center">
      <div className="mx-auto max-w-md border-t border-white/60 pt-8">
        <p className="font-display text-lg text-ink">
          {config.footer.split('❤️')[0]}
          <span className="inline-block animate-bob">❤️</span>
          {config.footer.split('❤️')[1] ?? ''}
        </p>
        <p className="mt-2 text-xs tracking-wide text-ink-soft uppercase">
          Happy Birthday {config.name}
        </p>
      </div>
    </footer>
  )
}
