// Sidebar nav icons, keyed by editor section id
export const NAV_ICON = {
  mainSetup:   'fa-sliders-h',
  hero:        'fa-image',
  intro:       'fa-hand-sparkles',
  profile:     'fa-address-card',
  couple:      'fa-user-friends',
  loveStory:   'fa-heart',
  countdown:   'fa-hourglass-half',
  event:       'fa-calendar-alt',
  livestream:  'fa-video',
  dressCode:   'fa-tshirt',
  rsvp:        'fa-envelope',
  gift:        'fa-gift',
  gallery:     'fa-images',
  thankYou:    'fa-star',
}

// Editor section ID → public site section ID to scroll to
export const EDITOR_TO_SECTION = {
  hero:      'hero',
  intro:     'intro',
  profile:   'profileIntro',
  couple:    'groom,bride',
  loveStory: 'loveStory',
  countdown: 'countdown',
  event:     'event',
  livestream: 'livestream',
  dressCode: 'dressCode',
  rsvp:      'rsvp',
  gift:      'gift',
  gallery:   'gallery',
  thankYou:  'thankYou',
}

export const CONTENT_IDS = new Set(['mainSetup', 'hero', 'intro', 'profile', 'couple', 'loveStory', 'countdown', 'event', 'livestream', 'dressCode', 'rsvp', 'gift', 'gallery', 'thankYou'])
export const SPECIAL_VIEWS = new Set(['dashboard', 'guests', 'whatsapp', 'wishes', 'gifts', 'media', 'layout', 'traffic-detail'])

// Views the 'user' role is allowed to access (everything else redirects to 'guests')
export const USER_ROLE_VIEWS = new Set(['guests', 'wishes', 'gifts', 'whatsapp'])
// Editor sections with no unique 1:1 public-section target — auto-navigate-on-scroll
// would otherwise bounce these back to 'hero' (or wherever) once the scroll guard expires
export const NON_SCROLLABLE_VIEWS = new Set(['mainSetup'])

// Views with no per-section save/revert (full standalone pages)
export const NO_SAVE_VIEWS = new Set(['guests', 'dashboard', 'wishes', 'gifts', 'traffic-detail'])
// Views where the mobile preview toggle/panel doesn't apply
export const NO_PREVIEW_TOGGLE_VIEWS = new Set(['guests', 'whatsapp', 'dashboard', 'wishes', 'gifts', 'traffic-detail', 'mainSetup'])
export const PREVIEW_HIDDEN_VIEWS = new Set([...NO_PREVIEW_TOGGLE_VIEWS, 'media', 'mainSetup'])
// Views whose scroll area should use the "full width" layout (no form-card padding)
export const SCROLL_FULL_VIEWS = new Set(['guests', 'whatsapp', 'dashboard', 'wishes', 'gifts', 'traffic-detail', 'media'])

// Public site section ID → editor section ID
// Also used for legacy editor ID redirects (general, mediaGlobal → mainSetup)
export const SECTION_TO_EDITOR = {
  general:      'mainSetup',
  mediaGlobal:  'mainSetup',
  hero:         'hero',
  intro:        'intro',
  backdrop:     'hero',
  profileIntro: 'profile',
  groom:        'couple',
  bride:        'couple',
  loveStory:    'loveStory',
  countdown:    'countdown',
  event:        'event',
  livestream:   'livestream',
  dressCode:    'dressCode',
  rsvp:         'rsvp',
  wishes:       'rsvp',
  gift:         'gift',
  gallery:      'gallery',
  thankYou:     'thankYou',
}

export function getSectionPaths(schema) {
  const paths = []
  function collect(node) {
    for (const f of node.fields || []) if (f.path) paths.push(f.path)
    for (const a of node.arrays || []) paths.push(a.path)
    for (const l of node.imageLists || []) paths.push(l.path)
    if (node.audioTrim) {
      paths.push(node.audioTrim.trackPath)
      paths.push(node.audioTrim.startPath)
      paths.push(node.audioTrim.endPath)
    }
  }
  if (schema.groups) schema.groups.forEach(collect)
  else if (schema.tabs) schema.tabs.forEach(collect)
  else collect(schema)
  return paths
}

export function getSectionTopKeys(schema) {
  return [...new Set(getSectionPaths(schema).map(p => p.split('.')[0]))]
}
