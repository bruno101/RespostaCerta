import Footer from "@/app/(mainApp)/footer";
import Menu from "./menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Menu />
      <main className="mt-[64px]">{children}</main>
      <Footer />
    </div>
  );
}
