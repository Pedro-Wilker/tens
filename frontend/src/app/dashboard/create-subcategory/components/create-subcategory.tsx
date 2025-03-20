"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import styles from "./create-subcategory.module.scss";
import { useRouter } from "next/navigation";

interface CategoriesProps {
  id: number;
  name: string;
}

interface Props {
  token: string | null | undefined;
}

export default function CreateSubcategoryForm({ token }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return;
      try {
        const response = await api.get("https://tensoportunidades.com.br:8080/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data || []);
      } catch (error) {
        console.error("Erro ao listar categorias:", error);
      }
    };
    fetchCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    if (!name) {
      setError("O nome da subcategoria é obrigatório.");
      return;
    }

    if (categoryId === undefined) {
      setError("Uma categoria deve ser selecionada.");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "https://tensoportunidades.com.br:8080/subcategories",
        { name, categoryId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Subcategoria criada com sucesso!");
      setError(null);
      setName("");
      setCategoryId(undefined);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Erro ao criar subcategoria:", error);
      setError(error.response?.data?.error || "Erro ao criar subcategoria. Tente novamente.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
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
            placeholder="Ex: Pizzarias"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.formLabel}>Categoria</label>
          <select
            id="category"
            value={categoryId !== undefined ? categoryId : ""}
            onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className={styles.select}
            disabled={loading}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Criando..." : "Criar Subcategoria"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}