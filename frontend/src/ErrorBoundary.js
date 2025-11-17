import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('React Error:', error, info); }
  render() {
    if (this.state.error) {
      return <div style={{padding:20, color:'red'}}>Chyba aplikace: {this.state.error.toString()}</div>;
    }
    return this.props.children;
  }
}