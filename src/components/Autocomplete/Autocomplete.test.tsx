import React from 'react';
import { render, screen } from '@testing-library/react';
import Autocomplete from './index';

/* eslint-disable */
test('renders the autocomplete component', () => {
  const { container } = render(<Autocomplete />);

  const element = container.querySelector('#Autocomplete');

  expect(element).toBeInTheDocument();
});

test('renders the autocomplete input', () => {
  const { container } = render(<Autocomplete />);

  const input = container.querySelector('#Autocomplete__input');

  expect(input).toBeInTheDocument();
});

test('renders the autocomplete dropdown', () => {
  const { container } = render(<Autocomplete />);

  const listbox = container.querySelector('#Autocomplete__listbox');

  expect(listbox).toBeInTheDocument();
});