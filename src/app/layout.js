import "./globals.css";

export const metadata = {
  title: "Personal Dashboard Template",
  description:
    "Static one-page Next.js template for visualizations, dashboards, and blog-style content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
