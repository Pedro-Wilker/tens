"use client";

import { useState } from "react";
import { api } from "@/services/api";
import styles from "./createservicedetails.module.scss";
import { useRouter } from "next/navigation";

interface Props {
  serviceId: number;
  token: string | null | undefined;
}

export default function CreateServiceDetailsForm({ serviceId, token }: Props) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const limitedFiles = Array.from(selectedFiles).slice(0, 10);
      setFiles(limitedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !serviceId) {
      setError("Token ou ID do serviço não encontrado. Faça login novamente.");
      return;
    }

    if (files.length === 0 && !description) {
      setError("Adicione pelo menos uma descrição ou arquivos.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("serviceId", serviceId.toString());
      formData.append("description", description);
      files.forEach((file) => formData.append("file", file));

      await api.post("https://tensoportunidades.com.br:8080/services/details", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Detalhes do serviço adicionados com sucesso!");
      setError(null);
      setDescription("");
      setFiles([]);
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error: any) {
      console.error("Erro ao adicionar detalhes do serviço:", error);
      setError(error.response?.data?.error || "Erro ao adicionar detalhes. Tente novamente.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>Descrição dos Detalhes</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            disabled={loading}
            placeholder="Descreva os detalhes do serviço"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="files" className={styles.formLabel}>Imagens (até 10)</label>
          <input
            id="files"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className={styles.input}
            disabled={loading}
          />
          {files.length > 0 && <p className={styles.fileCount}>{files.length} arquivo(s) selecionado(s)</p>}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Adicionando..." : "Adicionar Detalhes"}
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
      </form>
    </div>
  );
}