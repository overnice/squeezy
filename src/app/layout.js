import "./globals.css";

export const metadata = {
  title: "Squeezy",
  description: "A variable font experiment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="http://sdks.shopifycdn.com/buy-button/1.0.0/buybutton.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
