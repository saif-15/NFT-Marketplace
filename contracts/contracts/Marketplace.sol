// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NFT.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsDeleted;

    // Owner of the marketplace
    address payable owner;
    // price for putting something to sale in the Marketplace
    uint256 listingFee = 0.01 ether;

    constructor() {
        //set the owner of the contract to the one that deployed it
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable minter;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private MarketItems;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address minter,
        address seller,
        address owner,
        uint256 price,
        bool firstTime
    );

    event ItemUpdated(
        uint256 indexed itemId,
        uint256 indexed oldPrice,
        uint256 indexed newPrice
    );

    event TransferNFT(address ownerAddress, address toAddress, uint256 tokenId);

    function transferNFT(
        address ownerAddress,
        address toAddress,
        address nftContract,
        uint256 tokenId
    ) public nonReentrant {
        NFT tokenContract = NFT(nftContract);
        tokenContract.transferToken(ownerAddress, toAddress, tokenId);
        emit TransferNFT(ownerAddress, toAddress, tokenId);
    }

    event MarketItemDeleted(uint256 itemId);

    event ItemSold(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address minter,
        address seller,
        address owner,
        uint256 price
    );

    event ItemListed(uint256 indexed itemId);

    modifier onlyItemOrMarketPlaceOwner(uint256 id) {
        if (MarketItems[id].owner != address(0)) {
            require(MarketItems[id].owner == msg.sender);
        } else {
            require(
                MarketItems[id].seller == msg.sender || msg.sender == owner
            );
        }
        _;
    }

    modifier onlyItemSeller(uint256 id) {
        require(
            MarketItems[id].owner == msg.sender,
            "Only the Item can do this operation"
        );
        _;
    }

    modifier onlyItemOwner(uint256 id) {
        require(
            MarketItems[id].owner == msg.sender,
            "Only Item owner can do this operation"
        );
        _;
    }

    function getlistingFee() public view returns (uint256) {
        return listingFee;
    }

    function getNFTMinter(uint256 id) public view returns (address) {
        return MarketItems[id].minter;
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        // obligates the seller to pay the listing price
        require(msg.value == listingFee, "Listing fee required");

        _itemsIds.increment();
        uint256 itemId = _itemsIds.current();

        MarketItems[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        NFT tokenContract = NFT(nftContract);
        tokenContract.transferToken(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            address(this),
            price,
            true
        );
    }

    function updateMarketItemPrice(uint256 id, uint256 newPrice)
        public
        payable
        onlyItemSeller(id)
    {
        MarketItem storage item = MarketItems[id];
        uint256 oldPrice = item.price;
        item.price = newPrice;

        emit ItemUpdated(id, oldPrice, newPrice);
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = MarketItems[itemId].price;
        uint256 tokenId = MarketItems[itemId].tokenId;

        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        // Minters 10% royality calculation
        uint256 minterRoyality = (msg.value / 100) * 10;

        // Sellers  Remainning 90%  calculation
        MarketItems[itemId].seller.transfer(msg.value - minterRoyality);

        NFT tokenContract = NFT(nftContract);
        tokenContract.transferToken(address(this), msg.sender, tokenId);
        MarketItems[itemId].owner = payable(msg.sender);
        MarketItems[itemId].sold = true;
        _itemsSold.increment();

        //regards the marketplace with the listingFee
        payable(owner).transfer(listingFee);

        // transfering the 10% of the NFT price to the minter as royality
        MarketItems[itemId].minter.transfer(minterRoyality);

        emit ItemSold(
            MarketItems[itemId].itemId,
            MarketItems[itemId].nftContract,
            MarketItems[itemId].tokenId,
            MarketItems[itemId].minter,
            MarketItems[itemId].seller,
            payable(msg.sender),
            MarketItems[itemId].price
        );
    }

    function putItemToResell(
        address nftContract,
        uint256 itemId,
        uint256 newPrice
    ) public payable nonReentrant {
        uint256 tokenId = MarketItems[itemId].tokenId;
        require(newPrice > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingFee,
            "Price must be equal to listing price"
        );

        NFT tokenContract = NFT(nftContract);
        tokenContract.transferToken(msg.sender, address(this), tokenId);

        address payable oldOwner = MarketItems[itemId].owner;
        MarketItems[itemId].owner = payable(address(0));
        MarketItems[itemId].seller = oldOwner;
        MarketItems[itemId].price = newPrice;
        MarketItems[itemId].sold = false;
        _itemsSold.decrement();

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            MarketItems[itemId].minter,
            msg.sender,
            address(0),
            newPrice,
            false
        );
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemsIds.current();
        uint256 unsoldItemCount = _itemsIds.current() -
            _itemsSold.current() -
            _itemsDeleted.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                MarketItems[i + 1].owner == address(0) &&
                MarketItems[i + 1].sold == false &&
                MarketItems[i + 1].tokenId != 0
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = MarketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchSingleItem(uint256 id)
        public
        view
        returns (MarketItem memory)
    {
        return MarketItems[id];
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemsIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (MarketItems[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (MarketItems[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = MarketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchAuthorsCreations(address author)
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItemCount = _itemsIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                MarketItems[i + 1].minter == author && !MarketItems[i + 1].sold
            ) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                MarketItems[i + 1].minter == author && !MarketItems[i + 1].sold
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = MarketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
