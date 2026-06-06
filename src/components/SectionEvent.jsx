export default function SectionEvent({ content }) {
  const ev = content.event
  return (
    <div id="weddingevent" className="section-event child">
      <div className="ev-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 409.3 365.1">
          <g><path d="M0,227.1v1.5H42.2l.3,55.2.2,55.2-4.7.4c-2.7.2,5.3.4,17.7.5,24.4.2,28.3-.3,37.9-5.3,11.7-5.9,21.4-19.8,24.6-35,1.9-9.1,1.9-25.3,0-33.4-3.5-14.9-13.3-27.4-26.2-33.7l-5.8-2.9,6-.7c20-2.3,34.3-15.6,40-37.3,2.5-9.4,3-27.4,1.1-37.5-2.3-12.3-7.9-23.2-15.6-30.4-3.4-3.1-6.5-5.6-7.1-5.6a1,1,0,0,1-.9-1c0-.6,2.8-1.1,6.3-1.2,5.7-.1,5.8-.2,1.4-.5s-4.7-.6-4.1-2.6,4-11.3,8.1-22.5l7.5-20.2h23.8c21.7,0,23.8.2,24.5,1.7,3.7,9.5,15.5,41.6,15.5,42.3s-2.1,1.1-4.7,1.3,2.5.4,11.3.5c12.8.2,16.4.5,17.4,1.7s1.1,11.1.8,42.2c-.4,39.1-.5,41.1-2.7,47.7s-3.3,8-7.9,12.6c-6.7,6.7-13.3,9-25.3,9-15.5,0-25-5.9-30-18.5l-2.4-6v-88l3-.6c1.7-.4-1.7-.7-7.5-.7s-8.9.3-7,.7l3.5.6.5,42.5c.5,41.2.6,42.7,2.8,48.1,4.6,11.5,11.9,18.3,23,21.5,4.1,1.2,7.9,1.4,16,1,28.7-1.7,35.3-1.8,36.7-.6s1.5,9.1,1.5,54.4c0,29.2-.4,53.7-.8,54.4s-3.6,1.2-11.1,1l-10.2-.3-18-48c-9.8-26.4-19.2-51.4-20.8-55.5l-2.8-7.5h-7.9c-4.4-.1-6.2.1-4.1.3s3.7.8,3.7,1.2-16.7,47.2-30.8,85.6l-8.8,24-4.9.6c-3.3.4-1.5.6,5.5.6s8.3-.2,5.7-.4-4.7-.7-4.2-2.1,4-11.2,8.3-22.7l7.7-21,23.1-.3c18-.2,23.3,0,24.1,1s4.4,10.3,8.6,21.3,7.8,20.8,8.2,21.7-.1,1.7-4.2,2.1c-2.6.2,7.4.3,22.2.4s25.2-.2,23-.4-4.3-1-4.7-1.6-1-104-.2-107.4.9-2.3,14.5-2.3,19.4,1,22.3,5.1c1.4,2.1,1.6,7.7,1.6,52.4,0,27.5-.4,50.5-.8,51.1s-2.6,1.8-5,2.5c-4.8,1.4-6.7,3.2-5.8,5.4s7.7,1.5,12.9-3.4c2.5-2.3,3.6-2.6,9-2.5,8.2.2,18.4,3.7,37.9,13,22.1,10.4,31.4,13.4,42.1,13.4,23,0,41.3-13.8,49.2-37.3,4.8-14.3,4.1-28.2-2-41.5-7.3-15.8-25.7-30.4-31.3-24.8-2.5,2.5-.5,4.7,5.8,6.3,17.9,4.6,29,20.8,29,42.3,0,18.9-10.7,35.2-28.5,43.6-16.3,7.7-27.1,6.8-57.9-4.8-22.3-8.4-30.7-10.8-40.9-11.5-7.6-.5-8.7-.8-8-2.2s.9-13.7,1.1-28.4l.3-26.8,18.4.3c17.3.3,18.6.4,20.6,2.4a14.5,14.5,0,0,1,2.9,5.5c.5,2.2.8-1.1.8-9.6s-.3-11.9-.5-10.5c-1.5,9.5-3.9,10.5-25.3,10.5H274.2l-.3-25.3-.2-25.4,22.2.4c24,.3,26.3.8,30,5.8,1,1.4,2.2,5.2,2.7,8.5.8,5.7.9,5.5,1-4.8V227.1Z"/></g>
        </svg>
      </div>

      <h2
        className="ev-date"
        data-aos="fade"
        data-aos-offset="0"
        data-aos-delay="300"
        data-aos-duration="900"
      >
        {ev.date.replace(',', ',\n')}
      </h2>

      <div className="ev-cards">
        {/* Holy Matrimony */}
        <div
          className="ev-card"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="600"
          data-aos-duration="900"
        >
          <h3 className="ev-card-title">
            <span>{ev.ceremony.title}</span><br />
            <span>{ev.ceremony.time}</span><br />
            <span>{ev.ceremony.location}</span>
          </h3>
          <p
            className="ev-card-address"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {ev.ceremony.address}
          </p>
          <a
            className="ev-maps-btn"
            href={ev.ceremony.mapsUrl}
            target="_blank"
            rel="noopener"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            GOOGLE MAPS
          </a>
        </div>

        {/* Reception */}
        <div
          className="ev-card"
          data-aos="fade"
          data-aos-offset="0"
          data-aos-delay="1000"
          data-aos-duration="900"
        >
          <h3 className="ev-card-title">
            <span>{ev.reception.title}</span><br />
            <span>{ev.reception.time}</span><br />
            <span>{ev.reception.location}</span>
          </h3>
          <p
            className="ev-card-address"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {ev.reception.address}
          </p>
          <a
            className="ev-maps-btn"
            href={ev.reception.mapsUrl}
            target="_blank"
            rel="noopener"
            data-aos="fade"
            data-aos-offset="0"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            GOOGLE MAPS
          </a>
        </div>
      </div>
    </div>
  )
}
