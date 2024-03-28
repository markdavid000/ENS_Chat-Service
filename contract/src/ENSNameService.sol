// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {LibENSErrors, LibENSEvents} from "./libraries/LibENSNameService.sol";

contract NameService {
    struct DomainDetails {
        address owner;
        string ensName;
        string userName;
        string DisplayPictureURI;
    }

    mapping(string => address) public nameToAddress;
    mapping(string => DomainDetails) public domains;

    function getEnsDetails(
        string memory _ensName
    ) public view returns (string memory, string memory, address) {
        if (nameToAddress[_ensName] == address(0)) {
            revert LibENSErrors.EnsNotRegistered();
        }

        return (
            domains[_ensName].owner,
            domains[_ensName].ensName,
            domains[_ensName].DisplayPictureURI
        );
    }

    function registerNameService(
        string memory _ensName,
        string memory _userName,
        string memory _displayPictureURI
    ) public {
        if (nameToAddress[_ensName] != address(0)) {
            revert LibENSErrors.EnsAlreadyTaken();
        }
        nameToAddress[_ensName] = msg.sender;
        domains[_ensName] = DomainDetails(
            msg.sender,
            _ensName,
            _userName,
            _displayPictureURI
        );

        emit LibENSEvents.EnsRegistered(msg.sender, _ensName, _userName);
    }

    function updateEnsDP(
        string memory _ensName,
        string memory _displayPictureURI
    ) public {
        if (nameToAddress[_ensName] == address(0)) {
            revert LibENSErrors.EnsNotRegistered();
        }
        if (nameToAddress[_ensName] != msg.sender) {
            revert LibENSErrors.NotEnsOwner();
        }

        domains[_ensName].DisplayPictureURI = _displayPictureURI;
        emit LibENSEvents.DPUpdated(msg.sender, _ensName);
    }

    function updateUserName(
        string memory _ensName,
        string memory _userName
    ) public {
        if (nameToAddress[_ensName] == address(0)) {
            revert LibENSErrors.EnsNotRegistered();
        }
        if (nameToAddress[_ensName] != msg.sender) {
            revert LibENSErrors.NotEnsOwner();
        }

        domains[_ensName].DisplayPictureURI = _userName;
        emit LibENSEvents.DPUpdated(msg.sender, _ensName);
    }
}