import Select from './Select';
import { getSpacing } from '../styles-variables';
import GoogleMapPlacesApi from './GoogleMapPlacesApi';

import { Fragment } from 'react';
import moment from 'moment';
const MonthWrapper = props => (
  <Fragment>{props.children(moment.months())}</Fragment>
);

export class Selectors extends React.PureComponent {
  render() {
    return (
      <div className={'selectors-constainer'}>
        <h2>{'Rechercher une course'}</h2>

        <div className={'selectors-form'}>
          <Select
            label={'Localisation'}
            placeholder={'ex: Lyon'}
            listComponent={GoogleMapPlacesApi}
          />
          <Select
            label={'À partir du mois'}
            placeholder={'cliquez pour sélectionner un mois'}
            listComponent={MonthWrapper}
          />
        </div>

        <style jsx>{`
          .selectors-constainer {
            padding: 0 ${getSpacing('m')}px;
          }
        `}</style>
      </div>
    );
  }
}

export default Selectors;
