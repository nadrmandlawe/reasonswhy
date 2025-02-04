import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col w-screen min-h-dvh">
            <Header />
      <main className="flex-1 w-full">
            {children}
          </main>
      <Footer />

    </div>
  );
}