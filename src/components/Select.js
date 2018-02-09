import debounce from 'lodash.debounce';
import css from 'styled-jsx/css';

import Input from './Input';
import SelectListItems from '../components/SelectListItems';

import { getSpacing } from '../styles-variables';

const style = css`
  .selectWrapper {
  }

  .selectInputWrapper {
    margin-bottom: ${getSpacing('xxs')}px;
  }
`;

export class Select extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleItemSelection = this.handleItemSelection.bind(this);

    this.toggleHideListItems = this.toggleHideListItems.bind(this);
    this.toggleHideListItems = debounce(this.toggleHideListItems, 300);

    this.updateInput = this.updateInput.bind(this);
    this.updateInput = debounce(this.updateInput, 250);
  }

  state = {
    input: '',
    inputValidated: '',
    hideListItems: true
  };

  render() {
    let ListComponent = this.props.listComponent;

    return (
      <div className={`selectWrapper`}>
        <div className={'selectInputWrapper'}>
          <Input
            value={this.state.inputValidated}
            onChange={this.updateInput}
            onFocus={this.toggleHideListItems}
            onBlur={this.toggleHideListItems}
          />
        </div>

        <ListComponent input={this.state.input}>
          {predictions => (
            <SelectListItems
              hide={this.state.hideListItems}
              items={predictions}
              onSelect={this.handleItemSelection}
            />
          )}
        </ListComponent>

        <style jsx>{style}</style>
      </div>
    );
  }

  toggleHideListItems(event) {
    this.setState({ hideListItems: !this.state.hideListItems });
  }

  updateInput(value) {
    this.setState({ input: value });
  }

  handleItemSelection(value) {
    this.setState({ inputValidated: value });
  }
}

export default Select;
