import React, { useState, useEffect } from "react";
import { Card, Space, Spin } from "antd";
import { useNFTBalance } from "hooks/useNFTBalance";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import NFTCard from "components/NFTCard";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import { Flex } from "uikit/Flex/Flex";
const { Meta } = Card;

const styles = {
  heading: {
    fontSize: "35px",
    marginTop: "40px",
    fontWeight: "700"

  },
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
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
};

function NFTBalance() {
  const { walletAddress } = useMoralisDapp();
  const { Moralis, isAuthenticated, } = useMoralis();
  const [loading, setLoading] = useState(false);
  const [userNFTs, setUserNFTs] = useState([]);


  const getUserNFTs = async (walletAddress) => {
    setLoading(true)
    setTimeout(async () => {
      const nftsQuery = new Moralis.Query("MintedNFTs");
      nftsQuery.equalTo("owner_of_nft", walletAddress)
      nftsQuery.equalTo("onMarketplace", false)
      const nfts = await nftsQuery.find();
      setUserNFTs(nfts);
      setLoading(false);

    }, 5000);
  }


  useEffect(() => {

    if (isAuthenticated)
      getUserNFTs(walletAddress);

  }, [walletAddress]);

  return (
    isAuthenticated ?
      <div style={styles.parent}>
        {!loading ?
          userNFTs.length != 0 ?
            userNFTs.map((item) => {

              return <NFTCard
                uri={item.attributes.uri}
                minter={item.attributes.minter_of_nft}
                address={item.attributes.address}
                tokenId={item.attributes.tokenId}
                owner={item.attributes.owner_of_nft}
                onMarketplace={item.attributes.onMarketplace}
                transactionHash={item.attributes.transaction_hash}
                createdAt={String(item.attributes.createdAt)}
                isFirstTime={item.attributes.firstTime}
                itemId={item.attributes.itemId ?? -1}
                callback={getUserNFTs}
              />
            })
            : <h2>You have 0 NFTs Owned or Minted</h2>
          :
          <Space size="middle" style={{
            height: "100vh",
            width: "50%"
          }} >
            <Spin size="large" />
          </Space>

        }
      </div>

      : <h2 style={styles.heading}>Login in To View Your NFTs</h2>
  );
}

export default NFTBalance;
