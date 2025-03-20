"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/services/api";
import styles from "./dashboard-admin.module.scss";
import { UserIcon, BadgePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { User } from "@/types/user-types";
import Image from "next/image";

interface CategoriesProps {
  id: number;
  name: string;
  imageUrl: string | null;
}

interface SubcategoriesProps {
  id: number;
  name: string;
  categoryId: number;
}

interface Props {
  users: User[];
}

export default function DashboardAdminClient({ users }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoriesProps[]>([]);
  const router = useRouter();

  const normalizeImageUrl = (photoUrl: string | null): string => {
    if (!photoUrl || photoUrl.trim() === "") return "/placeholder.webp";
    if (photoUrl.startsWith("http")) return photoUrl;
    return `https://tensoportunidades.com.br/uploads/${photoUrl}`;
  };

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];
  };

  const openModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleApproveProvider = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      const response = await api.put(`/users/${selectedUserId}/approve-provider`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Resposta ao aprovar provedor em https://tensoportunidades.com.br:8080/users/:id/approve-provider:", {
        status: response.status,
        data: response.data,
      });

      setError(null);
      closeModal();
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao aprovar provedor em https://tensoportunidades.com.br:8080/users/:id/approve-provider:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(error.response?.data?.error || "Erro ao aprovar o provedor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => router.push("/dashboard/create-user");
  const handleCreateCategory = () => router.push("/dashboard/create-category");
  const handleCreateSubcategory = () => router.push("/dashboard/create-subcategory");

  const fetchCategories = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Categorias buscadas em https://tensoportunidades.com.br:8080/categories:", response.data);
      setCategories(
        response.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          imageUrl: item.imageUrl || null,
        })) || []
      );
    } catch (error: any) {
      console.error("Erro ao listar categorias em https://tensoportunidades.com.br:8080/categories:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError("Erro ao carregar categorias. Tente novamente.");
      // Fallback básico caso a API falhe
      setCategories([
        { id: 1, name: "Moda e Beleza", imageUrl: "moda_beleza.svg" },
        { id: 2, name: "Alimentação", imageUrl: "alimentacao.svg" },
      ]);
    }
  }, []);

  const fetchSubcategories = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await api.get("/subcategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Subcategorias buscadas em https://tensoportunidades.com.br:8080/subcategories:", response.data);
      setSubcategories(
        response.data.map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          categoryId: Number(item.categoryId),
        })) || []
      );
    } catch (error: any) {
      console.error("Erro ao listar subcategorias em https://tensoportunidades.com.br:8080/subcategories:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError("Erro ao carregar subcategorias. Tente novamente.");
      
      setSubcategories([
        { id: 1, name: "Roupas", categoryId: 1 },
        { id: 2, name: "Restaurantes", categoryId: 2 },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [fetchCategories, fetchSubcategories]);

  const openCategoryModal = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setSelectedCategoryId(null);
  };

  const handleUpdateCategory = async (updatedData: { name?: string; imageUrl?: File | null }) => {
    if (!selectedCategoryId) return;

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      const formData = new FormData();
      if (updatedData.name) formData.append("name", updatedData.name);
      if (updatedData.imageUrl) formData.append("file", updatedData.imageUrl);

      const response = await api.put(`/categories/${selectedCategoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Categoria atualizada em https://tensoportunidades.com.br:8080/categories/:id:", {
        status: response.status,
        data: response.data,
      });

      fetchCategories();
      closeCategoryModal();
      setError(null);
    } catch (error: any) {
      console.error("Erro ao atualizar categoria em https://tensoportunidades.com.br:8080/categories/:id:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(error.response?.data?.error || "Erro ao atualizar categoria. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const openSubcategoryModal = (subcategoryId: number) => {
    setSelectedSubcategoryId(subcategoryId);
    setSubcategoryModalOpen(true);
  };

  const closeSubcategoryModal = () => {
    setSubcategoryModalOpen(false);
    setSelectedSubcategoryId(null);
  };

  const handleUpdateSubcategory = async (updatedData: { name?: string }) => {
    if (!selectedSubcategoryId) return;

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Token não encontrado");

      const response = await api.put(`/subcategories/${selectedSubcategoryId}`, { name: updatedData.name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Subcategoria atualizada em https://tensoportunidades.com.br:8080/subcategories/:id:", {
        status: response.status,
        data: response.data,
      });

      fetchSubcategories();
      closeSubcategoryModal();
      setError(null);
    } catch (error: any) {
      console.error("Erro ao atualizar subcategoria em https://tensoportunidades.com.br:8080/subcategories/:id:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError(error.response?.data?.error || "Erro ao atualizar subcategoria. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Carregando...</p>}

      <section className={styles.usersSection}>
        <div className={styles.usersContainer}>
          <h2 className={styles.usersTitle}>Usuários em Espera para Provedor</h2>
          <p className={styles.usersSubtitle}>
            Aprovar ou gerenciar solicitações de provedores aguardando.
          </p>
          <div className={styles.usersGrid}>
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className={styles.userCard}
                  onClick={() => openModal(Number(user.id))}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.userIcon}>
                    <UserIcon size={48} color="#35047f" />
                  </div>
                  <h3 className={styles.userCardTitle}>{user.name}</h3>
                </div>
              ))
            ) : (
              <p className={styles.usersLoading}>Nenhum usuário em espera encontrado.</p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.createUserSection}>
        <div className={styles.createUserContainer}>
          <h2 className={styles.createUserTitle}>CRIE UM NOVO USUÁRIO</h2>
          <div className={styles.createUserBox}>
            <div className={styles.userIcon}>
              <UserIcon size={48} color="#35047f" />
            </div>
            <button className={styles.createUserButton} onClick={handleCreateUser}>
              CRIAR USUÁRIO
            </button>
          </div>
        </div>
      </section>

      <section className={styles.createUserSection}>
        <div className={styles.createUserContainer}>
          <h2 className={styles.createUserTitle}>CRIE UMA NOVA CATEGORIA</h2>
          <div className={styles.createUserBox}>
            <div className={styles.userIcon}>
              <BadgePlus size={48} color="#35047f" />
            </div>
            <button className={styles.createUserButton} onClick={handleCreateCategory}>
              CRIAR CATEGORIA
            </button>
          </div>
        </div>
      </section>

      <section className={styles.createUserSection}>
        <div className={styles.createUserContainer}>
          <h2 className={styles.createUserTitle}>CRIE UMA NOVA SUBCATEGORIA</h2>
          <div className={styles.createUserBox}>
            <div className={styles.userIcon}>
              <BadgePlus size={48} color="#35047f" />
            </div>
            <button className={styles.createUserButton} onClick={handleCreateSubcategory}>
              CRIAR SUBCATEGORIA
            </button>
          </div>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listContainer}>
          <h2 className={styles.listTitle}>Listar Categorias</h2>
          <div className={styles.listGrid}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className={styles.listItem}
                  onClick={() => openCategoryModal(category.id)}
                  style={{ cursor: "pointer" }}
                >
                  {category.imageUrl && (
                    <Image
                      src={normalizeImageUrl(category.imageUrl)}
                      alt={`Imagem da categoria ${category.name}`}
                      width={50}
                      height={50}
                      quality={100}
                      className={styles.categoryImage}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.webp";
                      }}
                    />
                  )}
                  <h3 className={styles.listItemTitle}>{category.name}</h3>
                </div>
              ))
            ) : (
              <p className={styles.listLoading}>Nenhuma categoria encontrada.</p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.listContainer}>
          <h2 className={styles.listTitle}>Listar Subcategorias</h2>
          <div className={styles.listGrid}>
            {subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className={styles.listItem}
                  onClick={() => openSubcategoryModal(subcategory.id)}
                  style={{ cursor: "pointer" }}
                >
                  <h3 className={styles.listItemTitle}>{subcategory.name}</h3>
                </div>
              ))
            ) : (
              <p className={styles.listLoading}>Nenhuma subcategoria encontrada.</p>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Aprovar Provedor</h2>
            <p>Deseja tornar esse usuário um Provedor?</p>
            {loading && <p>Carregando...</p>}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.modalButtons}>
              <button className={styles.confirmButton} onClick={handleApproveProvider} disabled={loading}>
                Sim
              </button>
              <button className={styles.cancelButton} onClick={closeModal} disabled={loading}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryModalOpen && (
        <div className={styles.modalOverlay} onClick={closeCategoryModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Editar Categoria</h2>
            <CategoryEditForm
              categoryId={selectedCategoryId!}
              onSubmit={handleUpdateCategory}
              onClose={closeCategoryModal}
              loading={loading}
              error={error}
              setError={setError}
            />
          </div>
        </div>
      )}

      {subcategoryModalOpen && (
        <div className={styles.modalOverlay} onClick={closeSubcategoryModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Editar Subcategoria</h2>
            <SubcategoryEditForm
              subcategoryId={selectedSubcategoryId!}
              onSubmit={handleUpdateSubcategory}
              onClose={closeSubcategoryModal}
              loading={loading}
              error={error}
              setError={setError}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface CategoryEditFormProps {
  categoryId: number | null;
  onSubmit: (data: { name?: string; imageUrl?: File | null }) => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

function CategoryEditForm({ categoryId, onSubmit, onClose, loading, error, setError }: CategoryEditFormProps) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "image/svg+xml") {
        setError("Apenas arquivos SVG são permitidos.");
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name && !file) {
      setError("Preencha pelo menos um campo para atualizar.");
      return;
    }
    onSubmit({ name: name || undefined, imageUrl: file || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>Nome da Categoria</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          disabled={loading}
          placeholder="Novo nome da categoria"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="file" className={styles.formLabel}>Imagem (SVG, Opcional)</label>
        <input
          id="file"
          type="file"
          accept="image/svg+xml"
          onChange={handleFileChange}
          className={styles.input}
          disabled={loading}
        />
        {file && <p className={styles.fileName}>Arquivo selecionado: {file.name}</p>}
      </div>
      <div className={styles.modalButtons}>
        <button type="submit" className={styles.confirmButton} disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
          Cancelar
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

interface SubcategoryEditFormProps {
  subcategoryId: number | null;
  onSubmit: (data: { name?: string }) => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

function SubcategoryEditForm({ subcategoryId, onSubmit, onClose, loading, error, setError }: SubcategoryEditFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("O nome da subcategoria é obrigatório.");
      return;
    }
    onSubmit({ name: name || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>Nome da Subcategoria</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          disabled={loading}
          placeholder="Novo nome da subcategoria"
        />
      </div>
      <div className={styles.modalButtons}>
        <button type="submit" className={styles.confirmButton} disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
          Cancelar
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}