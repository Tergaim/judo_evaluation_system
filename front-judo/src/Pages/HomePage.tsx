import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { Header, Menu, MenuItemProps, Tab } from 'semantic-ui-react';
import TeamsList from '../Components/TeamsList';
import PoolList from '../Components/PoolList';

let panes = [
    {
        menuItem: 'Teams',
        render: () => <Tab.Pane attached={false}><TeamsList/></Tab.Pane>,
    },
    {
        menuItem: 'Pools',
        render: () => <Tab.Pane attached={false}><PoolList/></Tab.Pane>,
    },
    {
        menuItem: 'Tab 3',
        render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
    },
]

type TParam = { id: string };

class HomePage extends Component<RouteComponentProps<TParam>> {

    render() {
        return (
            <div>
                <Tab defaultActiveIndex={this.props.match.params.id} menu={{ secondary: true, pointing: true }} panes={panes}/>
            </div>
        );
    }
}

export default HomePage;
