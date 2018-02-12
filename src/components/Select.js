import debounce from 'lodash.debounce';
import css from 'styled-jsx/css';

import Input from './Input';
import SelectListItems from '../components/SelectListItems';

import { getSpacing } from '../styles-variables';

const style = css`
  .selectWrapper {
    margin-bottom: ${getSpacing('s')}px;
  }

  .selectInputWrapper {
    margin-bottom: ${getSpacing('xxs')}px;
  }

  .inputLabel {
    padding-left: ${getSpacing('xs')}px;
  }
`;

export class Select extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleItemSelection = this.handleItemSelection.bind(this);

    this.toggleItemList = this.toggleItemList.bind(this);
    this.toggleItemList = debounce(this.toggleItemList, 300);

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
        <label className={'inputLabel'}>{this.props.label}</label>
        <div className={'selectInputWrapper'}>
          <Input
            value={this.state.inputValidated}
            placeholder={this.props.placeholder}
            onChange={this.updateInput}
            onFocus={() => this.toggleItemList(false)}
            onBlur={() => this.toggleItemList(true)}
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

  toggleItemList(toggle) {
    this.setState({ hideListItems: toggle });
  }

  updateInput(value) {
    this.setState({ input: value });
  }

  handleItemSelection(value) {
    this.setState({ inputValidated: value, input: '' });
    this.props.onChange({ [this.props.name]: value });
  }
}

export default Select;
