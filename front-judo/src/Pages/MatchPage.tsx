import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Modal, Segment, Dimmer, Loader, Confirm } from 'semantic-ui-react';
import MatchComp, {MatchCompProps} from '../Components/MatchPage/Main';
import { Client } from '../Utils/client';
import { url_back, Team, UpdateFun } from '../Utils/constants';

type TParam = { team1: string, team2: string, idA: string, idB: string, isPool: string, groupID: string };

class MatchPage extends Component<RouteComponentProps<TParam> & {updateState: UpdateFun<MatchCompProps>}> {

    state = { saving: false, saved: false, confirmOpen: false, loading: 2,
        nameA: '',
        shidoA: 0,
        ipponA: 0,
        wazaariA: 0,

        nameB: '',
        shidoB: 0,
        ipponB: 0,
        wazaariB: 0,

        matchTime: 180,
        wazaariTime: 10,
        ipponTime: 20,

        idMainTimer: null,
        valMain: 180,
        idOsaeTimer: null,
        valOsae: -1,
        isRedWinning: false
    };

    componentDidMount() {
        let {team1, idA, team2, idB} = this.props.match.params;
        this.loadName(parseInt(team1), parseInt(idA)).then(name => {
            this.updateState({ nameA: name });
            this.setState({loading: this.state.loading-1});
        });
        this.loadName(parseInt(team2), parseInt(idB)).then(name => {
            this.updateState({ nameB: name });
            this.setState({loading: this.state.loading-1});
        });
    }

    loadName(team: number, user: number) {
        return Client.postData(url_back + "/get_team", {
            id: team
        }, true).then(res => {
            let data: Team = res[1];

            let name = data.name + ' - ';
            for(let u of data.users || [])
                if(user == u.id)
                    name += u.name;

            return name;
        })
    }

    save(isAWinner: boolean) {
        this.setState({saving: true, confirmOpen: false});
        
        //HANDLE SAVE DATA
        let idA = parseInt(this.props.match.params.idA);
        let idB = parseInt(this.props.match.params.idB);

        Client.postData(url_back + "/set_score", {
            idA: idA,
            idB: idB,
            winner: isAWinner ? idA : idB,
            scoreA: {
                ippon: this.state.ipponA,
                wazahari: this.state.wazaariA,
                shido: this.state.shidoA
            },
            scoreB: {
                ippon: this.state.ipponB,
                wazahari: this.state.wazaariB,
                shido: this.state.shidoB
            },
            groupID: parseInt(this.props.match.params.groupID),
            isPool: this.props.match.params.isPool === 'true'
        }).then(res => {
            if(res[0])
                this.setState({saving: false, saved: true});
        });

    }

    updateState(s: Partial<MatchCompProps>) {
        // UPDATE COMPONENT STATE

        let clean: Record<string, any> = {}

        for(let [k, v] of Object.entries(s)) {
            if(v !== undefined) {
                //console.log("Setting ", k, " ", v);
                /*this.setState({
                    [k]: v
                })*/
                clean[k] = v;
            }
        }

        this.setState(clean);

        // Send state to other window
        this.props.updateState({ ...this.state, ...clean });
    }


    render() {
        let {team1, team2, idA, idB, isPool, groupID} = this.props.match.params;
        let bisPool = isPool === 'true';

        let returnLink = `/teamMatch/${team1}-${team2}-${bisPool ? 'pool' : 'bracket'}=${groupID}`

        return (
            <div onClick={(e) => { if(document.activeElement instanceof HTMLElement) document.activeElement.blur() }}>
                
                <Dimmer active={this.state.loading > 0}>
                    <Loader>Loading</Loader>
                </Dimmer>
                <Dimmer active={this.state.saving || this.state.saved}>
                    {this.state.saving && <Loader>Saving</Loader>}
                    {this.state.saved &&
                        <Segment>
                            <Header>Save successful</Header>
                            <Button as={Link} to={returnLink}>Exit</Button>
                        </Segment>
                    }
                </Dimmer>
                <Segment>
                    <Modal basic closeIcon trigger={
                        <Button icon negative>
                            <Icon name="close" /> Back to team view
                        </Button>
                    }>
                        <Header icon='close' content='Return without saving ?' />
                        <Modal.Content>
                            <p>
                                Are you sure you want to leave this page without saving the match data ?
                            </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button negative inverted 
                                as={Link} to={returnLink}
                            >
                                <Icon name='close' /> Leave
                            </Button>
                        </Modal.Actions>
                    </Modal>

                    <Modal basic closeIcon open={this.state.confirmOpen}
                    onClose={() => this.setState({confirmOpen: false})}
                    trigger={
                        <Button positive icon floated={"right"} onClick={() => this.setState({ confirmOpen: true })} >
                            <Icon name="save" /> Save & Return
                        </Button>
                    }>
                        <Header icon='save' content='Select who won' />
                        <Modal.Content>
                            <p>
                                Please select the winner of the match : 
                            </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={() => this.save(true)}>
                                {this.state.nameA}
                            </Button>
                            <Button color='red' onClick={() => this.save(false)}>
                                {this.state.nameB}
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Segment>

                <MatchComp  invertedForJudge={false}
                            nameA={this.state.nameA} shidoA={this.state.shidoA} ipponA={this.state.ipponA} wazaariA={this.state.wazaariA}
                            nameB={this.state.nameB} shidoB={this.state.shidoB} ipponB={this.state.ipponB} wazaariB={this.state.wazaariB}
                            matchTime={this.state.matchTime} wazaariTime={this.state.wazaariTime} ipponTime={this.state.ipponTime}
                            idMainTimer={this.state.idMainTimer} valMain={this.state.valMain}
                            idOsaeTimer={this.state.idOsaeTimer} valOsae={this.state.valOsae}
                            isRedWinning={this.state.isRedWinning}
                    updateState={(d) => this.updateState(d)} />
            </div>
        );
    }
}

export default MatchPage;
