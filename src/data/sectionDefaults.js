const DEFAULT_BG = { type: 'video', value: '' }

export const DEFAULT_HERO_BACKGROUND = { type: 'color', value: '#101010' }

export const DEFAULT_SECTIONS = [
  { id: 'intro',       component: 'SectionIntro',       label: 'Intro',        background: DEFAULT_BG },
  { id: 'profileIntro',component: 'SectionProfileIntro',label: 'Profile Intro',background: { type: 'color', value: '#101010' } },
  { id: 'groom',       component: 'SectionGroom',       label: 'Groom',        background: DEFAULT_BG },
  { id: 'bride',       component: 'SectionBride',       label: 'Bride',        background: DEFAULT_BG },
  { id: 'loveStory',   component: 'SectionLoveStory',   label: 'Love Story',   background: { type: 'color', value: '#0e0d0c' } },
  { id: 'countdown',   component: 'SectionCountdown',   label: 'Countdown',    background: { type: 'color', value: '#101010' } },
  { id: 'event',       component: 'SectionEvent',       label: 'Event',        background: DEFAULT_BG },
  { id: 'livestream',  component: 'SectionLivestream',  label: 'Livestream',   background: DEFAULT_BG },
  { id: 'dressCode',   component: 'SectionDressCode',   label: 'Dress Code',   background: DEFAULT_BG },
  { id: 'rsvp',        component: 'SectionRSVP',        label: 'RSVP',         background: DEFAULT_BG },
  { id: 'wishes',      component: 'SectionWishes',      label: 'Wishes',       background: DEFAULT_BG },
  { id: 'gift',        component: 'SectionGift',        label: 'Gift',         background: DEFAULT_BG },
  { id: 'gallery',     component: 'SectionGallery',     label: 'Gallery',      background: DEFAULT_BG },
  { id: 'thankYou',    component: 'SectionThankYou',    label: 'Thank You',    background: { type: 'color', value: '#101010' } },
]
