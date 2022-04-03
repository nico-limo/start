import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import { RecoilRoot } from "recoil";
import Topbar from "../layouts/Topbar";
import { memoize } from "lodash";
import Web3Root from "../layouts/web3/Web3Root";
import ApiRoot from "../layouts/apiRoot";
import "../theme/global.css";

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
        <Topbar />
        <Web3Root>
          <ApiRoot>
            <Container maxW="container.xl" bg="gray.700" p={4}>
              <Component {...pageProps} />
            </Container>
          </ApiRoot>
        </Web3Root>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default App;
