/**
 * 🎉  EDIT EVERYTHING HERE  🎉
 * This single file controls all the text, dates, and content on the page.
 * Replace the placeholder images in /public or swap the URLs below.
 */

// Assets bundled by Vite from src/assets. Imports become hashed URLs at build.
import songUrl from './assets/Kurumugil-MassTamilan.dev.mp3'
import songCover from './assets/Sita-Ramam.jpg'

// Personal gallery photos — eagerly globbed and sorted by filename (image1..imageN).
const photoModules = import.meta.glob('./assets/personal/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const photos = Object.keys(photoModules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => photoModules[key])

export const config = {
  /** The lucky person's name (used in a few places). Leave "" to keep it generic. */
  name: 'Arpitha',

  /**
   * The birthday, in the visitor's local time.
   * Format: YYYY, MM (1-12), DD, hour (0-23), minute.
   * The countdown counts down to the START of this day.
   */
  birthday: { year: 2026, month: 6, day: 26, hour: 0, minute: 0 },

  hero: {
    title: 'Happy Birthday Arpitha',
    subtitle: 'Today is all about celebrating someone truly special.',
    cta: 'Open My Surprise',
  },

  message: {
    heading: 'Happiest Birthday, Arpitha! 🎂❤️',
    // Each string is typed out line-by-line.
    lines: [
      "We don't talk every day, and I'm usually the one to text first —",
      "but I never mind, because every little moment with you stays with me.",
      'Even when the words come out wrong, you always seem to get what I mean,',
      'and honestly, that means more than I know how to say.',
      'More than anything, I just want you to be happy —',
      'today, and in every year that follows.',
      'Wishing you endless joy, good health, and the best of everything. ✨',
    ],
  },

  timeline: [
    {
      date: 'The Day We Met',
      title: 'Where it all began',
      text: 'A simple hello that I still remember perfectly. Some moments just stay with you.',
      emoji: '✨',
    },
    {
      date: 'That One Conversation',
      title: 'Talking for hours',
      text: 'We lost track of time completely — and I would do it all over again.',
      emoji: '💬',
    },
    {
      date: 'Your Big Achievement',
      title: 'So proud of you',
      text: 'You worked so hard and made it look effortless. You inspire the people around you.',
      emoji: '🏆',
    },
    {
      date: 'Countless Little Moments',
      title: 'The everyday magic',
      text: 'The laughs, the inside jokes, the small things that mean the most.',
      emoji: '🌷',
    },
  ],

  // Personal photos from src/assets/personal — add/remove files there to change this.
  gallery: photos.map((src, i) => ({
    src,
    alt: `A lovely memory ${i + 1}`,
    span: (['tall', 'short', 'mid', 'short', 'tall', 'mid', 'short', 'tall'] as const)[i % 8],
  })) as { src: string; alt: string; span: 'short' | 'mid' | 'tall' }[],

  reasons: [
    { emoji: '😊', title: 'Your smile', text: 'It lights up every room and makes everything better.' },
    { emoji: '💖', title: 'Your kindness', text: 'You care so deeply, and it shows in everything you do.' },
    { emoji: '✨', title: 'Your confidence', text: 'The way you carry yourself is genuinely inspiring.' },
    { emoji: '🌸', title: 'Your positivity', text: 'You find the bright side, and you share it generously.' },
    { emoji: '🎶', title: 'Your energy', text: 'Being around you is a little contagious — in the best way.' },
    { emoji: '🌟', title: 'Just being you', text: 'No reason needed. The world is better with you in it.' },
  ],

  gift: {
    closedHint: 'Tap to open',
    title: 'A little secret… 💌',
    message:
      "Out of everyone in the world, I'm so grateful it's you I get to celebrate today. Here's to you — and to many more birthdays together.",
  },

  music: {
    title: 'Kurumugil',
    artist: 'Sita Ramam',
    src: songUrl,
    cover: songCover,
  },

  final: {
    lines: [
      'Some people make the world brighter simply by being in it.',
      'Thank you for being one of those people.',
      'Happy Birthday and have an amazing year ahead. ❤️',
    ],
  },

  footer: 'Made with ❤️ especially for you',
}

export type Config = typeof config
