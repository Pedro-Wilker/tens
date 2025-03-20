'use client';

import SignForm from './components';
import styles from './page.module.scss';
import { useState } from 'react';

export default function SignPage() {
  const [showWelcomeBox, setShowWelcomeBox] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShowWelcomeBox(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setShowWelcomeBox(false);
    }, 5000);
    setTimeoutId(id);
  };

  return (
    <section className={styles.telaDeLogin}>
      <div
        className={styles.loginBoxWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>Login</h1>
          <SignForm />
        </div>
        <div
          className={`${styles.welcomeBox} ${showWelcomeBox ? styles.welcomeBoxVisible : ''}`}
        >
          <h2 className={styles.welcomeTitle}>Bem-vindo de Volta!</h2>
          <p className={styles.welcomeText}>
            Conecte-se com TENS para encontrar ou oferecer serviços em Tapiramutá.
          </p>
        </div>
      </div>
    </section>
  );
}