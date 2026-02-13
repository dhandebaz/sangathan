export default async function LocalisedLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  return (
    <>
      {children}
    </>
  );
}
