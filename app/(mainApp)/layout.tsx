import Footer from "./footer";
import NavLinks from "./navlinks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavLinks />
      <main className="mt-[64px]">{children}</main>
      <Footer />
    </div>
  );
}
