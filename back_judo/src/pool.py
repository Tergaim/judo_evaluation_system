import psycopg2
from src.classes import Athlete, Team, Pool
from src.tournament import Tournament
from src.score_func import score_function
from flask import jsonify, request
import logging, coloredlogs
from werkzeug.exceptions import BadRequest

coloredlogs.install(level='DEBUG')

def add_pool():
    tournament = Tournament.get()
    json = request.json
    teams_id = json["teams"]
    pool = Pool([tournament.teams[id] for id in teams_id], json["name"])
    pool.to_bdd(tournament.conn)
    tournament.pools[pool.id] = pool
    return ('', 200)


def delete_pool():
    tournament = Tournament.get()
    id = request.json["id"]
    tournament.pools.pop(id, None)
    curs = tournament.conn.cursor()
    curs.execute("""DELETE FROM pools WHERE id=%s""", [id])
    return ('', 200)

def get_all_pools():
    tournament = Tournament.get()
    return jsonify([pool.to_dict() for pool in tournament.pools.values()])


def get_pool():
    tournament = Tournament.get()
    pool = tournament.pools[request.json["id"]]
    result = pool.to_dict()
    matches = []
    for teamA in pool.teams:
        for teamB in pool.teams:
            if teamA.id != teamB.id:
                gagne, score, penalties = score_function(pool,teamA, teamB)
                victoire = (gagne>0) - (gagne<0)
                if victoire == 0:
                    victoire = (score>0) - (score<0)
                if victoire == 0:
                    victoire = (penalties<0) - (penalties>0)
                logging.info(f"Match entre {teamA.id} et {teamB.id}: {gagne}, {score}, {penalties}, victoire = {victoire}")
                matches.append((teamA.id, teamB.id, victoire))
    result["scores"] = matches
    return jsonify(result)