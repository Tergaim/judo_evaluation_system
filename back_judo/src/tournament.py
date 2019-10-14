from src.classes import Athlete, Team, Match, Pool, Bracket
import psycopg2
from os import environ
import logging
import coloredlogs
from time import sleep

coloredlogs.install(level='DEBUG')


class Tournament():
    __instance = None

    def __init__(self):
        """ Virtually private constructor. """
        if Tournament.__instance != None:
            raise Exception("This class is a singleton!")
        else:
            Tournament.__instance = self
        self.teams = {}
        self.athletes = {}
        self.matches = {}
        self.pools = {}
        self.brackets = {}
        while True:
            try:
                self.conn = psycopg2.connect(user=environ["POSTGRES_USER"], password=environ["POSTGRES_PASSWORD"], database=environ["POSTGRES_DB"], host='db')
                logging.info('Connection established with the database.')
                break
            except Exception as e:
                logging.info(f"{e} Trying again in 2 seconds.")
                sleep(2)

        self.reload_bdd()

    @staticmethod
    def get():
        return Tournament.__instance

    def add_team(self, team: Team):
        self.teams[team.id] = team

    def add_athlete(self, athlete: Athlete):
        self.athletes[athlete.id] = athlete

    def search_team(self, id_athlete: int):
        for team in self.teams.values():
            if id_athlete in team.athletes_id:
                return team.id
        return None

    def reload_bdd(self):
        curs = self.conn.cursor()
        curs.execute("""SELECT id, name, origin, athletes FROM teams""")
        teams_bdd = curs.fetchall()
        for team_bdd in teams_bdd:
            list_athlete_in_team = []
            print(team_bdd)
            for athlete_id in team_bdd[3]:
                curs.execute(f"""SELECT belt, weight, name, id FROM users WHERE id={athlete_id}""")
                athlete_bdd = curs.fetchall()[0]
                print(athlete_bdd)
                athlete = Athlete(*athlete_bdd)
                list_athlete_in_team.append(athlete)
                self.add_athlete(athlete)
            self.add_team(Team(team_bdd[2], team_bdd[1], team_bdd[3], list_athlete_in_team, team_bdd[0]))

        curs.execute("""SELECT teams, name, id, time_match, time_wazahari, time_ippon FROM pools""")
        pools_bdd = curs.fetchall()
        for pool_bdd in pools_bdd:
            team_list = [self.teams[id] for id in pool_bdd[0]]
            pool_tupl = pool_bdd[1:]
            pool = Pool(team_list, *pool_tupl)
            self.pools[pool.id] = pool

        curs.execute("""SELECT teams, name, id, progression, time_match, time_wazahari, time_ippon FROM brackets""")
        brackets_bdd = curs.fetchall()
        for bracket_bdd in brackets_bdd:
            team_list = [self.teams[id] for id in bracket_bdd[0]]
            bracket_tupl = bracket_bdd[1:]
            bracket = Bracket(False, team_list, *bracket_tupl)
            self.brackets[bracket.id] = bracket

        curs.execute("""SELECT j1, j2, score_j1, score_j2, winner, origin, isPool, id FROM matches""")
        matches_bdd = curs.fetchall()
        for match_bdd in matches_bdd:
            match = Match(*match_bdd)
            print(match.to_dict(False))
            self.teams[self.search_team(match.id_J1)].match_list.append(match.id)
            self.teams[self.search_team(match.id_J2)].match_list.append(match.id)
            self.matches[match.id] = match
            if match_bdd[6]:  # isPool
                self.pools[match_bdd[5]].matches.append(match.id)
            else:
                self.brackets[match_bdd[5]].matches.append(match.id)
