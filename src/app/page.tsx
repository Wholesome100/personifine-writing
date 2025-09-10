import { sql } from "@/db/context";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

async function getFeatured() {
  const response =
    await sql`SELECT title, description FROM stories WHERE featured=TRUE`;
  return response;
}

export default async function Home() {
  //console.log(await getFeatured());

  return (
    <>
      <Header />
      <main>
        {
          // I want a text logo for the site here
        }
        <p>I am some content for this website.</p>
        {
          // A featured stories section will go down here
        }
        {
          // A call for people to apply to be authors will go here
        }
      </main>
      <Footer />
    </>
  );
}
