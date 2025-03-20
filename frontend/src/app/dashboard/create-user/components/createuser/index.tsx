"use client";

import { useState } from "react";
import { api } from "@/services/api";
import styles from "./create-user-form.module.scss";
import { useRouter } from "next/navigation";

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [analfabeto, setAnalfabeto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim() || !number.trim()) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "https://tensoportunidades.com.br:8080/users",
        { name, email, password, number, analfabeto },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = response.data.id;
      setSuccess("Usuário criado com sucesso!");
      setError(null);
      setName("");
      setEmail("");
      setPassword("");
      setNumber("");
      setAnalfabeto(false);
      setTimeout(() => router.push(`/dashboard/choose-role?userId=${userId}`), 1000);
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      setError(error.response?.data?.error || "Erro ao criar usuário. Tente novamente.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
            placeholder="Ex: João Silva"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
            placeholder="Ex: joao@example.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
            placeholder="Digite uma senha segura"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="number">Número</label>
          <input
            type="tel"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
            placeholder="Ex: 11999999999"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="analfabeto">
            <input
              type="checkbox"
              id="analfabeto"
              checked={analfabeto}
              onChange={(e) => setAnalfabeto(e.target.checked)}
              disabled={loading}
              className={styles.checkbox}
            />
            Usuário é analfabeto
          </label>
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Criando..." : "Criar Usuário"}
        </button>
      </form>
    </div>
  );
}