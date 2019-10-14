export let url_back = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export type User = { id: number, name: string, belt: string, weight: string };

export type Team = { id: number, name: string, origin?: string, users?: User[] };

export type TeamMatch = [number, number, number];

export type Score = { ippon: number, wazahari: number, shido: number };

export type Match = { idA: number, idB: number, winner: number, groupID: number, isPool: boolean, scoreA: Score, scoreB: Score };

export type TeamMatchExtended = { team1: Team, team2: Team, winner: number, score: number, penalties: number, matches: Match[] };

export type Pool = { id: number, name: string, teams: Team[], scores?: TeamMatch[] };

export type UpdateFun<T> = (d: Partial<T>) => void;