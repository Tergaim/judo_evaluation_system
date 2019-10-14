from src.classes import Athlete, Team, Match
from src.tournament import Tournament
from flask import request
import logging, coloredlogs

coloredlogs.install(level='DEBUG')

def set_score():
    tournament = Tournament.get()
    json = request.json
    logging.info(json)
    score_J1 = [json["scoreA"]["ippon"], json["scoreA"]["wazahari"], json["scoreA"]["shido"]] 
    score_J2 = [json["scoreB"]["ippon"], json["scoreB"]["wazahari"], json["scoreB"]["shido"]]
    match = Match(json["idA"], json["idB"],score_J1, score_J2, json["winner"], json["groupID"], json["isPool"])
    match.to_bdd(tournament.conn)
    tournament.matches[match.id] = match
    tournament.teams[tournament.search_team(json["idA"])].match_list.append(match.id)
    tournament.teams[tournament.search_team(json["idB"])].match_list.append(match.id)
    return ('', 200)