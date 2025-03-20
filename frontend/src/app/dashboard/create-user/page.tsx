import CreateUserForm from "./components/createuser";
import styles from "./page.module.scss";
import { NextPage } from "next";

const CreateUserPage: NextPage = async () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Novo Usuário</h1>
      <CreateUserForm />
    </div>
  );
};

export default CreateUserPage;