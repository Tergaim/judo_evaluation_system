import React, { Component } from 'react';
import { Client } from '../Utils/client';
import { Pool, Team, TeamMatch, url_back } from '../Utils/constants';
import { Segment, Dimmer, Loader, Table, Header } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

type DoubleDict = {
    [K: number] : {
        [K: number]: number
    }
};

class CustomCell extends Component<{match: TeamMatch, poolID: number}> {
    render() {
        let [team1, team2, point] = this.props.match;
        let winner = point > 0;
        let loser = point < 0; 

        let color = winner ? 'green' : (loser ? 'darkred' : 'wheat');

        if(team1 == team2)
            return(
                <Table.Cell disabled />
            );

        return (
            <Table.Cell
                selectable
                style={{"background-color": color}}>
                <Link to={"/teamMatch/" + team1 + "-" + team2 + "-pool=" + this.props.poolID } />
            </Table.Cell>
        );
    } 
}

class PoolView extends Component<{id: number}> {

    state = {loading: true, data: {id: 0, name: '', teams: [] as Team[]} as Pool};

    componentDidMount() {
        this.load();
    }

    load() {
        this.setState({loading: true});
        let id = this.props.id;
        Client.postData(url_back + "/get_pool", {
            id: id
        }, true).then(res => this.setState({loading: false, data: res[1]}))
    }

    render() {
        let {id, name, teams, scores} = this.state.data;

        let tfMatch = {} as DoubleDict;
        if(scores) {
            for(let m of scores) {
                if (!tfMatch[m[0]]) tfMatch[m[0]] = {};
                if (!tfMatch[m[1]]) tfMatch[m[1]] = {};
                tfMatch[m[0]][m[1]] = m[2];
                tfMatch[m[1]][m[0]] = -m[2];
            }
        }

        return (
            <>
                <Header as="h2">Pool {name}</Header>
                <Segment>
                    <Dimmer active={this.state.loading}>
                        <Loader>Loading</Loader>
                    </Dimmer>
                        
                    <Table definition >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell/>
                                {teams.map(t => 
                                    <Table.HeaderCell>{t.name}</Table.HeaderCell>
                                )}
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {teams.map(t => 
                                <Table.Row>
                                    <Table.Cell>{t.name}</Table.Cell>
                                    {teams.map(enemy => 
                                        <CustomCell poolID={id} match={[t.id, enemy.id, tfMatch[t.id] && tfMatch[t.id][enemy.id]]}/>
                                    )}
                                </Table.Row>
                            )}
                        </Table.Body>

                    </Table>
                </Segment>
            </>
        );
    }
}

export default PoolView;
