import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soyeong Jeon — UX & Visual Designer",
  description: "UX Designer & Visual Designer at Samsung Electronics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Fustat (본문/UI 영문) + Stack Sans Headline (디스플레이) + Stack Sans Text */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fustat:wght@200..800&family=Stack+Sans+Headline:wght@200..700&family=Stack+Sans+Text:wght@200..700&display=swap"
          rel="stylesheet"
        />
        {/* Pretendard Variable — 한국어 텍스트 폴백 (dynamic subset으로 성능 최적화) */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
