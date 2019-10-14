# List of routes for the API

Here is an exhaustive list of the existing routes, as wall as a small description of what you need to provide and what you can expect to get in return for each request. 

## add_team (POST)

Request:
{
    name: str  (fac.)
    origin: str
    user: [
        {
            name: str
            weight: float
            belt: str
        }
    ]
}

## get_all_teams (GET)

Response:
{
    [
        {
            name: str
            origin: str
            id: int
            users: [
                {
                    name: str
                    weight: float
                    belt: str
                    id: int
                }
            ]
        }
    ]
}

## get_all_users (GET)

Response:
{
    [
        {
            name: str
            weight: float
            belt: str
            id: int
        }
    ]
}

## get_team (POST)

Request:
{
    id: int
}

Response:
{
    name: str
    origin: str
    id: int
    users: int[]
}

## get_user (POST)

Request:
{
    id:int
}

Response:
{
    name: str
    weight: float
    belt: str
    id: int
}

## get_score_functions (GET)

Response:
{
    id: int
    description: str
}

## set_score_function (POST)

Request:
{
    id: int
}

## update_team (PUT)

Request:
{
    id: int
    name: str             #fac.
    origin: str           #fac.
    user: [
        {
            id: int       # 0 if new user
            name: str
            weight: float
            belt: str
        }
    ]
}

If you want to delete a user, simply omit it in the JSON.

## add_pool (POST)

Request:
{
    name: str
    teams: int[]
    durations: {        #fac., in seconds, defaults to 180, 10, 20
        match: int
        wazahari: int
        ippon: int
    }
}

## add_bracket (POST)

Request:
{
    name: str
    random: bool
    teams: int[]
    durations: {        #fac., in seconds, defaults to 180, 10, 20
        match: int
        wazahari: int
        ippon: int
    }
}

## set_score (POST)

Request:
{
    idA: int
    idB: int
    winner: int         #id of the winner, 0 if equality
    scoreA:{
        ippon: int
        wazahari: int
        shido: int
    }
    scoreB:{
        ippon: int
        wazahari: int
        shido: int
    }
    id_origin: int
    isPool: bool
}

## get_pool (POST)

Request:
{
    id: int
}

Response:
{
    id: int
    name: int
    teams: [
        name: str
        id: int
    ]
    matches: int[][3]   # list of tuples (id_team1, id_team2, val) with val = 1 if team1 wins, -1 if team2 wins, 0 if equality
}

## get_all_pools (GET)

Response:
{
    [
        id: int
        name: int
        teams: [
            name: str
            id: int
        ]
    ]
}

## get_bracket (POST)
## get_all_brackets (GET)
## get_team_vs (POST)

Request:
{
    team1: int
    team2: int
    isPool: bool
    groupID: int        # id of the pool/bracket
}

Response:
{
    team1: {
        id: int
        name: str
        origin: str
        users: [
            id: int
            name: str
            belt: str
            weight: float
        ]
    }
    team2: {
        id: int
        name: str
        origin: str
        users: [
            id: int
            name: str
            belt: str
            weight: float
        ]
    }
    winner: int         # 1, 0, -1 if team1 wins, equality or loses
    score: int          # difference in point between 1 and 2 (>0 if 1 wins)
    penalties: int      #difference in penalties between 1 and 2 (>0 if 1 loses)
    matches: [
        idA: int        # it is guaranteed that A is in team1 and B in team2
        idB: int
        scoreA: {
            ippon: int
            wazahari: int
            shido: int
        }
        scoreB: {
            ippon: int
            wazahari: int
            shido: int
        }
        groupID: int
        isPool: bool
        winner: int     # id of the winner, 0 if equality
    ]
}

## delete_pool (POST)

Request:
{
    id: int
}

## delete_bracket (POST)

Request:
{
    id: int
}

## get_time_match (POST)

Request:
{
    id: int
    isPool: bool
}

Response:
{
    time_match: int
    time_wazahari: int
    time_ippon: int
}