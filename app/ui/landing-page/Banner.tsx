import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <div>
      <Image
        width={300}
        height={300}
        alt="banner"
        className="w-full h-[400px] sm:h-[300px] object-cover object-center"
        src={
          "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1726%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(164%2c 195%2c 228%2c 1)'%3e%3c/rect%3e%3cpath d='M1058.4199999999998 136.02 L1027.96 79.99L999.17493169552 152.02006830448008z' stroke='rgba(255%2c 255%2c 255%2c 1)' stroke-width='1.28'%3e%3c/path%3e%3crect width='319.2' height='319.2' clip-path='url(%26quot%3b%23SvgjsClipPath1727%26quot%3b)' x='1221.71' y='19.37' fill='url(%26quot%3b%23SvgjsPattern1728%26quot%3b)' transform='rotate(359.87%2c 1381.31%2c 178.97)'%3e%3c/rect%3e%3cpath d='M1029.21 193.47L1030.11 206.24 1017.85 209.93 1018.75 222.7 1006.48 226.39 1007.39 239.16 995.12 242.85M1022.63 188.93L1023.53 201.7 1011.26 205.38 1012.17 218.16 999.9 221.84 1000.8 234.62 988.54 238.3M1016.04 184.38L1016.94 197.15 1004.68 200.84 1005.58 213.61 993.32 217.3 994.22 230.07 981.95 233.76' stroke='rgba(112%2c 173%2c 221%2c 1)' stroke-width='2.39'%3e%3c/path%3e%3ccircle r='47.61968074754463' cx='1025.83' cy='389.84' fill='rgba(173%2c 204%2c 234%2c 1)'%3e%3c/circle%3e%3crect width='313.92' height='313.92' clip-path='url(%26quot%3b%23SvgjsClipPath1729%26quot%3b)' x='996.51' y='210.39' fill='url(%26quot%3b%23SvgjsPattern1730%26quot%3b)' transform='rotate(14.87%2c 1153.47%2c 367.35)'%3e%3c/rect%3e%3crect width='168' height='168' clip-path='url(%26quot%3b%23SvgjsClipPath1731%26quot%3b)' x='310.53' y='121.93' fill='url(%26quot%3b%23SvgjsPattern1732%26quot%3b)' transform='rotate(229.7%2c 394.53%2c 205.93)'%3e%3c/rect%3e%3cpath d='M825.02 437.1 L822.92 464.94L809.4364433398131 436.4864433398131z' fill='rgba(173%2c 204%2c 234%2c 1)'%3e%3c/path%3e%3crect width='300' height='300' clip-path='url(%26quot%3b%23SvgjsClipPath1733%26quot%3b)' x='209.63' y='-40.61' fill='url(%26quot%3b%23SvgjsPattern1734%26quot%3b)' transform='rotate(258.37%2c 359.63%2c 109.39)'%3e%3c/rect%3e%3cpath d='M1319.49 31.54a5.6 5.6 0 1 0-0.54-11.19 5.6 5.6 0 1 0 0.54 11.19zM1318.71 15.56a5.6 5.6 0 1 0-0.54-11.19 5.6 5.6 0 1 0 0.54 11.19zM1317.93-0.42a5.6 5.6 0 1 0-0.55-11.19 5.6 5.6 0 1 0 0.55 11.19zM1317.15-16.41a5.6 5.6 0 1 0-0.55-11.18 5.6 5.6 0 1 0 0.55 11.18zM1337.04 62.72a5.6 5.6 0 1 0-0.55-11.19 5.6 5.6 0 1 0 0.55 11.19zM1336.26 46.74a5.6 5.6 0 1 0-0.55-11.19 5.6 5.6 0 1 0 0.55 11.19zM1335.47 30.76a5.6 5.6 0 1 0-0.54-11.19 5.6 5.6 0 1 0 0.54 11.19zM1334.69 14.77a5.6 5.6 0 1 0-0.54-11.18 5.6 5.6 0 1 0 0.54 11.18z' stroke='rgba(255%2c 255%2c 255%2c 1)' stroke-width='1'%3e%3c/path%3e%3ccircle r='46.666666666666664' cx='1357.09' cy='352.19' stroke='rgba(173%2c 204%2c 234%2c 1)' stroke-width='1' stroke-dasharray='3%2c 3'%3e%3c/circle%3e%3crect width='72' height='72' clip-path='url(%26quot%3b%23SvgjsClipPath1735%26quot%3b)' x='1275.78' y='368.75' fill='url(%26quot%3b%23SvgjsPattern1736%26quot%3b)' transform='rotate(201.27%2c 1311.78%2c 404.75)'%3e%3c/rect%3e%3ccircle r='59.155974803910276' cx='734.94' cy='467.25' fill='rgba(112%2c 173%2c 221%2c 1)'%3e%3c/circle%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1726'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cpattern x='0' y='0' width='7.6' height='7.6' patternUnits='userSpaceOnUse' id='SvgjsPattern1728'%3e%3cpath d='M0 7.6L3.8 0L7.6 7.6' stroke='rgba(112%2c 173%2c 221%2c 1)' fill='none'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1727'%3e%3ccircle r='79.8' cx='1381.31' cy='178.97'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='6.54' height='6.54' patternUnits='userSpaceOnUse' id='SvgjsPattern1730'%3e%3cpath d='M0 6.54L3.27 0L6.54 6.54' stroke='rgba(173%2c 204%2c 234%2c 1)' fill='none'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1729'%3e%3ccircle r='78.48' cx='1153.47' cy='367.35'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='168' height='6' patternUnits='userSpaceOnUse' id='SvgjsPattern1732'%3e%3crect width='168' height='3' x='0' y='0' fill='rgba(112%2c 173%2c 221%2c 1)'%3e%3c/rect%3e%3crect width='168' height='3' x='0' y='3' fill='rgba(0%2c 0%2c 0%2c 0)'%3e%3c/rect%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1731'%3e%3ccircle r='42' cx='394.53' cy='205.93'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='6' height='6' patternUnits='userSpaceOnUse' id='SvgjsPattern1734'%3e%3cpath d='M3 1L3 5M1 3L5 3' stroke='rgba(255%2c 255%2c 255%2c 1)' fill='none' stroke-width='1'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1733'%3e%3ccircle r='75' cx='359.63' cy='109.39'%3e%3c/circle%3e%3c/clipPath%3e%3cpattern x='0' y='0' width='6' height='6' patternUnits='userSpaceOnUse' id='SvgjsPattern1736'%3e%3cpath d='M0 6L3 0L6 6' stroke='rgba(173%2c 204%2c 234%2c 1)' fill='none'%3e%3c/path%3e%3c/pattern%3e%3cclipPath id='SvgjsClipPath1735'%3e%3ccircle r='18' cx='1311.78' cy='404.75'%3e%3c/circle%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
        }
      />
      <div className="absolute mt-[-280px] sm:mt-[-225px] w-full flex flex-col">
        <div className="text-cyan-900 px-2 pb-1 bg-white font-bold text-xl sm:text-3xl mx-auto max-w-[500px]">
          Maximize a sua nota na discursiva
        </div>
        <div className="text-cyan-900 px-2 pb-1 bg-white font-bold text-xl sm:text-3xl mx-auto max-w-[500px]">
          com o Resposta Certa
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/questoes"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-700 hover:bg-cyan-800 transition-all transform hover:scale-105"
          >
            Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
  {
    /*<div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent sm:text-6xl">
              Resposta Certa
            </h1>
            <p className="mt-4 text-xl text-cyan-800">
              A plataforma definitiva para treinar questões discursivas de concursos
              públicos.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="/questoes"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Comece Agora <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>*/
  }
}
