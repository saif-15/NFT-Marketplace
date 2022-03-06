import MarketItem from "./MarketItem";

import {
  useMoralisQuery,
} from "react-moralis";
import { Spin, Space, Tabs } from "antd";

const { TabPane } = Tabs;


const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
  banner: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "0 auto",
    width: "600px",
    //borderRadius: "10px",
    height: "150px",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "solid 1px #e3e3e3",
  },
  logo: {
    height: "115px",
    width: "115px",
    borderRadius: "50%",
    // positon: "relative",
    // marginTop: "-80px",
    border: "solid 4px white",
  },
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
};

function NFTTokenIds({ query, setHint }) {


  const marketNFTs = useMoralisQuery("MarketplaceListing", q => q, [], { live: true });
  setHint("Explore Market")
  const styles = {
    parent: {
      display: "flex",
      "flex-wrap": "wrap",
      "justify-content": "center"
    },
    heading: {
      fontSize: "35px",
      marginTop: "40px",
      fontWeight: "700"

    },
    child: {
      flex: "1 0 21%",
      margin: "5px",
      height: "100px",
    },
    tabs: {
      color: "#21BF96"
    }
  }
  return (
    <>
      <Tabs defaultActiveKey="1" centered size={"large"} >
        <TabPane tab="Fix Price Token" key="1" >
          <div style={styles.parent}>
            {marketNFTs.data.length != 0 ?
              marketNFTs
                .data.map((item, index) =>
                  item.attributes.price.includes(query) || item.attributes.tokenId.includes(query) ?
                    <MarketItem
                      uri={item.attributes.uri}
                      minter={item.attributes.minter}
                      seller={item.attributes.seller}
                      address={item.attributes.nftContract}
                      tokenId={item.attributes.tokenId}
                      owner={item.attributes.seller}
                      onMarketplace={true}
                      createdAt={String(item.attributes.createdAt)}
                      price={item.attributes.price}
                      itemId={item.attributes.itemId}
                      query={query}
                    />
                    : <div></div>
                )
              : <Space size="middle" style={{
                height: "100vh",
                width: "50%"
              }} >
                <Spin size="large" />
              </Space>

            }
          </div>
        </TabPane>
        <TabPane tab="On Auction" key="2">
          <h2 style={styles.heading}>
            Auction Coming Soon
          </h2>
        </TabPane>

      </Tabs>
    </>
  );

}
export default NFTTokenIds;
