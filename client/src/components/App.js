import React, { Component } from "react";
import StakeCoin from "../contracts/StakeCoin.json"
import Staking from "../contracts/Staking.json";
import getWeb3 from "../getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './Navbar';
import Main from './Main.js';
import "./App.css";

class App extends Component {

    /**
     * entity: constructor
     * description: initialize the different variables
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            web3: null,
            accounts: [],
            contract: null,
            ownerOfContract: null,
            stakeCoin: {},
            staking: {},
            stakeCoinBalance: '0',
            stakingBalance: '0',
            loading: true,
            userBalance: null,
            tokenAddress: null

        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    componentDidMount = async () => {
        try {
                //************** LOAD Staking
                // Get network provider and web3 instance.
                const web3 = await getWeb3();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Staking.networks[networkId];
                const instance = new web3.eth.Contract(
                    Staking.abi,
                    deployedNetwork && deployedNetwork.address,
                );

                this.setState({web3: web3, contract: instance});

                //************** LOAD STAKECOIN token
                const stakeCoinData = StakeCoin.networks[networkId];
                if(stakeCoinData) {
                    const stakeCoin = new web3.eth.Contract(StakeCoin.abi, stakeCoinData.address);
                    this.setState({stakeCoin});
                } else {
                    window.alert("stakeCoin contract not deployed to detect network")
                }




                //Use web3 to get the user's accounts.
                window.ethereum.on('accountsChanged', async (accounts) => {
                    this.setState({accounts: accounts});

                    const userBalance = await web3.eth.getBalance(accounts[0]);
                    this.setState({userBalance});

                    console.log('userBalance: ', userBalance);
                    console.log('state of the object: ', this.state);

                    });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        const { accounts } = this.state;
        const {contractName} = StakeCoin

        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (

            <div className="App" style={{position:'relative'}}>

                {/*<Navbar  account={this.state.accounts}/>*/}

                <Navbar  currentAccount={this.state.accounts[0]}/>

                    <div className='container-fluid mt-5'>

                        <div className='row justify-content-center'>

                            <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}} >

                                <div>

                                    Please, can you change first the address of your metamask wallet.
                                    <Main userBalance={this.state.userBalance} web3={this.state.web3} contract={this.state.contract}
                                          stakingBalance={this.state.stakingBalance} currentAccount={this.state.accounts[0]} contractName={contractName}
                                          stakeCoin={this.state.stakeCoin}
                                    />

                                </div>
                            </main>

                        </div>

                    </div>


            </div>
        );
    }
}

export default App;