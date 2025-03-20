"use server";

import { api } from "@/services/api";

export interface Category {
  id: number;
  name: string;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await api.get("/categoriescarrossel");
    if (!Array.isArray(response.data)) {
      throw new Error("Resposta da API não é um array de categorias");
    }

   return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar categorias em https://tensoportunidades.com.br:8080/categoriescarrossel:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    const fallbackCategories: Category[] = [
      { id: 1, name: "Moda e Beleza" },
      { id: 2, name: "Alimentação" },
      { id: 3, name: "Festas e Eventos" },
      { id: 4, name: "Produtos da Roça" },
      { id: 5, name: "Artesanatos" },
      { id: 6, name: "Assistência Técnica" },
    ];
    return fallbackCategories;
  }
}