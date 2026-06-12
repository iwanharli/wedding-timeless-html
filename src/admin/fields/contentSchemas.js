export const CONTENT_SECTIONS = [
  // ── Main Setup (General + Media Global) ──────────────────
  {
    id: 'mainSetup',
    label: 'Main Setup',
    tabs: [
      {
        label: 'Nama Mempelai',
        columns: 3,
        fields: [
          { type: 'divider', label: 'Mempelai 1', span: 3 },
          { path: 'hero.firstName1', label: 'Nama Depan', type: 'text' },
          { path: 'hero.middleName1', label: 'Nama Tengah', type: 'text' },
          { path: 'hero.lastName1', label: 'Nama Belakang', type: 'text' },
          { path: 'hero.name1', label: 'Nama Panggilan', type: 'text', hint: 'Tampil di Cover, Intro, Profile, dan Ucapan Terima Kasih.', hintTooltip: true },
          { path: 'hero.fullName1', label: 'Nama Lengkap', type: 'computed', span: 2, compose: ['hero.titlePrefix1', 'hero.firstName1', 'hero.middleName1', 'hero.lastName1'], composeSuffix: 'hero.titleSuffix1', hint: 'Otomatis digabung dari Gelar (Depan), Nama Depan, Nama Tengah, Nama Belakang, dan Gelar (Belakang).', hintTooltip: true },
          { path: 'hero.titlePrefix1', label: 'Gelar (Depan)', type: 'text', hint: 'Gelar yang ditulis sebelum nama. Contoh: dr., Ir. — kosongkan jika tidak ada', hintTooltip: true },
          { path: 'hero.titleSuffix1', label: 'Gelar (Belakang)', type: 'text', hint: 'Gelar yang ditulis setelah nama. Contoh: S.T., S.Kom. — kosongkan jika tidak ada', hintTooltip: true },
          { type: 'divider', label: 'Mempelai 2', span: 3 },
          { path: 'hero.firstName2', label: 'Nama Depan', type: 'text' },
          { path: 'hero.middleName2', label: 'Nama Tengah', type: 'text' },
          { path: 'hero.lastName2', label: 'Nama Belakang', type: 'text' },
          { path: 'hero.name2', label: 'Nama Panggilan', type: 'text', hint: 'Tampil di Cover, Intro, Profile, dan Ucapan Terima Kasih.', hintTooltip: true },
          { path: 'hero.fullName2', label: 'Nama Lengkap', type: 'computed', span: 2, compose: ['hero.titlePrefix2', 'hero.firstName2', 'hero.middleName2', 'hero.lastName2'], composeSuffix: 'hero.titleSuffix2', hint: 'Otomatis digabung dari Gelar (Depan), Nama Depan, Nama Tengah, Nama Belakang, dan Gelar (Belakang).', hintTooltip: true },
          { path: 'hero.titlePrefix2', label: 'Gelar (Depan)', type: 'text', hint: 'Gelar yang ditulis sebelum nama. Contoh: dr., Ir. — kosongkan jika tidak ada', hintTooltip: true },
          { path: 'hero.titleSuffix2', label: 'Gelar (Belakang)', type: 'text', hint: 'Gelar yang ditulis setelah nama. Contoh: S.T., S.Kom. — kosongkan jika tidak ada', hintTooltip: true },
        ],
        footnote: 'Nama Panggilan digunakan di section: Cover, Intro, Profile, Ucapan Terima Kasih. Nama Depan/Tengah/Belakang/Gelar jadi nilai default untuk section Groom & Bride.',
      },
      {
        label: 'Info Pernikahan',
        columns: 3,
        fields: [
          { path: 'hero.date', label: 'Tanggal Pernikahan', type: 'date-text', span: 2, hint: 'Pilih tanggal di sebelah kiri untuk auto-isi, atau edit teks langsung di sebelah kanan', hintTooltip: true },
          { path: 'hero.time', label: 'Jam Pernikahan', type: 'time', hint: 'Jam mulai acara — jadi nilai default untuk Countdown jika section Countdown belum diisi jamnya sendiri.', hintTooltip: true },
          { path: 'hero.inviteTitle', label: 'Judul Undangan', type: 'text', span: 3, hint: 'Jadi judul default di section Cover & Intro — bisa ditimpa per section.', hintTooltip: true },
          { path: 'hero.connector', label: 'Kata Penghubung', type: 'text', hint: 'Contoh: "dan", "&", "and"', hintTooltip: true },
        ],
        footnote: 'Tanggal Pernikahan digunakan di section: Cover, Intro, Countdown, dan jadi nilai default untuk section Event & Livestream. Tanggal + Jam jadi nilai default untuk hitung mundur di Countdown.',
      },
      {
        label: 'Media Latar',
        description: 'Media latar yang digunakan di seluruh halaman undangan.',
        columns: 3,
        fields: [
          { path: 'hero.leftPanel', label: 'Background Kiri (Desktop)', type: 'media', compact: true, span: 1, hint: 'Tampil di panel kiri layar setelah undangan dibuka.' },
          { path: 'hero.backgroundVideo', label: 'Background Video (Mobile)', type: 'video', compact: true, span: 1, hint: 'Dipakai oleh section yang diset bertipe "Video" di Section Layout.' },
        ],
      },
      {
        label: 'Musik',
        description: 'Musik latar yang otomatis diputar saat undangan dibuka.',
        columns: 3,
        fields: [
          { path: 'audio.track', label: 'Musik Latar', type: 'audio', span: 1, hint: 'Otomatis diputar saat undangan dibuka. Format: mp3, wav, ogg' },
        ],
        audioTrim: {
          trackPath: 'audio.track',
          startPath: 'audio.startTime',
          endPath: 'audio.endTime',
        },
      },
    ],
  },

  // ── Hero / Cover ─────────────────────────────────────
  {
    id: 'hero',
    label: 'Hero / Cover',
    icon: 'fa-door-open',
    iconColor: '#f0fdf4',
    iconFg: '#15803d',
    description: 'Konten teks halaman cover undangan (sebelum dibuka). Media latar diatur dari menu Media & Musik Latar.',
    columns: 2,
    fields: [
      { path: 'hero.inviteTitleHero', label: 'Judul Undangan', type: 'text', fallback: 'hero.inviteTitle', span: 2 },
      { path: 'hero.openButton', label: 'Teks Tombol Buka', type: 'text', hint: 'Contoh: "Buka Undangan"' },
      { path: 'hero.dear', label: 'Teks Sapaan', type: 'text', hint: 'Contoh: "Kepada Yth.", "Dear", "Halo"' },
      { path: 'hero.apologyText', label: 'Teks Permohonan Maaf', type: 'textarea', hint: 'Contoh: "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir"', span: 2 },
    ],
  },

  // ── Intro / Selamat Datang ────────────────────────────
  {
    id: 'intro',
    label: 'Intro',
    icon: 'fa-hand-sparkles',
    iconColor: '#f0fdf4',
    iconFg: '#15803d',
    description: 'Konten teks section sambutan setelah undangan dibuka.',
    columns: 2,
    fields: [
      { path: 'hero.inviteTitleIntro', label: 'Judul Undangan', type: 'text', fallback: 'hero.inviteTitle', span: 2 },
      { path: 'hero.vow', label: 'Teks Pembuka / Janji', type: 'textarea', hint: 'Tekan Enter untuk baris baru.', span: 2 },
    ],
  },

  // ── Profile Intro ───────────────────────────────────────
  {
    id: 'profile',
    label: 'Profile Intro',
    icon: 'fa-quote-right',
    iconColor: '#fef9ee',
    iconFg: '#92400e',
    description: 'Kutipan atau ayat pilihan. Foto latar diatur dari menu Layout.',
    columns: 2,
    fields: [
      { path: 'profile.quoteText', label: 'Teks Kutipan', type: 'textarea', hint: 'Bisa berupa ayat suci, lirik lagu, puisi, atau kalimat inspiratif', span: 2 },
      { path: 'profile.quoteSource', label: 'Sumber / Penulis', type: 'text', hint: 'Nama penulis, tokoh, atau kitab suci. Kosongkan jika tidak diperlukan.' },
    ],
  },

  // ── Mempelai (Groom & Bride) ─────────────────────────────
  {
    id: 'couple',
    label: 'Groom & Bride',
    icon: 'fa-user-friends',
    iconColor: '#eef2ff',
    iconFg: '#4338ca',
    description: 'Profil lengkap mempelai pria dan wanita.',
    groups: [
      {
        label: 'Groom',
        icon: 'fa-male',
        iconColor: '#eff6ff',
        iconFg: '#1d4ed8',
        description: 'Profil lengkap mempelai pria.',
        columns: 2,
        layout: 'profile',
        fields: [
          { path: 'groom.image', label: 'Foto', type: 'image' },
          { path: 'groom.title', label: 'Gelar / Sapaan', type: 'text', fallback: 'hero.titlePrefix1', hint: 'Contoh: dr., Ir., S.T. — mengikuti "Gelar (Depan)" Mempelai 1 di Main Setup jika dikosongkan.', hintTooltip: true },
          { path: 'groom.firstName', label: 'Nama Depan', type: 'text', fallback: 'hero.firstName1', hint: 'Mengikuti "Nama Depan" Mempelai 1 di Main Setup jika dikosongkan.', hintTooltip: true },
          { path: 'groom.lastName', label: 'Nama Belakang', type: 'text', fallback: 'hero.lastName1', hint: 'Mengikuti "Nama Belakang Mempelai 1" di Main Setup jika dikosongkan.', hintTooltip: true },
          { path: 'groom.relation', label: 'Label Hubungan', type: 'text', hint: 'Contoh: "Putra pertama dari"' },
          { path: 'groom.relationDescription', label: 'Keterangan Orang Tua', type: 'textarea', hint: 'Nama lengkap orang tua, contoh: "Bapak Ahmad dan Ibu Siti"' },
          { path: 'groom.instagramUsername', label: 'Instagram', type: 'text', hint: 'Username tanpa @' },
          { path: 'groom.tiktokUsername', label: 'TikTok', type: 'text', hint: 'Username tanpa @' },
          { path: 'groom.facebookUrl', label: 'Facebook', type: 'text', hint: 'URL profil Facebook' },
          { path: 'groom.twitterUsername', label: 'X / Twitter', type: 'text', hint: 'Username tanpa @' },
        ],
      },
      {
        label: 'Bride',
        icon: 'fa-female',
        iconColor: '#fdf2f8',
        iconFg: '#9d174d',
        description: 'Profil lengkap mempelai wanita.',
        columns: 2,
        layout: 'profile',
        fields: [
          { path: 'bride.image', label: 'Foto', type: 'image' },
          { path: 'bride.title', label: 'Gelar / Sapaan', type: 'text', fallback: 'hero.titlePrefix2', hint: 'Contoh: dr., S.Pd., S.Kom. — mengikuti "Gelar (Depan)" Mempelai 2 di Main Setup jika dikosongkan.', hintTooltip: true },
          { path: 'bride.firstName', label: 'Nama Depan', type: 'text', fallback: 'hero.firstName2', hint: 'Mengikuti "Nama Depan" Mempelai 2 di Main Setup jika dikosongkan.', hintTooltip: true },
          { path: 'bride.lastName', label: 'Nama Belakang', type: 'text', fallback: 'hero.lastName2', hint: 'Mengikuti "Nama Belakang Mempelai 2" di Main Setup jika dikosongkan.', hintTooltip: true },
          { path: 'bride.relation', label: 'Label Hubungan', type: 'text', hint: 'Contoh: "Putri pertama dari"' },
          { path: 'bride.relationDescription', label: 'Keterangan Orang Tua', type: 'textarea', hint: 'Nama lengkap orang tua, contoh: "Bapak Hendra dan Ibu Dewi"' },
          { path: 'bride.instagramUsername', label: 'Instagram', type: 'text', hint: 'Username tanpa @' },
          { path: 'bride.tiktokUsername', label: 'TikTok', type: 'text', hint: 'Username tanpa @' },
          { path: 'bride.facebookUrl', label: 'Facebook', type: 'text', hint: 'URL profil Facebook' },
          { path: 'bride.twitterUsername', label: 'X / Twitter', type: 'text', hint: 'Username tanpa @' },
        ],
      },
    ],
  },

  // ── Love Story ──────────────────────────────────────────
  {
    id: 'loveStory',
    label: 'Love Story',
    icon: 'fa-heart',
    iconColor: '#fff1f2',
    iconFg: '#be123c',
    description: 'Cerita perjalanan cinta pasangan, dibagi per babak.',
    columns: 2,
    fields: [
      { path: 'loveStory.sectionLabel', label: 'Label Kecil', type: 'text', hint: 'Teks kecil di atas judul, contoh: "Kisah Kami"' },
      { path: 'loveStory.sectionTitle', label: 'Judul Section', type: 'text', hint: 'Contoh: "Perjalanan Cinta Kami"' },
    ],
    arrays: [
      {
        path: 'loveStory.chapters',
        label: 'Babak Cerita',
        itemLabel: (item, i) => item.date || `Babak ${i + 1}`,
        addItem: () => ({ date: '', title: '', description: '', image: '' }),
        itemColumns: 2,
        itemLayout: 'profile',
        itemFields: [
          { path: 'image', label: 'Foto', type: 'image', cropAspect: 4 / 3, hint: 'Klik "Crop" untuk menyesuaikan area foto sesuai rasio 4:3 pada layout.', hintTooltip: true },
          { path: 'date', label: 'Tanggal / Periode', type: 'text', placeholder: 'Contoh: Januari 2020' },
          { path: 'title', label: 'Judul Babak', type: 'text', hint: 'Contoh: "Pertama Bertemu"' },
          { path: 'description', label: 'Cerita', type: 'textarea' },
        ],
      },
    ],
  },

  // ── Hitungan Mundur ──────────────────────────────────────
  {
    id: 'countdown',
    label: 'Countdown',
    icon: 'fa-hourglass-half',
    iconColor: '#f0f9ff',
    iconFg: '#0369a1',
    description: 'Pesan dan waktu acara untuk hitungan mundur.',
    columns: 2,
    fields: [
      { path: 'countdown.message', label: 'Pesan', type: 'text', hint: 'Teks yang tampil di atas hitungan mundur', span: 2 },
      { path: 'countdown.date', label: 'Tanggal & Jam Acara', type: 'datetime', span: 2, fallbackDate: 'hero.date', fallbackTime: 'hero.time', hint: 'Waktu tepat acara dimulai — digunakan untuk menghitung mundur. Mengikuti Tanggal & Jam Pernikahan Main Setup jika dikosongkan. Foto latar diatur dari menu Layout.', hintTooltip: true },
    ],
  },

  // ── Akad & Resepsi ───────────────────────────────────────
  {
    id: 'event',
    label: 'Event',
    icon: 'fa-calendar-alt',
    iconColor: '#f0f9ff',
    iconFg: '#0369a1',
    description: 'Detail acara akad nikah dan resepsi.',
    columns: 2,
    fields: [
      { path: 'event.date', label: 'Tanggal Acara (Teks Tampilan)', type: 'date-text', span: 2, fallback: 'hero.date', hint: 'Teks tanggal yang tampil di undangan, contoh: "Sabtu, 12 Oktober 2024" — mengikuti "Tanggal Pernikahan" Main Setup jika dikosongkan.', hintTooltip: true },
      { path: 'event.ceremony.title', label: 'Akad Nikah — Judul', type: 'text' },
      { path: 'event.reception.title', label: 'Resepsi — Judul', type: 'text' },
      { path: 'event.ceremony.time', label: 'Akad Nikah — Waktu', type: 'time-range', placeholder: 'Contoh: 09.00 - 11.00 WIB' },
      { path: 'event.reception.time', label: 'Resepsi — Waktu', type: 'time-range', placeholder: 'Contoh: 12.00 - 14.00 WIB' },
      { path: 'event.ceremony.location', label: 'Akad Nikah — Nama Venue', type: 'text' },
      { path: 'event.reception.location', label: 'Resepsi — Nama Venue', type: 'text' },
      { path: 'event.ceremony.address', label: 'Akad Nikah — Alamat Lengkap', type: 'textarea', span: 1 },
      { path: 'event.reception.address', label: 'Resepsi — Alamat Lengkap', type: 'textarea', span: 1 },
      { path: 'event.ceremony.mapsUrl', label: 'Akad Nikah — Tautan Google Maps', type: 'url', span: 1, hint: 'Tempel tautan dari Google Maps' },
      { path: 'event.reception.mapsUrl', label: 'Resepsi — Tautan Google Maps', type: 'url', span: 1, hint: 'Tempel tautan dari Google Maps' },
    ],
  },

  // ── Siaran Langsung ──────────────────────────────────────
  {
    id: 'livestream',
    label: 'Livestream',
    icon: 'fa-video',
    iconColor: '#f0f9ff',
    iconFg: '#0369a1',
    description: 'Detail siaran langsung acara.',
    columns: 2,
    layout: 'profile',
    fields: [
      { path: 'livestream.image', label: 'Foto', type: 'image', cropAspect: 2 / 1, hint: 'Hanya dipakai jika "Tautan Siaran" bukan link YouTube. Untuk YouTube, thumbnail diambil otomatis dari videonya. Klik "Crop" untuk menyesuaikan area foto sesuai rasio lebar pada layout.', hintTooltip: true },
      { path: 'livestream.title', label: 'Judul', type: 'text', hint: 'Contoh: "Saksikan Siaran Langsung"' },
      { path: 'livestream.buttonText', label: 'Teks Tombol', type: 'text', hint: 'Contoh: "Tonton Siaran"' },
      { path: 'livestream.date', label: 'Tanggal Siaran', type: 'date-text', fallback: 'hero.date', hint: 'Contoh: Sabtu, 12 Oktober 2024 — mengikuti "Tanggal Pernikahan" Main Setup jika dikosongkan.', hintTooltip: true },
      { path: 'livestream.url', label: 'Tautan Siaran', type: 'url', span: 2, hint: 'URL YouTube Live (thumbnail otomatis), Zoom, atau platform siaran lainnya' },
    ],
  },

  // ── Dress Code ──────────────────────────────────────────
  {
    id: 'dressCode',
    label: 'Dress Code',
    icon: 'fa-tshirt',
    iconColor: '#fafaf9',
    iconFg: '#57534e',
    description: 'Panduan berpakaian dan palet warna untuk tamu undangan.',
    fields: [
      { path: 'dressCode.title', label: 'Judul', type: 'text' },
      { path: 'dressCode.text', label: 'Panduan Berpakaian', type: 'textarea', hint: 'Penjelasan singkat mengenai aturan berpakaian untuk tamu' },
    ],
    arrays: [
      {
        path: 'dressCode.colors',
        label: 'Palet Warna',
        itemLabel: (item, i) => item.label || item.hex || `Warna ${i + 1}`,
        addItem: () => ({ hex: '#cccccc', label: '' }),
        itemColumns: 2,
        itemFields: [
          { path: 'hex', label: 'Warna', type: 'color' },
          { path: 'label', label: 'Nama Warna', type: 'text', hint: 'Contoh: Dusty Rose, Sage Green, Navy Blue' },
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
    description: 'Formulir konfirmasi kehadiran tamu undangan.',
    columns: 3,
    fields: [
      { path: 'rsvp.title', label: 'Judul', type: 'text', span: 3 },
      { path: 'rsvp.description', label: 'Deskripsi', type: 'textarea', hint: 'Penjelasan singkat di bawah judul RSVP' },
      { path: 'rsvp.attendanceLabel', label: 'Pilihan: Hadir', type: 'text', hint: 'Contoh: "Saya akan hadir"' },
      { path: 'rsvp.maybeLabel', label: 'Pilihan: Mungkin Hadir', type: 'text', hint: 'Contoh: "Mungkin Datang"' },
      { path: 'rsvp.unableLabel', label: 'Pilihan: Tidak Hadir', type: 'text', hint: 'Contoh: "Maaf, saya tidak bisa hadir"' },
      { path: 'rsvp.guestLabel', label: 'Label Jumlah Tamu', type: 'text', hint: 'Contoh: "Jumlah Tamu yang Dibawa"' },
      { path: 'rsvp.maxGuests', label: 'Batas Tamu per RSVP', type: 'number', hint: 'Jumlah maksimal tamu yang dapat didaftarkan dalam satu pengiriman RSVP' },
      { path: 'rsvp.submitButtonText', label: 'Teks Tombol Kirim', type: 'text', hint: 'Contoh: "Konfirmasi Kehadiran"' },
      { path: 'rsvp.successMessage', label: 'Pesan Sukses', type: 'textarea', hint: 'Ditampilkan setelah formulir berhasil dikirimkan' },
    ],
  },

  // ── Gift ────────────────────────────────────────────────
  {
    id: 'gift',
    label: 'Gift',
    icon: 'fa-gift',
    iconColor: '#fff7ed',
    iconFg: '#c2410c',
    description: 'Informasi rekening bank dan detail pengiriman hadiah.',
    columns: 2,
    fields: [
      { path: 'gift.title', label: 'Judul', type: 'text', span: 2 },
      { path: 'gift.description', label: 'Deskripsi', type: 'textarea' },
      { path: 'gift.confirmButtonText', label: 'Teks Tombol Konfirmasi', type: 'text', hint: 'Contoh: "Konfirmasi Hadiah"' },
      { path: 'gift.popupTitle', label: 'Popup — Judul', type: 'text', hint: 'Judul popup konfirmasi, contoh: "Konfirmasi Hadiah"' },
      { path: 'gift.popupLabelName', label: 'Popup — Label Nama', type: 'text', hint: 'Contoh: "Nama Pengirim"' },
      { path: 'gift.popupLabelBank', label: 'Popup — Label Bank Tujuan', type: 'text', hint: 'Contoh: "Rekening Tujuan"' },
      { path: 'gift.popupLabelAmount', label: 'Popup — Label Jumlah', type: 'text', hint: 'Contoh: "Jumlah Transfer"' },
      { path: 'gift.popupLabelNote', label: 'Popup — Label Catatan', type: 'text', hint: 'Contoh: "Catatan (opsional)"' },
      { path: 'gift.popupSubmitText', label: 'Popup — Teks Tombol Kirim', type: 'text', hint: 'Contoh: "Kirim Konfirmasi"' },
    ],
    arrays: [
      {
        path: 'gift.accounts',
        label: 'Daftar Rekening',
        itemLabel: (item, i) => item.bankName || `Rekening ${i + 1}`,
        addItem: () => ({ bankName: '', bankType: '', accountNumber: '' }),
        itemColumns: 3,
        itemFields: [
          { path: 'bankName', label: 'Nama Penerima', type: 'text' },
          { path: 'bankType', label: 'Nama Bank / Dompet Digital', type: 'text', hint: 'Contoh: BCA, Mandiri, GoPay, OVO' },
          { path: 'accountNumber', label: 'Nomor Rekening', type: 'text' },
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
    tabs: [
      {
        label: 'Konten',
        description: 'Judul dan kutipan yang tampil di bagian atas galeri.',
        columns: 2,
        fields: [
          { path: 'gallery.title', label: 'Judul Section', type: 'textarea', hint: 'Tekan Enter untuk baris baru', span: 1 },
          { path: 'gallery.quote', label: 'Kutipan', type: 'textarea', span: 1, hint: 'Kalimat pendek yang tampil di bawah judul' },
        ],
      },
      {
        label: 'Sorotan Utama',
        description: 'Media utama yang tampil di atas slider — pilih antara video atau foto.',
        columns: 2,
        fields: [
          {
            path: 'gallery.highlightType',
            label: 'Tipe Media Sorotan',
            type: 'radio',
            span: 2,
            options: [
              { value: 'video', label: 'Video', icon: 'fa-film' },
              { value: 'photo', label: 'Foto', icon: 'fa-image' },
            ],
          },
          {
            path: 'gallery.videoFile',
            label: 'File Video',
            type: 'video',
            hint: 'Unggah file video dalam format mp4, mov, atau webm.',
            span: 2,
            showWhen: { path: 'gallery.highlightType', value: 'video', default: 'video' },
          },
          {
            path: 'gallery.videoThumb',
            label: 'Foto Sorotan',
            type: 'image',
            hint: 'Foto yang tampil sebagai sorotan utama di atas slider.',
            span: 2,
            showWhen: { path: 'gallery.highlightType', value: 'photo', default: 'video' },
          },
        ],
      },
      {
        label: 'Slider Media',
        description: 'Foto dan video yang tampil di slider bawah. Seret untuk mengubah urutan.',
        imageLists: [
          { path: 'gallery.images', label: 'Foto & Video Slider', accept: 'image/*,video/*', cropAspect: 4 / 3 },
        ],
      },
    ],
  },

  // ── Thank You ───────────────────────────────────────────
  {
    id: 'thankYou',
    label: 'Thank You',
    icon: 'fa-star',
    iconColor: '#fefce8',
    iconFg: '#a16207',
    description: 'Pesan penutup dan ucapan terima kasih kepada tamu undangan.',
    columns: 2,
    fields: [
      { path: 'thankYou.title', label: 'Judul', type: 'text', hint: 'Teks heading di atas nama mempelai' },
      { path: 'thankYou.note', label: 'Catatan', type: 'textarea', hint: 'Keterangan di bawah nama mempelai — misal harapan atau ucapan khusus dari pasangan' },
    ],
  },
]
