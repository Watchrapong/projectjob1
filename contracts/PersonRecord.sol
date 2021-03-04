// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Token.sol";

contract PersonRecord {
    struct Person {
    string citizenId;
    string firstName;
    string lastName;
    uint age;
    string gender;
    uint256 dateGetVaccine;
    address owner;
    }
    event AddedPerson(uint256 personid,string citizenId,string firstName,string lastName, uint age, string gender, uint256 dateGetVaccine, address owner);
    // event getVaccine(string citizenid, uint256 dateGetVaccine);
    mapping (uint256 => Person) persons;
    mapping (uint256 => address[]) receiver;
    Token token;

    constructor (address _tokenAddress) public {
        token = Token(_tokenAddress);
    }

    

    function addPerson(uint256 _pid, string memory _citizenId, string memory _firstName, string memory _lastName, uint _age, string memory _gender, uint256 _dateGetVaccine ) public {
        persons[_pid] = Person({
            citizenId: _citizenId,
            firstName: _firstName,
            lastName: _lastName,
            age: _age,
            gender: _gender,
            dateGetVaccine: _dateGetVaccine,
            owner: msg.sender
        });
        emit AddedPerson(_pid, _citizenId, _firstName, _lastName, _age, _gender, _dateGetVaccine,msg.sender);
    }

    // function getvaccine (string memory _citizenid, uint256 _dateGetVaccine) public{

    //     Person storage person = persons[_citizenid];
    //     emit getVaccine(_citizenid, _dateGetVaccine);
    // }
    function getPerson(uint256 _personid) public view returns (string memory citizenId,string memory firstName,string memory lastName, uint age, string memory gender, uint256 dateGetVaccine, address owner) {
        Person memory person = persons[_personid];
        return (person.citizenId,person.firstName,person.lastName,person.age,person.gender,person.dateGetVaccine,person.owner);
    }
}