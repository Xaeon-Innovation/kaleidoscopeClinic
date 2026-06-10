import { Montserrat } from "next/font/google";

/** Body / UI text */
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
