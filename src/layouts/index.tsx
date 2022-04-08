import ApiRoot from "./apiRoot";
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
  </>
);

export default Layout;
