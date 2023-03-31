// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the openzepplin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract openBooks is ERC721, ERC721URIStorage,ERC721Enumerable{

    uint payment = 0.001 * 10 ** 18;

    using Counters for Counters.Counter;

    Counters.Counter public _tokenIdCounter;

    struct bookDetails {
        uint price;
        address owner;
        bool sold;
        string book;
    }

    mapping(uint => bookDetails) public book;

    // mapping(uint => bookDetails) public bookS;

    mapping (address => uint) public profit;

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

     function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mintBook(string memory _bookCover, string memory _book, uint _price) public payable{
        require(msg.value == payment, "insufficient payment");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _bookCover);
        bookDetails storage bookdetail = book[tokenId];
        bookdetail.price = _price;
        bookdetail.owner = msg.sender;
        bookdetail.book = _book;
    }

    function purchaseBook(uint _bookId) public payable{
        require(msg.value == book[_bookId].price, "insufficient payment");
        require(book[_bookId].owner != msg.sender, "owner cannot purchase book");
        require(book[_bookId].sold == false, "book not up for sale");
        profit[book[_bookId].owner] += msg.value;
        _transfer(ownerOf(_bookId),msg.sender, _bookId);
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

    function getBook(uint _bookId) public view returns(string memory){
        require(book[_bookId].owner == msg.sender, "only owner can get book");
        return book[_bookId].book;
    }

    function redeem() public {
        (bool success,) = msg.sender.call{value:profit[msg.sender]}("");
        require(success);
        profit[msg.sender] = 0;
    }
}