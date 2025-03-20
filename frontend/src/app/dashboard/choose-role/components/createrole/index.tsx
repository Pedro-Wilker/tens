"use client";

import { useState } from "react";
import { api } from "@/services/api";
import styles from "./choose-role-form.module.scss";
import { useRouter } from "next/navigation";

interface Props {
  userId: number;
  token: string | null | undefined;
}

export default function ChooseRoleForm({ userId, token }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChooseClient = () => {
    router.push("/dashboard");
  };

  const handleChooseProvider = async () => {
    if (!token || !userId) {
      setError("Token ou ID do usuário não encontrado. Faça login novamente.");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "https://tensoportunidades.com.br:8080/createrole",
        { roleSelection: "PROVIDER", userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(null);
      setError(null);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Erro ao atualizar role para PROVIDERAWAIT:", error);
      setError(error.response?.data?.error || "Erro ao processar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProvider = async () => {
    if (!token || !userId) {
      setError("Token ou ID do usuário não encontrado. Faça login novamente.");
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `https://tensoportunidades.com.br:8080/users/${userId}/approve-provider`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setError(null);
      setIsModalOpen(false);
      setSuccess("Provedor aprovado com sucesso!");
      setTimeout(() => router.push(`/dashboard/create-service?userId=${userId}`), 1000);
    } catch (error: any) {
      console.error("Erro ao aprovar provedor:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error ||
        `Erro ao aprovar o provedor. Status: ${error.response?.status}, Mensagem: ${error.message}`;

      if (errorMessage.includes("User not found")) {
        setError("Usuário não encontrado. Verifique o ID do usuário.");
      } else if (errorMessage.includes("User is not awaiting approval to be a provider")) {
        setError("O usuário não está aguardando aprovação para ser um provedor.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className={styles.container}>
      <section className={styles.roleSection}>
        <h2 className={styles.roleTitle}>Esse usuário vai ser um provedor?</h2>
        <div className={styles.roleButtons}>
          <button
            className={styles.roleButton}
            onClick={handleChooseClient}
            disabled={loading}
          >
            Cliente
          </button>
          <button
            className={styles.roleButton}
            onClick={handleChooseProvider}
            disabled={loading}
          >
            Provedor
          </button>
        </div>
      </section>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Aprovar Provedor</h2>
            <p>Deseja tornar esse usuário um Provedor?</p>
            {loading && <p>Carregando...</p>}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={handleApproveProvider}
                disabled={loading}
              >
                Sim
              </button>
              <button
                className={styles.cancelButton}
                onClick={closeModal}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}