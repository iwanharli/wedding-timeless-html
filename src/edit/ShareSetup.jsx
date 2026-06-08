import SectionForm from './SectionForm'

const SHARE_SCHEMA = {
  id: 'share',
  label: 'Share Setup',
  description: 'Atur metadata dan template pesan WhatsApp untuk tautan undangan.',
  fields: [
    {
      path: 'share.whatsappTemplate',
      label: 'Template Pesan WhatsApp',
      type: 'textarea',
      hint: 'Gunakan {{name}} untuk nama tamu dan {{link}} untuk tautan undangan.',
    },
    {
      path: 'share.ogTitle',
      label: 'OG Title',
      type: 'text',
      hint: 'Judul halaman yang akan dipakai oleh preview saat dibagikan.',
    },
    {
      path: 'share.ogDescription',
      label: 'OG Description',
      type: 'textarea',
      hint: 'Deskripsi singkat untuk preview tautan undangan.',
    },
    {
      path: 'share.ogImage',
      label: 'OG Image',
      type: 'image',
      hint: 'Upload gambar yang akan dipakai sebagai thumbnail preview.',
    },
  ],
}

export default function ShareSetup({ draft, onFieldChange }) {
  return (
    <SectionForm
      schema={SHARE_SCHEMA}
      draft={draft}
      onFieldChange={onFieldChange}
      onArrayChange={() => {}}
    />
  )
}
