pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 

    struct Star { 
        string name;
        string starStory;
        string ra;
        string dec;
        string mag; 
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    
    // starsForSale: tokenId -> star price 
    mapping(uint256 => uint256) public starsForSale; 

    mapping(bytes32 => bool) public starhashToExist;

    //event starCreated(address owner);
    //event starInSale(uint256 id);

    function createStar(
        string _name,
        string _starStory,
        string _ra,
        string _dec,
        string _mag, 
        uint256 _tokenId
    ) 
        public 
    {
        // TODO: prevents stars with the same coordinates from being added
        bytes32 newStarhash = keccak256(abi.encodePacked(_ra, _dec, _mag));
        require(starhashToExist[newStarhash] == false);
        
        starhashToExist[newStarhash] = true;

        Star memory newStar = Star(_name, _starStory, _ra, _dec, _mag);

        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);

        //emit starCreated(msg.sender);
    }

    function checkIfStarExist(string _ra, string _dec, string _mag) public view returns (bool) {
        bytes32 newStarhash = keccak256(abi.encodePacked(_ra, _dec, _mag));
        return starhashToExist[newStarhash];
    }


    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;

        //emit starInSale(_tokenId);
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }
}