export const CONTENT_SECTIONS = [
  // ── General / Wedding Info ──────────────────────────────
  {
    id: 'general',
    label: 'General / Wedding Info',
    groups: [
      {
        label: 'Wedding Info',
        icon: 'fa-ring',
        iconColor: '#fef3c7',
        iconFg: '#b45309',
        description: 'Nama pasangan & tanggal — tampil di semua section.',
        columns: 2,
        fields: [
          { path: 'hero.name1',     label: 'Name 1',            type: 'text', hint: 'Dipakai di cover, intro, dan left panel' },
          { path: 'hero.connector', label: 'Connector',          type: 'text', hint: 'Contoh: "and", "&", "dan"' },
          { path: 'hero.name2',     label: 'Name 2',            type: 'text', hint: 'Dipakai di cover, intro, dan left panel' },
          { path: 'hero.date',      label: 'Tanggal Pernikahan', type: 'date-text', hint: 'Tampil di cover, intro, dan countdown' },
        ],
      },
      {
        label: 'Groom',
        icon: 'fa-male',
        iconColor: '#eff6ff',
        iconFg: '#1d4ed8',
        description: 'Profil mempelai pria.',
        columns: 2,
        fields: [
          { path: 'groom.title',               label: 'Title',               type: 'text' },
          { path: 'groom.firstName',           label: 'First Name',          type: 'text' },
          { path: 'groom.lastName',            label: 'Last Name',           type: 'text' },
          { path: 'groom.relation',            label: 'Relation Label',      type: 'text' },
          { path: 'groom.relationDescription', label: 'Relation Description',type: 'textarea' },
          { path: 'groom.instagramUsername',   label: 'Instagram Username',  type: 'text' },
          { path: 'groom.image',               label: 'Photo',               type: 'image' },
        ],
      },
      {
        label: 'Bride',
        icon: 'fa-female',
        iconColor: '#fdf2f8',
        iconFg: '#9d174d',
        description: 'Profil mempelai wanita.',
        columns: 2,
        fields: [
          { path: 'bride.title',               label: 'Title',               type: 'text' },
          { path: 'bride.firstName',           label: 'First Name',          type: 'text' },
          { path: 'bride.lastName',            label: 'Last Name',           type: 'text' },
          { path: 'bride.relation',            label: 'Relation Label',      type: 'text' },
          { path: 'bride.relationDescription', label: 'Relation Description',type: 'textarea' },
          { path: 'bride.instagramUsername',   label: 'Instagram Username',  type: 'text' },
          { path: 'bride.image',               label: 'Photo',               type: 'image' },
        ],
      },
    ],
  },

  // ── Hero 1 / Cover ─────────────────────────────────────
  {
    id: 'hero',
    label: 'Hero 1 / Cover',
    groups: [
      {
        label: 'Cover Content',
        icon: 'fa-door-open',
        iconColor: '#f0fdf4',
        iconFg: '#15803d',
        description: 'Teks dan gambar yang tampil sebelum undangan dibuka.',
        columns: 2,
        fields: [
          { path: 'hero.inviteTitle', label: 'Invitation Title',  type: 'text', hint: 'Tampil di cover dan di section intro pertama' },
          { path: 'hero.vow',        label: 'Vow Text',           type: 'textarea', hint: 'Tampil di section intro. Gunakan baris baru untuk line break' },
          { path: 'hero.openButton', label: 'Open Button Label',  type: 'text' },
          { path: 'hero.dear',       label: '"Dear" Label',       type: 'text' },
          { path: 'hero.apologyText',label: 'Apology Text',       type: 'textarea' },
          { path: 'hero.backgroundImage', label: 'Cover Background Image', type: 'image' },
          { path: 'hero.previewImage',    label: 'Preview / Share Image',  type: 'image' },
        ],
      },
    ],
  },

  // ── Hero 2 / Backdrop  +  Music ────────────────────────
  {
    id: 'backdrop',
    label: 'Hero 2 / Backdrop',
    groups: [
      {
        label: 'Background Media',
        icon: 'fa-photo-video',
        iconColor: '#faf5ff',
        iconFg: '#7e22ce',
        description: 'Video dan foto latar setelah undangan dibuka.',
        fields: [
          { path: 'hero.backgroundOverlayImage', label: 'Left Panel Background', type: 'image' },
          { path: 'hero.backgroundVideo',        label: 'Background Video',       type: 'video' },
        ],
      },
      {
        label: 'Background Music',
        icon: 'fa-music',
        iconColor: '#fff7ed',
        iconFg: '#c2410c',
        description: 'Musik yang otomatis diputar saat undangan dibuka.',
        fields: [
          { path: 'audio.track', label: 'Music File', type: 'audio' },
        ],
      },
    ],
  },

  // ── Profile Intro ───────────────────────────────────────
  {
    id: 'profile',
    label: 'Profile Intro',
    icon: 'fa-quote-right',
    iconColor: '#fef9ee',
    iconFg: '#92400e',
    description: 'Kutipan atau ayat pilihan beserta foto pasangan.',
    fields: [
      { path: 'profile.biblicalReference', label: 'Sumber / Referensi', type: 'text',     hint: 'Contoh: 1 Korintus 13:4, atau nama penulis, atau dikosongkan' },
      { path: 'profile.biblicalText',      label: 'Kutipan',            type: 'textarea', hint: 'Isi dengan ayat, puisi, atau kalimat inspiratif apa pun' },
      { path: 'profile.coupleImage',       label: 'Foto Pasangan',      type: 'image' },
    ],
  },

  // ── Love Story ──────────────────────────────────────────
  {
    id: 'loveStory',
    label: 'Love Story',
    icon: 'fa-heart',
    iconColor: '#fff1f2',
    iconFg: '#be123c',
    description: 'Cerita perjalanan cinta pasangan, chapter per chapter.',
    arrays: [
      {
        path: 'loveStory.chapters',
        label: 'Chapters',
        itemLabel: (item, i) => item.date || `Chapter ${i + 1}`,
        addItem: () => ({ date: '', title: '', description: '', image: '' }),
        itemFields: [
          { path: 'date',        label: 'Tanggal',       type: 'text', placeholder: 'e.g. January 2020' },
          { path: 'title',       label: 'Chapter Title', type: 'text' },
          { path: 'description', label: 'Description',   type: 'textarea' },
          { path: 'image',       label: 'Photo',         type: 'image' },
        ],
      },
    ],
  },

  // ── Event & Schedule  (Event + Countdown + Livestream tabs) ──
  {
    id: 'event',
    label: 'Event & Schedule',
    icon: 'fa-calendar-alt',
    iconColor: '#f0f9ff',
    iconFg: '#0369a1',
    description: 'Detail acara, countdown, dan livestream.',
    tabs: [
      {
        label: 'Ceremony & Reception',
        fields: [
          { path: 'event.date',                 label: 'Tanggal Acara (tampilan)',      type: 'date-text' },
          { path: 'event.ceremony.title',        label: 'Ceremony — Title',             type: 'text' },
          { path: 'event.ceremony.time',         label: 'Ceremony — Waktu',             type: 'time-range', placeholder: 'e.g. 09:00 - 10:00 WIB' },
          { path: 'event.ceremony.location',     label: 'Ceremony — Venue',             type: 'text' },
          { path: 'event.ceremony.address',      label: 'Ceremony — Address',           type: 'textarea' },
          { path: 'event.ceremony.mapsUrl',      label: 'Ceremony — Maps URL',          type: 'url' },
          { path: 'event.reception.title',       label: 'Reception — Title',            type: 'text' },
          { path: 'event.reception.time',        label: 'Reception — Waktu',            type: 'time-range', placeholder: 'e.g. 12:00 - 14:00 WIB' },
          { path: 'event.reception.location',    label: 'Reception — Venue',            type: 'text' },
          { path: 'event.reception.address',     label: 'Reception — Address',          type: 'textarea' },
          { path: 'event.reception.mapsUrl',     label: 'Reception — Maps URL',         type: 'url' },
        ],
      },
      {
        label: 'Countdown',
        fields: [
          { path: 'countdown.message', label: 'Message',                    type: 'text' },
          { path: 'countdown.date',    label: 'Target Tanggal & Jam',      type: 'datetime', hint: 'Waktu tepat acara dimulai — dipakai untuk hitung mundur' },
          { path: 'countdown.image',   label: 'Photo',               type: 'image' },
        ],
      },
      {
        label: 'Livestream',
        fields: [
          { path: 'livestream.title',      label: 'Title',            type: 'text' },
          { path: 'livestream.date',       label: 'Tanggal Livestream', type: 'date-text' },
          { path: 'livestream.url',        label: 'Stream URL',       type: 'url' },
          { path: 'livestream.buttonText', label: 'Button Text',      type: 'text' },
          { path: 'livestream.image',      label: 'Image',            type: 'image' },
        ],
      },
    ],
  },

  // ── Dress Code ──────────────────────────────────────────
  {
    id: 'dressCode',
    label: 'Dress Code',
    icon: 'fa-tshirt',
    iconColor: '#fafaf9',
    iconFg: '#57534e',
    description: 'Panduan berpakaian dan palet warna untuk tamu.',
    fields: [
      { path: 'dressCode.title', label: 'Title',         type: 'text' },
      { path: 'dressCode.text',  label: 'Guidance Text', type: 'textarea' },
    ],
    arrays: [
      {
        path: 'dressCode.colors',
        label: 'Color Swatches',
        itemLabel: (item, i) => item.label || item.hex || `Color ${i + 1}`,
        addItem: () => ({ hex: '#cccccc', label: '' }),
        itemFields: [
          { path: 'hex',   label: 'Color',                           type: 'color' },
          { path: 'label', label: 'Color Name (e.g. Dusty Rose)',    type: 'text' },
        ],
      },
    ],
  },

  // ── RSVP ────────────────────────────────────────────────
  {
    id: 'rsvp',
    label: 'RSVP',
    icon: 'fa-envelope',
    iconColor: '#f0fdf4',
    iconFg: '#15803d',
    description: 'Formulir konfirmasi kehadiran tamu.',
    fields: [
      { path: 'rsvp.title',           label: 'Title',                      type: 'text' },
      { path: 'rsvp.description',     label: 'Description',                type: 'textarea' },
      { path: 'rsvp.attendanceLabel', label: 'Will Attend — Button Label', type: 'text' },
      { path: 'rsvp.unableLabel',     label: 'Cannot Attend — Button Label',type: 'text' },
      { path: 'rsvp.guestLabel',      label: 'Guest Count Field Label',    type: 'text', hint: 'e.g. "No of Guest"' },
      { path: 'rsvp.maxGuests',       label: 'Max Guests per RSVP',        type: 'number' },
      { path: 'rsvp.submitButtonText',label: 'Submit Button Text',         type: 'text' },
    ],
  },

  // ── Gift ────────────────────────────────────────────────
  {
    id: 'gift',
    label: 'Gift',
    icon: 'fa-gift',
    iconColor: '#fff7ed',
    iconFg: '#c2410c',
    description: 'Informasi rekening dan detail pengiriman hadiah.',
    fields: [
      { path: 'gift.title',       label: 'Title',       type: 'text' },
      { path: 'gift.description', label: 'Description', type: 'textarea' },
    ],
    arrays: [
      {
        path: 'gift.accounts',
        label: 'Accounts',
        itemLabel: (item, i) => item.bankName || `Account ${i + 1}`,
        addItem: () => ({ bankName: '', bankType: '', accountNumber: '' }),
        itemFields: [
          { path: 'bankName',      label: 'Account Name',   type: 'text' },
          { path: 'bankType',      label: 'Bank',           type: 'text' },
          { path: 'accountNumber', label: 'Account Number', type: 'text' },
        ],
      },
    ],
  },

  // ── Gallery ─────────────────────────────────────────────
  {
    id: 'gallery',
    label: 'Gallery',
    icon: 'fa-images',
    iconColor: '#fdf4ff',
    iconFg: '#7e22ce',
    description: 'Foto-foto kenangan dalam tiga kolom.',
    fields: [
      { path: 'gallery.title', label: 'Title', type: 'textarea', hint: 'Use Enter / new line for line breaks' },
      { path: 'gallery.quote', label: 'Quote', type: 'textarea' },
    ],
    imageLists: [
      { path: 'gallery.columns.0.images', label: 'Column 1 Photos' },
      { path: 'gallery.columns.1.images', label: 'Column 2 Photos' },
      { path: 'gallery.columns.2.images', label: 'Column 3 Photos' },
    ],
  },

  // ── Thank You ───────────────────────────────────────────
  {
    id: 'thankYou',
    label: 'Thank You',
    icon: 'fa-star',
    iconColor: '#fefce8',
    iconFg: '#a16207',
    description: 'Pesan penutup dan ucapan terima kasih.',
    fields: [
      { path: 'thankYou.title',   label: 'Title',   type: 'text' },
      { path: 'thankYou.message', label: 'Message', type: 'text' },
      { path: 'thankYou.note',    label: 'Note',    type: 'text' },
    ],
  },
]
