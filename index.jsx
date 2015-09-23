import React from 'react';
import RedBox from 'redbox-react';
import ChatWindowContainer from './components/ChatWindowContainer';

class App extends React.Component {
  componentWillMount() {
    let isLocal = document.location.hostname == 'localhost';
    this.username = isLocal ? 'justin' : '';
    if (!this.username) {
      while (!(this.username = prompt('Enter a username'))){}
    }
  }
  render() {
    return <ChatWindowContainer username={this.username} />;
  }
}

const root = document.querySelector("#myApp");

try {
  React.render(<App />, root)
} catch (e) {
  React.render(<RedBox error={e} />, root)
}