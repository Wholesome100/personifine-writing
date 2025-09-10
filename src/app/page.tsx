import { sql } from "@/db/context";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

async function getFeatured() {
  const response =
    await sql`SELECT title, description FROM stories WHERE featured=TRUE`;
  return response;
}

export default async function Home() {
  console.log(await getFeatured());

  return (
    <>
      <Header />

      <p>I am some content for this website.</p>
      <Footer />
    </>
  );
}
