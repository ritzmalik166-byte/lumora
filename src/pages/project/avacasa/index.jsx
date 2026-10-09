import Header from "@/components/Header";
import Footer from "@/sections/Footer";
import Head from "next/head";
import NewProjectPage from "@/components/NewProjectPage";

const ProductPage = () => {
  return (
    <>
      <Head>
        <title>Lumora - Project Avacasa</title>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="preload"
          as="image"
          href="/avacasa-banners/new_web_banner_mobile.jpg"
          media="(max-width: 767px)"
          type="image/jpeg"
        />
        <link
          rel="preload"
          as="image"
          href="/avacasa-banners/new_web_banner_tablet.jpg"
          media="(min-width: 768px) and (max-width: 1023px)"
          type="image/jpeg"
        />
        <link
          rel="preload"
          as="image"
          href="/avacasa-banners/new_web_banner_desktop.jpg"
          media="(min-width: 1024px)"
          type="image/jpeg"
        />
      </Head>

      <Header lgScreen="lg:w-full" bgHeader="bg-greenTheme" />

      <NewProjectPage />

      <Footer />
    </>
  );
};

export default ProductPage;
