import React, { useEffect, useRef, useState } from "react";
import { EthereumIcom, ClockIcon, ViewIcon } from "assets/svg";
import { BoxShadow, Card as StyledCard } from "./StyledCard";
import image from "assets/img/image-avatar.png";
import { Image, Modal, Alert, Badge, Input, Collapse } from "antd";
import abis from "./abis";
import { Typography } from 'antd';
import moment from "moment";



import contractAddresses from "./contracts";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { colors, Flex } from "assets/style/variables";
import { FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { Button, Card, Tooltip } from "antd";

function NFTCard({ uri, minter, address, tokenId, owner, onMarketplace, transactionHash, createdAt, isFirstTime, itemId, callback }) {
    const { Panel } = Collapse;

    const { Moralis } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction();
    const [metadata, setMetadata] = useState({});
    const [visibility, setVisibility] = useState(false);
    const [secondVisibility, setSecondVisibility] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [ethAddress, setEthAddress] = useState("");
    const [ethPrice, setEthPrice] = useState("");
    const { Title, Paragraph } = Typography;





    const onSubModel = (e, stateSub = true, stateMain = false) => {
        setVisibility(stateMain);
        setSecondVisibility(stateSub);
    };

    const parseJson = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        setMetadata(data);
    }

    const turncate = (string) => {
        if (string.length > 35) {
            string = string.substring(0, 6) + "......." + string.substring(string.length - 15, string.length);
        }
        return string;
    }

    useEffect(() => {
        parseJson(uri)
    }, [])

    const sellOnMarketPlace = async () => {
        let options = {
            contractAddress: contractAddresses.marketplaceContract,
            functionName: isFirstTime ? abis.createMarketItem.functionName : abis.putItemToResell.functionName,
            abi: isFirstTime ? abis.createMarketItem.abi : abis.putItemToResell.abi,
            params: isFirstTime ? {
                nftContract: address,
                tokenId: tokenId,
                price: Moralis.Units.ETH(ethPrice)
            } : {
                nftContract: address,
                itemId: itemId,
                newPrice: Moralis.Units.ETH(ethPrice)

            },
            msgValue: Moralis.Units.ETH(contractAddresses.listingPrice)
        };

        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                const modal = Modal.success({
                    title: "NFT Listing",
                    content: "Your NFT is listed successfully",
                },
                    callback()
                );
                setTimeout(() => {
                    modal.destroy();
                }, 2000);
            },
            onError: () => {
                const modal = Modal.error({
                    title: "NFT Listing",
                    content: "Something went wrong",
                });
                setTimeout(() => {
                    modal.destroy();
                }, 2000);
            }
        })
    }
    // const showInfoModal = () => {
    //     const modal = Modal.success({
    //         title: "NFT Listing",
    //         content: "Your NFT is listed successfully",
    //     });
    //     setTimeout(() => {
    //         modal.destroy();
    //     }, 2000);
    // }
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

                        type={"primary"}
                        color={colors.White}
                        onClick={onSubModel}
                    >Transfer Token</Button>
                    ,
                    <Button
                        type={"primary"}
                        color={colors.White}
                        onClick={(e) => {
                            sellOnMarketPlace();
                            setVisibility(false);
                        }}
                    >Publish on Marketplace</Button>
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
                                width: "250px",
                                borderRadius: "10px",
                                marginBottom: "15px",
                            }}
                        />
                    </Badge.Ribbon>

                </Flex>

                <Input

                    step={0.1}
                    min={0.0}
                    allowClear={true}
                    padding={10}
                    placeholder={" Amount "}
                    type={"number"}
                    inputMode={"decimal"}
                    suffix={"ETH"}
                    padding={"10px"}
                    prefix={<EthereumIcom color={colors.darkBlueCardBG} />}
                    hoverable
                    enterKeyHint="Enter Price in Eth"
                    onChange={(e) => setEthPrice(e.target.value)}
                >
                </Input>

                <Collapse
                    style={{
                        marginTop: "20px ",


                    }}
                >
                    <Panel header="Token Owner" key="1">
                        <p >{owner}</p>
                    </Panel>
                    <Panel header="Token Minter" key="2">
                        <p>{minter}</p>
                    </Panel>
                    <Panel header="Token Address" key="3">
                        <p>{address}</p>
                    </Panel>
                    <Panel header="Token ID" key="4">
                        <p>{tokenId}</p>
                    </Panel>
                    <Panel header="Token Type" key="5">
                        <p>{"ERC721"}</p>
                    </Panel>
                    <Panel header="Token Transaction Hash" key="6">
                        <p>{transactionHash}</p>
                    </Panel>
                    <Panel header="Token Minted At" key="7">
                        <p>{moment(createdAt).format("DD-MM-YYYY hh:mm A")}</p>
                    </Panel>
                </Collapse>
            </Modal>
        </Flex>
    }

    const sellModal = () => {
        return <Modal
            centered={true}
            keyboard={true}
            maskClosable={true}
            title={`${onMarketplace ? "" : "Transfer Token :" + tokenId}`}
            visible={secondVisibility}
            onCancel={() => {
                console.log(ethAddress);
                setSecondVisibility(false);

            }}
            onOk={() => setSecondVisibility(false)}
        >

            <Input

                allowClear={true}
                padding={10}
                placeholder={" Enter ETH Address "}
                type={"text"}
                suffix={"ETH"}
                prefix={<EthereumIcom color={colors.darkBlueCardBG} />}
                hoverable
                onChange={(e) => setEthAddress(e.target.value)}

            >
            </Input>

        </Modal>
    }

    return (
        <>
            <Card
                actions={[
                    <Tooltip title="View On Blockexplorer">
                        <FileSearchOutlined
                            onClick={() =>
                                console.log()
                            }
                        />
                    </Tooltip>,
                    <Tooltip title="List NFT for sale">
                        <ShoppingCartOutlined onClick={() => {
                            console.log("clicked")
                            setVisibility(true);
                        }} />
                    </Tooltip>,
                ]}
                about="this is card"
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
                                <ViewIcon />
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
                                <EthereumIcom color={colors.cyan} />
                                <span className="card__info-box-left">eth</span>
                            </Flex>

                            {/* <Flex>
                    <ClockIcon />
                    <span className="card__info-box-right">3 days left</span>
                </Flex> */}
                        </Flex>
                    }
                    <div className="card__footer">
                        {/* <Flex gap="5px" justify="flex-start">
                            <p>
                                Minted By: <span>{turncate(minter)}</span>
                            </p>
                        </Flex> */}
                        <Flex gap="5px" justify="flex-start">
                            <p>
                                Owned By: <span>{turncate(owner)}</span>
                            </p>
                        </Flex>
                    </div>

                </StyledCard>


            </Card>
            {visibility && nftModal()}
            {secondVisibility && sellModal()}

        </>

    );
}

export default NFTCard;