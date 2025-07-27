import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-24 pt-32">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}