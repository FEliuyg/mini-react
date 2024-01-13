function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'string' ? createTextElement(child) : child
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, parent) {
  const { type, props } = element;
  const dom = type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);

  Object.keys(props).forEach((prop) => {
    if (prop !== 'children') {
      dom[prop] = props[prop];
    }
  });

  props.children.forEach((child) => render(child, dom));
  parent.appendChild(dom);
}

export default {
  render,
  createElement,
};
