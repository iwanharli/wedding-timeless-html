function SocialLinks({ person }) {
  const links = [
    person.instagramUsername && { href: `https://instagram.com/${person.instagramUsername}`, icon: 'fab fa-instagram', label: person.instagramUsername },
    person.tiktokUsername    && { href: `https://tiktok.com/@${person.tiktokUsername}`,      icon: 'fab fa-tiktok',    label: person.tiktokUsername },
    person.facebookUrl       && { href: person.facebookUrl,                                   icon: 'fab fa-facebook',  label: 'Facebook' },
    person.twitterUsername   && { href: `https://x.com/${person.twitterUsername}`,            icon: 'fab fa-x-twitter', label: person.twitterUsername },
  ].filter(Boolean)

  if (!links.length) return null
  return (
    <div className="profile-socials">
      {links.map((l, i) => (
        <a key={i} className="profile-social-btn" href={l.href} target="_blank" rel="noopener">
          <i className={l.icon} />
          <span>{l.label}</span>
        </a>
      ))}
    </div>
  )
}

export default function SectionBride({ content }) {
  const b = content.bride
  return (
    <div className="section-profile section-bride child">
      <div className="profile-card" data-aos="fade-up" data-aos-duration="900">

        <div className="profile-photo-wrap">
          <img src={b.image} className="profile-photo" alt="" />
          <div className="profile-photo-gradient" />
        </div>

        <div className="profile-body">
          <span className="profile-role">{b.title}</span>

          <div className="profile-names">
            <h2 className="profile-firstname">{b.firstName}</h2>
            <h2 className="profile-lastname">{b.lastName}</h2>
          </div>

          <div className="profile-divider" />

          <p className="profile-relation">{b.relation}</p>
          <p className="profile-relation-desc">{b.relationDescription}</p>

          <SocialLinks person={b} />
        </div>

      </div>
    </div>
  )
}
