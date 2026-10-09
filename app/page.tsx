import { Footer } from "@/components/Footer";
import { Highlights } from "@/components/Highlights";
import { Navbar } from "@/components/Navbar";
import { NewsletterBanner } from "@/components/NewsletterBanner";
import { Storefront } from "@/components/Storefront";
import { TrustSection } from "@/components/TrustSection";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" ? category : "";

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* key resets the filters when a category link changes ?category= */}
        <Storefront key={initialCategory} initialCategory={initialCategory} />
        <Highlights />
        <TrustSection />
        <NewsletterBanner />
      </main>
      <Footer />
    </>
  );
}
