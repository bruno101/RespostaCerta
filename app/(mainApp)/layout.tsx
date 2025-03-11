import NavLinks from "./navlinks";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-cyan-600 w-full h-[25vh] sm:h-[45vh] pt-5 pl-5 sm:pl-7"></div>
      <NavLinks />
      <div className="mb-10 min-h-[100px] bg-white border-1 mt-10 lg:mt-0 md:ml-4 md:mr-4 md:rounded-lg">
        {children}
      </div>
    </div>
  );
}
