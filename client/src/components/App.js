import React, { Component } from "react";
//import StakeCoin from "../contracts/StakeCoin.json"
import Staking from "../contracts/Staking.json";
import getWeb3 from "../getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './Navbar';
import Main from './Main.js';
import "./App.css";

class App extends Component {
    state = {web3: null, accounts: null, contract: null, ownerOfContract: null};

    /**
     * entity: constructor
     * description: initialize the different variables
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            stakeCoin: {},
            staking: {},
            stakeCoinBalance: '0',
            stakingBalance: '0',
            loading: true

        }
    }

    /**
     *
     * @returns {Promise<void>}
     */
    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            this.setState({accounts:accounts[0]});
            console.log('accounts[0]: ', accounts[0]);

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Staking.networks[networkId];

            const instance = new web3.eth.Contract(
                Staking.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({accounts});

            //let StakingContractInstanceBalance = await StakingContractInstance.methods.reward;

            //let StakingContractInstanceBalance = await StakingContractInstance.methods.balanceOf(this.state.account).call();

            //this.setState({StakingContractInstanceBalance: StakingContractInstanceBalance.toString() });
            //console.log('balance: ', StakingContractInstanceBalance );


            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, contract: instance }, this.runInit);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    /**
     *
     * @returns {Promise<void>}
     */
    runInit = async () => {

        const { contract } = this.state;

    };





    render() {
        const { accounts } = this.state;
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (


            <div className="App" style={{position:'relative'}}>


                <Navbar  account={this.state.accounts}/>

                    <div className='container-fluid mt-5'>



                        <div className='row justify-content-center'>

                            <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}} >


                                <div>

                                    <Main/>




                                </div>
                            </main>

                        </div>

                    </div>


            </div>
        );
    }
}

export default App;