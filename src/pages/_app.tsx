import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import { RecoilRoot } from "recoil";
import Topbar from "../layouts/Topbar";
import { memoize } from "lodash";
import ApiRoot from "./api/ApiRoot";
import Web3Root from "./web3/Web3Root";
import "../theme/global.css";
import { TOKENS } from "../utils/constants/tokens";
import axios from "axios";
import { API_COINGECKO } from "../utils/constants";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  console.log("pageProps ", pageProps);
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

export async function getStaticProps() {
  try {
    const namesArr = TOKENS[250].map((token) => token.pathCoingecko);
    const ids = namesArr.join(",");
    const params = {
      ids: "fantom",
      include_24hr_change: true,
      vs_currencies: "usd",
    };

    const { data: prices } = await axios.get(API_COINGECKO, { params });
    return {
      props: {
        prices,
      },
    };
  } catch (error) {
    console.log("ERROR PRE FETCH STATIC");
  }
}
