import "./globals.css";

export const metadata = {
  title: "Squeezy Variable",
  description: "A squishable and squashable variable font",
};
// <script src="http://sdks.shopifycdn.com/buy-button/1.0.0/buybutton.js"></script>

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
