function formatDistance(value) {
  if (!value) return value;
  if (value < 1000) return `${value}m`;
  return `${value / 1000}km`;
}

const EMPTY_VALUE = '-';

const EventDetailsActivities = ({ data }) => {
  if (!data.activities || !data.activities.length) return null;

  return (
    <table className={'Table'}>
      <thead className={'Table-Head'}>
        <tr className={'Table-Row'}>
          <th className={'Table-DataHeader'} />
          <th className={'Table-DataHeader'}>{`Départ`}</th>
          <th className={'Table-DataHeader'}>{`Prix`}</th>
        </tr>
      </thead>
      <tbody className={'Table-Body'}>
        {data.activities
          .sort((act1, act2) => act2.distance - act1.distance)
          .map(({ distance, time, price, title }, i) => (
            <tr className={'Table-Row'} key={i}>
              <td className={'Table-DataCell Table-DataCell--bold'}>
                {formatDistance(distance) || EMPTY_VALUE}
              </td>
              <td className={'Table-DataCell'}>{time || EMPTY_VALUE}</td>
              <td className={'Table-DataCell'}>
                {price ? `${price}€` : EMPTY_VALUE}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default EventDetailsActivities;
