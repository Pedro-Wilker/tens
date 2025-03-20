import CreateServicesForm from "./components";
import { getCookieServer } from "@/lib/cookieServer";
import styles from "./page.module.scss";
import { NextPage } from "next";

const CreateServicePage: NextPage<{ searchParams: Promise<{ userId?: string }> }> = async ({ searchParams }) => {
  const token = await getCookieServer();
  const resolvedSearchParams = await searchParams;
  const providerId = resolvedSearchParams.userId;

  if (!providerId || isNaN(Number(providerId))) {
    return (
      <div className={styles.errorContainer}>
        <h1>Erro: ID do provedor não fornecido ou inválido</h1>
      </div>
    );
  }

  try {
    const response = await fetch("https://tensoportunidades.com.br:8080/categories", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erro ao carregar categorias: ${response.statusText}`);
    }

    const categories = await response.json();

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Criar Novo Serviço</h1>
        <CreateServicesForm providerId={Number(providerId)} token={token} categories={categories} />
      </div>
    );
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return (
      <div className={styles.errorContainer}>
        <h1>Erro ao carregar categorias</h1>
      </div>
    );
  }
};

export default CreateServicePage;