import React, {Component} from 'react';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            errorMessage: ''

        }
        console.log("this props", this.props);
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

        const { web3, currentAccount  } = this.state;

        console.log()
        event.preventDefault();
        const {inputValue} = this.state;

        if (!this.isInputValid(inputValue)){
            this.setState({errorMessage: " type a number pls!"});
            return
        }

        //this.props.contract.methods.createStake().then(console.log).catch(console.error);

        console.log('inputValue', inputValue);
        const amount = this.props.web3.utils.toWei(inputValue.toString(), 'ether');

        console.log('amount', amount);

        /*await this.props.stakeCoin.methods.approve(this.props.contract._address, amount).send({from: this.props.currentAccount}).on('transactionHash', (hash) => {

            await this.props.contract.methods.createStake(amount,this.props.stakeCoin._address).send({from: this.props.currentAccount}).on('transactionHash', (hash) => {

        });

        });

         */

        /*
        const balanceOfTheCurrentUser = await this.props.stakeCoin.methods.balanceOf(this.props.currentAccount).call();
        console.log('balanceOfTheCurrentUser: ', balanceOfTheCurrentUser);
         */

        /*
        const releaseApprove = await this.props.stakeCoin.methods.approve(this.props.contract._address, amount).send({from:this.props.currentAccount});
        console.log('releaseApprove', releaseApprove);

        console.log('this.props.contract._address', this.props.contract._address);
        console.log('this.props.contract._address', this.props.contract._address);

        console.log('this.props.contract.options.address', this.props.contract.options.address);
        */


        //const balanceStakingBeforeStake = this.props.web3.eth.getBalance(this.props.contract.options.address);

        const balanceStakingBeforeStake = await this.props.contract.methods.getSCBalance().call();
        console.log('balance Staking Before Stake: ', balanceStakingBeforeStake);


        const historyStakeBeforeTheStakeOperation = await this.props.contract.methods.stakeOf(this.props.currentAccount,this.props.stakeCoin._address).call();
        console.log('historyStake Before The Stake Operation:', historyStakeBeforeTheStakeOperation);

        const releaseApprove = await this.props.stakeCoin.methods.approve(this.props.contract._address, amount).send({from:this.props.currentAccount});
        console.log('releaseApprove', releaseApprove);

        const releaseCreateStake = await this.props.contract.methods.createStake(amount,this.props.stakeCoin._address).send({from:this.props.currentAccount});
        console.log('releaseCreateStake: ', releaseCreateStake);

        const historyStakeAfterTheStakeOperation = await this.props.contract.methods.stakeOf(this.props.currentAccount,this.props.stakeCoin._address).call();
        console.log('historyStake After The Stake Operation:', historyStakeAfterTheStakeOperation);

        const balanceStakingAfterStake = await this.props.contract.methods.getSCBalance().call();
        console.log('balance Staking After Stake: ', balanceStakingAfterStake);

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
                                Your balance in Metamask: {userBalance && web3.utils.fromWei(userBalance.toString())}
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
                                <button type='submit' className='btn btn-primary btn-lg btn-block' disabled={["",undefined].includes(this.props.currentAccount)} onClick={(e)=>this.handleDeposit(e)}>DEPOSIT</button>
                                {this.state.errorMessage}
                            </div>
                        </div>
                    </form>
                    <button className='btn btn-primary btn-lg btn-block' style={{maxWidth:'600px'}}>WITHDRAW</button>

                </div>
            </div>
        );
    }
}

export default Main;