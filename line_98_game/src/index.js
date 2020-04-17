import React from 'react';
import ReactDOM from 'react-dom';


class Hello extends React.Component {
  render() {
    let msgElem = <i>Hello, world!</i>;
    return <h1>{msgElem}</h1> ;
  }
}

ReactDOM.render(
  <Hello />,
  document.getElementById('line98EntryPoint')
);
