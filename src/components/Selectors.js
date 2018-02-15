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
  constructor(props) {
    super(props);

    this.state = {
      city: null,
      month: null
    };

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSelectorsValidation = this.handleSelectorsValidation.bind(this);
  }

  render() {
    return (
      <div className={'selectorsContainer'}>
        <div className={'selectorsLayout'}>
          <div>
            <Select
              name={'city'}
              label={'Localisation'}
              placeholder={'ex: Lyon'}
              listComponent={GoogleMapPlacesApi}
              onChange={this.handleSelectChange}
            />
            <Select
              name={'month'}
              label={'À partir du mois'}
              placeholder={'cliquez pour sélectionner un mois'}
              listComponent={MonthWrapper}
              onChange={this.handleSelectChange}
            />
          </div>

          <div className={'selectorsValidation'}>
            <Button onClick={this.handleSelectorsValidation}>
              {'Appliquer'}
            </Button>
          </div>
        </div>

        <style jsx>{`
          .selectorsContainer {
            padding: 0 ${getSpacing('m')}px;
            position: relative;
            height: 100%;
          }

          .selectorsLayout {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          }

          .selectorsValidation {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: ${getSpacing('m')}px;
          }
        `}</style>
      </div>
    );
  }

  handleSelectChange(data) {
    this.setState(data);
  }

  handleSelectorsValidation() {
    let { city, month } = this.state;
    this.props.validate({ city, month });
  }
}

export default Selectors;
