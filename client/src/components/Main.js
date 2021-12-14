import React, {Component} from 'react';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            errorMessage: '',
            amount:''
        }
    }

    /**
     *
     * @param input
     * @returns {boolean}
     */
    isInputValid = input => {
        return input !== "";
    }

    /**
     *
     * @param event
     * @returns {Promise<void>}
     */
    handleDeposit = async(event) => {

        event.preventDefault();
        const {inputValue, web3, currentAccount} = this.state;

        if (!this.isInputValid(inputValue)){
            this.setState({errorMessage: " type a number pls!"});
            return
        }

        //this.props.contract.methods.createStake().then(console.log).catch(console.error);

        console.log('inputValue', inputValue);
        let amount;
        amount = inputValue;
        amount = this.props.web3.utils.toWei(amount, 'ether');
        console.log('amount', amount);

        //call of the method of the smart contract
        /*await this.props.contract.methods.createStake(amount,currentAccount);
        let historyStake = await this.props.contract.historyStake();
        console.log('historyStake', historyStake);
        */
    }

    /**
     *
     * @param event
     */
    handleChange = (event) => {

        this.setState({inputValue: event.target.value});
    }

    /**
     *
     * @param event
     * @returns {Promise<void>}
     */
    handleWithdraw = async(event) => {

        const { web3, currentAccount  } = this.state;
    }

    render() {

        const { web3 } = this.props;

        const userBalance = this.props.userBalance;

        return (

            <div id='content' className='mt-3' >

                <table className='table text-muted text-center'>
                    <thead>
                        <tr style={{color:'white'}}>
                            <th scope='col'>Staking Balance</th>
                            <th scope='col'>Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{color:'black'}}>
                          <td>Token: {this.props.contractName} </td>
                          <td>Reward associated</td>
                        </tr>
                    </tbody>
                </table>

                <div className='card mb-2' style={{opacity:'.9'}}>
                    <form className='mb-3'>
                        <div style={{borderSpacing:'0 1em'}}>

                            <div className='float-right mb-4' style={{marginRight:'8px'}}>
                                Balance: {userBalance && web3.utils.fromWei(userBalance.toString())}
                            </div>

                            <div className='float-right mb-4' style={{marginRight:'8px'}}>
                                Your staked balance is: {this.props.stakingBalance}
                            </div>


                            <div className='input-group mb-4 flex-column'>

                                <label htmlFor='input-stake-token' className='float-left'  style={{marginLeft:'15px'}}><b>Stake tokens</b></label>
                                <input className="mb-4"
                                    id='input-stake-token'
                                    type='text'
                                    placeholder='Enter a amount of token please'
                                    required
                                       value={this.state.value}
                                       onChange={this.handleChange}
                                />
                                <button type='submit' className='btn btn-primary btn-lg btn-block' onClick={this.handleDeposit}>DEPOSIT</button>
                                {this.state.errorMessage}
                            </div>
                        </div>
                    </form>
                    <button className='btn btn-primary btn-lg btn-block' style={{maxWidth:'600px'}}>WITHDRAW</button>

                    <div className='card-body text-center' style={{color:'blue'}}>
                        AIRDROP
                    </div>

                </div>
            </div>
        );
    }
}

export default Main;