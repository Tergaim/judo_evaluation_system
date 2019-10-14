import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Segment, Dimmer, Loader, Table } from 'semantic-ui-react';
import { Team, url_back, TeamMatchExtended, User } from '../Utils/constants';
import { Client } from '../Utils/client';


type UserDict = Record<number, User>;

class NewMatch extends Component<{team1: Team, team2: Team, isPool: boolean, groupID: number}> {
    state = {creating: false, idA: undefined, idB: undefined};

    getDropdownOptions(team: Team) {
        if(!team || !team.users) return []; 
        return team.users.map(u => {
            return {
                key: u.id,
                text: u.name + ' - ' + u.weight + ' kg',
                value: u.id
            }
        });
    }

    handleSubmit() {

    }

    render() {
        if(!this.state.creating)
            return (
                <Segment>
                    <Button icon onClick={() => this.setState({creating: true})}>
                        <Icon name="add"/>
                        Create new match
                    </Button>
                </Segment>
            );
        else {
            let {team1, team2} = this.props;
            let {idA, idB} = this.state;
            let dropOptions1 = this.getDropdownOptions(team1);
            let dropOptions2 = this.getDropdownOptions(team2);

            return (
                <Segment>
                    <Form>
                        <Header as="h3">Start a new match</Header>
                        <Form.Group>
                            <Form.Dropdown placeholder={`Team ${team1.name}`} fluid selection
                                value={idA} options={dropOptions1} onChange={(e, x) => this.setState({idA: x.value})}/>
                            <Form.Dropdown placeholder={`Team ${team2.name}`} fluid selection
                                value={idB} options={dropOptions2} onChange={(e, x) => this.setState({idB: x.value})}/>
                            <Button floated='right' type='button' negative onClick={() => this.setState({creating: false})}>Cancel</Button>
                            <Button floated='right' type='button' positive 
                                disabled={!idA || !idB}
                                as={Link} to={`/match/team1=${team1.id}-team2=${team2.id}-idA=${idA}-idB=${idB}-isPool=${this.props.isPool}-groupID=${this.props.groupID}`}>
                                Start !
                            </Button>
                        </Form.Group>
                    </Form>
                </Segment>
            );
        }
    }
}

type TParams = { team1: string, team2: string, groupID: string };

class TeamMatch extends Component<RouteComponentProps<TParams> & {isPool: boolean}> {

    state = { loading: true, data: {} as TeamMatchExtended};

    componentDidMount() {
        this.load();
    }

    load() {
        this.setState({loading: true});

        let { team1, team2, groupID } = this.props.match.params;
        Client.postData(url_back + "/get_team_vs", {
            team1: parseInt(team1),
            team2: parseInt(team2),
            isPool: this.props.isPool,
            groupID: parseInt(groupID)
        }, true).then(res => this.setState({ loading: false, data: res[1] }));
    }

    getUserDict(array: User[]) {
        let d = {} as UserDict;
        for(let u of array) {
            d[u.id] = u;
        }

        return d;
    }

    render() {
        let {groupID} = this.props.match.params;
        let isPool = this.props.isPool;
        let loading = this.state.loading;
        let {team1, team2, matches} = this.state.data;

        let udict1 = this.getUserDict(team1 ? team1.users || [] : []);
        let udict2 = this.getUserDict(team2 ? team2.users || [] : []);

        return (
            <div>
                <Button circular as={Link} to={`/${isPool ? 'pool' : 'bracket'}/${groupID}`} icon='arrow left'/>
                <Header as="h2">Team Match : {!loading && team1.name} vs. {!loading && team2.name}</Header>
                <Segment>
                    <Dimmer active={loading}>
                        <Loader>Loading</Loader>
                    </Dimmer>

                    {!loading && <Table textAlign='center'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{team1.name}</Table.HeaderCell>
                                <Table.HeaderCell>Ippon</Table.HeaderCell>
                                <Table.HeaderCell>Waza-ari</Table.HeaderCell>
                                <Table.HeaderCell>Shido</Table.HeaderCell>

                                <Table.HeaderCell>Shido</Table.HeaderCell>
                                <Table.HeaderCell>Waza-ari</Table.HeaderCell>
                                <Table.HeaderCell>Ippon</Table.HeaderCell>
                                <Table.HeaderCell>{team2.name}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {matches.map(m => {
                                let winnerA = m.winner === m.idA;
                                let loserA = !winnerA;
                                let winnerB = loserA;
                                let loserB = winnerA;

                                return (
                                    <Table.Row>
                                        <Table.Cell positive={winnerA} negative={loserA}>{`${udict1[m.idA].name} - ${udict1[m.idA].weight} kg`}</Table.Cell>
                                        <Table.Cell positive={winnerA} negative={loserA}>{m.scoreA.ippon}</Table.Cell>
                                        <Table.Cell positive={winnerA} negative={loserA}>{m.scoreA.wazahari}</Table.Cell>
                                        <Table.Cell positive={winnerA} negative={loserA}>{m.scoreA.shido}</Table.Cell>

                                        <Table.Cell positive={winnerB} negative={loserB}>{m.scoreB.shido}</Table.Cell>
                                        <Table.Cell positive={winnerB} negative={loserB}>{m.scoreB.wazahari}</Table.Cell>
                                        <Table.Cell positive={winnerB} negative={loserB}>{m.scoreB.ippon}</Table.Cell>
                                        <Table.Cell positive={winnerB} negative={loserB}>{`${udict2[m.idB].name} - ${udict2[m.idB].weight} kg`}</Table.Cell>
                                    </Table.Row>    
                                );
                            })
                            }
                        </Table.Body>
                    </Table>}

                    <NewMatch team1={team1} team2={team2} isPool={isPool} groupID={parseInt(groupID)} />
                </Segment>
            </div>
        );
    }
}

export default TeamMatch;
