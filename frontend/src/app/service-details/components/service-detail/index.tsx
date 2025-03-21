"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import styles from "./service-details.module.scss";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { MessageCircle, Pen, Trash2 } from "lucide-react";

// Interfaces permanecem iguais
interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  provider: { id: number; name: string; number: string; email: string; analfabeto: boolean };
  subcategory: { id: number; name: string };
  averageRating: number;
  serviceDetails: ServiceDetail[];
  comments: Comment[];
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceDetail {
  id: number;
  photoUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Rating {
  id: string;
  rating: number;
  user: { id: number; name: string };
}

interface Comment {
  id: number;
  text: string;
  user: { id: number; name: string };
  createdAt: string;
  updatedAt?: string;
  subcomments: Subcomment[];
}

interface Subcomment {
  id: number;
  text: string;
  user: { id: number; name: string };
  createdAt: string;
  updatedAt?: string;
}

interface User {
  role: "PROVIDER" | "CLIENT" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
  id: number;
}

interface Props {
  initialService: Service | null;
  initialDetails: ServiceDetail[];
  initialRatings: Rating[];
  initialComments: Comment[];
  token: string | undefined;
}

const formatDate = (dateString: string): string => {
  console.log(`Formatando data ${dateString} para exibição...`);
  try {
    const formattedDate = new Date(dateString).toISOString().split("T")[0];
    console.log(`Data formatada com sucesso: ${formattedDate}`);
    return formattedDate;
  } catch (err: any) {
    console.error(`Erro ao formatar data ${dateString}:`, err.message);
    return "Data inválida";
  }
};

export default function ServiceDetails({
  initialService,
  initialDetails,
  initialRatings,
  initialComments,
  token,
}: Props) {
  const [service, setService] = useState<Service | null>(initialService);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>(initialDetails || []);
  const [ratings, setRatings] = useState<Rating[]>(initialRatings || []);
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [isAnalfabetoModalOpen, setIsAnalfabetoModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: initialService?.name || "",
    description: initialService?.description || "",
    files: [] as File[],
  });
  const [editingComment, setEditingComment] = useState<{
    id: number;
    text: string;
    isSubcomment: boolean;
  } | null>(null);
  const [editingSubcomment, setEditingSubcomment] = useState<{
    commentId: number | undefined;
    subcommentId: number | undefined;
    text: string;
  }>({
    commentId: undefined,
    subcommentId: undefined,
    text: "",
  });
  const [userLoaded, setUserLoaded] = useState(false);
  const router = useRouter();

  const getImageUrl = (photoUrl: string | null): string => {
    console.log(`Processando URL da imagem: ${photoUrl}`);
    if (!photoUrl || photoUrl.trim() === "") {
      console.log("URL da imagem vazia ou inválida, retornando placeholder: /placeholder.webp");
      return "/placeholder.webp";
    }
    const baseUrl = "https://tensoportunidades.com.br/uploads/";
    const cleanPhotoUrl = photoUrl.startsWith("/uploads/") ? photoUrl.replace("/uploads/", "") : photoUrl;
    const directImageUrl = `${baseUrl}${cleanPhotoUrl}`.replace("//uploads/", "/uploads/");
    console.log("URL da imagem processada:", directImageUrl);
    return directImageUrl;
  };

  const fetchServiceDetails = useCallback(async (serviceId: number) => {
    console.log(`Iniciando fetchServiceDetails para serviceId: ${serviceId}`);
    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    try {
      console.log(`Enviando requisição GET para https://tensoportunidades.com.br:8080/services/${serviceId}`);
      const response = await api.get(`/services/${serviceId}`, apiConfig);
      console.log(`Resposta recebida de https://tensoportunidades.com.br:8080/services/${serviceId}:`, {
        status: response.status,
        data: response.data,
      });
      setService(response.data);
      setServiceDetails(response.data.serviceDetails || []);
      setRatings(
        response.data.ratings?.map((r: any) => ({
          id: uuidv4(),
          rating: r.rating,
          user: { id: r.user?.id || 0, name: r.user?.name || "Usuário Anônimo" },
        })) || []
      );
      setComments(response.data.comments || []);
    } catch (err: any) {
      console.error(`Erro ao buscar detalhes do serviço em https://tensoportunidades.com.br:8080/services/${serviceId}:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Erro ao carregar detalhes do serviço. Tente novamente.");
    }
  }, [token]); // Dependência 'token' incluída

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Iniciando fetchUser...");
      if (!token) {
        console.log("Nenhum token fornecido, definindo usuário como null.");
        setUser(null);
        setUserLoaded(true);
        return;
      }

      const apiConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        console.log("Enviando requisição GET para https://tensoportunidades.com.br:8080/detailuser");
        const response = await api.get("/detailuser", apiConfig);
        console.log("Usuário buscado com sucesso em https://tensoportunidades.com.br:8080/detailuser:", {
          status: response.status,
          data: response.data,
        });
        setUser(response.data);
      } catch (error: any) {
        console.error("Erro ao buscar dados do usuário em https://tensoportunidades.com.br:8080/detailuser:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError("Erro ao carregar usuário. Verifique sua sessão.");
        setUser(null);
      } finally {
        console.log("Finalizando fetchUser, definindo userLoaded como true.");
        setUserLoaded(true);
      }
    };

    console.log("Executando useEffect para buscar usuário e detalhes do serviço...");
    fetchUser();
    if (initialService?.id) {
      console.log("Serviço inicial presente, buscando detalhes do serviço:", initialService.id);
      fetchServiceDetails(initialService.id);
    }
  }, [initialService?.id, fetchServiceDetails, token]); // Dependências incluídas

  const handleRating = async (rating: number) => {
    console.log("Iniciando handleRating com rating:", rating);
    if (!userLoaded || !token) {
      console.log("Usuário não carregado ou token ausente, não é possível avaliar.");
      alert("Você precisa estar logado para avaliar este serviço.");
      return;
    }

    if (user?.role !== "CLIENT" && user?.role !== "PROVIDERAWAIT") {
      console.log("Usuário não tem permissão para avaliar (role:", user?.role, ").");
      setError("Somente clientes podem avaliar serviços.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log("Enviando requisição POST para https://tensoportunidades.com.br:8080/ratings");
      const response = await api.post(
        "/ratings",
        { "serviceId": service?.id, "rating": rating },
        apiConfig
      );
      console.log("Avaliação enviada com sucesso para https://tensoportunidades.com.br:8080/ratings:", {
        status: response.status,
        data: response.data,
      });
      setUserRating(rating);
      await fetchServiceDetails(service!.id);
    } catch (err: any) {
      console.error("Erro ao avaliar o serviço em https://tensoportunidades.com.br:8080/ratings:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Erro ao avaliar o serviço. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando handleCommentSubmit...");
    if (!userLoaded || !token || !newComment.trim() || !user?.id) {
      console.log("Condições não atendidas para enviar comentário:", {
        userLoaded,
        token: !!token,
        newComment: newComment.trim(),
        userId: user?.id,
      });
      alert("Você precisa estar logado para adicionar um comentário.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log("Enviando requisição POST para https://tensoportunidades.com.br:8080/comments");
      const response = await api.post(
        "/comments",
        { "serviceId": service?.id, "text": newComment, "userId": user.id },
        apiConfig
      );
      console.log("Comentário enviado com sucesso para https://tensoportunidades.com.br:8080/comments:", {
        status: response.status,
        data: response.data,
      });
      setNewComment("");
      await fetchServiceDetails(service!.id);
    } catch (err: any) {
      console.error("Erro ao adicionar comentário em https://tensoportunidades.com.br:8080/comments:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao adicionar comentário: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubcommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando handleSubcommentSubmit...");
    if (!userLoaded || !token || !editingSubcomment.commentId || !editingSubcomment.text.trim() || !user?.id) {
      console.log("Condições não atendidas para enviar subcomentário:", {
        userLoaded,
        token: !!token,
        commentId: editingSubcomment.commentId,
        text: editingSubcomment.text.trim(),
        userId: user?.id,
      });
      alert("Você precisa estar logado para adicionar um subcomentário.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log(`Enviando requisição POST para https://tensoportunidades.com.br:8080/comments/${editingSubcomment.commentId}/subcomments`);
      const response = await api.post(
        `/comments/${editingSubcomment.commentId}/subcomments`,
        { "text": editingSubcomment.text, "userId": user.id },
        apiConfig
      );
      console.log(`Subcomentário enviado com sucesso para https://tensoportunidades.com.br:8080/comments/${editingSubcomment.commentId}/subcomments:`, {
        status: response.status,
        data: response.data,
      });
      setEditingSubcomment((prev) => ({ ...prev, text: "" }));
      await fetchServiceDetails(service!.id);
    } catch (err: any) {
      console.error(`Erro ao adicionar subcomentário em https://tensoportunidades.com.br:8080/comments/${editingSubcomment.commentId}/subcomments:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao adicionar subcomentário: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = (comment: Comment) => {
    console.log("Iniciando handleEditComment para comentário:", comment.id);
    if (!token || user?.id !== comment.user.id) {
      console.log("Usuário não autorizado para editar comentário:", {
        token: !!token,
        userId: user?.id,
        commentUserId: comment.user.id,
      });
      alert("Você precisa estar logado e ser o autor para editar este comentário.");
      return;
    }
    setFormData({ ...formData, name: comment.text });
    setEditingComment({ id: comment.id, text: comment.text, isSubcomment: false });
    setIsEditModalOpen(true);
  };

  const handleDeleteComment = async (commentId: number) => {
    console.log("Iniciando handleDeleteComment para comentário:", commentId);
    if (!token || !userLoaded) {
      console.log("Usuário não carregado ou token ausente, não é possível deletar comentário.");
      alert("Você precisa estar logado para deletar um comentário.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log(`Enviando requisição DELETE para https://tensoportunidades.com.br:8080/comments/${commentId}`);
      const response = await api.delete(
        `/comments/${commentId}`,
        {
          ...apiConfig,
          data: { "userId": user?.id },
        }
      );
      console.log(`Comentário deletado com sucesso em https://tensoportunidades.com.br:8080/comments/${commentId}:`, {
        status: response.status,
      });
      await fetchServiceDetails(service!.id);
    } catch (err: any) {
      console.error(`Erro ao deletar comentário em https://tensoportunidades.com.br:8080/comments/${commentId}:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao deletar comentário: ${err.response?.data?.error || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubcomment = (subcomment: Subcomment) => {
    console.log("Iniciando handleEditSubcomment para subcomentário:", subcomment.id);
    if (!token || user?.id !== subcomment.user.id) {
      console.log("Usuário não autorizado para editar subcomentário:", {
        token: !!token,
        userId: user?.id,
        subcommentUserId: subcomment.user.id,
      });
      alert("Você precisa estar logado e ser o autor para editar este subcomentário.");
      return;
    }
    setFormData({ ...formData, name: subcomment.text });
    setEditingComment({ id: subcomment.id, text: subcomment.text, isSubcomment: true });
    setIsEditModalOpen(true);
  };

  const handleDeleteSubcomment = async (subcommentId: number) => {
    console.log("Iniciando handleDeleteSubcomment para subcomentário:", subcommentId);
    if (!token || !userLoaded) {
      console.log("Usuário não carregado ou token ausente, não é possível deletar subcomentário.");
      alert("Você precisa estar logado para deletar um subcomentário.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log(`Enviando requisição DELETE para https://tensoportunidades.com.br:8080/subcomments/${subcommentId}`);
      const response = await api.delete(
        `/subcomments/${subcommentId}`,
        {
          ...apiConfig,
          data: { "userId": user?.id },
        }
      );
      console.log(`Subcomentário deletado com sucesso em https://tensoportunidades.com.br:8080/subcomments/${subcommentId}:`, {
        status: response.status,
      });
      await fetchServiceDetails(service!.id);
    } catch (err: any) {
      console.error(`Erro ao deletar subcomentário em https://tensoportunidades.com.br:8080/subcomments/${subcommentId}:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao deletar subcomentário: ${err.response?.data?.error || "Erro desconhecido"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando handleSaveCommentEdit...");
    if (!token || !editingComment || !user?.id || editingComment.isSubcomment) {
      console.log("Condições não atendidas para salvar edição de comentário:", {
        token: !!token,
        editingComment: !!editingComment,
        userId: user?.id,
        isSubcomment: editingComment?.isSubcomment,
      });
      alert("Você precisa estar logado para editar um comentário.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log(`Enviando requisição PUT para https://tensoportunidades.com.br:8080/comments/${editingComment.id}`);
      const response = await api.put(
        `/comments/${editingComment.id}`,
        { "text": formData.name },
        apiConfig
      );
      console.log(`Comentário editado com sucesso em https://tensoportunidades.com.br:8080/comments/${editingComment.id}:`, {
        status: response.status,
        data: response.data,
      });
      await fetchServiceDetails(service!.id);
      closeEditModal();
    } catch (err: any) {
      console.error(`Erro ao salvar edição de comentário em https://tensoportunidades.com.br:8080/comments/${editingComment.id}:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao editar comentário: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubcommentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando handleSaveSubcommentEdit...");
    if (!token || !editingComment || !user?.id || !editingComment.isSubcomment) {
      console.log("Condições não atendidas para salvar edição de subcomentário:", {
        token: !!token,
        editingComment: !!editingComment,
        userId: user?.id,
        isSubcomment: editingComment?.isSubcomment,
      });
      alert("Você precisa estar logado para editar um subcomentário.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log(`Enviando requisição PUT para https://tensoportunidades.com.br:8080/subcomments/${editingComment.id}`);
      const response = await api.put(
        `/subcomments/${editingComment.id}`,
        { "text": formData.name },
        apiConfig
      );
      console.log(`Subcomentário editado com sucesso em https://tensoportunidades.com.br:8080/subcomments/${editingComment.id}:`, {
        status: response.status,
        data: response.data,
      });
      await fetchServiceDetails(service!.id);
      closeEditModal();
    } catch (err: any) {
      console.error(`Erro ao salvar edição de subcomentário em https://tensoportunidades.com.br:8080/subcomments/${editingComment.id}:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao editar subcomentário: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando handleSubmit para atualizar detalhes do serviço...");
    if (!token || !service) {
      console.log("Token ou serviço ausente, não é possível atualizar detalhes.");
      alert("Você precisa estar logado para atualizar os detalhes do serviço.");
      return;
    }

    if (formData.files.length === 0) {
      console.log("Nenhum arquivo selecionado para upload.");
      setError("Selecione pelo menos uma imagem para atualizar os detalhes do serviço.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description || service.description);
      formData.files.forEach((file) => formDataToSend.append("file", file));

      console.log(`Enviando requisição PUT para https://tensoportunidades.com.br:8080/services/${service.id}/details`);
      const response = await api.put(
        `/services/${service.id}/details`,
        formDataToSend,
        apiConfig
      );
      console.log(`Detalhes do serviço atualizados com sucesso em https://tensoportunidades.com.br:8080/services/${service.id}/details:`, {
        status: response.status,
        data: response.data,
      });
      await fetchServiceDetails(service.id);
      closeEditModal();
    } catch (err: any) {
      console.error(`Erro ao atualizar detalhes em https://tensoportunidades.com.br:8080/services/${service.id}/details:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao atualizar os detalhes do serviço: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async () => {
    console.log("Iniciando handleDeleteService...");
    if (!token) {
      console.log("Token ausente, não é possível deletar serviço.");
      alert("Você precisa estar logado para deletar o serviço.");
      return;
    }

    if (!service?.id) {
      console.log("ID do serviço não disponível.");
      setError("ID do serviço não disponível.");
      return;
    }

    const apiConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      setLoading(true);
      console.log(`Enviando requisição DELETE para https://tensoportunidades.com.br:8080/services/${service.id}`);
      const response = await api.delete(`/services/${service.id}`, apiConfig);
      console.log(`Serviço deletado com sucesso em https://tensoportunidades.com.br:8080/services/${service.id}:`, {
        status: response.status,
        data: response.data,
      });

      if (response.status === 204) {
        console.log("Redirecionando para a página de serviços: /services");
        router.push("/services");
      }
    } catch (err: any) {
      console.error(`Erro ao deletar serviço em https://tensoportunidades.com.br:8080/services/${service.id}:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(`Erro ao deletar o serviço: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const renderStars = (rating: number, isUserRating: boolean = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.starFilled}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={styles.starHalf}>☆</span>);
      } else {
        stars.push(
          <span
            key={i}
            className={isUserRating && userRating && i < userRating ? styles.starFilled : styles.starEmpty}
            onClick={() => (token ? handleRating(i + 1) : alert("Você precisa estar logado para avaliar."))}
          >
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  const openEditModal = () => {
    if (token) {
      setIsEditModalOpen(true);
    } else {
      alert("Você precisa estar logado para editar.");
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({ name: service?.name || "", description: service?.description || "", files: [] });
    setEditingComment(null);
    setEditingSubcomment({ commentId: undefined, subcommentId: undefined, text: "" });
  };

  const openPhotosModal = () => {
    setIsPhotosModalOpen(true);
  };

  const closePhotosModal = () => {
    setIsPhotosModalOpen(false);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < serviceDetails.length - 1 ? prev + 1 : 0));
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : serviceDetails.length - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const limitedFiles = Array.from(files).slice(0, 10);
      setFormData((prev) => ({ ...prev, files: limitedFiles }));
    }
  };

  const handleWhatsAppClick = () => {
    if (service?.provider.analfabeto) {
      setIsAnalfabetoModalOpen(true);
    } else {
      sendWhatsAppMessage();
    }
  };

  const sendWhatsAppMessage = () => {
    if (!service?.provider.number) {
      setError("Erro: Número do provedor não disponível.");
      return;
    }

    const providerNumber = formatWhatsAppNumber(service.provider.number);
    if (!providerNumber.match(/^\+\d{10,15}$/)) {
      setError("Número de telefone inválido para envio no WhatsApp.");
      return;
    }

    window.open(
      `https://wa.me/${providerNumber}?text=${encodeURIComponent("Olá, gostaria de contratar o seu serviço.")}`,
      "_blank"
    );
    setIsAnalfabetoModalOpen(false);
  };

  if (!service) {
    return <div>Serviço não encontrado.</div>;
  }

  return (
    <div className={styles.serviceDetailsContainer}>
      {loading && <div>Carregando...</div>}
      {error && <div className={styles.error}>{error}</div>}
      <section className={styles.photosSection}>
        <div className={styles.mainPhoto}>
          {serviceDetails.length > 0 && (
            <Image
              src={getImageUrl(serviceDetails[0].photoUrl)}
              alt={`${service.name} - Foto principal`}
              width={600}
              height={400}
              quality={100}
              className={styles.photo}
              onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.webp"}
            />
          )}
        </div>
        <div className={styles.smallPhotos}>
          <div className={styles.smallPhotosRow}>
            {serviceDetails.slice(1, 3).map((detail, index) => (
              <Image
                key={detail.id}
                src={getImageUrl(detail.photoUrl)}
                alt={`${service.name} - Foto ${index + 2}`}
                width={200}
                height={200}
                quality={100}
                className={styles.smallPhoto}
                onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.webp"}
              />
            ))}
          </div>
          <div className={styles.smallPhotosRow}>
            {serviceDetails.slice(3, 4).map((detail, index) => (
              <Image
                key={detail.id}
                src={getImageUrl(detail.photoUrl)}
                alt={`${service.name} - Foto ${index + 4}`}
                width={200}
                height={200}
                quality={100}
                className={styles.smallPhoto}
                onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.webp"}
              />
            ))}
            {serviceDetails.length > 4 && (
              <div
                className={styles.buttonBox}
                onClick={openPhotosModal}
                onMouseOver={() => setShowTooltip(true)}
                onMouseOut={() => setShowTooltip(false)}
              >
                <button className={styles.morePhotosButton}>
                  +{showTooltip && <span className={styles.tooltip}>Ver todas as imagens</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.infoSection}>
        <div className={styles.serviceInfoBox}>
          <h2 className={styles.sectionTitle}>Informações do Serviço</h2>
          {service?.description ? (
            <p className={styles.serviceDescription}>Detalhes: {service.description}</p>
          ) : (
            <p>Sem descrição geral do serviço.</p>
          )}
          {serviceDetails.length > 0 && serviceDetails[0]?.description ? (
            <p className={styles.serviceDetailDescription}>{serviceDetails[0].description}</p>
          ) : (
            <p>Sem detalhes específicos disponíveis.</p>
          )}
        </div>
        <div className={styles.contactInfo}>
          <div className={styles.contactDetails}>
            <h3>Contato do Provedor</h3>
            <p>Telefone: {service.provider.number}</p>
            <p>Email: {service.provider.email}</p>
          </div>
          <button
            className={styles.whatsappButton}
            onClick={handleWhatsAppClick}
            aria-label="Entrar em contato via WhatsApp"
          >
            <MessageCircle size={30} color="#f1f7f3" />
          </button>
        </div>
        {user?.role === "PROVIDER" && user?.id === service.provider.id && token && (
          <div className={styles.actionButtons}>
            <button className={styles.editButton} onClick={openEditModal}>
              Editar Detalhes do Serviço
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={20} color="red" />
            </button>
          </div>
        )}
      </section>

      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Avaliações e Comentários</h2>
        <div className={styles.ratingSection}>
          <h3>Avaliação Média</h3>
          <div className={styles.stars}>{renderStars(service.averageRating || 0)}</div>
          <h3>Avalie este Serviço</h3>
          <div className={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={userRating && star <= userRating ? styles.starFilled : styles.starEmpty}
                onClick={() => (token ? handleRating(star) : alert("Você precisa estar logado para avaliar."))}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className={styles.commentsSection}>
          <h3>Adicionar Comentário</h3>
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              className={styles.commentInput}
              disabled={!token}
            />
            <button type="submit" className={styles.commentButton} disabled={!token}>
              Enviar
            </button>
          </form>
          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.commentContainer}>
                <div className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <p className={styles.commentUser}>{comment.user.name}</p>
                    <div className={styles.commentActions}>
                      {user?.id === comment.user.id && token && (
                        <>
                          <Pen
                            size={16}
                            className={styles.actionIcon}
                            onClick={() => handleEditComment(comment)}
                          />
                          <Trash2
                            size={16}
                            className={styles.actionIcon}
                            onClick={() => handleDeleteComment(comment.id)}
                          />
                        </>
                      )}
                      <MessageCircle
                        size={16}
                        className={styles.actionIcon}
                        onClick={() =>
                          token
                            ? setEditingSubcomment((prev) => ({ ...prev, commentId: comment.id, text: "" }))
                            : alert("Você precisa estar logado para adicionar um subcomentário.")
                        }
                      />
                    </div>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                  <p className={styles.commentDate}>{formatDate(comment.createdAt)}</p>
                </div>
                {editingSubcomment.commentId === comment.id && token && (
                  <form onSubmit={handleSubcommentSubmit} className={styles.subcommentForm}>
                    <textarea
                      value={editingSubcomment.text}
                      onChange={(e) =>
                        setEditingSubcomment((prev) => ({ ...prev, text: e.target.value }))
                      }
                      placeholder="Escreva seu subcomentário..."
                      className={styles.subcommentInput}
                      disabled={!token}
                    />
                    <button type="submit" className={styles.subcommentButton} disabled={!token}>
                      Enviar Subcomentário
                    </button>
                  </form>
                )}
                {comment.subcomments?.length > 0 &&
                  comment.subcomments.map((subcomment) => (
                    <div key={subcomment.id} className={styles.subcomment}>
                      <div className={styles.subcommentHeader}>
                        <p className={styles.subcommentUser}>{subcomment.user.name}</p>
                        <div className={styles.subcommentActions}>
                          {user?.id === subcomment.user.id && token && (
                            <>
                              <Pen
                                size={16}
                                className={styles.actionIcon}
                                onClick={() => handleEditSubcomment(subcomment)}
                              />
                              <Trash2
                                size={16}
                                className={styles.actionIcon}
                                onClick={() => handleDeleteSubcomment(subcomment.id)}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <p className={styles.subcommentText}>{subcomment.text}</p>
                      <p className={styles.subcommentDate}>{formatDate(subcomment.createdAt)}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{editingComment ? "Editar Comentário/Subcomentário" : "Editar Detalhes do Serviço"}</h2>
            <form
              onSubmit={
                editingComment
                  ? editingComment.isSubcomment
                    ? handleSaveSubcommentEdit
                    : handleSaveCommentEdit
                  : handleSubmit
              }
              encType={editingComment ? undefined : "multipart/form-data"}
            >
              {editingComment ? (
                <div>
                  <label>Texto:</label>
                  <textarea
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.textareaField}
                    disabled={!token}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label>Nome do Serviço:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.inputField}
                      disabled={!token}
                    />
                  </div>
                  <div>
                    <label>Descrição:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={styles.textareaField}
                      disabled={!token}
                    />
                  </div>
                  <div>
                    <label>Imagens (até 10):</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                      disabled={!token}
                    />
                  </div>
                </>
              )}
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton} disabled={!token}>
                  {editingComment ? "Salvar Edição" : "Salvar Alterações"}
                </button>
                <button type="button" onClick={closeEditModal} className={styles.cancelButton}>
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
            <h2>Confirmação de Exclusão</h2>
            <p>Você deseja apagar este serviço?</p>
            <div className={styles.modalButtons}>
              <button className={styles.confirmButton} onClick={handleDeleteService} disabled={!token}>
                Sim
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}

      {isPhotosModalOpen && (
        <div className={styles.modalOverlay} onClick={closePhotosModal}>
          <div className={styles.photosModalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Todas as Fotos do Serviço</h2>
            <div className={styles.carouselContainer}>
              <button className={styles.prevButton} onClick={prevPhoto}>
                ◀
              </button>
              <div className={styles.carouselImageBox}>
                {serviceDetails.length > 0 && (
                  <Image
                    src={getImageUrl(serviceDetails[currentPhotoIndex].photoUrl)}
                    alt={`Foto ${currentPhotoIndex + 1} do serviço ${service.name}`}
                    width={600}
                    height={400}
                    quality={100}
                    className={styles.carouselPhoto}
                    onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.webp"}
                  />
                )}
              </div>
              <button className={styles.nextButton} onClick={nextPhoto}>
                ▶
              </button>
            </div>
            <p className={styles.photoCounter}>
              {currentPhotoIndex + 1} de {serviceDetails.length}
            </p>
            <button onClick={closePhotosModal} className={styles.closePhotosButton}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {isAnalfabetoModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAnalfabetoModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Atenção</h2>
            <p>
              Este é um usuário analfabeto. Tente comunicar-se por áudios e ligações para facilitar o contato com o
              provedor deste serviço.
            </p>
            <div className={styles.modalButtons}>
              <button className={styles.submitButton} onClick={sendWhatsAppMessage}>
                Enviar Mensagem Mesmo Assim
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsAnalfabetoModalOpen(false)}
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

const formatWhatsAppNumber = (number: string) => {
  const cleanedNumber = number.replace(/[^\d]/g, "");
  const formattedNumber = cleanedNumber.startsWith("+") ? cleanedNumber : `+55${cleanedNumber}`;
  return formattedNumber;
};