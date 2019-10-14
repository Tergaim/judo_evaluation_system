import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message } from 'semantic-ui-react';
import PoolView from '../Components/PoolView';

type TParam = { id: string };

class PoolPage extends Component<RouteComponentProps<TParam>> {

    render() {
        return (
            <div>
                <Button circular as={Link} to="/1" icon='arrow left'/>
                <PoolView id={parseInt(this.props.match.params.id)}/>
            </div>
        );
    }
}

export default PoolPage;
