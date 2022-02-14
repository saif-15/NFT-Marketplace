import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";
import NFTTokenIds from "components/NFTTokenIds";
import CreateNft from "components/CreateNft";
import { Menu, Layout } from "antd";
import SearchCollections from "components/SearchCollections";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
import NFTMarketTransactions from "components/NFTMarketTransactions";
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Montserrat,Roboto,sans-serif",
    color: "#041836",
    marginTop: "70px",
    padding: "10px",
  },

  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    fontFamily: "Montserrat,Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontFamily: "Montserrat,Roboto, sans-serif",

    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();



  const [query, setQuery] = useState("");
  const [placeholder, setPlaceHolder] = useState("Search Marketplace")

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          {/* <SearchCollections placeholder={placeholder} setQuery={setQuery} /> */}
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "15px",
              fontWeight: "800",
              marginLeft: "0px",
              width: "70%",
              justifyContent: "center"

            }}
            defaultSelectedKeys={["marketplace"]}
            color={"#0000FF"}
          >
            <Menu.Item key="marketplace"  >
              <NavLink to="/marketplace">Explore Market</NavLink>
            </Menu.Item>
            <Menu.Item key="collection">
              <NavLink to="/collection"> My Collection</NavLink>
            </Menu.Item>
            <Menu.Item key="transactions">
              <NavLink to="/transactions"> Transactions</NavLink>
            </Menu.Item>
            <Menu.Item key="create">
              <NavLink to="/create"> Create Token</NavLink>
            </Menu.Item>
          </Menu>
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/collection">
              <NFTBalance query={query} setHint={setPlaceHolder} />
            </Route>
            <Route path="/create">
              <CreateNft />

            </Route>
            <Route path="/marketplace">
              <NFTTokenIds query={query} setHint={setPlaceHolder} />
            </Route>
            <Route path="/transactions">
              <NFTMarketTransactions />
            </Route>
          </Switch>
          <Redirect to="/marketplace" />
        </div>
      </Router>
    </Layout>
  );
};

export const Logo = () => (
  <div style={{
    display: "flex",
    marginTop: "20px",
    fontFamily: 'Kaushan Script',
  }}>
    {
      <svg
        width="60"
        height="80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill="#211390" d="M15.833984375,21.103515625q0-0.1640625,0.1572265625-0.24609375t0.341796875-0.123046875t0.3349609375-0.041015625l0.150390625,0q0.478515625,0,0.6904296875,0.21875t0.5126953125,0.560546875q2.05078125,2.966796875,3.759765625,6.1044921875t3.294921875,6.3505859375q0.13671875-3.74609375,0.2802734375-7.5400390625t0.3623046875-7.5263671875q0-0.1640625,0.1572265625-0.2734375t0.35546875-0.1640625t0.4033203125-0.068359375t0.314453125-0.013671875q0.1640625,0,0.3623046875,0.013671875t0.396484375,0.08203125t0.328125,0.1640625t0.1298828125,0.259765625q0.0546875,0.587890625,0.0615234375,1.1826171875t0.0068359375,1.1826171875q0,4.40234375-0.19140625,8.626953125t-0.19140625,8.53125l0,0.984375q0,0.0546875-0.0546875,0.1640625q0.02734375,0.109375,0.08203125,0.2392578125t0.0546875,0.1845703125q0,0.21875-0.2255859375,0.328125t-0.4921875,0.1708984375t-0.4716796875,0.0615234375t-0.150390625,0q-0.697265625,0-1.17578125-0.3828125t-0.478515625-0.916015625q-1.01171875-2.26953125-2.0166015625-4.5048828125t-2.0986328125-4.4501953125q-0.697265625-1.39453125-1.4013671875-2.7958984375t-1.5107421875-2.7138671875q0.02734375,0.02734375,0.02734375,0.08203125q0.13671875,1.3671875,0.2939453125,2.7275390625t0.2392578125,2.7275390625q0.0546875,1.17578125,0.123046875,2.37890625t0.21875,2.37890625q0,0.451171875-0.2802734375,0.57421875t-0.6494140625,0.123046875q-0.314453125,0-0.5947265625-0.08203125t-0.3349609375-0.41015625q0-1.2578125-0.095703125-2.6728515625t-0.177734375-2.8505859375q-0.13671875-1.900390625-0.3623046875-3.8623046875t-0.2255859375-3.8349609375q0-0.08203125,0.013671875-0.1708984375t0.013671875-0.1982421875q-0.08203125-0.13671875-0.1845703125-0.287109375t-0.1025390625-0.2734375z M31.04626953125,36.703125q0.08203125-2.21484375,0.1435546875-4.5390625t0.1162109375-4.5869140625t0.08203125-4.3955078125t0.02734375-3.978515625q0.02734375-0.369140625,0.642578125-0.587890625t1.4697265625-0.3212890625t1.8046875-0.1298828125t1.6884765625-0.02734375q0.1640625,0,0.68359375-0.013671875l0.259765625,0q0.396484375,0,0.833984375,0.02734375q0.57421875,0.041015625,1.0048828125,0.177734375t0.4306640625,0.396484375q0,0.19140625-0.150390625,0.3076171875t-0.3486328125,0.1708984375t-0.41015625,0.068359375t-0.2939453125,0.013671875q-1.28515625,0-2.54296875-0.041015625q-0.341796875-0.013671875-0.697265625-0.013671875q-0.9296875,0-1.88671875,0.08203125q0.0546875,0.1640625,0.0888671875,0.9912109375t0.0341796875,1.8662109375t-0.013671875,2.0302734375t0,1.5244140625l0,3.5546875q0.423828125-0.02734375,0.833984375-0.02734375l0.8203125,0l0.546875-0.02734375q0.2734375-0.013671875,0.57421875-0.013671875q0.314453125,0,0.642578125,0.013671875q0.65625,0.02734375,1.1962890625,0.1572265625t0.5400390625,0.4580078125q0,0.24609375-0.205078125,0.3623046875t-0.4580078125,0.1708984375t-0.478515625,0.0546875l-0.2529296875,0q-0.779296875,0-1.6201171875-0.0546875t-1.5654296875-0.0546875q-0.13671875,0.0546875-0.2939453125,0.041015625t-0.2802734375-0.013671875q0,2.05078125-0.041015625,4.0810546875t-0.095703125,4.0400390625q0,0.396484375-0.4990234375,0.51953125t-0.9501953125,0.123046875q-0.505859375,0-0.7998046875-0.123046875t-0.4169921875-0.4033203125t-0.150390625-0.7451171875q-0.013671875-0.259765625-0.02734375-0.57421875q0-0.259765625,0.013671875-0.560546875z M41.3640234375,19.544921875q0-0.19140625,0.2666015625-0.2939453125t0.3486328125-0.1025390625l0.505859375-0.08203125q0.505859375-0.08203125,1.025390625-0.1435546875t1.01171875-0.1162109375q1.736328125-0.21875,3.47265625-0.4306640625t3.5-0.2119140625q0.13671875,0,0.3759765625,0.013671875t0.478515625,0.0751953125t0.41015625,0.1708984375t0.1708984375,0.30078125q0,0.13671875-0.1298828125,0.2392578125t-0.3076171875,0.1572265625t-0.3623046875,0.068359375t-0.2939453125,0.013671875l-0.2392578125,0t-0.2392578125-0.0546875q-0.724609375,0-1.4287109375,0.068359375t-1.4287109375,0.123046875q0.19140625,0.21875,0.205078125,0.615234375t0.02734375,0.68359375q0,4.83984375,0.068359375,9.625t0.123046875,9.666015625l0,0.02734375q-0.451171875,0.396484375-0.7724609375,0.505859375t-0.6494140625,0.109375q-0.314453125,0-0.6357421875-0.1162109375t-0.7724609375-0.4990234375l0-0.02734375l0.109375-10.732421875q0-1.06640625-0.02734375-2.3515625t-0.02734375-2.6044921875t0.041015625-2.5498046875t0.21875-2.146484375q-0.806640625,0.08203125-1.708984375,0.24609375q-0.779296875,0.13671875-1.490234375,0.13671875l-0.24609375,0q-0.0546875,0-0.3212890625,0.013671875t-0.546875-0.013671875t-0.505859375-0.109375t-0.2255859375-0.2734375z" />
        <path fill="#000" d="" />
      </svg>
    }

  </div>
);

export default App;
