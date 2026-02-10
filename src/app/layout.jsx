import "./globals.css";
import MainLayout from "@/components/layout/main-layout";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "تگ مال",
  description: "فروشگاه آنلاین",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Set CSS custom property for viewport height (mobile-friendly)
              function setVH() {
                const vh = window.visualViewport 
                  ? window.visualViewport.height * 0.01 
                  : window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', vh + 'px');
              }
              
              setVH();
              window.addEventListener('resize', setVH);
              if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', setVH);
              }
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <MainLayout>{children}</MainLayout>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#000",
              fontFamily: "YekanBakh",
              direction: "rtl",
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#e30613",
                secondary: "#fff",
              },
            },
            success: {
              duration: 4000,
              style: {
                color: "#0da700",
              },
              iconTheme: {
                primary: "#0da700",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
