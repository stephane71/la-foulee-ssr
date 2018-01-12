import EventListItem from './EventListItem';

export default props => (
  <div>
    {props.data.map(eventListDay =>
      eventListDay.map(event => <EventListItem data={event} />)
    )}
  </div>
);
