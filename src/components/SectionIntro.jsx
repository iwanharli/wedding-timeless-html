export default function SectionIntro({ content }) {
  return (
    <div id="pertama" className="section-intro child">
      <div id="home"></div>
      <div className="intro-content">
        <p className="intro-invite-title">WE INVITE YOU TO CELEBRATE</p>
        <div className="intro-names">
          <div className="intro-names-top">
            <span className="intro-name intro-name1">{content.hero.name1}</span>
            <span className="intro-name-connector">{content.hero.connector}</span>
          </div>
          <div className="intro-names-bottom">
            <span className="intro-name intro-name2">{content.hero.name2}</span>
          </div>
        </div>
        <p className="intro-date">{content.hero.date}</p>
        <p className="intro-vow">we make an eternal vow<br />AT THIS MOMENT</p>
        <div className="intro-spacer"></div>
        <p className="intro-scroll-hint">
          <span className="scroll-hint-text">(Scroll Up)</span>
        </p>
      </div>
      <div className="scroll"></div>
    </div>
  )
}
