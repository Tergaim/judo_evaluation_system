import psycopg2
from src.classes import Athlete
from src.tournament import Tournament
from flask import jsonify, request

def get_user():
    tournament = Tournament.get()
    json = request.json
    return jsonify(tournament.athletes[json["id"]].to_dict())

def get_all_users():
    tournament = Tournament.get()
    list_athletes = [athlete.to_dict() for athlete in tournament.athletes.values()]
    return jsonify(list_athletes)