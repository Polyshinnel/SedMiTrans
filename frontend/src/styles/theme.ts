import { createTheme } from '@mantine/core';

export const theme = createTheme({
  colors: {
    brandOrange: [
      '#fff4eb',
      '#ffe7d6',
      '#ffd0b4',
      '#ffb58c',
      '#ff9b67',
      '#ff8946',
      '#ff7c1f',
      '#dc6514',
      '#b8500c',
      '#913c06',
    ],
    brandGray: [
      '#f8f8f7',
      '#eeecea',
      '#d9d6d2',
      '#c1bcb6',
      '#a69f98',
      '#827a73',
      '#4f4943',
      '#423d38',
      '#302c28',
      '#1f1c19',
    ],
  },
  primaryColor: 'brandOrange',
  primaryShade: 6,
  fontFamily: 'var(--font-manrope), Arial, sans-serif',
  headings: { fontFamily: 'var(--font-manrope), Arial, sans-serif' },
});
