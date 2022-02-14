const abis = {
    mintItem: {
        functionName: "mintItem",
        abi: [{
            "inputs": [
                {
                    "internalType": "string",
                    "name": "uri",
                    "type": "string"
                }
            ],
            "name": "mintItem",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }]
    },
    createMarketItem: {
        functionName: "createMarketItem",
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "createMarketItem",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }]
    },
    putItemToResell: {
        functionName: "putItemToResell",
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "itemId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "newPrice",
                    "type": "uint256"
                }
            ],
            "name": "putItemToResell",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }]
    },
    createMarketSale: {
        functionName: "createMarketSale",
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "itemId",
                    "type": "uint256"
                }
            ],
            "name": "createMarketSale",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }]
    },
    transferToken: {
        functionName: "transferNFT",
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "ownerAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "toAddress",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "nftContract",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferNFT",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }]
    }
}

export default abis;