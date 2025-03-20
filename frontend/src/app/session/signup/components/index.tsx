'use client';

import { useState } from 'react';
import styles from '../page.module.scss';
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import Email from '@mui/icons-material/Email';
import { Phone } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../teste';
import { ActionResponse } from '@/types/user-types';

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const result: ActionResponse = await registerUser(formData);
      if (result.success) {
        router.push('/session/sign');
      } else {
        setError(result.message || 'Erro ao registrar usuário. Tente novamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar usuário. Tente novamente.');
    }
  };

  return (
    <>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form action={handleSubmit}>
        <div className={styles.inputGroup}>
          <Person className={styles.userIcon} />
          <input
            required
            type="text"
            name="name"
            placeholder="USUÁRIO"
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <Email className={styles.emailIcon} />
          <input
            required
            type="email"
            name="email"
            placeholder="EMAIL"
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <Phone className={styles.phoneIcon} />
          <input
            required
            type="tel"
            name="number"
            placeholder="TELEFONE"
            className={styles.inputField}
            pattern="\d{10,11}"
            title="O número deve ter 10 ou 11 dígitos."
          />
        </div>
        <div className={styles.inputGroup}>
          <Lock className={styles.lockIcon} />
          <input
            required
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="SENHA"
            className={styles.inputField}
          />
          <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <button type="submit" className={styles.signupButton}>
          <b>Criar</b>
        </button>
      </form>
      <div className={styles.loginLink}>
        Já possui login? <Link href="/session/sign">Login</Link>
      </div>
    </>
  );
}