import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Transition, List } from 'semantic-ui-react';

import { url_back, Team, User } from '../Utils/constants';
import { Client } from '../Utils/client';

type UserProps = { data: User, handleChange: (name: Exclude<keyof User, "id">, value: string) => void, handleDelete: () => void };
class EditUser extends Component<UserProps, User> {
    render() {
        let { name, belt, weight } = this.props.data;

        return (
            <Form.Group>
                <Form.Input label="Name" placeholder="Athlete name" value={name} onChange={(e, x) => this.props.handleChange('name', x.value)} />
                <Form.Input label="Belt" value={belt} onChange={(e, x) => this.props.handleChange('belt', x.value)} />
                <Form.Input label="Weight" placeholder="kilograms" value={weight} onChange={(e, x) => this.props.handleChange('weight', x.value)} />
                <Button floated='right' type='button' circular icon='minus' onClick={(e,x) => this.props.handleDelete()} />
            </Form.Group>
        );
    }

}

type TeamProps = { new: boolean } & Team;
class EditTeam extends Component<TeamProps> {
    state = { 
        id: this.props.id || '0', 
        name: this.props.name || '', 
        origin: this.props.origin || '', 
        users: this.props.users || [] as User[], 
        success: false, 
        error: false, 
        loading: false 
    };
    
    handleChange = (e: React.ChangeEvent, data: InputOnChangeData, name: string) => this.setState({ [name]: data.value });

    addUser = (e: React.MouseEvent, data: ButtonProps) => {
        let a = this.state.users;
        a.push({ id: 0, name: '', belt: '', weight: '' });
        this.setState({ users: a });
    }

    remUser = (idx: number) => {
        let a = this.state.users;
        a = a.filter((val, i) => i !== idx);
        this.setState({ users: a });
    }

    handleUserChange(idx: number, name: Exclude<keyof User, "id">, value: string) {
        let a = this.state.users;
        a[idx][name] = value;
        this.setState({ users: a });
    }

    render() {
        let { name, origin } = this.state;

        return (
            <div>
                <Form onSubmit={this.handleSubmit} success={this.state.success} error={this.state.error} loading={this.state.loading}>
                    <Transition visible={this.state.success}>
                        <Message success header='Team saved !' content="The team has been registered." />
                    </Transition>
                    <Transition visible={this.state.error}>
                        <Message error header='An error occurred !' content="The team has NOT been registered." />
                    </Transition>

                    <Form.Input label="Name" placeholder="Optional team name" value={name} onChange={(e, x) => this.handleChange(e, x, 'name')} />
                    <Form.Input label="Origin" value={origin} onChange={(e, x) => this.handleChange(e, x, 'origin')} />

                    <Header dividing as='h3'>Athletes</Header>
                    <Transition.Group
                        duration={200}
                        as={List}
                        animation="fade left"
                        verticalAlign='middle'
                    >
                        {this.state.users.map((a, idx) =>
                            <List.Item key={idx} >
                                <EditUser data={a}
                                    handleChange={(n, v) => this.handleUserChange(idx, n, v)}
                                    handleDelete={() => this.remUser(idx)} />
                            </List.Item>
                        )}
                    </Transition.Group>
                    <Button floated='right' type='button' circular icon='add' onClick={this.addUser} />

                    <Form.Button>Save Team</Form.Button>
                </Form>
            </div>
        );
    }

    handleSubmit = (e: React.FormEvent, data: FormProps) => {
        this.setState({ loading: true });

        let id = this.state.id;
        let name = this.state.name;
        let origin = this.state.origin;
        let users = this.state.users;

        Client.postData(url_back + (this.props.new ? '/add_team' : '/update_team'), {
            id: id,
            name: name,
            origin: origin,
            user: users
        }).then(res => {
            if (res[0]) {
                this.setState({ success: true, error: false, loading: false });
                if(this.props.new) 
                    this.setState({ name: '', origin: '', users: [] });
            }
            else
                this.setState({ success: false, error: true, loading: false });
            
            setTimeout(() => this.setState({error: false, success: false}), 5000);
        });
    }
}

export default EditTeam;
