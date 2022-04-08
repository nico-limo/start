import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import { RecoilRoot } from "recoil";
import { memoize } from "lodash";
import "../theme/global.css";
import Layout from "../layouts";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const mutedConsole = memoize((console) => ({
    ...console,
    warn: (...args) =>
      args[0].includes("Duplicate atom key") ? null : console.warn(...args),
  }));
  global.console = mutedConsole(global.console);
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Container maxW="container.xl" bg="gray.700" p={4}>
            <Component {...pageProps} />
          </Container>
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default App;
