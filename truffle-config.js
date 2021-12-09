const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration! modifs done
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    test: {
      network_id:"*",
      host:"127.0.0.1",
      port: 7545
    }
  },

  compilers: {
    solc: {
      version: "0.8.9" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }

};
