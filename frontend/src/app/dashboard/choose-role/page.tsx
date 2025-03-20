import ChooseRoleForm from "./components/createrole";
import { getCookieServer } from "@/lib/cookieServer";
import styles from "./page.module.scss";
import { NextPage } from "next";

const ChooseRolePage: NextPage<{ searchParams: Promise<{ userId?: string }> }> = async ({ searchParams }) => {
  const token = await getCookieServer();
  const resolvedSearchParams = await searchParams; 
  const userId = resolvedSearchParams.userId;

  if (!userId) {
    return (
      <div className={styles.errorContainer}>
        <h1>Erro: ID do usuário não fornecido</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Escolha o Role do Usuário</h1>
      <ChooseRoleForm userId={Number(userId)} token={token} />
    </div>
  );
};

export default ChooseRolePage;