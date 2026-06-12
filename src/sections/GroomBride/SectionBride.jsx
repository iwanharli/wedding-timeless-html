import { imgSrc, handleImgError } from '../../lib/image'
import './groom-bride.css'

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
      <div className="profile-card">

        <div className="profile-photo-wrap" data-aos="fade" data-aos-delay="0" data-aos-duration="500">
          <img src={imgSrc(b.image)} onError={handleImgError} className="profile-photo" loading="lazy" alt="" />
          <div className="profile-photo-tint" />
          <div className="profile-photo-gradient" />
        </div>

        <div className="profile-body">
          <span className="profile-role" data-aos="fade-up" data-aos-delay="60" data-aos-duration="500">{b.title || content.hero.titlePrefix2}</span>

          <div className="profile-names" data-aos="fade-up" data-aos-delay="100" data-aos-duration="500">
            <h2 className="profile-firstname">{b.firstName || content.hero.firstName2}</h2>
            <h2 className="profile-lastname">{b.lastName || content.hero.lastName2}</h2>
          </div>

          <div className="profile-divider" data-aos="fade-up" data-aos-delay="140" data-aos-duration="500" />

          <p className="profile-relation" data-aos="fade-up" data-aos-delay="160" data-aos-duration="500">{b.relation}</p>
          <p className="profile-relation-desc" data-aos="fade-up" data-aos-delay="180" data-aos-duration="500">{b.relationDescription}</p>

          <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="500">
            <SocialLinks person={b} />
          </div>
        </div>

      </div>
    </div>
  )
}
