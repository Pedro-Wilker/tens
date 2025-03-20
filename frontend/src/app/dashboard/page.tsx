import DashboardAdminClient from "./components/users";
import { getCookieServer } from "@/lib/cookieServer";
import { User } from "@/types/user-types";
import { NextPage } from "next";

export const dynamic = "force-dynamic";

const DashboardAdminServer: NextPage = async () => {
  try {
    const token = await getCookieServer();
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await fetch("https://tensoportunidades.com.br:8080/users/provider-await", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const users: User[] = await response.json();

    return <DashboardAdminClient users={users} />;
  } catch (error) {
    console.error("Erro ao buscar usuários em PROVIDERAWAIT:", error);
    return <DashboardAdminClient users={[]} />;
  }
};

export default DashboardAdminServer;