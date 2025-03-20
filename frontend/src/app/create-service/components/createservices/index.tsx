"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import styles from "./createservices.module.scss";
import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
}

interface Props {
  token: string;
  categories: Category[];
}

export default function CreateServicesForm({ token, categories }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryId, setSubcategoryId] = useState<number | undefined>(undefined);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get("userId");

  useEffect(() => {
    if (!providerId || isNaN(Number(providerId))) {
      setError("ID do provedor não fornecido ou inválido.");
    }
  }, [providerId]);

  const fetchCategoryId = useCallback(async (categoryName: string): Promise<number | null> => {
    if (!categoryName || !token) return null;
    try {
      const response = await api.get(`/categories/name/${encodeURIComponent(categoryName)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.id;
    } catch (error: any) {
      console.error("Erro ao buscar categoria por nome:", error);
      setError("Erro ao carregar categoria. Tente novamente.");
      return null;
    }
  }, [token]);

  const fetchSubcategories = useCallback(async (categoryId: number) => {
    if (!categoryId || !token) return;
    try {
      const response = await api.get(`/subcategories/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubcategories(response.data);
      setSubcategoryId(undefined);
    } catch (error: any) {
      console.error("Erro ao buscar subcategorias:", error);
      setError("Erro ao carregar subcategorias. Tente novamente.");
    }
  }, [token]);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (categoryName) {
        const categoryId = await fetchCategoryId(categoryName);
        if (categoryId) await fetchSubcategories(categoryId);
      } else {
        setSubcategories([]);
        setSubcategoryId(undefined);
      }
    };
    loadSubcategories();
  }, [categoryName, token, fetchCategoryId, fetchSubcategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    if (!providerId || isNaN(Number(providerId))) {
      setError("ID do provedor não fornecido ou inválido.");
      return;
    }

    if (subcategoryId === undefined) {
      setError("Selecione uma subcategoria.");
      return;
    }

    if (!name) {
      setError("O nome do serviço é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        "https://tensoportunidades.com.br:8080/services",
        {
          providerId: Number(providerId),
          subcategoryId,
          name,
          description,
          price: price ? parseFloat(price) : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const serviceId = response.data.id;
      setSuccess("Serviço criado com sucesso!");
      setError(null);
      setName("");
      setDescription("");
      setPrice("");
      setCategoryName("");
      setSubcategoryId(undefined);
      setTimeout(() => router.push(`/create-service/details-services?serviceId=${serviceId}`), 1000);
    } catch (error: any) {
      console.error("Erro ao criar serviço:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Erro ao criar serviço. Tente novamente.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  if (!providerId || isNaN(Number(providerId))) {
    return (
      <div className={styles.errorContainer}>
        <h1>Erro: ID do provedor não fornecido ou inválido</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.formLabel}>Categoria</label>
          <select
            id="category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className={styles.select}
            disabled={loading}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subcategory" className={styles.formLabel}>Subcategoria</label>
          <select
            id="subcategory"
            value={subcategoryId !== undefined ? subcategoryId : ""}
            onChange={(e) => setSubcategoryId(e.target.value ? parseInt(e.target.value, 10) : undefined)}
            className={styles.select}
            disabled={loading || !categoryName}
          >
            <option value="">Selecione uma subcategoria</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Nome do Serviço</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            disabled={loading}
            placeholder="Ex: Coxinha"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            disabled={loading}
            placeholder="Descreva seu serviço"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.formLabel}>Preço (R$)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={styles.input}
            disabled={loading}
            placeholder="Ex: 25.00"
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Criando..." : "Criar Serviço"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}