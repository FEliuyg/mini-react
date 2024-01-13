import React from './react.js';

const ReactDOM = {
  createRoot(container) {
    return {
      render(app) {
        React.render(app, container);
      },
    };
  },
};

export default ReactDOM;
