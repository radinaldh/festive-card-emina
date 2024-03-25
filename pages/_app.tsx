import RootLayout from "@/app/layout";

function MyApp({ Component, pageProps }: any) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
