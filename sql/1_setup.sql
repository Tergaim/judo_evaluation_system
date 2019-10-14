--
-- PostgreSQL database dump
--

-- Dumped from database version 12beta4
-- Dumped by pg_dump version 12beta4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brackets; Type: TABLE; Schema: public; Owner: judo
--

CREATE TABLE public.brackets (
    id integer NOT NULL,
    name text,
    teams integer[],
    progression integer[],
    time_match integer,
    time_wazahari integer,
    time_ippon integer
);


ALTER TABLE public.brackets OWNER TO judo;

--
-- Name: brackets_id_seq; Type: SEQUENCE; Schema: public; Owner: judo
--

CREATE SEQUENCE public.brackets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brackets_id_seq OWNER TO judo;

--
-- Name: brackets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: judo
--

ALTER SEQUENCE public.brackets_id_seq OWNED BY public.brackets.id;


--
-- Name: matches; Type: TABLE; Schema: public; Owner: judo
--

CREATE TABLE public.matches (
    team1 integer,
    team2 integer,
    j1 integer,
    j2 integer,
    winner integer,
    score_j1 integer[],
    score_j2 integer[],
    origin integer,
    isPool boolean,
    id integer NOT NULL
);


ALTER TABLE public.matches OWNER TO judo;

--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: judo
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.matches_id_seq OWNER TO judo;

--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: judo
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: pools; Type: TABLE; Schema: public; Owner: judo
--

CREATE TABLE public.pools (
    id integer NOT NULL,
    name text,
    teams integer[],
    time_match integer,
    time_wazahari integer,
    time_ippon integer
);


ALTER TABLE public.pools OWNER TO judo;

--
-- Name: pools_id_seq; Type: SEQUENCE; Schema: public; Owner: judo
--

CREATE SEQUENCE public.pools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pools_id_seq OWNER TO judo;

--
-- Name: pools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: judo
--

ALTER SEQUENCE public.pools_id_seq OWNED BY public.pools.id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: judo
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name text,
    origin text,
    athletes integer[]
);


ALTER TABLE public.teams OWNER TO judo;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: judo
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.teams_id_seq OWNER TO judo;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: judo
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: judo
--

CREATE TABLE public.users (
    id integer NOT NULL,
    belt text,
    weight real,
    name text
);


ALTER TABLE public.users OWNER TO judo;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: judo
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO judo;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: judo
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: brackets id; Type: DEFAULT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.brackets ALTER COLUMN id SET DEFAULT nextval('public.brackets_id_seq'::regclass);


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: pools id; Type: DEFAULT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.pools ALTER COLUMN id SET DEFAULT nextval('public.pools_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: brackets; Type: TABLE DATA; Schema: public; Owner: judo
--

COPY public.brackets (id, name, teams, progression, time_match, time_wazahari, time_ippon) FROM stdin;
\.


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: judo
--

COPY public.matches (team1, team2, j1, j2, winner, score_j1, score_j2, origin, isPool, id) FROM stdin;
\.


--
-- Data for Name: pools; Type: TABLE DATA; Schema: public; Owner: judo
--

COPY public.pools (id, name, teams, time_match, time_wazahari, time_ippon) FROM stdin;
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: judo
--

COPY public.teams (id, name, origin, athletes) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: judo
--

COPY public.users (id, belt, weight, name) FROM stdin;
\.


--
-- Name: brackets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: judo
--

SELECT pg_catalog.setval('public.brackets_id_seq', 1, false);


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: judo
--

SELECT pg_catalog.setval('public.matches_id_seq', 1, false);


--
-- Name: pools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: judo
--

SELECT pg_catalog.setval('public.pools_id_seq', 1, false);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: judo
--

SELECT pg_catalog.setval('public.teams_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: judo
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: brackets brackets_pkey; Type: CONSTRAINT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.brackets
    ADD CONSTRAINT brackets_pkey PRIMARY KEY (id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: pools pools_pkey; Type: CONSTRAINT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: judo
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--
