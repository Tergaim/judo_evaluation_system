import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Segment, Container, Grid, Image, Label, Input, Divider, Checkbox } from 'semantic-ui-react';
import {GlobalHotKeys, HotKeys} from 'react-hotkeys';
import { UpdateFun } from '../../Utils/constants';

type ChronoProps = {
    idMainTimer: NodeJS.Timeout | null,
    valMain: number,
    idOsaeTimer: NodeJS.Timeout | null,
    valOsae: number,
    isRedWinning: boolean
};

type ExtraProps = {
    invertedForJudge: boolean,
    matchTime: number,
    wazaariTime: number,
    ipponTime: number,
    onFinish: (ipponA: number, wazaA: number, ipponB: number, wazaB: number) => void,
    updateState: UpdateFun<ChronoProps>
}

export class ChronoComp extends Component<ChronoProps & ExtraProps> {

    toggleMainTimer() {
        if(this.props.invertedForJudge)
            return;

        if(this.props.idMainTimer == null) {
            // Disabled => enable it
            let newID = setInterval(() => this.props.updateState({valMain: this.props.valMain - 1}), 1000);
            this.props.updateState({idMainTimer: newID});
        }
        else {
            clearInterval(this.props.idMainTimer);
            this.props.updateState({idMainTimer: null});
            this.toketa();
        }
    }

    resetMainTimer() {
        if (this.props.invertedForJudge)
            return;

        if (this.props.idMainTimer != null)
            clearInterval(this.props.idMainTimer);

        this.props.updateState({idMainTimer: null, valMain: this.props.matchTime});
    }

    osaeTick() {
        let secs = this.props.valOsae + 1; // we have just finished next second

        let ippon = secs === this.props.ipponTime;
        let waza = secs === this.props.wazaariTime;
        let isB = this.props.isRedWinning;

        let pointA = !isB ? 1 : 0;
        let pointB = isB ? 1 : 0;

        if(ippon)
            this.props.onFinish(pointA, -pointA, pointB, -pointB);
        if(waza)
            this.props.onFinish(0, pointA, 0, pointB);

        this.props.updateState({ valOsae: this.props.valOsae + 1 });
    }

    toggleOsaeTimer() {
        if (this.props.invertedForJudge)
            return;

        if (this.props.idOsaeTimer == null) {
            // Disabled => enable it
            let newID = setInterval(() => this.osaeTick(), 1000);
            this.props.updateState({ idOsaeTimer: newID, valOsae: 0 });
        }
        else {
            // Enabled => stop it, reset osae counter & send result of winner
            clearInterval(this.props.idOsaeTimer);
            this.props.updateState({ idOsaeTimer: null, valOsae: -1 });
        }
    }

    toketa() {
        if (this.props.idOsaeTimer != null)
            this.toggleOsaeTimer();
    }

    toggleWinning() {
        this.props.updateState({isRedWinning: !this.props.isRedWinning});
    }



    render() {
        let {idMainTimer, valMain, idOsaeTimer, valOsae, isRedWinning} = this.props;
        let running = idMainTimer != null;
        let osae = idOsaeTimer != null;

        let hotkeymap: Record<string, string> = {
            TOGGLE_MAIN_TIMER: "space"
        };
        let hotkeyhandler: Record<string, (event: KeyboardEvent | undefined) => void> = {
            TOGGLE_MAIN_TIMER: () => this.toggleMainTimer()
        };

        if(running) {
            hotkeymap["TOGGLE_OSAE_TIMER"] = "enter";
            hotkeyhandler["TOGGLE_OSAE_TIMER"] = () => this.toggleOsaeTimer();
        }

        //<GlobalHotKeys keyMap={hotkeymap} handlers={hotkeyhandler} allowChanges={true} />
        return (
            <>
            {!this.props.invertedForJudge && <GlobalHotKeys keyMap={hotkeymap} handlers={hotkeyhandler} allowChanges={true} />}
            <Grid columns={2}>
                <Grid.Column>
                    <MainChrono value={valMain} running={running} onToggle={() => this.toggleMainTimer()} onReset={() => this.resetMainTimer()} />
                </Grid.Column>
                <Grid.Column>
                    <OsaeChrono value={valOsae} running={osae} disabled={!running} isRedWinning={isRedWinning}
                        onToggle={() => this.toggleOsaeTimer()} onToggleWinning={() => this.toggleWinning()} />
                </Grid.Column>
            </Grid>
            </>
        );
    }
}

type MainChronoProps = {
    value: number,
    running: boolean,
    onToggle: () => void,
    onReset: () => void
}

class MainChrono extends Component<MainChronoProps> {

    pad(n: number) {
        return String(n).padStart(2, '0');
    }

    render() {
        let abs_val = Math.abs(this.props.value);
        let mins = Math.floor(abs_val / 60);
        let secs = abs_val % 60;
        let negative = this.props.value < 0;
        let sign = negative ? '-' : '';

        return(
            <Segment basic>
                <Header textAlign='center' style={{ "fontSize": "7rem" }}
                    color={negative ? 'red' : undefined}
                >
                    {`${sign}${this.pad(mins)}:${this.pad(secs)}`}
                </Header>

                <Button fluid color={this.props.running ? 'purple' : 'yellow'} 
                    onClick={() => this.props.onToggle()}
                >
                    {this.props.running ? 'Mate' : 'Hajime'}
                </Button>
                <Divider hidden />
                <Button fluid 
                    onClick={() => this.props.onReset()}
                >
                    Reset the timer
                </Button>
            </Segment>
        );
    }
}

type OsaeChronoProps = {
    value: number,
    running: boolean,
    disabled: boolean,
    isRedWinning: boolean,
    onToggle: () => void,
    onToggleWinning: () => void
}

class OsaeChrono extends Component<OsaeChronoProps> {

    pad(n: number) {
        return String(n).padStart(2, '0');
    }

    render() {
        let {value, running, disabled, isRedWinning} = this.props;

        return (
            <Segment basic>
                <Header textAlign='center' style={{ "fontSize": "7rem" }}
                >
                    {running ? this.pad(value) : '-'}
                </Header>

                <Button fluid color={this.props.running ? 'red' : 'green'}
                    onClick={() => this.props.onToggle()}
                    disabled={disabled}
                >
                    {this.props.running ? 'Toketa' : 'Osaekomi'}
                </Button>
                <Divider hidden />
                <Segment basic textAlign='center'>
                    <Label>White on red </Label>
                <Checkbox toggle checked={isRedWinning} onChange={() => this.props.onToggleWinning()} />
                    <Label>Red on white</Label>
                </Segment>
            </Segment>
        );
    }
}
