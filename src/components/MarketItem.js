import React, { useEffect, useState } from "react";
import { EthereumIcom } from "assets/svg";
import { BoxShadow, Card as StyledCard } from "./StyledCard";
import { Image, Modal, Badge, Collapse } from "antd";
import abis from "./abis";
import moment from "moment";
import contractAddresses from "./contracts";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { colors, Flex } from "assets/style/variables";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";


import { Button, Card, Tooltip } from "antd";

function MarketItem({ uri, minter, seller, address, tokenId, owner, onMarketplace, createdAt, price, itemId, query }) {
    const { Panel } = Collapse;

    const { Moralis } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const [metadata, setMetadata] = useState({});
    const [visibility, setVisibility] = useState(false);
    const { walletAddress } = useMoralisDapp();
    const parseJson = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        setMetadata({
            name: data.name.slice(0, 15),
            description: data.description.slice(0, 45) + "...",
            image: data.image
        });
    }

    const turncate = (string) => {
        if (string.length > 35) {
            string = string.substring(0, 6) + "......." + string.substring(string.length - 15, string.length);
        }
        return string;
    }

    useEffect(() => {
        parseJson(uri)

    }, [query])


    const purchaseItem = async () => {
        let options = {
            contractAddress: contractAddresses.marketplaceContract,
            functionName: abis.createMarketSale.functionName,
            abi: abis.createMarketSale.abi,
            params: {
                nftContract: address,
                itemId: itemId
            },
            msgValue: price
        };

        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                const modal = Modal.success({
                    title: "NFT Purchase",
                    content: "Your NFT is purchased successfully",
                });

                setTimeout(() => {
                    modal.destroy();

                    setVisibility(false)
                }, 2000);
                //    callback();
            },
            onError: () => {
                const modal = Modal.error({
                    title: "NFT Purchase",
                    content: "Something went wrong",
                });
                setTimeout(() => {
                    modal.destroy();
                }, 2000);
            }

        })


    }

    const nftModal = () => {
        return <Flex>
            <Modal
                style={{
                    "font-weight": "bold",
                }}
                centered={true}
                keyboard={true}
                maskClosable={true}
                title={`${onMarketplace ? "Buy" : "Sell on Marketplace:"} ${metadata.name} #${tokenId}`}
                visible={visibility}
                onCancel={() => setVisibility(false)}
                onOk={() => setVisibility(false)}
                footer={[
                    <Button
                        onClick={(e) => purchaseItem()}
                        type={"primary"}
                        color={colors.White}
                    >Buy Now</Button>

                ]}
                confirmLoading={true}
            >

                <Flex justify={"center"}>
                    <Badge.Ribbon

                        color="red"
                        text={tokenId}
                        placement="start"

                    >
                        <Image
                            src={metadata.image}
                            style={{
                                position: "center",
                                width: "300px",
                                borderRadius: "10px",
                                marginBottom: "15px",
                            }}
                        />
                    </Badge.Ribbon>

                </Flex>



                <Collapse
                    style={{
                        marginTop: "20px "

                    }}
                >
                    <Panel header="Token Owner" key="1">
                        <a href={`https://ropsten.etherscan.io/address/${owner}`} target="_blank">{owner}</a>

                    </Panel>
                    <Panel header="Token Minter" key="2">
                        <a href={`https://ropsten.etherscan.io/address/${minter}`} target="_blank">{minter}</a>
                    </Panel>
                    <Panel header="Token Address" key="3">
                        <a href={`https://ropsten.etherscan.io/token/${address}`} target="_blank">{address}</a>
                    </Panel>
                    <Panel header="Token ID" key="4">
                        <p>{tokenId}</p>
                    </Panel>
                    <Panel header="Token Type" key="5">
                        <p>{"ERC721"}</p>
                    </Panel>
                    <Panel header="Token Price" key="6">
                        <p>{Moralis.Units.FromWei(price)} ETH</p>
                    </Panel>
                    <Panel header="Token Minted At" key="7">
                        <p>{moment(createdAt).format("DD-MM-YYYY hh:mm A")}</p>
                    </Panel>
                </Collapse>
            </Modal>
        </Flex>
    }


    return (
        walletAddress !== seller &&
        <>
            <Card

                onClick={(e) => setVisibility(true)}
                actions={[
                    <Tooltip title="Buy Now">
                        <ShoppingCartOutlined onClick={() => {
                            console.log("clicked")
                            setVisibility(true);
                        }} />
                    </Tooltip>
                ]}
                bodyStyle={{ padding: "0" }}
                style={{
                    margin: "10px 10px",
                    padding: "0px",
                    "border-radius": "10px",

                }}

                hoverable
            >
                <StyledCard
                    image={metadata.image}
                >
                    <div className="card__img">
                        <div className="card__visible">
                            <div className="card__visible-icon">

                            </div>
                        </div>
                    </div>
                    <div className="card__text-cont">
                        <Flex>

                            <h3>{metadata.name}</h3>
                            <h3>#{tokenId}</h3>

                        </Flex>
                        <p> {metadata.description}</p>
                    </div>
                    {onMarketplace &&
                        <Flex className="card__info-row">
                            <Flex>
                                <EthereumIcom color={colors.darkBlueCardBG} />
                                <span className="card__info-box-left">{Moralis.Units.FromWei(price)}</span>
                            </Flex>

                        </Flex>
                    }

                </StyledCard>
            </Card>

            {visibility && nftModal()}

        </>

    );
}

export default MarketItem;