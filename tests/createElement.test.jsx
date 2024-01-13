import React from '../core/react';
import { test, expect } from 'vitest';

test('createElement render when props is null', () => {
  const el = <div>Hello, World!</div>;

  expect(el).toEqual({
    type: 'div',
    props: {
      children: [
        {
          type: 'TEXT_ELEMENT',
          props: {
            nodeValue: 'Hello, World!',
            children: [],
          },
        },
      ],
    },
  });
});

test('createElement render with className', () => {
  const el = <div className='app'>Hello, World!</div>;

  expect(el).toEqual({
    type: 'div',
    props: {
      className: 'app',
      children: [
        {
          type: 'TEXT_ELEMENT',
          props: {
            nodeValue: 'Hello, World!',
            children: [],
          },
        },
      ],
    },
  });
});
