// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

library Struct {
    struct DomainDetails {
        address owner;
        string ensName;
        string DisplayPictureURI;
    }
}
interface IENSNameService {
    function getEnsDetails(string memory _ensName) external view returns (address, string memory, string memory);
    function getAllRegisteredUsers() external view returns (Struct.DomainDetails[] memory);
}