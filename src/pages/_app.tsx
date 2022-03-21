import React from "react";
import { ChakraProvider, Container } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import { RecoilRoot } from "recoil";
import Topbar from "../layouts/Topbar";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Topbar />
        <Container maxW="container.xl" bg="gray.700" my={4}>
          <Component {...pageProps} />
        </Container>
      </ChakraProvider>
    </RecoilRoot>
  );
};

export default App;
