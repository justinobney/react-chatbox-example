import React from 'react';
import RedBox from 'redbox-react';
import ChatWindow from './components/ChatWindow';

export class App extends React.Component {
  componentWillMount() {
    this.username = '';
    while (!(this.username = prompt('Enter a username'))){}
  }
	render() {
		return (
			<ChatWindow username={this.username}/>
		);
	}
}

const root = document.querySelector("#myApp");

try {
  React.render(<App />, root)
} catch (e) {
  React.render(<RedBox error={e} />, root)
}