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

export default function SectionGroom({ content }) {
  const g = content.groom
  return (
    <div id="profile" className="section-profile child">
      <div className="profile-card">

        <div className="profile-photo-wrap" data-aos="fade" data-aos-delay="0" data-aos-duration="1200">
          <img src={imgSrc(g.image)} onError={handleImgError} className="profile-photo" loading="lazy" alt="" />
          <div className="profile-photo-tint" />
          <div className="profile-photo-gradient" />
        </div>

        <div className="profile-body">
          <span className="profile-role" data-aos="fade-up" data-aos-delay="150" data-aos-duration="900">{g.title || content.hero.titlePrefix1}</span>

          <div className="profile-names" data-aos="fade-up" data-aos-delay="250" data-aos-duration="900">
            <h2 className="profile-firstname">{g.firstName || content.hero.firstName1}</h2>
            <h2 className="profile-lastname">{g.lastName || content.hero.lastName1}</h2>
          </div>

          <div className="profile-divider" data-aos="fade-up" data-aos-delay="350" data-aos-duration="900" />

          <p className="profile-relation" data-aos="fade-up" data-aos-delay="400" data-aos-duration="900">{g.relation}</p>
          <p className="profile-relation-desc" data-aos="fade-up" data-aos-delay="450" data-aos-duration="900">{g.relationDescription}</p>

          <div data-aos="fade-up" data-aos-delay="500" data-aos-duration="900">
            <SocialLinks person={g} />
          </div>
        </div>

      </div>
    </div>
  )
}
