require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks:{
    mumbai:{
      url:process.env.API_KEY,
      accounts:[process.env.PRIVATE_KEY],
    }
  },
};
