import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Transition, List } from 'semantic-ui-react';

import { url_back, Team, User } from '../Utils/constants';
import { Client } from '../Utils/client';

class AddPool extends Component {
    state = { 
        name: '',
        selectedTeams: [] as number[],
        allTeams: [] as Team[],
        success: false, 
        error: false, 
        loading: true 
    };

    componentDidMount() {
        Client.getData(url_back + "/get_all_teams").then(res => {
            this.setState({ loading: false, allTeams: res[1] });
        })
    }

    render() {
        let { name, allTeams, selectedTeams } = this.state;

        let options = allTeams.map(t => {
            return {
                key: t.id,
                text: t.name,
                value: t.id
            }
        });

        return (
            <div>
                <Form onSubmit={this.handleSubmit} success={this.state.success} error={this.state.error} loading={this.state.loading}>
                    <Transition visible={this.state.success}>
                        <Message success header='Pool saved !' content="The pool has been registered." />
                    </Transition>
                    <Transition visible={this.state.error}>
                        <Message error header='An error occurred !' content="The pool has NOT been registered." />
                    </Transition>

                    <Form.Input label="Name" placeholder="Pool name" value={name} onChange={(e, x) => this.setState({name: x.value})} />
                    
                    <Form.Dropdown label="Teams" placeholder="Select teams" 
                        fluid multiple selection
                        onChange={(e, x) => this.setState({selectedTeams: x.value})}
                        value={selectedTeams}
                        options={options} />

                    <Form.Button>Save Pool</Form.Button>
                </Form>
            </div>
        );
    }

    handleSubmit = (e: React.FormEvent, data: FormProps) => {
        this.setState({ loading: true });

        let name = this.state.name;
        let teams = this.state.selectedTeams;

        Client.postData(url_back + '/add_pool', {
            name: name,
            teams: teams
        }).then(res => {
            if (res[0])
                this.setState({ name: '', selectedTeams: [], success: true, error: false, loading: false });
            else
                this.setState({ success: false, error: true, loading: false });
            
            setTimeout(() => this.setState({success: false, error: false}), 5000);
        });
    }
}

export default AddPool;
