import styles from "./page.module.scss";
import Image, { StaticImageData } from "next/image";
import Header from "./components/Header";
import modaBelezaImg from "/public/carrossel/modaBeleza.jpg";
import alimentacaoImg from "/public/carrossel/alimentacao.jpg";
import festasEventosImg from "/public/carrossel/festasEventos.jpg";
import produtosRocaImg from "/public/carrossel/produtosRoca.jpg";
import artesanatosImg from "/public/carrossel/artesanatos.jpg";
import assistenciaTecnicaImg from "/public/carrossel/assistenciaTecnica.jpg";
import placeHolderImg from "/public/placeholder.webp";
import Footer from "./components/footer/footer";
import Carousel from "./components/carousel/carousel";
import JoinForm from "./components/JoinForm"; // Importe o novo componente
import { fetchCategories, Category } from "./actions/categories";
import { CategoryProvider } from "./context/CategoryContext";
import HeroSection from "./components/HeroSection";

const categoryImages: { [key: string]: StaticImageData } = {
  "Alimentação": alimentacaoImg,
  "Artesanatos": artesanatosImg,
  "Assistência técnica": assistenciaTecnicaImg,
  "Moda e beleza": modaBelezaImg,
  "Festas e Eventos": festasEventosImg,
  "Produtos da roça": produtosRocaImg,
};

export default async function Home() {
  const categories: Category[] = await fetchCategories();

  const filteredCategories = categories
    .filter((category) => categoryImages[category.name])
    .slice(0, 6)
    .map((category) => ({
      id: category.id,
      name: category.name,
      image: categoryImages[category.name] || placeHolderImg,
      categoryId: category.id,
    }));

  return (
    <CategoryProvider>
      <>
        <Header />
        <main className={styles.main}>
          <HeroSection />
          <section className={styles.carouselSection}>
            <h2 className={styles.carouselTitle}>O que você precisa?

              Aqui é um teste
            </h2>
            {filteredCategories.length > 0 ? (
              <Carousel categories={filteredCategories} />
            ) : (
              <p className={styles.carouselError}>Nenhuma categoria encontrada. Verifique o backend.</p>
            )}
          </section>
          <JoinForm /> 
        </main>
        <Footer />
      </>
    </CategoryProvider>
  );
}