export const CONTENT_SECTIONS = [
  // ── Main Setup (General + Media Global) ──────────────────
  {
    id: 'mainSetup',
    label: 'Main Setup',
    tabs: [
      {
        label: 'Info Pernikahan',
        description: 'Nama pasangan dan tanggal pernikahan yang tampil di seluruh halaman undangan.',
        columns: 3,
        fields: [
          { path: 'hero.name1', label: 'Nama Mempelai 1', type: 'text', hint: 'Muncul di halaman cover, intro, dan panel kiri' },
          { path: 'hero.connector', label: 'Kata Penghubung', type: 'text', hint: 'Contoh: "dan", "&", "and"' },
          { path: 'hero.name2', label: 'Nama Mempelai 2', type: 'text', hint: 'Muncul di halaman cover, intro, dan panel kiri' },
          { path: 'hero.date', label: 'Tanggal Pernikahan', type: 'date-text', hint: 'Muncul di halaman cover, intro, dan hitungan mundur', span: 3 },
        ],
      },
      {
        label: 'Background Left Desktop',
        description: 'Media yang tampil di panel kiri layar setelah undangan dibuka.',
        fields: [
          { path: 'hero.leftPanel', label: '', type: 'media', compact: true },
        ],
      },
      {
        label: 'Background Right Mobile',
        description: 'Video latar utama. Dipakai oleh section yang diset bertipe "Video" di Section Layout.',
        fields: [
          { path: 'hero.backgroundVideo', label: 'Video Background', type: 'video' },
        ],
      },
      {
        label: 'Background Music',
        description: 'Musik yang otomatis diputar saat undangan dibuka.',
        fields: [
          { path: 'audio.track', label: 'File Musik', type: 'audio', hint: 'Format yang didukung: mp3, wav, ogg' },
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
      { path: 'hero.inviteTitle', label: 'Judul Undangan', type: 'text', hint: 'Muncul di halaman cover dan bagian intro awal', span: 2 },
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
      { path: 'hero.inviteTitle', label: 'Judul Undangan', type: 'text', hint: 'Sama dengan judul di halaman cover', span: 2 },
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
          { path: 'groom.title', label: 'Gelar / Sapaan', type: 'text', hint: 'Contoh: dr., Ir., S.T. — kosongkan jika tidak ada' },
          { path: 'groom.firstName', label: 'Nama Depan', type: 'text' },
          { path: 'groom.lastName', label: 'Nama Belakang', type: 'text' },
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
          { path: 'bride.title', label: 'Gelar / Sapaan', type: 'text', hint: 'Contoh: dr., S.Pd., S.Kom. — kosongkan jika tidak ada' },
          { path: 'bride.firstName', label: 'Nama Depan', type: 'text' },
          { path: 'bride.lastName', label: 'Nama Belakang', type: 'text' },
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
          { path: 'image', label: 'Foto', type: 'image' },
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
      { path: 'countdown.date', label: 'Tanggal & Jam Acara', type: 'datetime', hint: 'Waktu tepat acara dimulai — digunakan untuk menghitung mundur. Foto latar diatur dari menu Layout.', span: 2 },
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
      { path: 'event.date', label: 'Tanggal Acara (Teks Tampilan)', type: 'date-text', hint: 'Teks tanggal yang tampil di undangan, contoh: "Sabtu, 12 Oktober 2024"', span: 2 },
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
      { path: 'livestream.image', label: 'Foto', type: 'image', hint: 'Hanya dipakai jika "Tautan Siaran" bukan link YouTube. Untuk YouTube, thumbnail diambil otomatis dari videonya.' },
      { path: 'livestream.title', label: 'Judul', type: 'text', hint: 'Contoh: "Saksikan Siaran Langsung"' },
      { path: 'livestream.buttonText', label: 'Teks Tombol', type: 'text', hint: 'Contoh: "Tonton Siaran"' },
      { path: 'livestream.date', label: 'Tanggal Siaran', type: 'date-text', hint: 'Contoh: Sabtu, 12 Oktober 2024' },
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
          { path: 'gallery.images', label: 'Foto & Video Slider', accept: 'image/*,video/*' },
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
