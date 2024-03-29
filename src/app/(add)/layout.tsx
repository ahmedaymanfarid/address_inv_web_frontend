import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export const metadata = {
  title: "The Address - Amr El Sheikh",
  description: "The Address - Amr El Sheikh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
