import Document, { Html, Head, Main, NextScript } from "next/document";

class EminaDoc extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Emina Festive Microsite" />
          {/* Google Analytics (gtag.js) */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-0EJ5N4YZEP"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-0EJ5N4YZEP');
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default EminaDoc;
