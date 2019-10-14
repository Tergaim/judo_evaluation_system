import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message } from 'semantic-ui-react';
import AddPool from '../Components/AddPool';

class NewPool extends Component {

    render() {
        return (
            <div>
                <Button circular as={Link} to="/1" icon='arrow left'/>
                <Header as="h2">Create new pool</Header>
                <AddPool />
            </div>
        );
    }
}

export default NewPool;
