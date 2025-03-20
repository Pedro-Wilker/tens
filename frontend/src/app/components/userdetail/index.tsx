"use client";

import { useState } from "react";
import { api } from "@/services/api";
import styles from "./user-details.module.scss";
import { Pen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  role: "CLIENT" | "PROVIDER" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
  passwordHash?: string;
  services?: {
    id: string;
    name: string;
    description: string;
    price: string;
    subcategory: { id: string; name: string };
    serviceDetails: { id: string; photoUrl: string; description?: string }[];
    ratings: { id: string; rating: number; userId: string; createdAt: string }[];
  }[];
  comments?: {
    id: string;
    text: string;
    subcomments: { id: string; text: string }[];
    createdAt: string;
  }[];
  ratings?: { id: string; rating: number; serviceId: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialUser: User;
  token: string;
}

export default function UserDetails({ initialUser, token }: Props) {
  const [user, setUser] = useState<User>(initialUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: initialUser.name,
    email: initialUser.email,
    number: initialUser.number,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      const response = await api.put(
        `/users/${user.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setIsEditModalOpen(false);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao atualizar usuário: ${err.response?.data?.error || "Erro desconhecido"}`);
      console.error("Erro ao atualizar usuário:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!token) {
      setError("Token não disponível. Faça login novamente.");
      return;
    }
  
    try {
      setLoading(true);
      console.log("Enviando requisição DELETE para:", `/users/${user.id}`, { token });
  
      const response = await api.delete(`/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Resposta do backend ao deletar usuário:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
  
      if (response.status === 204 || response.status === 200) {
        setIsDeleteModalOpen(false);
        router.push("/"); // Redireciona para a raiz após deletar usuário
        setError(null);
      } else {
        throw new Error(`Resposta inesperada do servidor: Status ${response.status}`);
      }
    } catch (err: any) {
      // Captura a mensagem de erro do backend ou uma mensagem genérica
      const errorMessage =
        err.response?.data?.error || // Mensagem específica do backend (ex.: "Cannot delete...")
        err.message ||              // Mensagem genérica do erro (ex.: "Network Error")
        "Erro desconhecido ao deletar o usuário";
      
      setError(`Erro ao deletar usuário: ${errorMessage}`);
      
      // Log detalhado para depuração
      console.error("Erro detalhado ao deletar usuário:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        config: err.config,
        stack: err.stack,
        fullError: err, // Loga o objeto completo do erro para inspeção
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (!user?.id || !token || !commentId) {
      setError("Usuário não carregado ou ID do comentário inválido.");
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: user.id },
      });
      setUser((prev) => {
        if (!prev) return initialUser;
        return {
          ...prev,
          comments: prev.comments?.filter((c) => c.id !== commentId) || [],
        };
      });
      setError(null);
    } catch (err: any) {
      setError(`Erro ao deletar comentário: ${err.response?.data?.error || "Erro desconhecido"}`);
      console.error("Erro ao deletar comentário:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcomment = async (commentId: string, subcommentId: string) => {
    if (!user?.id || !token || !commentId || !subcommentId) {
      setError("Usuário não carregado ou IDs inválidos.");
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/subcomments/${subcommentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: user.id },
      });
      setUser((prev) => {
        if (!prev) return initialUser;
        return {
          ...prev,
          comments: prev.comments?.map((c) =>
            c.id === commentId
              ? { ...c, subcomments: c.subcomments.filter((s) => s.id !== subcommentId) }
              : c
          ) || [],
        };
      });
      setError(null);
    } catch (err: any) {
      setError(`Erro ao deletar subcomentário: ${err.response?.data?.error || "Erro desconhecido"}`);
      console.error("Erro ao deletar subcomentário:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServiceDetail = async (serviceId: string, detailId: string) => {
    if (!user?.id || !token || !serviceId || !detailId) {
      setError("Usuário não carregado ou IDs inválidos.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await api.delete(`/services/${serviceId}/details/${detailId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("Resposta do backend ao deletar detalhe:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
  
      if (response.status === 204) {
        setUser((prev) => {
          if (!prev) return initialUser;
          return {
            ...prev,
            services: prev.services?.map((s) =>
              s.id === serviceId
                ? { ...s, serviceDetails: s.serviceDetails.filter((d) => d.id !== detailId) }
                : s
            ) || [],
          };
        });
        setError(null);
      } else {
        throw new Error(`Resposta inesperada do servidor: Status ${response.status}`);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.statusText ||
        err.message ||
        "Erro desconhecido ao deletar o detalhe do serviço";
      setError(`Erro ao deletar detalhe do serviço: ${errorMessage}`);
      console.error("Erro detalhado ao deletar detalhe do serviço:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        config: err.config,
        stack: err.stack,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className={styles.userDetailsSection}>
      {loading && <div className={styles.loading}>Carregando...</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.userInfo}>
        <h1 className={styles.userTitle}>Detalhes do Usuário</h1>
        <div className={styles.infoBox}>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Número:</strong> {user.number}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.editButton} onClick={() => setIsEditModalOpen(true)}>
            <Pen size={20} /> Editar
          </button>
          <button className={styles.deleteButton} onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 size={20} /> Excluir
          </button>
        </div>
      </div>

      {user.services && user.services.length > 0 && (
        <section className={styles.servicesSection}>
          <h2 className={styles.sectionTitle}>Serviços Oferecidos</h2>
          <ul className={styles.servicesList}>
            {user.services.map((service) => (
              <li key={service.id} className={styles.serviceItem}>
                <p><strong>Nome:</strong> {service.name}</p>
                <p><strong>Descrição:</strong> {service.description}</p>
                <p><strong>Preço:</strong> {service.price}</p>
                <p><strong>Subcategoria:</strong> {service.subcategory.name}</p>
                <h3 className={styles.subsectionTitle}>Detalhes dos Serviços</h3>
                <ul className={styles.detailsList}>
                  {service.serviceDetails.map((detail) => (
                    <li key={detail.id} className={styles.detailItem}>
                      <p>Foto: {detail.photoUrl}</p>
                      <p>Descrição: {detail.description || "Sem descrição"}</p>
                      <button
                        onClick={() => handleDeleteServiceDetail(service.id, detail.id)}
                        className={styles.deleteButton}
                        disabled={loading}
                      >
                        <Trash2 size={16} color="red" /> Deletar Detalhe
                      </button>
                    </li>
                  ))}
                </ul>
                <h3 className={styles.subsectionTitle}>Avaliações</h3>
                <ul className={styles.ratingsList}>
                  {service.ratings.map((rating) => (
                    <li key={rating.id} className={styles.ratingItem}>
                      <p>Avaliação: {rating.rating}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      {user.comments && user.comments.length > 0 && (
        <section className={styles.commentsSection}>
          <h2 className={styles.sectionTitle}>Comentários</h2>
          <ul className={styles.commentsList}>
            {user.comments.map((comment) => (
              <li key={comment.id} className={styles.commentItem}>
                <p><strong>Texto:</strong> {comment.text}</p>
                <h3 className={styles.subsectionTitle}>Subcomentários</h3>
                <ul className={styles.subcommentsList}>
                  {comment.subcomments.map((subcomment) => (
                    <li key={subcomment.id} className={styles.subcommentItem}>
                      <p>Texto: {subcomment.text}</p>
                      <button
                        onClick={() => handleDeleteSubcomment(comment.id, subcomment.id)}
                        className={styles.deleteButton}
                        disabled={loading}
                      >
                        <Trash2 size={16} color="red" /> Deletar Subcomentário
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className={styles.deleteButton}
                  disabled={loading}
                >
                  <Trash2 size={16} color="red" /> Deletar Comentário
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {user.ratings && user.ratings.length > 0 && (
        <section className={styles.ratingsSection}>
          <h2 className={styles.sectionTitle}>Avaliações Feitas</h2>
          <ul className={styles.ratingsList}>
            {user.ratings.map((rating) => (
              <li key={rating.id} className={styles.ratingItem}>
                <p><strong>Serviço ID:</strong> {rating.serviceId}</p>
                <p><strong>Avaliação:</strong> {rating.rating}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Editar Meus Dados</h2>
            <form onSubmit={handleUpdateUser}>
              <div className={styles.formGroup}>
                <label>Nome:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Número:</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  className={styles.inputField}
                />
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Confirmação de Exclusão</h2>
            <p>Tem certeza de que deseja excluir sua conta? Isso removerá todos os seus serviços, comentários e avaliações.</p>
            <div className={styles.modalButtons}>
              <button className={styles.confirmButton} onClick={handleDeleteUser}>
                Sim
              </button>
              <button className={styles.cancelButton} onClick={() => setIsDeleteModalOpen(false)}>
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}