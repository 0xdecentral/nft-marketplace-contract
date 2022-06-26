// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC1155Collection is ERC1155, Ownable, Pausable, ERC1155Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping(uint256 => address) public creators;
    mapping(uint256 => string) private _uris;
    string public name;
    string public symbol;

    event TokenERC1155Mint(
        address creator,
        uint256 tokenId,
        uint256 amount,
        string tokenCID,
        uint256 timestamp
    );

    event TokenERC1155MintBatch(
        address creator,
        uint256[] ids,
        uint256[] amounts,
        string[] tokenCIDs,
        uint256 timestamp
    );

    constructor(string memory _name, string memory _symbol) ERC1155("") {
        name = _name;
        symbol = _symbol;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(
        string memory tokenCID,
        uint256 amount,
        bytes calldata data
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        creators[tokenId] = msg.sender;
        _uris[tokenId] = tokenCID;

        _mint(msg.sender, tokenId, amount, data);

        emit TokenERC1155Mint(
            msg.sender,
            tokenId,
            amount,
            tokenCID,
            block.timestamp
        );

        return tokenId;
    }

    function mintBatch(
        string[] memory tokenCIDs,
        uint256[] memory amounts,
        bytes calldata data
    ) public {
        uint256[] memory tokenIds = new uint256[](amounts.length);

        for (uint256 i = 0; i < amounts.length; i++) {
            _tokenIds.increment();
            tokenIds[i] = _tokenIds.current();
            creators[tokenIds[i]] = msg.sender;
            _uris[tokenIds[i]] = tokenCIDs[i];
        }

        _mintBatch(msg.sender, tokenIds, amounts, data);

        emit TokenERC1155MintBatch(
            msg.sender,
            tokenIds,
            amounts,
            tokenCIDs,
            block.timestamp
        );
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return _uris[_tokenId];
    }
}
