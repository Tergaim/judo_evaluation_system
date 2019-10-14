import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { Button, Icon, Segment, Dimmer, Loader, List, Accordion, Label, Modal, Header } from 'semantic-ui-react';
import { Team, url_back } from '../Utils/constants';
import { Client } from '../Utils/client';

import logo from '../assets/judo.png';
import EditTeam from './EditTeam';

class TeamView extends Component<Team & {triggerReload: () => void}> {

    render() {

        return(
            <List.Item>
                <List.Content>
                    <List.Header>{this.props.name} - {this.props.origin}</List.Header>
                    <List.Description>
                        {this.props.users && this.props.users.map(a =>
                            <Label key={a.id} image size="large">
                                <img src={logo} />
                                {a.name} ({a.belt} - {a.weight} kg)
                            </Label>
                        )}
                        <Modal trigger={
                            <Button icon floated="right"><Icon name="edit"/> Edit</Button>
                        }
                        onClose={this.props.triggerReload}>
                            <Modal.Content>
                                <Header as="h2">Update team</Header>
                                <EditTeam new={false} id={this.props.id} name={this.props.name} origin={this.props.origin} users={this.props.users} />
                            </Modal.Content>
                        </Modal>
                    
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

class TeamsList extends Component {
    //state = { loading: false, data: [{ id: '0', name: 'bla', origin: "fr", users: [{ id: '1', name: 'No1', belt: 'black', weight: '95' }, { id: '2', name: 'No2', belt: 'white', weight: '50' }] }, { id: '0', name: 'bla', origin: "fr", users: [{ id: '1', name: 'No1', belt: 'black', weight: '95' }, { id: '2', name: 'No2', belt: 'white', weight: '50' }] }] as Team[]};
    state = { loading: true, data: [] as Team[] };

    componentDidMount() {
        Client.getData(url_back + "/get_all_teams").then(res => {
            this.setState({loading: false, data: res[1]});
        })
    }

    reload(idx: number) {
        let data = this.state.data;
        let id = data[idx].id;
        Client.postData(url_back + "/get_team", {
            id: id
        }, true).then(res => {
            data[idx] = res[1];
            this.setState({data: data});
        })
    }

    render() {
        return (
            <div>
                <Button animated as={Link} to="/newTeam">
                    <Button.Content visible>Create team</Button.Content>
                    <Button.Content hidden>
                        <Icon name='add user' />
                    </Button.Content>
                </Button>

                <Segment>
                    <Dimmer active={this.state.loading}>
                        <Loader>Loading</Loader>
                    </Dimmer>

                    <List size="big" divided relaxed>
                        {this.state.data.map((team, idx) =>
                            <TeamView key={team.id}
                                id={team.id} name={team.name} origin={team.origin} users={team.users} 
                                triggerReload={() => this.reload(idx)} 
                            />
                        )}
                    </List>
                </Segment>
            </div>
        );
    }
}

export default TeamsList;
