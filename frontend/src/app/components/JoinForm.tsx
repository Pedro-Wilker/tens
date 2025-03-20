"use client";

import { useState } from "react";
import styles from "../page.module.scss";

export default function JoinForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Enviar mensagem para o WhatsApp
      const message = `Olá, meu nome é ${name}. Quero me cadastrar como profissional na TENS. Meu e-mail é ${email} e meu telefone é ${phone}.`;
      const whatsappUrl = `https://wa.me/5574981054996?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappUrl;

      setSuccessMessage("Redirecionando para o WhatsApp...");
      setError(null);

      // Limpar o formulário após o envio
      setName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      console.error("Erro ao enviar mensagem:", err);
      setError("Erro ao enviar sua mensagem. Tente novamente.");
      setSuccessMessage(null);
    }
  };

  return (
    <section className={styles.join}>
      <h2 className={styles.joinTitle}>Junte-se a nós em Tapiramutá</h2>
      <p className={styles.joinSubtitle}>
        Torne-se um profissional e alcance clientes na sua região.
      </p>
      <form className={styles.joinForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Seu nome"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Seu telefone"
          className={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" className={styles.joinButton}>
          Cadastre-se
        </button>
      </form>
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
}