const main = async () => {

    try{

        //we get the getContractFactory function from hre.ethers
        const contractFacotry = await hre.ethers.getContractFactory('Domain')
        //it gets our contract and generates the colpiled code in artifacts

        const contract = await contractFacotry.deploy('followME');

        //deployed is removed and target is added
        await contract.target;
        console.log('contract has been deployed! and deployed at : ',contract.target)

        //getting singers, this is type of grabbing wallet of deployer and anotherPerson
        const [deplyer, anotherPerson] = await hre.ethers.getSigners();  //this is way of accessing the wallet of both owner and anotherperson
        console.log('address of deployer -> ',deplyer.address);
        console.log('address of anotherPerson -> ',anotherPerson.address);

        //calling our functions of solidity contract
        const contractTxn1 = await contract.register('deployer',{value: hre.ethers.parseEther('0.1')});
        await contractTxn1.wait;   //it is transaction function we have to wait; //hrer wait is not an function

        const contractTxn2 = await contract.connect(anotherPerson).register('anotherPerson',{value: hre.ethers.parseEther('0.1')})  //parseEther convert ethers string into wei
        await contractTxn2.wait;

        const addressOfDeployer = await contract.getAddressFun('deployer');   //this is not an transaction function
        const addressOfAnotherPerson = await contract.getAddressFun('anotherPerson'); //this is non transact function

        console.log(addressOfDeployer);
        console.log(addressOfAnotherPerson);

        const balanceOfContract = await hre.ethers.provider.getBalance(contract.target);   //we will get the balance of this address
        //conveting into an ether
        console.log(hre.ethers.formatEther(balanceOfContract));  //we get the address in ether

        //checking what is this 
        console.log(hre.ethers.parseEther('0.1'));   //converted into wei from string assumed to be in ether

        //deployer try to change the domain of other so transact revert
        //const contractGetRecord = await contract.connect(deplyer).setRecord('anotherPerson','anotherDomain')
        //await contractGetRecord.wait();  //waiting for the transact function

        let balance = await hre.ethers.provider.getBalance(deplyer.address);
        console.log('balance of deployer -> ', hre.ethers.formatEther(balance));
        balance = await hre.ethers.provider.getBalance(contract.target)
        console.log('balance of contract -> ', hre.ethers.formatEther(balance));

        //withdrawing the payments
        const txn1 = await contract.connect(deplyer).getMoneyFromContract();
        await txn1.wait();

        balance = await hre.ethers.provider.getBalance(deplyer.address);
        console.log('balance of deployer -> ', hre.ethers.formatEther(balance));
        balance = await hre.ethers.provider.getBalance(contract.target)
        console.log('balance of contract -> ', hre.ethers.formatEther(balance));

        process.exit(0);
    }catch(error){

        console.log(error)
        process.exit(1);

    }

}

//calling of the function
main();

