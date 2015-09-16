import React from 'react';
import RedBox from 'redbox-react';
import ChatWindow from './components/ChatWindow';

export class App extends React.Component {
	render() {
		return (
			<ChatWindow />
		);
	}
}

const root = document.querySelector("#myApp");

try {
  React.render(<App kind="warning" />, root)
} catch (e) {
  React.render(<RedBox error={e} />, root)
}