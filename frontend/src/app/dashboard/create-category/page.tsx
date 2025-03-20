import CreateCategoryForm from "./components/createcategory";
import { getCookieServer } from "@/lib/cookieServer";
import styles from "./page.module.scss";
import { NextPage } from "next";

const CreateCategoryPage: NextPage = async () => {
  const token = await getCookieServer();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Nova Categoria</h1>
      <CreateCategoryForm token={token} />
    </div>
  );
};

export default CreateCategoryPage;