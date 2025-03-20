'use client';

import { useState } from 'react';
import styles from '../page.module.scss';
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../teste';
import { ActionResponse } from '@/types/user-types';

export default function SignForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const result: ActionResponse = await loginUser(formData);
      if (result.success) {
        router.push('/services');
      } else {
        setError(result.message || 'Erro ao fazer login. Tente novamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
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
            type="email"
            name="email"
            className={styles.inputField}
            placeholder="Digite um email"
          />
        </div>
        <div className={styles.inputGroup}>
          <Lock className={styles.lockIcon} />
          <input
            required
            type={showPassword ? 'text' : 'password'}
            name="password"
            className={styles.inputField}
            placeholder="Senha de acesso"
          />
          <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <button type="submit" className={styles.loginButton}>
          <b>Entrar</b>
        </button>
      </form>
      <div className={styles.signupLink}>
        Não faz parte de TENS ainda? <Link href="/session/signup">Venha se cadastrar</Link>
      </div>
    </>
  );
}