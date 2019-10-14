import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, Link, RouteComponentProps } from 'react-router-dom';
import { Button, Icon, Form, Header, InputOnChangeData, FormProps, ButtonProps, Message, Segment, Container, Grid, Image, Label, Input } from 'semantic-ui-react';

import { UpdateFun } from '../../Utils/constants';

class EditValue extends Component<{name: string, value: number, onChange: (v: number) => void}> {
    state = {editing: false, value: this.props.value};

    render() {
        if(this.state.editing) {
            return (
                <div>
                    <Input placeholder={this.props.name} value={this.state.value} onChange={(e, x) => this.setState({value: x.value})} />
                    <Button circular icon='save' onClick={() => {
                        this.setState({editing: false});
                        this.props.onChange(this.state.value);
                    }} />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Label>
                        {this.props.name}
                        <Label.Detail>{this.props.value}</Label.Detail>
                    </Label>
                    <Button circular icon='edit' onClick={() => this.setState({editing: true})} />
                </div>
            );
        }
    }
}


export type EditValueProps = {
    matchTime: number,
    wazaariTime: number,
    ipponTime: number
};

class EditValues extends Component<EditValueProps & { updateState: UpdateFun<EditValueProps> }> {

    

    render() {

        return (
            <Segment>
                <EditValue name="Match time" value={this.props.matchTime} onChange={(v) => this.props.updateState({matchTime: v})}/>
                <EditValue name="Osaekomi for waza-ari" value={this.props.wazaariTime} onChange={(v) => this.props.updateState({ wazaariTime: v })} />
                <EditValue name="Osaekomi for ippon" value={this.props.ipponTime} onChange={(v) => this.props.updateState({ ipponTime: v })} />
            </Segment>
        );
    }
}

export default EditValues;
