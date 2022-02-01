import React, { useState, useEffect } from "react";
import { getNativeByChain } from "helpers/networks";
import { getCollectionsByChain } from "helpers/collections";
import MarketItem from "./MarketItem";

import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
} from "react-moralis";
import { Card, Spin, Space } from "antd";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import {
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
const { Meta } = Card;

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

function NFTTokenIds() {

  const contractProcessor = useWeb3ExecuteFunction();
  const { Moralis } = useMoralis();
  const marketNFTs = useMoralisQuery("MarketplaceListing");




  const styles = {
    parent: {
      display: "flex",
      "flex-wrap": "wrap",
      "justify-content": "center"
    },
    child: {
      flex: "1 0 21%",
      margin: "5px",
      height: "100px",
    },
  }






  return (
    <>
      <div style={styles.parent}>
        {marketNFTs.data.length != 0 ?
          marketNFTs
            .data.map((item, index) =>
              <MarketItem
                uri={item.attributes.uri}
                minter={item.attributes.minter}
                address={item.attributes.nftContract}
                tokenId={item.attributes.tokenId}
                owner={item.attributes.seller}
                onMarketplace={true}
                createdAt={String(item.attributes.createdAt)}
                price={item.attributes.price}
                itemId={item.attributes.itemId}
              />
            )
          : <Space size="middle" >
            <Spin size="large" />
          </Space>
        }
      </div>
    </>
  );

}

export default NFTTokenIds;
