import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

class StakeholdersManagement extends Component {

    /*routeChange=()=> {
        let path = `./Main.js`;
        let history = useHistory();
        history.push(path);
    }*/


    render() {
        return (

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{width: '50rem'}}>
                    <Card.Header className="text-center"><strong>List of authorised stakeholder(s):</strong></Card.Header>
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item >
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>@</th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {/*
                                    {whitelist.map((a,index) => <tr key={index}>
                                        <td>{a}</td>
                                    </tr>)
                                    }
                                    */}

                                    </tbody>
                                </Table>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>

                <Card style={{width: '50rem'}}>
                    <Card.Header className="text-center"><strong>Authorise a new stakeholder</strong></Card.Header>
                    <Card.Body>
                        <Form.Group  >

                            {/*
                            <Form.Control placeholder="Enter Address please "  isInvalid={Boolean(formError)} onChange={e => this.setState({ formAddress: e.target.value, formError: null })} type="text" id="address"
                            />
                            */}

                            <Form.Control placeholder="Enter Address please " type="text" id="address" />


                        </Form.Group>

                        <br/>
                        <div style={{display: 'flex', justifyContent: 'center'}}>

                            <Button style={{minWidth:'350px'}} onClick={this.xxx} variant="dark"> Authorise </Button>

                        </div>

                    </Card.Body>
                </Card>

                <Card style={{width: '50rem'}}>
                    <Card.Header className="text-center"><strong>Your role: admin </strong></Card.Header>

                    <Card.Body>
                        <div style={{display: 'flex', justifyContent: 'center' }}>
                            <Button style={{minWidth:'350px'}} onClick={this.startStakeUnstakeSession} variant="danger"> Start the session of
                                stake/unstake </Button>
                        </div>


                        {/*<div style={{display: 'flex', justifyContent: 'center' }}>
                            <Button style={{minWidth:'350px'}} onClick={this.routeChange} variant="danger"> Start the session of
                                stake/unstake </Button>
                        </div>*/}

                        {/*<Link to="/signup" className="btn btn-primary">Sign up</Link>*/}

                        <br/>


                    </Card.Body>

                </Card>

            </div>
        );
    }

}

export default StakeholdersManagement;