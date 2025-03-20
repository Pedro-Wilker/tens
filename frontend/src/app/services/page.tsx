import styles from "./page.module.scss";
import { api } from "@/services/api";
import Categories, { CategoriesProps } from "./components/categories";
import ServicesComponent from "./components/services";
import { CategoryProvider } from "@/app/context/CategoryContext";
import { NextPage } from "next";

const Services: NextPage<{ searchParams: Promise<{ categoryId?: string }> }> = async ({
  searchParams,
}) => {
  let categories: CategoriesProps[] = [];
  let services: any[] = [];

  const resolvedSearchParams = await searchParams;

  try {
    const categoriesResponse = await api.get("/categories");
    if (Array.isArray(categoriesResponse.data)) {
      categories = categoriesResponse.data.map((category: CategoriesProps) => ({
        id: category.id,
        name: category.name,
        imageUrl: category.imageUrl && category.imageUrl.trim() !== "" ? category.imageUrl : null,
        subcategories: category.subcategories || [],
      }));
    } else {
      console.error("Dados de categorias não estão no formato esperado (esperado: array):", categoriesResponse.data);
    }
  } catch (err: any) {
    console.error("Erro ao carregar categorias em https://tensoportunidades.com.br:8080/categories:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    categories = [];
  }

  try {
    const endpoint = resolvedSearchParams.categoryId
      ? `/services/category/${resolvedSearchParams.categoryId}`
      : "/allservices";
    const servicesResponse = await api.get(endpoint);
    if (Array.isArray(servicesResponse.data)) {
      services = servicesResponse.data;
    } else {
      console.error("Dados de serviços não estão no formato esperado (esperado: array):", servicesResponse.data);
    }
  } catch (err: any) {
    console.error(`Erro ao carregar serviços em https://tensoportunidades.com.br:8080${resolvedSearchParams.categoryId ? `/services/category/${resolvedSearchParams.categoryId}` : "/allservices"}:`, {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    services = [];
  }

  return (
    <CategoryProvider>
      <Categories categories={categories} />
      <main className={styles.mainContent}>
        <ServicesComponent initialServices={services} />
      </main>
    </CategoryProvider>
  );
};

export default Services;