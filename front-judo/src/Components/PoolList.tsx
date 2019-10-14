import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link } from 'react-router-dom';
import { Button, Icon, Segment, Dimmer, Loader, List, Accordion, Label, Modal, Header } from 'semantic-ui-react';
import { Pool, Team, url_back } from '../Utils/constants';
import { Client } from '../Utils/client';

import logo from '../assets/team.png';

class PoolView extends Component<Pool & {triggerDelete: () => void}> {

    render() {

        return(
            <List.Item>
                <List.Content>
                    <List.Header>{this.props.name}</List.Header>
                    <List.Description>
                        {this.props.teams.map(t =>
                            <Label key={t.id} image size="large">
                                <img src={logo} />
                                {t.name}
                            </Label>
                        )}

                        <Modal basic closeIcon trigger={
                            <Button icon floated="right" negative>
                                <Icon name="delete" /> Delete
                            </Button>
                        }>
                            <Header icon='trash' content='Delete pool ?' />
                            <Modal.Content>
                                <p>
                                    Are you sure you want to delete the pool {this.props.name} ?
                                </p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button negative inverted onClick={(e, x) => this.props.triggerDelete()}>
                                    <Icon name='delete' /> Delete
                                </Button>
                            </Modal.Actions>
                        </Modal>
                        
                        
                        <Button icon floated="right" positive as={Link} to={"/pool/" + this.props.id}>
                            <Icon name="play" /> Open
                        </Button>
                    
                    </List.Description>
                </List.Content>
            </List.Item>
        );
    }
}

class TeamsList extends Component {
    state = { loading: true, data: [] as Pool[] };

    componentDidMount() {
        this.load();
    }

    load() {
        this.setState({loading: true});
        Client.getData(url_back + "/get_all_pools").then(res => {
            this.setState({ loading: false, data: res[1] });
        });
    }

    handleDelete(id: number) {
        this.setState({loading: true});
        Client.postData(url_back + "/delete_pool", {
            id: id
        }).then(res => this.load());
    }

    render() {
        return (
            <div>
                <Button animated as={Link} to="/newPool">
                    <Button.Content visible>Create pool</Button.Content>
                    <Button.Content hidden>
                        <Icon name='add' />
                    </Button.Content>
                </Button>

                <Segment>
                    <Dimmer active={this.state.loading}>
                        <Loader>Loading</Loader>
                    </Dimmer>

                    <List size="big" divided relaxed>
                        {this.state.data.map(pool =>
                            <PoolView key={pool.id}
                                id={pool.id} name={pool.name} teams={pool.teams} 
                                triggerDelete={() => this.handleDelete(pool.id)} 
                            />
                        )}
                    </List>
                </Segment>
            </div>
        );
    }
}

export default TeamsList;
