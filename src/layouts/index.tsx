// import ApiRoot from "./apiRoot";
import ApiRootV2 from "./ApiRootV2";
import Footer from "./Footer";
import SubHeader from "./SubHeader";
import Topbar from "./Topbar";
import Web3Root from "./web3/Web3Root";

const Layout = (props) => (
  <>
    <Topbar />
    <SubHeader />
    <Web3Root>
      {/* <ApiRoot> */}
      <ApiRootV2>
        <main>{props.children}</main>
      </ApiRootV2>
      {/* </ApiRoot> */}
    </Web3Root>
    <Footer />
  </>
);

export default Layout;
