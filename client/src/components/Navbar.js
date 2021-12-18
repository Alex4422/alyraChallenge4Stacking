import React, {Component} from 'react';

class Navbar extends Component {

    constructor(props) {
        super(props);

        }

    render() {
        return (
            <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor:'black', height:'50px'}}>
                <a className='navbar-brand col-sm-3 col-md-2 mr-0' href=''
                   style={{color:'white'}}>DAPP Staking exercise</a>

                <small  className='row-cols-xl-6' style={{color:'white'}}>CURRENT ADDRESS: {this.props.currentAccount} </small>
            </nav>
        );
    }

}

export default Navbar;