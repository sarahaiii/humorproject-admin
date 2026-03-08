import "./globals.css";

export const metadata = {
    title: "Humor Project Admin",
    description: "Admin panel",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}