const main = async() => {

    try{
        const getContract = await hre.ethers.getContractFactory('Domain');
        const contractDeploy = await getContract.deploy('followME');
        await contractDeploy.target;

        console.log('address of deployed contract -> ',contractDeploy.target);

        let txn = await contractDeploy.register('music', { value: hre.ethers.parseEther('0.01')});
        await txn.wait();
        console.log('music.followME has been minted!');

        txn = await contractDeploy.setRecord('music','this is music site?')
        await txn.wait();
        console.log("Set record for music.followME");

        //address of deployer
        const address = await contractDeploy.getAddressFun('music');
        console.log('owner of this domain is : ',address);

        //balance of this contract as again back converting into ether
        const balance = await hre.ethers.provider.getBalance(contractDeploy.target)
        console.log('balance of contract -> ',hre.ethers.formatEther(balance))
        
        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }

}

main();

//parseEther -> ether into wei 
//formatEther -> wei into ether

//address of deployed contract ->  0xf590076e21dDdFcE11663017DA923F2da6Aa320d

