import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Segment, Grid } from 'semantic-ui-react';
import AthletePoints, { AthletePointProps } from './AthletePoints';
import { UpdateFun } from '../../Utils/constants';
import EditValues, { EditValueProps } from './EditValues';
import { ChronoComp } from './Timers';

export type MatchCompProps = {
    nameA: string,
    shidoA: number,
    ipponA: number,
    wazaariA: number,

    nameB: string,
    shidoB: number,
    ipponB: number,
    wazaariB: number,

    matchTime: number,
    wazaariTime: number,
    ipponTime: number,

    idMainTimer: NodeJS.Timeout | null,
    valMain: number,
    idOsaeTimer: NodeJS.Timeout | null,
    valOsae: number,
    isRedWinning: boolean,

    invertedForJudge: boolean

};

class MatchComp extends Component<MatchCompProps & {updateState: UpdateFun<MatchCompProps>}> {

    updateWhite(newState: Partial<AthletePointProps>) {
        this.props.updateState({
            shidoA: newState.shido,
            ipponA: newState.ippon,
            wazaariA: newState.wazaari
        });
    }

    updateRed(newState: Partial<AthletePointProps>) {
        this.props.updateState({
            shidoB: newState.shido,
            ipponB: newState.ippon,
            wazaariB: newState.wazaari
        });
    }

    updateValues(newState: Partial<EditValueProps>) {
        this.props.updateState({
            matchTime: newState.matchTime,
            wazaariTime: newState.wazaariTime,
            ipponTime: newState.ipponTime
        });
    }

    render() {
        return (
            <Segment>
                <Grid>
                    <Grid.Row columns={2}>
                        {this.props.invertedForJudge &&
                            <Grid.Column>
                                <AthletePoints updateState={(s) => this.updateRed(s)} isRed={true}
                                    name={this.props.nameB} shido={this.props.shidoB} ippon={this.props.ipponB} wazaari={this.props.wazaariB} />
                            </Grid.Column>
                        }
                        <Grid.Column >
                            <AthletePoints updateState={(s) => this.updateWhite(s)} isRed={false}
                                name={this.props.nameA} shido={this.props.shidoA} ippon={this.props.ipponA} wazaari={this.props.wazaariA} />
                        </Grid.Column>
                        {!this.props.invertedForJudge && 
                            <Grid.Column>
                                <AthletePoints updateState={(s) => this.updateRed(s)} isRed={true}
                                    name={this.props.nameB} shido={this.props.shidoB} ippon={this.props.ipponB} wazaari={this.props.wazaariB} />
                            </Grid.Column>
                        }
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <ChronoComp 
                                idMainTimer={this.props.idMainTimer}
                                valMain={this.props.valMain}
                                idOsaeTimer={this.props.idOsaeTimer}
                                valOsae={this.props.valOsae}
                                isRedWinning={this.props.isRedWinning}

                                invertedForJudge={this.props.invertedForJudge}
                                matchTime={this.props.matchTime}
                                wazaariTime={this.props.wazaariTime}
                                ipponTime={this.props.ipponTime} 
                                onFinish={(iA, wA, iB, wB) => {
                                    this.updateWhite({
                                        ippon: this.props.ipponA + iA,
                                        wazaari: this.props.wazaariA + wA
                                    });
                                    this.updateRed({
                                        ippon: this.props.ipponB + iB,
                                        wazaari: this.props.wazaariB + wB
                                    })
                                }}
                                updateState={(s) => this.props.updateState(s)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

export default MatchComp;
