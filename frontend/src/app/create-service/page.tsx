import CreateServicesForm from "./components/createservices";
import { getCookieServer } from "@/lib/cookieServer";
import styles from "./page.module.scss";
import { api } from "@/services/api";
import { redirect } from "next/navigation";


interface Category {
  id: number;
  name: string;
  imageUrl: string;
  subcategories: { id: number; name: string; services: any[] }[];
}

interface User {
  role: "PROVIDER" | "CLIENT" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
  id: number;
  name: string;
  email: string;
  number: string;
  analfabeto: boolean;
}

export default async function CreateServicePage() {
  const token = await getCookieServer();

  if (!token) {
    redirect("/session/sign"); 
  }

  let user: User | null = null;
  try {
    const response = await api.get("/detailuser"); 
    user = response.data;
  } catch (err: any) {
    console.error("Erro ao buscar dados do usuário:", err);
    redirect("/session/sign"); 
  }

  if (!user || user.role !== "PROVIDER") {
    redirect("/services");
  }

  let categories: Category[] = [];
  try {
    const response = await api.get("/categories"); 
    categories = response.data;
  } catch (err: any) {
    console.error("Erro ao carregar categorias:", err);
    return (
      <div className={styles.errorContainer}>
        <h1>Erro ao carregar categorias: {err.response?.data?.error || err.message}</h1>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Criar Novo Serviço</h1>
        <CreateServicesForm token={token} categories={categories} />
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";