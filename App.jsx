import React from './core/react.js';

function Counter({ num }) {
  return <div>count: {num}</div>;
}

function App() {
  return (
    <div className='App'>
      Hello React
      <Counter num={111} />
      <Counter num={222} />
    </div>
  );
}

export default App;
