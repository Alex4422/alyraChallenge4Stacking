import React, { Component } from "react";
import StakeCoin from "../contracts/StakeCoin.json"
import StakingContract from "../contracts/Staking.json";
import getWeb3 from "../getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';

/*
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
*/

import Navbar from './Navbar';
import Main from './Main.js';



import "./App.css";
import StakeholdersManagement from "./StakeholdersManagement";

class App extends Component {
    state = {web3: null, accounts: null, contract: null };

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
            const deployedNetwork = StakingContract.networks[networkId];

            const StakingContractInstance = new web3.eth.Contract(
                StakingContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            this.setState({StakingContractInstance});
            //let StakingContractInstanceBalance = await StakingContractInstance.methods.reward;

            //let StakingContractInstanceBalance = await StakingContractInstance.methods.balanceOf(this.state.account).call();

            //this.setState({StakingContractInstanceBalance: StakingContractInstanceBalance.toString() });
            //console.log('balance: ', StakingContractInstanceBalance );


            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, contract: StakingContractInstance }, this.runInit);
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

      /*
        const { accounts, contract } = this.state;

        // Stores a given value, 5 by default.
        await contract.methods.set(5).send({ from: accounts[0] });

        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();

        // Update state with the result.
        this.setState({ storageValue: response });

       */
    };


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
    startStakeUnstakeSession = async() => {


    }




    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (


            <div className="App" style={{position:'relative'}}>


                <Navbar  account={this.state.accounts}/>

                    <div className='container-fluid mt-5'>

                        {/*style to change in className!!!!!!!!!*/}
                        <div  style={{marginTop: '10rem'}}>
                            <StakeholdersManagement/>
                        </div>

                        <div className='row justify-content-center'>

                            <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}} >


                                <div>

                                    {/*<Main/>*/}




                                </div>
                            </main>

                        </div>

                    </div>


            </div>
        );
    }
}

export default App;