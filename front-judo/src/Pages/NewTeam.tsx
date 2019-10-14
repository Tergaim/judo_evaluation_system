import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message } from 'semantic-ui-react';
import EditTeam from '../Components/EditTeam';

class NewTeam extends Component {

    render() {
        return (
            <div>
                <Button circular as={Link} to="/" icon='arrow left'/>
                <Header as="h2">Register new team</Header>
                <EditTeam new={true} id={0} name={''} origin={''} users={[]} />
            </div>
        );
    }
}

export default NewTeam;
