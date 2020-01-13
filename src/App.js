import React from 'react';
import Layout from './components/Layout.js';
import './index.css';

export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Layout title="Chat App bAby" />
      </div>
    )
  };
};
