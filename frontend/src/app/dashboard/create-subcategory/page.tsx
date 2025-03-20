import CreateSubcategoryForm from "./components/create-subcategory";
import { getCookieServer } from "@/lib/cookieServer";
import styles from "./page.module.scss";
import { NextPage } from "next";

const CreateSubcategoryPage: NextPage = async () => {
  const token = await getCookieServer();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Criar Nova Subcategoria</h1>
      <CreateSubcategoryForm token={token} />
    </div>
  );
};

export default CreateSubcategoryPage;