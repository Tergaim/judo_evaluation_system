from src.classes import Team, Athlete, Pool
from src.tournament import Tournament


def score_team_v_team(pool: Pool, teamA: Team, teamB: Team):
    tournament = Tournament.get()
    id_matches_to_consider_temp = [match_id for match_id in teamA.match_list if tournament.matches[match_id].isPool and tournament.matches[match_id].origin == pool.id]
    id_matches_to_consider = [match_id for match_id in id_matches_to_consider_temp if tournament.matches[match_id].id_J1 in teamB.athletes_id or tournament.matches[match_id].id_J2 in teamB.athletes_id]
    gagne = 0
    for match_id in id_matches_to_consider:
        if tournament.matches[match_id].winner in teamA.athletes_id:
            gagne += 1
        else:
            gagne -= 1

    penalties = 0
    score = 0
    for match_id in id_matches_to_consider:
        match = tournament.matches[match_id]
        if match.id_J1 in teamA.athletes_id:
            score += 10*(match.score_J1[0] - match.score_J2[0]) + 5*(match.score_J1[1] - match.score_J2[1])
            penalties += match.score_J1[2] - match.score_J2[2]
        else:
            score -= 10*(match.score_J1[0] - match.score_J2[0]) + 5*(match.score_J1[1] - match.score_J2[1])
            penalties -= match.score_J1[2] - match.score_J2[2]
    
    return gagne, score, penalties 

score_function = score_team_v_team