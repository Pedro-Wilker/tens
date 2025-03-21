"use server";

import { api } from "@/services/api";
import { cookies } from "next/headers";

export interface ActionResponse {
  success: boolean;
  message?: string;
}

export async function loginUser(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Por favor, preencha todos os campos." };
  }

  try {
    const response = await api.post("/session", { "email": email, "password": password },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Requisição de login enviada para https://tensoportunidades.com.br:8080/session", {
      status: response.status,
      data: response.data,
    });

    if (response.status !== 200 || !response.data.token) {
      return { success: false, message: "E-mail ou senha incorretos." };
    }

    const expressTime = 30 * 24 * 60 * 60 * 1000;
    const cookieStore = await cookies();

    const existingSessions = cookieStore.getAll().filter((c) => c.name === "session");
    existingSessions.forEach((oldCookie) => {
      cookieStore.delete(oldCookie.name);
      console.log("Token antigo removido:", oldCookie.name);
    });

    cookieStore.set("session", response.data.token, {
      maxAge: expressTime,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      //httpOnly: true, 
      //sameSite: "lax", 
    });

    console.log("Cookie de sessão definido com sucesso para:", email);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao fazer login em https://tensoportunidades.com.br:8080/session:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.error || "Erro ao fazer login. Tente novamente." };
  }
}

export async function registerUser(formData: FormData): Promise<ActionResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const number = formData.get("number") as string;

  if (!name || !email || !password || !number) {
    return { success: false, message: "Preencha todos os campos." };
  }

  try {
    console.log("Enviando requisição de registro para https://tensoportunidades.com.br:8080/users:", {
      name,
      email,
      number,
    });
    const response = await api.post("/users", { "name": name, "email":email, "password": password, "number":number },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("Resposta do backend ao registrar:", {
      status: response.status,
      data: response.data,
    });

    if (response.status !== 201) {
      return { success: false, message: response.data?.error || `Erro no servidor: ${response.status}` };
    }

    console.log("Registro bem-sucedido para:", email);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao registrar usuário em https://tensoportunidades.com.br:8080/users:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, message: error.response?.data?.error || "Erro ao registrar usuário." };
  }
}