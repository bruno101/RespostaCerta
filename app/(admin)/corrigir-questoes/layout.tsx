import Menu from "./menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="bg-cyan-600 w-full h-[25vh] sm:h-[45vh] pt-5 pl-5 sm:pl-7"></div>
      <div className="-mt-[21vh] sm:-mt-[41vh]">
        <nav className="block w-full max-w-screen px-4 pt-4 mx-auto top-3 lg:px-8">
          <div className="container flex items-center justify-between mx-auto text-slate-800">
            <Menu />
          </div>
        </nav>
      </div>
      <div className="mb-10 min-h-[200px] bg-white border-1 mt-10 lg:mt-10 md:ml-4 md:mr-4 md:rounded-lg">
        {children}
      </div>
    </div>
  );
}
