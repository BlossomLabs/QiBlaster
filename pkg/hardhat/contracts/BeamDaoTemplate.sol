// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { MyTokenFactory, MyToken } from "./MyTokenFactory.sol";
import { MyGovernorFactory, MyGovernor } from "./MyGovernorFactory.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";

interface TeamNick {
        function register(
        string calldata name,
        address owner,
        address addr,
        string calldata avatar
    ) external;
}

contract BeamDaoTemplate {
    address immutable teamNick = 0x7C6EfCb602BC88794390A0d74c75ad2f1249A17f;
    address immutable tokenFactory;
    address immutable governorFactory;

    constructor(address _tokenFactory, address _governorFactory) {
        tokenFactory = _tokenFactory;
        governorFactory = _governorFactory;
    }

    function newDao(
        string memory _id,
        string memory _name,
        string memory _symbol,
        address[] memory _holders,
        uint256[] memory _stakes,
        uint256[5] memory _votingSettings // 0: quorum, 1: delay, 2: period, 3: timelock, 4: votingThreshold
        ) public {
        MyToken token = MyTokenFactory(tokenFactory).createToken(address(this), _name, _symbol);

        for (uint256 i = 0; i < _holders.length; i++) {
            token.mint(_holders[i], _stakes[i]);
        }

        TimelockController timelock = new TimelockController(_votingSettings[3], new address[](0), new address[](0), address(this));
        MyGovernor governor = MyGovernorFactory(governorFactory).createGovernor(_id, token, timelock, uint48(_votingSettings[1]), uint32(_votingSettings[2]), uint256(_votingSettings[4]), uint256(_votingSettings[0]));

        timelock.grantRole(timelock.PROPOSER_ROLE(), address(governor));
        timelock.grantRole(timelock.DEFAULT_ADMIN_ROLE(), address(timelock));

        TeamNick(teamNick).register(_id, msg.sender, address(this), "");

    }

    // function newTokenAndInstance(
    //     string memory _tokenName,
    //     string memory _tokenSymbol,
    //     string memory _id,
    //     address[] memory _holders,
    //     uint256[] memory _stakes,
    //     uint256[3] memory _votingSettings
    // ) public returns (LazulineToken token, LazulineGovernor governor, LazulineACL acl) {

    //     // Create a new ACL
    //     bytes memory aclInitData = abi.encodeWithSelector(LazulineACL.initialize.selector, address(this));
    //     acl = LazulineACL(payable(new ERC1967Proxy(aclImplementation, aclInitData)));

    //     // Create a new token
    //     bytes memory tokenInitData = abi.encodeWithSelector(LazulineToken.initialize.selector, _tokenName, _tokenSymbol);
    //     token = LazulineToken(payable(new ERC1967Proxy(tokenImplementation, tokenInitData)));
    //     token.setAuthority(address(acl));

    //     // Create a new governor
    //     // string name, uint48 initialVotingDelay, uint32 initialVotingPeriod, uint256 initialProposalThreshold, IVotes _token
    //     bytes memory governorInitData = abi.encodeWithSelector(LazulineGovernor.initialize.selector, _id, _votingSettings[0], _votingSettings[1], _votingSettings[2], token);
    //     governor = LazulineGovernor(payable(new ERC1967Proxy(governorImplementation, governorInitData)));
    //     governor.setAuthority(address(acl));

    //     acl.setRoleAdmin(MINT_ROLE, acl.ADMIN_ROLE());
    //     acl.setRoleGuardian(MINT_ROLE, acl.ADMIN_ROLE());
    //     bytes4[] memory selectors = new bytes4[](1);
    //     selectors[0] = LazulineToken.mint.selector;
    //     acl.setTargetFunctionRole(address(token), selectors, MINT_ROLE);

    //     // Mint tokens to holders
    //     for (uint256 i = 0; i < _holders.length; i++) {
    //         token.mint(_holders[i], _stakes[i]);
    //     }
    }
