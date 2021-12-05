import React, {Component} from 'react';

class Main extends Component {

    render() {
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

                            {/*
                            <span className='float-right mb-4' style={{marginRight:'8px'}}>
                                Balance:
                            </span>
                            */}

                            <div className='float-right mb-4' style={{marginRight:'8px'}}>
                                Balance:
                            </div>

                            <div className='input-group mb-4 flex-column'>

                                <label for='input-stake-token' className='float-left'  style={{marginLeft:'15px'}}><b>Stake tokens</b></label>
                                <input className="mb-4"
                                    id='input-stake-token'
                                    type='text'
                                    placeholder='0'
                                    required
                                />
                                <button type='submit' className='btn btn-primary btn-lg btn-block'  >DEPOSIT</button>

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