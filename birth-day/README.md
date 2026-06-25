# 🎂 Happy Birthday — A Little Surprise Page

A beautiful, single-page birthday website. Soft pastels, floating hearts &
sparkles, confetti, a typing message, a memory timeline, a photo gallery with
lightbox, a live countdown, an openable gift box, a music player, and a romantic
finish. Built with **React + TypeScript + Tailwind CSS v4 + Motion (Framer
Motion)**.

## Run it

```bash
npm install      # already done if you're reading this
npm run dev      # start the dev server → open the printed localhost URL
npm run build    # production build into /dist
npm run preview  # preview the production build
```

## ✏️ Make it yours — edit one file

Almost everything lives in **`src/config.ts`**. Open it and change the text:

| What | Where in `config.ts` |
| --- | --- |
| Their name | `name` |
| Birthday date (for the countdown) | `birthday` — `{ year, month, day }` in local time |
| Hero title / subtitle / button | `hero` |
| The typed message | `message.lines` |
| Memory timeline cards | `timeline` |
| Photo gallery | `gallery` |
| "Reasons you're special" cards | `reasons` |
| The hidden gift message | `gift` |
| Song & album art | `music` |
| The final romantic message | `final` |
| Footer text | `footer` |

### Photos
Replace the placeholder image URLs in `config.ts`. To use your own files, drop
them in the **`public/`** folder and reference them like `"/our-photo.jpg"`.

### Music
Put an `.mp3` in `public/` and set `music.src` to e.g. `"/our-song.mp3"`.
Autoplay is intentionally **off** — the song only plays when the play button is
pressed (browsers block autoplay anyway).

## Notes
- **Countdown**: counts down to the start of the birthday, then automatically
  switches to *"It's Your Birthday Today! 🎉"* and fires confetti cannons. After
  the day passes it shows a friendly "until next year" message.
- **Accessibility**: respects `prefers-reduced-motion` (animations and confetti
  are toned down), the gallery lightbox supports keyboard (←/→/Esc), and all
  interactive elements are real buttons with labels.
- **Customizing colors**: the pastel palette lives in the `@theme` block at the
  top of `src/index.css`.

Made with ❤️
