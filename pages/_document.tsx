import Document, { Html, Head, Main, NextScript } from "next/document";

class EminaDoc extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Emina Festive Microsite" />
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
