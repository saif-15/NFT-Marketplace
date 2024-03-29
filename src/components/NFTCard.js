import React, { useEffect, useState } from "react";
import { EthereumIcom } from "assets/svg";
import { Card as StyledCard } from "./StyledCard";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { Image, Modal, Alert, Badge, Input, Collapse, Switch } from "antd";
import abis from "./abis";
import { Typography } from 'antd';
import moment from "moment";
import contractAddresses from "./contracts";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { colors, Flex } from "assets/style/variables";
import { FileSearchOutlined, ShoppingCartOutlined, InfoCircleOutlined } from "@ant-design/icons";

import { Button, Card, Tooltip } from "antd";

function NFTCard({ uri, minter, address, tokenId, owner, onMarketplace, transactionHash, createdAt, isFirstTime, itemId, callback, query }) {
    const { Panel } = Collapse;

    const { Moralis } = useMoralis();
    const { walletAddress } = useMoralisDapp();

    const contractProcessor = useWeb3ExecuteFunction();
    const [metadata, setMetadata] = useState({});
    const [visibility, setVisibility] = useState(false);
    const [secondVisibility, setSecondVisibility] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [ethAddress, setEthAddress] = useState("");
    const [ethPrice, setEthPrice] = useState("");
    const [isFixedPrice, setFixedPrice] = useState(true);
    const { Title, Paragraph } = Typography;



    const onSubModel = (e, stateSub = true, stateMain = false) => {
        setVisibility(stateMain);
        setSecondVisibility(stateSub);
    };

    const parseJson = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        setMetadata({
            name: data.name.slice(0, 15),
            description: data.description.slice(0, 50) + "...",
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
    }, [])

    const sellOnMarketPlace = async () => {
        if (parseFloat(ethPrice) > 0) {
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
        } else {
            const call = () => {
                const modal = Modal.error({
                    title: "NFT Listing",
                    content: "Please Enter Price",
                },
                );
                setTimeout(() => {
                    modal.destroy();
                }, 2000);
            }
            call();
        }
        callback(walletAddress);

    }

    const transferToken = async () => {
        let option = {
            contractAddress: contractAddresses.marketplaceContract,
            functionName: abis.transferToken.functionName,
            abi: abis.transferToken.abi,
            params: {
                ownerAddress: walletAddress,
                toAddress: ethAddress,
                nftContract: address,
                tokenId: tokenId,
            },
        };
        setSecondVisibility(false);

        await contractProcessor.fetch({
            params: option,
            onSuccess: () => {
                const modal = Modal.success({
                    title: "NFT Transfer",
                    content: `Your NFT is transfer successfully to ${ethAddress}`,
                },
                );
                setTimeout(() => {
                    setSecondVisibility(false);
                    modal.destroy();
                }, 2000);
            },
            onError: () => {
                const modal = Modal.error({
                    title: "NFT Transfer",
                    content: `Transfer Failed`,
                });
                setTimeout(() => {
                    modal.destroy();
                }, 2000);
            }
        })
        callback(walletAddress);
    }


    const onSwitchChange = (checked) => {
        console.log(`switch to ${checked}`);
        setFixedPrice(checked)

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

                        type={"primary"}
                        color={colors.White}
                        onClick={onSubModel}
                    >Transfer Token</Button>
                    ,
                    <Button
                        disabled={!isFixedPrice}
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
                {!isFixedPrice && <Alert message="Auction isnt Available yet" type="error" style={{
                    margin: "10px"
                }} />}


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

                <Flex justify={"space-between"} style={{
                    marginBottom: "15px",
                }}>
                    <h3
                        style={{
                            fontWeight: "800",
                            fontSize: "16px",
                        }}
                    >{isFixedPrice ? "Fix Price" : "On Auction"}</h3>
                    <Switch checked={isFixedPrice} onChange={onSwitchChange} />

                </Flex>

                {isFixedPrice && <Input
                    step={0.1}
                    min={0.0}
                    allowClear={true}
                    padding={10}
                    placeholder={" Amount "}
                    type={"number"}
                    inputMode={"decimal"}
                    suffix={"ETH"}

                    prefix={<EthereumIcom color={colors.darkBlueCardBG} />}
                    hoverable
                    enterKeyHint="Enter Price in Eth"
                    onChange={(e) => setEthPrice(e.target.value)}
                >
                </Input>}

                <Collapse
                    style={{
                        marginTop: "20px ",


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
                    <Panel header="Token Name" key="6">
                        <p>{"FYPToken"}</p>
                    </Panel>
                    <Panel header="Token Symbol" key="7">
                        <p>{"FYP"}</p>
                    </Panel>
                    <Panel header="Token Transaction Hash" key="8">
                        <a href={`https://ropsten.etherscan.io/tx/${transactionHash}`} target="_blank">{transactionHash}</a>

                    </Panel>
                    <Panel header="Token Minted At" key="9">
                        <p>{moment(createdAt).format("DD-MM-YYYY hh:mm A")}</p>
                    </Panel>
                </Collapse>
            </Modal>
        </Flex>
    }

    const transferModal = () => {
        return <Modal
            style={{
                "font-weight": "bold",
            }}
            centered={true}
            keyboard={true}
            maskClosable={true}
            title={`${onMarketplace ? "" : "Transfer Token :" + tokenId}`}
            visible={secondVisibility}
            onCancel={(e) => {
                console.log(walletAddress);
                console.log(ethAddress);
                console.log(contractAddresses.nftContract);
                console.log(tokenId);
                setSecondVisibility(false);

            }}
            onOk={(e) => transferToken()
            }
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
                                window.open(
                                    `https://ropsten.etherscan.io/tx/${transactionHash}`,
                                    "_blank"
                                )
                            }
                        />
                    </Tooltip>,
                    onMarketplace ? <Tooltip title="Already on Sale">
                        <InfoCircleOutlined onClick={() => {
                            console.log("clicked")

                        }} />
                    </Tooltip>
                        : <Tooltip title="List NFT for sale">
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

                hoverable={true}
            >

                <StyledCard
                    image={metadata.image}
                    onMarket={onMarketplace}
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


                    {/* <Flex>
                    <ClockIcon />
                    <span className="card__info-box-right">3 days left</span>
                </Flex> */
                        // <div className="card__footer">

                        //     <Flex gap="5px" justify="flex-start">
                        //         <p>
                        //             Owned By: <span>{turncate(owner)}</span>
                        //         </p>
                        //     </Flex>
                        // </div>
                    }
                </StyledCard>



            </Card>

            {visibility && nftModal()}
            {secondVisibility && transferModal()}


        </>


    );
}

export default NFTCard;