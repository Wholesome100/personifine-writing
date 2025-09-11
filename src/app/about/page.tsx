import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-page-text">
      <Header />

      {/* Main container vertically centered */}
      <main className="flex-grow flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full">
          {/* Top intro section */}
          <section className="mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl text-accent1 mb-4">
              What is Personifine?
            </h1>
            <p className="text-lg text-page-text-muted leading-relaxed">
              Personifine is a website created to showcase my writing in a clean, ad‑free format.
              This is in contrast to sites such as Wattpad, which, in my opinion, do not present a convenient reading experience. 
              I wanted to amend that. In its current form, the website is tailored for my personal writings, but I would love to hear from any
              prospective contributors as I continue to expand the site.
            </p>
          </section>

          {/* Profile + About section */}
          <section className="flex flex-col md:flex-row items-center md:items-center gap-8">
            {/* Profile image column */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-64 h-64 relative">
                <Image
                  src="/Wholesome100.jpg"
                  alt="A low-poly caracal sitting in a bathtub"
                  fill
                  className="rounded-full object-cover shadow-lg"
                />
              </div>
            </div>

            {/* About text column */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="font-serif text-3xl text-accent2 mb-4">
                About the Creator
              </h2>
              <p className="text-lg text-page-text-muted leading-relaxed">
                I am Wholesome100, a Computer Science master's graduate, looking to create engaging
                and useful software for others. The stories I've posted here were written
                throughout 2020–2024, on the side, throughout college and my first job.
                They have been left largely unedited to provide a clear progression of my skills
                throughout the years.
              </p>
              <p className="mt-4 text-lg text-page-text-muted leading-relaxed">
                Thank you for visiting Personifine; I hope you enjoyed the stories as much as I did when writing them.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
