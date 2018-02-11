import moment from 'moment';
import { Fragment } from 'react';

import Button from './Button';
import Select from './Select';
import GoogleMapPlacesApi from './GoogleMapPlacesApi';

import { getSpacing } from '../styles-variables';

const MonthWrapper = props => (
  <Fragment>{props.children(moment.months())}</Fragment>
);

export class Selectors extends React.PureComponent {
  render() {
    return (
      <div className={'selectorsContainer'}>
        <h2>{'Rechercher une course'}</h2>

        <div className={'selectorsLayout'}>
          <div>
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

          <Button>{'Appliquer'}</Button>
        </div>

        <style jsx>{`
          .selectorsContainer {
            padding: 0 ${getSpacing('m')}px;
            height: 100%;
            position: relative;
          }

          .selectorsLayout {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
        `}</style>
      </div>
    );
  }
}

export default Selectors;
