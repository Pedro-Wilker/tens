'use client';

import SignupForm from './components';
import styles from './page.module.scss';
import { useState } from 'react';

export default function SignupPage() {
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
    <section className={styles.signupPage}>
      <div
        className={styles.signupBoxWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.signupBox}>
          <h1 className={styles.signupTitle}>Crie Sua Conta</h1>
          <SignupForm />
        </div>
        <div
          className={`${styles.welcomeBox} ${showWelcomeBox ? styles.welcomeBoxVisible : ''}`}
        >
          <h2 className={styles.welcomeTitle}>Bem-vindo ao TENS!</h2>
          <p className={styles.welcomeText}>
            Junte-se à comunidade de Tapiramutá e comece a oferecer ou encontrar serviços.
          </p>
        </div>
      </div>
    </section>
  );
}