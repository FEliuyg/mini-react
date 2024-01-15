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

function performUnitOfWork(work) {
  // 1.创建dom
  if (!work.dom) {
    const dom = (work.dom =
      work.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(work.type));

    // work.parent.dom.appendChild(dom);
    // 2.更新props
    Object.keys(work.props).forEach((prop) => {
      if (prop !== 'children') {
        dom[prop] = work.props[prop];
      }
    });
  }

  // 3.创建链表关系
  let prev;
  work.props.children.forEach((child, index) => {
    let unitOfWork = {
      type: child.type,
      props: child.props,
      dom: null,
      child: null,
      sibling: null,
      parent: work,
    };

    if (index === 0) {
      work.child = unitOfWork;
    } else {
      prev.sibling = unitOfWork;
    }
    prev = unitOfWork;
  });

  // 4.返回下个要执行的任务
  if (work.child) {
    return work.child;
  }

  if (work.sibling) {
    return work.sibling;
  }

  return work.parent?.sibling;
}

function commitRoot() {
  commitWork(root.child);

  root = null;
}

function commitWork(work) {
  if (!work) {
    return;
  }

  const domParent = work.parent.dom;
  domParent.appendChild(work.dom);

  commitWork(work.child);
}

export default {
  render,
  createElement,
};
