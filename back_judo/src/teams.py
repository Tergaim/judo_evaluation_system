import psycopg2
from src.classes import Athlete, Team
from src.tournament import Tournament
from flask import jsonify, request
import logging
import coloredlogs
from werkzeug.exceptions import BadRequest
from src.score_func import score_function

coloredlogs.install(level='DEBUG')


def add_team():
    tournament = Tournament.get()
    logging.debug(f"Request received on add_team:\n{request}")
    json = request.json

    athletes_temp = json["user"]
    id_athletes_in_team = []
    athlete_in_team = []
    for athlete_dict in athletes_temp:
        if len(athlete_dict["name"]) > 0:
            try:
                weight = float(athlete_dict["weight"])
            except:
                weight = -1
            athlete = Athlete(athlete_dict["belt"], weight, athlete_dict["name"])
            athlete.to_bdd(tournament.conn)
            id_athletes_in_team.append(athlete.id)
            athlete_in_team.append(athlete)
            tournament.add_athlete(athlete)

    if len(athlete_in_team) == 0:
        raise BadRequest
    if len(json["name"]) != 0:
        name = json["name"]
    else:
        name = athletes_temp[0]["name"]

    team = Team(json["origin"], name, id_athletes_in_team, athlete_in_team)
    team.to_bdd(tournament.conn)
    tournament.add_team(team)
    return ('', 200)


def get_team():
    tournament = Tournament.get()
    json = request.json
    return jsonify(tournament.teams[json["id"]].to_dict())


def get_all_team():
    tournament = Tournament.get()
    list_teams = [team.to_dict() for team in tournament.teams.values()]
    return jsonify(list_teams)


def update_team():
    tournament = Tournament.get()
    json_global = request.json
    json_users = json_global["user"]
    list_users = []
    team = tournament.teams[json_global["id"]]
    curs = tournament.conn.cursor()
    logging.info(json_users)
    for json in json_users:
        id_user = json["id"]

        try:
            name = json["name"]
        except KeyError:
            pass
        try:
            weight = json["weight"]
        except KeyError:
            pass
        try:
            belt = json["belt"]
        except KeyError:
            pass
        if id_user != 0:
            athlete = tournament.athletes[id_user]
            athlete.name = name
            athlete.weight = weight
            athlete.belt = belt
            curs.execute("""UPDATE users SET name=%s, belt=%s, weight=%s WHERE id=%s""", [athlete.name, athlete.belt, athlete.weight, athlete.id])
        else:
            athlete = Athlete(belt, weight, name)
            athlete.to_bdd(tournament.conn)
        tournament.athletes[athlete.id] = athlete
        list_users.append(athlete.id)

    for user_id in team.athletes_id:
        if user_id not in list_users:
            tournament.athletes.pop(user_id, None)
            curs.execute(f"""DELETE FROM users WHERE id={user_id}""")

    team.athletes_id = list_users
    team.athletes = [tournament.athletes[id] for id in list_users]
    curs.execute("""UPDATE teams SET athletes=%s WHERE id=%s""", [list_users, team.id])
    tournament.conn.commit()
    curs.close()
    return ('', 200)


def get_team_vs():
    tournament = Tournament.get()
    json = request.json
    teamA = tournament.teams[json["team1"]]
    teamB = tournament.teams[json["team2"]]
    if json["isPool"]:
        gagne, score, penalties = score_function(tournament.pools[json["groupID"]], teamA, teamB)
    result = {"team1": teamA.to_dict(), "team2": teamB.to_dict(), "winner": gagne, "score": score, "penalties": penalties}
    matches = []
    for match_id in teamA.match_list:
        match = tournament.matches[match_id]
        if match.isPool == json["isPool"]:
            if match.origin == json["groupID"] and match_id in teamB.match_list:
                inverse = (match.id_J1 in teamB.athletes_id)
                matches.append(match.to_dict(inverse))
    result["matches"] = matches
    return jsonify(result)
