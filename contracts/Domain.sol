//SPDX-License-Identifier: MIT

pragma solidity^ 0.8.19;
//version os solidity

import 'hardhat/console.sol';
//solidity file which has feature to use console.log()

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


//we inherits the contract which we imports
contract Domain is ERC721URIStorage{

    //it help us to keep the track of tokenId
    uint256 public _tokenIds = 1;
    address payable owner;
    //here payable means owner can recieve the payments

    struct details{
        string name;
        address from;
        uint256 price;
        uint256 time;
    }

    details[] public detail;

    //storing NFT metadata images
    string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="340" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = '</text></svg>';


    //constructor(){
        //console.log('this is only run in the time of deployment', msg.sender);
        //here msg.sender is the address of deployer
    //}

    string domainTLD;

    constructor(string memory _domainTLD) payable ERC721("followME Name Service","f-ME"){
        //sending the nft name and symbol to the erc721 constructor
        domainTLD = _domainTLD;
        console.log('%s name service deployed', _domainTLD);
        owner = payable(msg.sender);
    }

    mapping(string => address) public domains;
    //it is state varibale permanently stored

    mapping(string => string) public records;

    function price(string calldata domainName) public pure returns(uint){
        //firstly converting into bytes then finding the length
        bytes memory a = bytes(domainName);
        uint256 domainNameLength = a.length;

        console.log('length of ',domainName, domainNameLength);
        //this is the way to find the actual of the length of any string
        
        //here shorter domains are expensive one
        require(domainNameLength>0);
        if(domainNameLength == 3){
            return 5*10**16;    //this is 0.05 matic
        }else if(domainNameLength == 4){
            return 3*10**16;    //this is 0.03 matic
        }else{
            return 1*10**16;    //this is 0.01 matic
        }

    }

    //getting names
    function register(string calldata domainName) public payable{
        require(domains[domainName] == address(0));

        uint _price = price(domainName);
        require(msg.value >= _price,"you dont have require matic!");

        //combining the passed name into dns, abi.encoded connects all as a string
        //getting the full domain name
        string memory name = string(abi.encodePacked(domainName,'.',domainTLD));


        //create the svg image with name for an nft
        //making an svg with the fulll domainName
        string memory finalSvg = string(abi.encodePacked(svgPartOne, name, svgPartTwo));

        //setting up the tokenId
        uint256 newRecordId = _tokenIds;
        console.log('this is the new id or we can say uniquie one ',newRecordId);

        //finding an domainName length and then convert into an string
        bytes memory a = bytes(domainName);
        uint256 length = a.length; 
        string memory strlen = Strings.toString(length);

        console.log('domain name was registered with ', name, newRecordId, domainTLD);

        //creting the metadat in json form
        //Base64 converts the binary data into printable form
        string memory json = Base64.encode(
            abi.encodePacked(
                        '{'
                            '"name": "', name,'", '
                            '"description": "A domain on the followMw name service", '
                            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(finalSvg)), '", '
                            '"length": "', strlen , '"'
                        '}'
            )
        );

        string memory finalTokenUri = string( abi.encodePacked("data:application/json;base64,", json));

        console.log("\n--------------------------------------------------------");
        console.log("Final tokenURI", finalTokenUri);
        console.log("--------------------------------------------------------\n");

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);


        //getting the value as of msg.value to the contract
        domains[domainName] = msg.sender;
        console.log("%s has registed for domain!", msg.sender);   //this address is of function caller


        detail.push(details(domainName, msg.sender, _price, block.timestamp));
        _tokenIds++;
    }

    //domain owner's address
    function getAddressFun(string calldata domainName) public view returns(address){
        return domains[domainName];
    }

    //here record can be anything link or photo or svg etc
    function setRecord(string calldata domainName, string calldata _record ) public{
        //we did this so other peolple can;t change your domain
        require(domains[domainName] == msg.sender);
        records[domainName] = _record;
    }

    function getRecord(string calldata domainName) public view returns(string memory){
        return records[domainName];
    }

    function getMoneyFromContract() public{
        require(msg.sender == owner);
        //transfering the money to the owner from the contract
        owner.transfer(address(this).balance);
    }

    function viewMoney() public view returns(uint256){
        return address(this).balance;
    }

    function Array() public view returns(details[] memory){
        return(detail);
    }

}

//calldata stores value for permananet and takes less gas