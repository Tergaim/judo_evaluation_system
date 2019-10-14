import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Segment, Container, Grid, Image } from 'semantic-ui-react';

import yellow_card from '../../assets/shido.png';
import empty from '../../assets/empty.png';
import { UpdateFun } from '../../Utils/constants';

export type AthletePointProps = {
    name: string,
    shido: number,
    ippon: number,
    wazaari: number,
    isRed: boolean
};

class AthletePoints extends Component<AthletePointProps & { updateState: UpdateFun<AthletePointProps>}> {

    clamp(num: number, min: number, max: number) {
        num = num < min ? min : num;
        num = num > max ? max : num;
        return num;
    }

    updateShidoNum(count: number) {
        this.props.updateState({shido: this.clamp(count, 0, 3)});
    }

    updateIpponNum(count: number) {
        this.props.updateState({ippon: this.clamp(count, 0, 9)});
    }

    updateWazaNum(count: number) {
        this.props.updateState({wazaari: this.clamp(count, 0, 9)});
    }

    render() {
        let color : 'red' | undefined = this.props.isRed ? 'red' : undefined;

        return (
            <Segment inverted={this.props.isRed} color={color}>
                <Message size='massive'>
                    <Message.Header>{this.props.name}
                        
                    </Message.Header>
                </Message>

                <Segment basic textAlign="center">
                    <Button circular icon='minus' onClick={() => this.updateShidoNum(this.props.shido - 1)} />
                    {this.props.shido == 0 && <Image size='tiny' spaced src={empty} />}
                    {
                        [...Array(this.props.shido)].map((e) =>
                            <Image size='tiny' spaced src={yellow_card} />
                        )
                    }
                    <Button circular icon='plus' onClick={() => this.updateShidoNum(this.props.shido + 1)} />
                </Segment>

                <Segment basic>
                <Grid columns={2} textAlign="center">
                    <Grid.Row>
                        <Grid.Column><Header>Ippon</Header></Grid.Column>
                        <Grid.Column><Header>Waza-ari</Header></Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header style={{ "fontSize": "8rem" }}>
                                <Button style={{ "fontSize": "1rem" }} circular icon='minus' onClick={() => this.updateIpponNum(this.props.ippon - 1)} />
                                {this.props.ippon}
                                <Button style={{ "fontSize": "1rem" }} circular icon='plus' onClick={() => this.updateIpponNum(this.props.ippon + 1)} />
                            </Header>
                        </Grid.Column>
                        <Grid.Column>
                            <Header style={{ "fontSize": "8rem" }}>
                                <Button style={{ "fontSize": "1rem" }} circular icon='minus' onClick={() => this.updateWazaNum(this.props.wazaari - 1)} />                                
                                {this.props.wazaari}
                                <Button style={{ "fontSize": "1rem" }} circular icon='plus' onClick={() => this.updateWazaNum(this.props.wazaari + 1)} />
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </Segment>

            </Segment>
        );
    }
}

export default AthletePoints;
