// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the openzepplin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract openBooks is ERC721, ERC721URIStorage{

    uint payment = 0.001 * 10 ** 18;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct bookDetails {
        uint price;
        address owner;
        bool sold;
    }

    mapping(uint => bookDetails) book;

    constructor() ERC721("openBooks", "OB") {}

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function mintBook(string memory _bookCover, uint _price) public payable{
        require(msg.value == payment, "insufficient payment");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _bookCover);
        bookDetails storage bookdetail = book[tokenId];
        bookdetail.price = _price;
        bookdetail.owner = msg.sender;
    }

    function purchaseBook(uint _bookId) public payable{
        require(msg.value == book[_bookId].price, "insufficient payment");
        require(book[_bookId].owner != msg.sender, "owner cannot purchase book");
        require(book[_bookId].sold == false, "book not up for sale");
        safeTransferFrom(book[_bookId].owner, msg.sender, _bookId);
        bookDetails storage bookdetail = book[_bookId];
        bookdetail.owner = msg.sender;
        bookdetail.sold = true;
    }

    function resellBook(uint _bookId, uint _price) public {
        require(book[_bookId].owner == msg.sender, "only owner can resell book");
        bookDetails storage bookdetail = book[_bookId];
        bookdetail.price = _price;
        bookdetail.sold = false;
    }


}