import { inter } from "./ui/fonts";
import "@/app/ui/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* //  antialiased applies anti-aliasing to the fonts, making them smoother and more visually appealing. */}
      <body className={ `${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
