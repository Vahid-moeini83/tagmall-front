import "./globals.css";
import { Toaster } from "react-hot-toast";
import AppShells from "@/components/layout/AppShells";

export const metadata = {
  title: "تگ مال",
  description: "فروشگاه آنلاین",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">
        {children}
        <AppShells />
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
