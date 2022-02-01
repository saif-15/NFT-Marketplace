// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("FYPToken", "FYP") {
        contractAddress = marketplaceAddress;
    }

    event MintedNFTs(
        uint256 tokenId,
        string uri,
        address minter_of_nft,
        address owner_of_nft,
        bool onMarketplace,
        bool firstTime
    );

    function mintItem(string memory uri) public returns (uint256) {
        _tokenIds.increment();

        uint256 newId = _tokenIds.current();
        _safeMint(msg.sender, newId);
        _setTokenURI(newId, uri);
        setApprovalForAll(contractAddress, true);

        emit MintedNFTs(newId, uri, msg.sender, msg.sender, false, true);

        return newId;
    }

    function transferToken(
        address from,
        address to,
        uint256 tokenId
    ) external {
        require(ownerOf(tokenId) == from, "From address must be token owner");
        _transfer(from, to, tokenId);
    }
}
