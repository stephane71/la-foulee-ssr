import moment from 'moment';

export default function getEventDescription(event) {
  const date = moment
    .unix(event.date)
    .utc()
    .format('dddd DD/MM/YYYY');

  return `Retrouvez toutes les informations sur l'évènement '${
    event.title
  }' le ${date} à ${event.city} (${
    event.department.code
  }): épreuves, départs, tarifs, site de l'organisateur`;
}
