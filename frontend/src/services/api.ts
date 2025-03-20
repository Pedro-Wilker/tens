import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://tensoportunidades.com.br:8080";
console.log("Base URL configurada no api.ts:", baseURL);

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
  
    return config;
  },
  (error) => {
    console.error("Erro ao enviar requisição:", {
      message: error.message,
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
  
    return response;
  },
  (error) => {
    console.error(`Erro na resposta de ${error.config?.baseURL}${error.config?.url}:`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    return Promise.reject(error);
  }
);