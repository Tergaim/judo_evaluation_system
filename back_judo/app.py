from src.tournament import Tournament
from src import athletes, bracket, score_func, teams, pool, matches
import flask
from flask_cors import CORS


def create_server():
    app = flask.Flask(__name__)
    app.add_url_rule('/add_team', 'add_team', teams.add_team, methods=['POST'])
    app.add_url_rule('/get_all_teams', 'get_all_teams', teams.get_all_team)
    app.add_url_rule('/get_team', 'get_team', teams.get_team, methods=['POST'])
    app.add_url_rule('/get_all_users', 'get_all_users', athletes.get_all_users)
    app.add_url_rule('/get_user', 'get_user', athletes.get_user, methods=['POST'])
    app.add_url_rule('/update_team', 'update_team', teams.update_team, methods=['PUT', 'POST', 'PATCH'])
    app.add_url_rule('/add_pool', 'add_pool', pool.add_pool, methods = ['POST'])
    app.add_url_rule('/delete_pool', 'delete_pool', pool.delete_pool, methods = ['POST'])
    app.add_url_rule('/get_all_pools', 'get_all_pools', pool.get_all_pools)
    app.add_url_rule('/get_pool', 'get_pool', pool.get_pool, methods=['POST'])
    app.add_url_rule('/set_score', 'set_score', matches.set_score, methods=['POST'])
    app.add_url_rule('/get_team_vs', 'get_team_vs', teams.get_team_vs, methods=['POST'])
    app.add_url_rule('/get_time_match', 'get_time_match', bracket.get_time_match, methods=['POST'])
    app.add_url_rule('/add_bracket', 'add_bracket', bracket.add_bracket, methods=['POST'])
    return app


if __name__ == "__main__":
    tournament = Tournament()
    app = create_server()
    CORS(app)
    app.run(host='0.0.0.0')
