import Footer from "@/components/Footer";

export default function WithFooterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
} 