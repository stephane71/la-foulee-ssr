const EventPage = ({ query }) => (
  <div className={'EventPage'}>
    {query.keyword ?
    JSON.stringify(query) : <div>{`Cette évenement n'existe pas :(`}</div>}

    <style jsx>{`
      .EventPage {
      }
    `}</style>
  </div>
);

export default EventPage;
