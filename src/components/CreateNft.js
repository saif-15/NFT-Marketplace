import React, { useEffect } from 'react'
import { useState } from 'react';
import { Input, Image, Button, Modal, Form, Upload } from 'antd';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import contractAddresses from './contracts';
import { Typography } from 'antd';
import { useHistory } from 'react-router-dom'
import NFTCard from "components/NFTCard";
import abis from './abis';

function CreateNft() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [collection, setCollection] = useState("");
    const [selectedImage, setSelectedImage] = useState();
    const [loading, setLoading] = useState(false);
    const { Moralis, isAuthenticated } = useMoralis();
    const history = useHistory();
    const contractProcessor = useWeb3ExecuteFunction();

    const mintNFT = async (tokenUri) => {
        let options = {
            contractAddress: contractAddresses.nftContract,
            functionName: abis.mintItem.functionName,
            abi: abis.mintItem.abi,
            params: { uri: tokenUri }
        }

        await contractProcessor.fetch({
            params: options,
            onError: () => {
                const modal = Modal.success({
                    title: "NFT Minting",
                    content: "Your NFT not minted successfully",
                });
                setTimeout(() => {
                    modal.destroy();
                }, 2000);
                setLoading(false);
            },
            onSuccess: () => {
                const modal = Modal.success({
                    title: "NFT Minting",
                    content: "Your NFT is minted successfully",
                });
                setTimeout(() => {
                    modal.destroy();
                    setLoading(false);
                }, 2000);

            }
        })
    }


    const uploadNFT = async () => {
        setLoading(true);
        if (name.trim().length > 0 && desc.trim().length > 0 && selectedImage !== null) {

            const nftFile = new Moralis.File("nft.jpg", selectedImage)
            await nftFile.saveIPFS();

            const nftFilePath = nftFile.ipfs()

            const metadata = {
                name: name,
                description: desc,
                image: nftFilePath,
            }

            const NFTMetadata = new Moralis.File("file.json", { base64: btoa(JSON.stringify(metadata)) });
            await NFTMetadata.saveIPFS()

            const nftMetadataPath = NFTMetadata.ipfs()
            console.log(nftMetadataPath);
            const receipt = await mintNFT(nftMetadataPath);
            console.log(receipt);
            history.push("#")

        } else {
            const modal = Modal.error({
                title: "Error!",
                content: `Please Fill The fields correctly`,
            });

            setTimeout(() => {
                modal.destroy();
                setLoading(false);
            }, 3000);

        }

    }


    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
            console.log(selectedImage);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage();
    };



    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            width: "70%"
        },
        heading: {
            fontSize: "35px",
            marginTop: "40px",
            fontWeight: "700"

        },
        paras: {
            fontSize: "20px",
            color: "#000000",
            margin: "20px 0px 0px 0px"
        }
    };


    return (
        isAuthenticated ?
            <div style={styles.container}>
                <h2 style={styles.heading}>Create New Token</h2>

                <div style={{
                    marginTop: "20px 10px"
                }}>


                    <p style={styles.paras}>Images</p>
                    <p style={{
                        fontSize: "12px",
                        marginTop: "5px",
                        marginBottom: "5px"
                    }}>File types supported: JPG,PNG,BMP,JPEG</p>
                </div>



                <Input
                    style={{
                        fontWeight: "600",
                        fontSize: "16px",
                        margin: "10px",
                        padding: "10px 10px",
                        borderRadius: "5px",


                    }}
                    allowClear={true}
                    width={200}
                    required
                    autoFocus
                    maxLength={15}
                    placeholder="NFT Title"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        console.log(name)

                    }
                    }

                />

                <Input
                    style={{
                        margin: "10px",
                        padding: "10px 10px",
                        borderRadius: "5px",
                        color: "#000000",
                        fontWeight: "600",
                        fontSize: "16px",

                    }}
                    allowClear={true}
                    width={200}
                    required
                    autoFocus
                    maxLength={100}
                    placeholder="NFT Description"
                    value={desc}
                    onChange={(e) => {
                        setDesc(e.target.value)
                        console.log(desc)

                    }
                    }

                />
                <Input
                    style={{
                        margin: "10px",
                        padding: "10px 10px",
                        borderRadius: "5px",
                        color: "#000000",
                        fontWeight: "600",
                        fontSize: "16px",

                    }}
                    allowClear={true}
                    width={200}
                    required
                    autoFocus
                    placeholder="NFT Collection Name"
                    value={collection}
                    onChange={(e) => {
                        setCollection(e.target.value)
                        console.log(desc)
                    }
                    }
                />




                <input
                    style={{
                        margin: "20px",

                    }}
                    type={"file"}
                    accept="image/*"
                    onChange={imageChange}
                    backgroundColor={"#FF3434"}
                    color={"#CCCWWW"}
                />

                {selectedImage && <Image
                    style={{
                        marginTop: "20px",
                        objectFit: "fill"
                    }}
                    width={200}
                    src={URL.createObjectURL(selectedImage)}
                />
                }



                <Button
                    style={{
                        marginTop: "40px",
                        backgroundColor: "#21BF96",
                        borderRadius: "5px",
                        color: "#FFFFFF",
                        fontSize: "15px",
                        height: "50px",

                        cursor: "pointer"

                    }}
                    loading={loading}
                    onClick={async () => {
                        console.log('clicked')
                        await uploadNFT();
                    }}
                >Mint Token</Button>
            </div > :
            <h2 style={styles.heading}>Please Login to Mint NFTs</h2>


    );

}



export default CreateNft;
