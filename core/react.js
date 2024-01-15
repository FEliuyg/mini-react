function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode = typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextElement(child) : child;
      }),
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
  const rootWork = {
    dom: parent,
    props: {
      children: [element],
    },
  };

  root = rootWork;
  nextUnitOfWork = performUnitOfWork(rootWork);
}

let nextUnitOfWork = null;
let root = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && root) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function createDom(fiber) {
  return fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(fiber.type);
}

function updateProps(dom, props) {
  // 2.更新props
  Object.keys(props).forEach((prop) => {
    if (prop !== 'children') {
      dom[prop] = props[prop];
    }
  });
}

function initChildren(fiber, children) {
  let prev;
  children.forEach((child, index) => {
    let unitOfWork = {
      type: child.type,
      props: child.props,
      dom: null,
      child: null,
      sibling: null,
      parent: fiber,
    };

    if (index === 0) {
      fiber.child = unitOfWork;
    } else {
      prev.sibling = unitOfWork;
    }
    prev = unitOfWork;
  });
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';

  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber));

      updateProps(dom, fiber.props);
    }
  }

  // 3.创建链表关系
  const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children;
  initChildren(fiber, children);

  // 4.返回下个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  if (fiber.sibling) {
    return fiber.sibling;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function commitRoot() {
  commitWork(root.child);

  root = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    fiberParent.dom.appendChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export default {
  render,
  createElement,
};
