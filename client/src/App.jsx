import React from 'react'
import { useEffect } from 'react'
import contractABI from './contractABI.json'
import { ethers } from 'ethers'
// import {network}
//ethers library -> talks to our contract from frontend

import './app.css'


const twitterHandel = `_myTwiiterProfile`;
const twitterLink = 'https://twitter.com/SharadPoddar11';

export default function App(){

  const [account,setAccount] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [record, setRecord] = React.useState();
  const [value,setValue] = React.useState(0);
  const [price1, setPrice] = React.useState(0);
  const [detailsArray, setDetailsArray] = React.useState([]);
  // const [network, setNetwork] = React.useState('')
  
  React.useEffect(()=>{
    const price = domain.length===3?'0.05':domain.length===4?'0.03':'0.01';
    setPrice(price);
  },[domain])

  const address = '0x295E4DD4ABD149D59303cce13d6eeb1d6a57B513';



  //checking for wallet is connect or not
  const checkIfWalletConnected = async() => {
    //first make sure we have window.ethereum
    const {ethereum} = window;

    if(!ethereum){
      console.log('we have any metamask!');
      return;
    }else{
      console.log('connecting with ethereum wallet metamask!',ethereum);

      const accounts = await ethereum.request({method:'eth_accounts'})

      if(accounts.length!==0){
        const account = accounts[0];
        console.log('account selectd ', account);
        setAccount(account);
      }else{
        console.log('you have metamask but make sure you have account init')
      }

      // This is the new part, we check the user's network chain ID
      // const chainId = await ethereum.request({method:'eth_chainId'})
      // setNetwork(networks[chainId]);

      //relode when the networks changes
      // ethereum.on('changed', (_chainId)=>{
      //   window.location.reload();
      
    }
  }



  const hadelConnectWallet = async() =>{
    const { ethereum } = window;
    if(!ethereum){
      console.log('make sure you have metamask!');
    }else{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      if(accounts.length !== 0){
        setAccount(accounts[0])
        console.log('account connected ',accounts[0]);
      }else{
        console.log('you dont have any authorised account')
      }
    }
  }

  
  
  //rendering the function if wallet is not connected yet
  const renderSomething = ()=>{
    return(
      <div className='renderAnything'>
        <img src='../public/img/img2.jpg'/>
        <h1>connect Here...</h1>
        <button onClick={hadelConnectWallet}>Connect Wallet</button>
      </div>
    )
  }

  //value trnfer to the owner
  const contractValueTransfer = async() =>{
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(address, contractABI.abi, signer);

    const txn = await contract.getMoneyFromContract();
    await txn.wait();

    console.log(txn.hash);
  }


  const renderActual = ()=>{
    return(
      <div className='renderActual'>
        <div className='image'>
          <img src='../public/img/img2.jpg'/>
        </div>
        <div className='firstRow'>
          <input className='domainName' type='text' placeholder='domain...'  value={domain}  onChange={e=>setDomain(e.target.value)} required/>
          <p>.followME</p>
        </div>
        <div className='secondRow'>
          <input className='record' type='text' placeholder='followME power' value={record} onChange={e=>setRecord(e.target.value)} required/>
        </div>
        <div>
          { domain.length>0 && price1 >0 && <p style={{color:'red', fontWeight:'900'}}>Price for minting og this Domain : {price1} Matic</p>}
        </div>
        <div className='btns'>
          <button onClick={_mint}>_mint</button>
        </div>
        <div>
          <p className='viewMoney'>{value} Matic</p>
        </div>
        <div className='btns'>
          <button onClick={contractValueTransfer}>contract value</button>
        </div>
        <div className='list'>
          { detailsArray && detailsArray.map((element)=>{
              return(
                <div className='details'>
                  <p>Domain name: {element.name}</p>
                  <p>address: {element.from}</p>
                  <p>Price: {ethers.formatEther(element.price)}</p>
                  <p>Time: {Number(element.time)}</p>
                </div>
              )
          })}
        </div>
      </div>
    )
  }


  const _mint = async() =>{
    if(domain.length<3){
      alert('domain must be 3 characters long');
      return;
    }

    //setting up the price
    const price = domain.length===3?'0.05':domain.length===4?'0.03':'0.01';
    console.log('minting domain with price', price);

    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.BrowserProvider(ethereum);
        //provider is what actually taks to the node either ethereum or polygon.
        //BrowserProvider is new version.

        const signer = await provider.getSigner();
        //contains info about the person who calls the contract, provides conts the signer

        const contract = new ethers.Contract(address, contractABI.abi, signer);
        //this line makes our contract to frontend

        console.log('contract is ready!')

        let txn = await contract.register(domain, {value: ethers.parseEther(price)})    //converting into wei
        const reciept = await txn.wait();
        //this txn consot all the details of transaction

        //checking for transaction is complete or not
        if(reciept.status === 1 ){
          console.log("Domain minted! https://mumbai.polygonscan.com/tx/"+txn.hash);
        }

        txn = await contract.setRecord(domain, record);
        await txn.wait();

        console.log("Record set! https://mumbai.polygonscan.com/tx/"+txn.hash);

        setDomain('');
        setRecord('');
      }else{
        console.log('transaction failed!');
      }
    }catch(error){
      console.log(error);
    }
  }

  const detailsList = async() => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(address, contractABI.abi, signer);

    const array = await contract.Array();
    setDetailsArray(array);
  }


const money = async() => {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(address, contractABI.abi, signer);

  const valuee = await contract.viewMoney();

  //conversion of wei into matic or ether
  setValue(ethers.formatEther(valuee));
}

  useEffect(()=>{
    //this can only done on page refreshing as parameter is set to be []
    checkIfWalletConnected();
    money();
    detailsList();
  },[])  

  return(
    <div>
      <div className='heading'>
        <h1> D🫥main-Name-Service <span>followME</span></h1>
        <p>your immortal API on bl🫥ckchain</p>
        <div>
          {/* <p>{network.includes("Polygon") ? 'polygon' : 'ethereum'}</p> */}
          { account ? <p> Wallet: {account.slice(0, 6)}...{account.slice(-4)} </p> : <p> Not connected </p> }
        </div>
      </div>
      <div className='content'>
        {!account ? renderSomething():renderActual()}
      </div>
      <div className='bottom-part'>
        <i class="fa-brands fa-twitter"></i>
        <a href={twitterLink}>{`built by @${twitterHandel}`}</a>
      </div>
    </div>
  )
}