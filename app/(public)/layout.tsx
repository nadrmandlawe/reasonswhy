import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlobalConfetti } from "@/components/GlobalConfetti";

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
    <GlobalConfetti/>
    </div>
  );
}