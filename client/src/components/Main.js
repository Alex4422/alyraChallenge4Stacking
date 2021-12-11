import React, {Component} from 'react';
import Web3 from 'web3';

class Main extends Component {

    constructor(props) {

        super(props);

        this.state = {
            inputValue: '',
            errorMessage: ''
        }
        console.log({props})
        console.log(this.props)
    }


    isInputValid = input => {
        return input != "";
    }

    handleDeposit = (event) => {
        event.preventDefault();
        //console.log(event);

        const {inputValue} = this.state;
        if (!this.isInputValid(inputValue)){
            this.setState({errorMessage: " type a number pls!"});
            return
        }

        console.log("handle deposit props", this.props);
        this.props.contract.methods.createStake().then(console.log).catch(console.error)
        //console.log(this.defaultProps);



        //console.log(inputValue);
    }

    handleChange = (event) => {

        this.setState({inputValue: event.target.value});

    }

    render() {

        const { web3 } = this.props;
        //objet1 = objet2
        //const {userBalance} = this.props;
        const userBalance = this.props.userBalance;


//const balance = this.props.userBalance != null ? this.props.userBalance : "not found"
        //const balance = this.props.userBalance || "not found"

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
                          <td>Token</td>
                          <td>Reward associated</td>
                        </tr>
                    </tbody>
                </table>

                <div className='card mb-2' style={{opacity:'.9'}}>
                    <form className='mb-3'>
                        <div style={{borderSpacing:'0 1em'}}>

                            <div className='float-right mb-4' style={{marginRight:'8px'}}>
                                Balance:

                                    {userBalance && web3.utils.fromWei(userBalance.toString())}
                                            {/*{this.state.userBalance}*/}
                                            {/*this.setState({ this.state.userBalance })*/}
                                            {/*{this.props.userBalance}*/}
                                            {/*({this.state?.userBalance} {userBalance}*/}
                            </div>

                            <div className='input-group mb-4 flex-column'>

                                <label htmlFor='input-stake-token' className='float-left'  style={{marginLeft:'15px'}}><b>Stake tokens</b></label>
                                <input className="mb-4"
                                    id='input-stake-token'
                                    type='text'
                                    placeholder='0'
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