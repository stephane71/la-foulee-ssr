import Button from './Button';

export class HomePage extends React.PureComponent {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h3>{'Home page'}</h3>
        <Button onClick={this.props.onClick}>
          {'Les évenements autour de moi'}
        </Button>
      </div>
    );
  }
}

export default HomePage;
