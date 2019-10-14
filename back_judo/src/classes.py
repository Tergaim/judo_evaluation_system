import psycopg2
from typing import List
from random import shuffle


class Athlete():
    def __init__(self, belt: str, weight: float, name: str, id: int = None):
        self.belt = belt
        self.weight = weight
        self.name = name
        self.id = id

    def to_bdd(self, conn):
        curs = conn.cursor()
        curs.execute("""INSERT INTO users (belt, weight, name) VALUES (%s, %s, %s) RETURNING id;""", [self.belt, self.weight, self.name])
        self.id = curs.fetchone()[0]
        conn.commit()
        curs.close()

    def to_dict(self):
        return {"name": self.name, "weight": self.weight, "belt": self.belt, "id": self.id}


class Team():
    def __init__(self, origin: str, name: str, athletes_id: List[int], athletes_list: List[Athlete], id: int = None):
        self.origin = origin
        self.athletes_id = athletes_id
        self.athletes = athletes_list
        self.name = name
        self.match_list = []
        self.id = id

    def to_bdd(self, conn):
        curs = conn.cursor()
        curs.execute("""INSERT INTO teams (name, origin, athletes) VALUES (%s, %s, %s::integer[]) RETURNING id;""", [self.name, self.origin, self.athletes_id])
        self.id = curs.fetchone()[0]
        conn.commit()
        curs.close()

    def to_dict(self):
        return {"name": self.name, "users": [athlete.to_dict() for athlete in self.athletes], "origin": self.origin, "id": self.id}


class Pool():
    def __init__(self, teams: List[Team], name: str, id: int = None, time_match: int = None, time_wazahari: int = None, time_ippon: int = None, matches: List[int] = None):
        self.teams = teams
        self.teams_id = [team.id for team in teams]
        self.name = name
        self.matches = matches
        if matches is None:
            self.matches = []
        self.id = id
        self.time_match = (time_match, 300)[time_match is None]
        self.time_ippon = (time_ippon, 20)[time_ippon is None]
        self.time_wazahari = (time_wazahari, 10)[time_wazahari is None]

    def to_bdd(self, conn):
        curs = conn.cursor()
        curs.execute("""INSERT INTO pools (name, teams) VALUES (%s, %s::integer[]) RETURNING id;""", [self.name, self.teams_id])
        self.id = curs.fetchone()[0]
        conn.commit()
        curs.close()

    def to_dict(self):
        return {"id": self.id, "name": self.name, "teams": [{"name": team.name, "id": team.id} for team in self.teams]}


class Match():
    def __init__(self, id_J1: int, id_J2: int, score_J1: List[int], score_J2: List[int], winner: int, origin: int, isPool: bool, id: int = None):
        if winner is not None and winner != id_J1 and winner != id_J2:
            raise AttributeError(f"Winner cannot be {winner} if match is between {id_J1} and {id_J2}!")
        if winner is None:
            winner = 0
        self.id_J1 = id_J1
        self.id_J2 = id_J2
        self.score_J1 = score_J1
        self.score_J2 = score_J2
        self.winner = winner
        self.origin = origin
        self.isPool = isPool
        self.id = id

    def to_bdd(self, conn):
        curs = conn.cursor()
        curs.execute(
            """INSERT INTO matches (j1, j2, winner, score_j1, score_j2, origin, isPool, time_match, time_wazahari, time_ippon) VALUES (%s, %s, %s, %s::integer[], %s::integer[], %s, %s, %s, %s, %s) RETURNING id;""", [self.id_J1, self.id_J2, self.winner, self.score_J1, self.score_J2, self.origin, self.isPool, self.time_match, self.time_wazahari, self.time_ippon])
        self.id = curs.fetchone()[0]
        conn.commit()
        curs.close()

    def to_dict(self, inverse: bool):
        score_J1 = {"ippon": self.score_J1[0], "wazahari": self.score_J1[1], "shido": self.score_J1[2]}
        score_J2 = {"ippon": self.score_J2[0], "wazahari": self.score_J2[1], "shido": self.score_J2[2]}
        if inverse:
            return {"idA": self.id_J2, "idB": self.id_J1, "scoreA": score_J2, "scoreB": score_J1, "winner": self.winner, "groupID": self.origin, "isPool": self.isPool}
        return {"idA": self.id_J1, "idB": self.id_J2, "scoreA": score_J1, "scoreB": score_J2, "winner": self.winner, "groupID": self.origin, "isPool": self.isPool}


class Bracket():
    def __init__(self, rand: bool, teams: List[Team], name: str, id: int = None, order: List[int] = None, time_match: int = None, time_wazahari: int = None, time_ippon: int = None):
        if rand:
            shuffle(teams)
        self.teams = teams
        self.name = name
        self.id = id
        self.matches = []
        self.time_match = (time_match, 300)[time_match is None]
        self.time_ippon = (time_ippon, 20)[time_ippon is None]
        self.time_wazahari = (time_wazahari, 10)[time_wazahari is None]
        self.state = [[team.id for team in teams]]
        l = len(teams)
        if order is None:
            self.order = {team.id: 0 for team in teams}
        else:
            self.order = {team.id: order[i] for i, team in enumerate(teams)}

        while l > 1:
            l = int(l/2) + (l & 1)
            self.state.append([0]*l)
        for i in range(0, len(self.state)-1):
            start = 0
            end = len(self.state[i])
            if len(self.state[i]) % 2:
                if i % 2:
                    self.state[i+1][0] = self.state[i][0]
                    start = 1
                else:
                    self.state[i+1][len(self.state[i+1]-1)] = self.state[i][len(self.state[i]-1)]
                    end = end - 1
            for j in range(start, end, 2):
                if self.order[teams[j].id] > self.order[teams[j+1].id]:
                    self.state[i+1][j//2+(j & 1)] = teams[j].id
                elif self.order[teams[j].id] < self.order[teams[j+1].id]:
                    self.state[i+1][j//2+(j & 1)] = teams[j+1].id

    def to_bdd(self, conn):
        curs = conn.cursor()
        curs.execute("""INSERT INTO brackets (name, teams, progression, time_match, time_wazahari, time_ippon) VALUES (%s, %s::integer[], %s::integer[], %s, %s, %s) RETURNING id""", [self.name, self.state[0], self.order, self.time_match, self.time_wazahari, self.time_ippon])
        self.id = curs.fetchone()[0]
        conn.commit()
        curs.close()

    def to_dict(self):
        return {"teams": [{"id": team.id, "name": team.name} for team in self.teams], "state": self.state}
