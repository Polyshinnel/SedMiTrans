'use client';

import { IconArrowUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import styles from './scroll-to-top.module.css';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Прокрутить страницу в начало"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <IconArrowUp size={20} stroke={2} aria-hidden="true" />
    </button>
  );
}
