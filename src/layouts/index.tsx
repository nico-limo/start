import ApiRoot from "./apiRoot";
import Footer from "./Footer";
import Topbar from "./Topbar";
import Web3Root from "./web3/Web3Root";

const Layout = (props) => (
  <>
    <Topbar />
    <Web3Root>
      <ApiRoot>
        <main>{props.children}</main>
      </ApiRoot>
    </Web3Root>
    <Footer />
  </>
);

export default Layout;
