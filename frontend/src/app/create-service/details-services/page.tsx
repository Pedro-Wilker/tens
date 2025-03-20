import CreateServiceDetailsForm from "./components/createservicedetails";
import { getCookieServer } from "@/lib/cookieServer";
import styles from "./page.module.scss";
import { NextPage } from "next";

const DetailsServicesPage: NextPage<{ searchParams: Promise<{ serviceId?: string }> }> = async ({ searchParams }) => {
  const token = await getCookieServer();
  const resolvedSearchParams = await searchParams;
  const serviceId = resolvedSearchParams.serviceId;

  if (!serviceId) {
    return (
      <div className={styles.errorContainer}>
        <h1>Erro: ID do serviço não fornecido</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Adicionar Detalhes do Serviço</h1>
      <CreateServiceDetailsForm serviceId={serviceId} token={token} />
    </div>
  );
};

export default DetailsServicesPage;