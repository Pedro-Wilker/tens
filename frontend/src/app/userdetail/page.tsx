import UserDetails from "../components/userdetail";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/services/api";
import { NextPage } from "next";

// Tipo esperado por UserDetails (com id: string)
interface UserForComponent {
  id: string; // Mantido como string para compatibilidade
  name: string;
  email: string;
  number: string;
  role: "CLIENT" | "PROVIDER" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
  passwordHash?: string;
  services?: {
    id: string;
    name: string;
    description: string;
    price: string;
    subcategory: { id: string; name: string };
    serviceDetails: { id: string; photoUrl: string; description?: string }[];
    ratings: { id: string; rating: number; userId: string; createdAt: string }[];
  }[];
  comments?: {
    id: string;
    text: string;
    subcomments: { id: string; text: string }[];
    createdAt: string;
  }[];
  ratings?: { id: string; rating: number; serviceId: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

interface UserFromBackend {
  id: number;
  name: string;
  email: string;
  number: string;
  role: "CLIENT" | "PROVIDER" | "ADMIN" | "SUPPORT" | "PROVIDERAWAIT";
  passwordHash?: string;
  services?: {
    id: number;
    name: string;
    description: string;
    price: string;
    subcategory: { id: number; name: string };
    serviceDetails: { id: number; photoUrl: string; description?: string }[];
    ratings: { id: number; rating: number; userId: number; createdAt: string }[];
  }[];
  comments?: {
    id: number;
    text: string;
    subcomments: { id: number; text: string }[];
    createdAt: string;
  }[];
  ratings?: { id: number; rating: number; serviceId: number; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

const UserDetailPage: NextPage = async () => {
  console.log("Arquivo page.tsx carregado para /userdetail");

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  console.log("Carregando UserDetailPage com token:", token);

  if (!token) {
    redirect("/session/sign");
    return null;
  }

  let userFromBackend: UserFromBackend | null = null;

  try {
    const userResponse = await api.get("/listdetailuser", {
      headers: { Authorization: `Bearer ${token}` },
    });
    userFromBackend = userResponse.data;
    console.log("Dados do usuário em /userdetail:", userFromBackend);
  } catch (err) {
    console.error("Erro ao carregar dados do usuário:", err);
    const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
    return <div>Erro ao carregar dados do usuário: {errorMessage}</div>;
  }

  if (!userFromBackend) {
    return <div>Usuário não encontrado.</div>;
  }

  const userForComponent: UserForComponent = {
    ...userFromBackend,
    id: userFromBackend.id.toString(),
    services: userFromBackend.services?.map((service) => ({
      ...service,
      id: service.id.toString(),
      subcategory: { ...service.subcategory, id: service.subcategory.id.toString() },
      serviceDetails: service.serviceDetails.map((detail) => ({
        ...detail,
        id: detail.id.toString(),
      })),
      ratings: service.ratings.map((rating) => ({
        ...rating,
        id: rating.id.toString(),
        userId: rating.userId.toString(),
      })),
    })),
    comments: userFromBackend.comments?.map((comment) => ({
      ...comment,
      id: comment.id.toString(),
      subcomments: comment.subcomments.map((sub) => ({
        ...sub,
        id: sub.id.toString(),
      })),
    })),
    ratings: userFromBackend.ratings?.map((rating) => ({
      ...rating,
      id: rating.id.toString(),
      serviceId: rating.serviceId.toString(),
    })),
  };

  return (
    <div>
      <UserDetails initialUser={userForComponent} token={token} />
    </div>
  );
};

export default UserDetailPage;