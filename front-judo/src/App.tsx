import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Header, Menu, MenuItemProps, Container, Button } from 'semantic-ui-react';
import HomePage from './Pages/HomePage';
import NewTeam from './Pages/NewTeam';
import NewPool from './Pages/NewPool';
import PoolPage from './Pages/PoolPage';
import TeamMatch from './Pages/TeamMatch';
import MatchPage from './Pages/MatchPage';
import NewWindow from 'react-new-window';
import MatchComp, { MatchCompProps } from './Components/MatchPage/Main';


class App extends Component {
    state = {matchData: {} as MatchCompProps, judgeOpen: false};
    render() {
        return (
            <Container>
                <Header as='h1' block={true} textAlign='center'>
                    Judo Competition System
                    <Button floated='right' onClick={() => this.setState({judgeOpen: true})}>Open judge</Button>
                </Header>
                <BrowserRouter>
                    <Switch>
                        <Route path='/newTeam' component={NewTeam}/>
                        <Route path='/newPool' component={NewPool} />
                        <Route path='/pool/:id' component={PoolPage} />
                        <Route path='/teamMatch/:team1-:team2-pool=:groupID' render={(props) => <TeamMatch {...props} isPool={true}/>} />
                        <Route path='/teamMatch/:team1-:team2-bracket=:groupID' render={(props) => <TeamMatch {...props} isPool={false} />} />
                        <Route path='/match/team1=:team1-team2=:team2-idA=:idA-idB=:idB-isPool=:isPool-groupID=:groupID'
                            render={(props) => <MatchPage {...props} updateState={(s) => this.setState({matchData: s})} />} />                        
                        <Route path='/(tab=)?:id?' component={HomePage}/>
                    </Switch>
                </BrowserRouter>

                {this.state.judgeOpen && <NewWindow onUnload={() => this.setState({judgeOpen: false})}>
                    <MatchComp invertedForJudge={true}
                        {...this.state.matchData}
                        updateState={() => { }} />
                </NewWindow>}
            </Container>
        );
    }
}

export default App;
