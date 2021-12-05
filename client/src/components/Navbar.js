import React, {Component} from 'react';

class Navbar extends Component {

    render() {
        return (
            <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'black', height:'50px'}}>
                <a className='navbar-brand col-sm-3 col-md-2 mr-0'
                   style={{color:'white'}}>DAPP Staking exercise</a>

                {/*reexplain this pls:  CURRENT ADDRESS: {this.props.account} not {this.props.account[0]}? */}
                <small  className='row-cols-xl-6' style={{color:'white'}}>CURRENT ADDRESS: {this.props.account} </small>
            </nav>
        );
    }

}

export default Navbar;