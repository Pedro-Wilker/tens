"use client";

import { useState } from "react";
import { api } from "@/services/api";
import styles from "./createcategory.module.scss";
import { useRouter } from "next/navigation";

interface Props {
  token: string | null | undefined;
}

export default function CreateCategoryForm({ token }: Props) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    if (!name) {
      setError("O nome da categoria é obrigatório.");
      return;
    }

    if (!file) {
      setError("Uma imagem SVG é obrigatória.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      await api.post("https://tensoportunidades.com.br:8080/categories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Categoria criada com sucesso!");
      setError(null);
      setName("");
      setFile(null);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Erro ao criar categoria:", error);
      setError(error.response?.data?.error || "Erro ao criar categoria. Tente novamente.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.formLabel}>Nome da Categoria</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            disabled={loading}
            placeholder="Ex: Restaurantes"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="file" className={styles.formLabel}>Imagem SVG</label>
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

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Criando..." : "Criar Categoria"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}