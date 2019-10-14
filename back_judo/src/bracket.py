from src.classes import Team, Bracket
from src.tournament import Tournament
from flask import jsonify, request
import logging
import coloredlogs

def add_bracket():
    tournament = Tournament.get()
    json = request.json
    bracket = Bracket(json["random"], json["teams"], json["name"], json["durations"]["time_match"], json["durations"]["time_wazahari"], json["durations"]["time_ippon"])
    bracket.to_bdd()
    tournament.brackets[bracket.id] = bracket
    
def get_time_match():
    tournament = Tournament.get()
    json = request.json
    id = json["id"]
    if json["isPool"]:
        result = {"time_match":tournament.pools[id].time_match,"time_wazahari":tournament.pools[id].time_wazahari, "time_ippon":tournament.pools[id].time_ippon}
    else:
        result = {"time_match":tournament.brackets[id].time_match,"time_wazahari":tournament.brackets[id].time_wazahari, "time_ippon":tournament.brackets[id].time_ippon}
    return jsonify(result)