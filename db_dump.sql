--
-- PostgreSQL database dump
--

\restrict W11Mxp1XO2KUgQZDfJDv9dYdCtDA6ub6qlheQAHZpAUFghfSud6yvZakFxvqBOQ

-- Dumped from database version 18.3 (Postgres.app)
-- Dumped by pg_dump version 18.3 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP INDEX public.idx_rsvp_visible_wish;
DROP INDEX public.idx_rsvp_slug;
DROP INDEX public.idx_page_visits_visited_at;
DROP INDEX public.idx_guests_slug;
DROP INDEX public.idx_guests_category;
DROP INDEX public.admins_username_key;
ALTER TABLE ONLY public.wishes DROP CONSTRAINT wishes_pkey;
ALTER TABLE ONLY public.wedding_config DROP CONSTRAINT wedding_config_pkey;
ALTER TABLE ONLY public.rsvp DROP CONSTRAINT rsvp_pkey;
ALTER TABLE ONLY public.page_visits DROP CONSTRAINT page_visits_pkey;
ALTER TABLE ONLY public.guests DROP CONSTRAINT guests_slug_key;
ALTER TABLE ONLY public.guests DROP CONSTRAINT guests_pkey;
ALTER TABLE ONLY public.admins DROP CONSTRAINT admins_pkey;
ALTER TABLE public.wishes ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.rsvp ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.page_visits ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.guests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.admins ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.wishes_id_seq;
DROP TABLE public.wishes;
DROP TABLE public.wedding_config;
DROP SEQUENCE public.rsvp_id_seq;
DROP TABLE public.rsvp;
DROP SEQUENCE public.page_visits_id_seq;
DROP TABLE public.page_visits;
DROP SEQUENCE public.guests_id_seq;
DROP TABLE public.guests;
DROP SEQUENCE public.admins_id_seq;
DROP TABLE public.admins;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username text NOT NULL,
    "passwordHash" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: guests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guests (
    id integer NOT NULL,
    name text NOT NULL,
    phone text DEFAULT ''::text,
    category text DEFAULT ''::text,
    table_number text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now(),
    slug text
);


--
-- Name: guests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guests_id_seq OWNED BY public.guests.id;


--
-- Name: page_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_visits (
    id integer NOT NULL,
    slug text,
    visited_at timestamp with time zone DEFAULT now(),
    ip_address text,
    user_agent text,
    device_type text,
    browser_name text,
    os_name text
);


--
-- Name: page_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_visits_id_seq OWNED BY public.page_visits.id;


--
-- Name: rsvp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rsvp (
    id integer NOT NULL,
    name text NOT NULL,
    attend text NOT NULL,
    guests integer DEFAULT 1 NOT NULL,
    wish text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text,
    visible boolean DEFAULT true
);


--
-- Name: rsvp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rsvp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rsvp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rsvp_id_seq OWNED BY public.rsvp.id;


--
-- Name: wedding_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wedding_config (
    id integer DEFAULT 1 NOT NULL,
    data jsonb NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: wishes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishes (
    id integer NOT NULL,
    name text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: wishes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wishes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wishes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wishes_id_seq OWNED BY public.wishes.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: guests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guests ALTER COLUMN id SET DEFAULT nextval('public.guests_id_seq'::regclass);


--
-- Name: page_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_visits ALTER COLUMN id SET DEFAULT nextval('public.page_visits_id_seq'::regclass);


--
-- Name: rsvp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvp ALTER COLUMN id SET DEFAULT nextval('public.rsvp_id_seq'::regclass);


--
-- Name: wishes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishes ALTER COLUMN id SET DEFAULT nextval('public.wishes_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, username, "passwordHash", "createdAt") FROM stdin;
1	admin	$2b$12$lwROdK8f9Hiw.H.hXyJNBetXK1jhHXF.ceAPB6KcOZNcEhKNQcKCS	2026-06-01 21:06:01.949
\.


--
-- Data for Name: guests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.guests (id, name, phone, category, table_number, notes, created_at, slug) FROM stdin;
1	Iwan & Budi	081249442476	Teman			2026-06-08 06:32:13.996641+07	ClJM4No
2	Budi Santoso	081234567801	Keluarga		Paman dari pihak pengantin pria	2026-06-08 07:18:23.686327+07	FqERx0Q
3	Dewi Rahayu	081234567802	Keluarga		Bibi dari pihak pengantin wanita	2026-06-08 07:18:23.688543+07	Hbc5rJs
4	Andi Wijaya	081234567803	Teman			2026-06-08 07:18:23.68919+07	uTRrVUQ
5	Sari Putri	081234567804	Teman		Sahabat SMA pengantin wanita	2026-06-08 07:18:23.68951+07	wDQpDUA
6	Reza Firmansyah	081234567805	Teman			2026-06-08 07:18:23.689829+07	oZ_KQWo
7	Linda Kusuma	081234567806	Rekan Kerja			2026-06-08 07:18:23.690155+07	UTD7i1k
8	Hendra Pratama	081234567807	Rekan Kerja		Manager divisi Marketing	2026-06-08 07:18:23.690483+07	dKxRRpc
9	Yuni Astuti	081234567808	Rekan Kerja			2026-06-08 07:18:23.690811+07	W2prO_A
10	Bambang Susilo		Keluarga		Kakak pengantin pria	2026-06-08 07:18:23.691159+07	zUzBIb8
11	Mega Lestari	081234567810	Teman		Teman kuliah pengantin pria	2026-06-08 07:18:23.691803+07	Fi1ao1o
12	Fajar Nugroho	081234567811	Teman			2026-06-08 07:18:23.692118+07	iN2Cb58
13	Rina Marlina	081234567812	Keluarga		Sepupu pengantin wanita	2026-06-08 07:18:23.692308+07	lpsBSiM
14	Doni Saputra	081234567813	Rekan Kerja			2026-06-08 07:18:23.692552+07	kXNd5S4
15	Nita Andriani	081234567814	Lainnya		Tetangga lama	2026-06-08 07:18:23.692804+07	9oxLors
16	Wahyu Kurniawan	081234567815	Lainnya			2026-06-08 07:18:23.692997+07	_lt3oek
17	Budi Santoso	081234567801	Keluarga		Paman dari pihak pengantin pria	2026-06-09 04:18:44.361437+07	Ms8B8qg
18	Dewi Rahayu	081234567802	Keluarga		Bibi dari pihak pengantin wanita	2026-06-09 04:18:44.364996+07	Xf_NOGw
19	Andi Wijaya	081234567803	Teman			2026-06-09 04:18:44.365293+07	aZ0MeRI
20	Sari Putri	081234567804	Teman		Sahabat SMA pengantin wanita	2026-06-09 04:18:44.365609+07	DSzxDrM
21	Reza Firmansyah	081234567805	Teman			2026-06-09 04:18:44.365899+07	R0z5x3I
22	Linda Kusuma	081234567806	Rekan Kerja			2026-06-09 04:18:44.366153+07	SCaAZqs
23	Hendra Pratama	081234567807	Rekan Kerja		Manager divisi Marketing	2026-06-09 04:18:44.366315+07	WWVYYe0
24	Yuni Astuti	081234567808	Rekan Kerja			2026-06-09 04:18:44.366772+07	aSXTZvY
25	Bambang Susilo		Keluarga		Kakak pengantin pria	2026-06-09 04:18:44.367127+07	sHSNSgE
26	Mega Lestari	081234567810	Teman		Teman kuliah pengantin pria	2026-06-09 04:18:44.367336+07	1KbawZQ
27	Fajar Nugroho	081234567811	Teman			2026-06-09 04:18:44.367506+07	fUdc8N8
28	Rina Marlina	081234567812	Keluarga		Sepupu pengantin wanita	2026-06-09 04:18:44.36822+07	_wwUKOE
29	Doni Saputra	081234567813	Rekan Kerja			2026-06-09 04:18:44.368708+07	_ZEANZc
30	Nita Andriani	081234567814	Lainnya		Tetangga lama	2026-06-09 04:18:44.368866+07	aqIpoEQ
31	Wahyu Kurniawan	081234567815	Lainnya			2026-06-09 04:18:44.369002+07	cEiBCBg
\.


--
-- Data for Name: page_visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.page_visits (id, slug, visited_at, ip_address, user_agent, device_type, browser_name, os_name) FROM stdin;
1	\N	2026-06-08 07:15:27.375755+07	\N	\N	\N	\N	\N
2	ClJM4No	2026-06-08 07:15:27.378015+07	\N	\N	\N	\N	\N
3	zUzBIb8	2026-05-26 19:01:23.698+07	\N	\N	\N	\N	\N
4	\N	2026-05-26 09:43:23.698+07	\N	\N	\N	\N	\N
5	\N	2026-05-26 14:29:23.698+07	\N	\N	\N	\N	\N
6	\N	2026-05-26 08:06:23.698+07	\N	\N	\N	\N	\N
7	\N	2026-05-26 17:48:23.698+07	\N	\N	\N	\N	\N
8	Fi1ao1o	2026-05-26 15:00:23.698+07	\N	\N	\N	\N	\N
9	FqERx0Q	2026-05-27 21:56:23.698+07	\N	\N	\N	\N	\N
10	lpsBSiM	2026-05-27 12:16:23.698+07	\N	\N	\N	\N	\N
11	9oxLors	2026-05-27 09:51:23.698+07	\N	\N	\N	\N	\N
12	\N	2026-05-27 17:56:23.698+07	\N	\N	\N	\N	\N
13	\N	2026-05-27 20:10:23.698+07	\N	\N	\N	\N	\N
14	\N	2026-05-27 10:13:23.698+07	\N	\N	\N	\N	\N
15	lpsBSiM	2026-05-27 15:24:23.698+07	\N	\N	\N	\N	\N
16	\N	2026-05-27 10:06:23.698+07	\N	\N	\N	\N	\N
17	9oxLors	2026-05-27 18:40:23.698+07	\N	\N	\N	\N	\N
18	\N	2026-05-28 20:23:23.698+07	\N	\N	\N	\N	\N
19	9oxLors	2026-05-28 10:04:23.698+07	\N	\N	\N	\N	\N
20	\N	2026-05-28 17:17:23.698+07	\N	\N	\N	\N	\N
21	\N	2026-05-28 08:10:23.698+07	\N	\N	\N	\N	\N
22	W2prO_A	2026-05-29 20:16:23.698+07	\N	\N	\N	\N	\N
23	uTRrVUQ	2026-05-29 16:37:23.698+07	\N	\N	\N	\N	\N
24	\N	2026-05-30 09:40:23.698+07	\N	\N	\N	\N	\N
25	\N	2026-05-30 21:47:23.698+07	\N	\N	\N	\N	\N
26	wDQpDUA	2026-05-31 15:10:23.698+07	\N	\N	\N	\N	\N
27	\N	2026-05-31 11:26:23.698+07	\N	\N	\N	\N	\N
28	zUzBIb8	2026-06-01 11:42:23.698+07	\N	\N	\N	\N	\N
29	9oxLors	2026-06-01 16:47:23.698+07	\N	\N	\N	\N	\N
30	zUzBIb8	2026-06-01 11:24:23.698+07	\N	\N	\N	\N	\N
31	W2prO_A	2026-06-02 08:47:23.698+07	\N	\N	\N	\N	\N
32	wDQpDUA	2026-06-02 18:36:23.698+07	\N	\N	\N	\N	\N
33	9oxLors	2026-06-02 19:05:23.698+07	\N	\N	\N	\N	\N
34	\N	2026-06-02 09:19:23.698+07	\N	\N	\N	\N	\N
35	FqERx0Q	2026-06-02 18:38:23.698+07	\N	\N	\N	\N	\N
36	UTD7i1k	2026-06-02 10:21:23.698+07	\N	\N	\N	\N	\N
37	\N	2026-06-03 09:29:23.698+07	\N	\N	\N	\N	\N
38	\N	2026-06-03 18:03:23.698+07	\N	\N	\N	\N	\N
39	\N	2026-06-03 08:13:23.698+07	\N	\N	\N	\N	\N
40	UTD7i1k	2026-06-03 14:07:23.698+07	\N	\N	\N	\N	\N
41	\N	2026-06-03 18:04:23.698+07	\N	\N	\N	\N	\N
42	\N	2026-06-03 19:01:23.698+07	\N	\N	\N	\N	\N
43	\N	2026-06-03 13:41:23.698+07	\N	\N	\N	\N	\N
44	iN2Cb58	2026-06-03 17:33:23.698+07	\N	\N	\N	\N	\N
45	\N	2026-06-04 20:47:23.698+07	\N	\N	\N	\N	\N
46	\N	2026-06-04 15:22:23.698+07	\N	\N	\N	\N	\N
47	\N	2026-06-04 20:35:23.698+07	\N	\N	\N	\N	\N
48	iN2Cb58	2026-06-04 14:41:23.698+07	\N	\N	\N	\N	\N
49	wDQpDUA	2026-06-04 17:20:23.698+07	\N	\N	\N	\N	\N
50	UTD7i1k	2026-06-04 18:48:23.698+07	\N	\N	\N	\N	\N
51	\N	2026-06-04 20:41:23.698+07	\N	\N	\N	\N	\N
52	\N	2026-06-04 21:53:23.698+07	\N	\N	\N	\N	\N
53	zUzBIb8	2026-06-04 19:44:23.698+07	\N	\N	\N	\N	\N
54	\N	2026-06-05 20:23:23.698+07	\N	\N	\N	\N	\N
55	iN2Cb58	2026-06-05 09:31:23.698+07	\N	\N	\N	\N	\N
56	Fi1ao1o	2026-06-05 19:39:23.698+07	\N	\N	\N	\N	\N
57	\N	2026-06-05 09:13:23.698+07	\N	\N	\N	\N	\N
58	kXNd5S4	2026-06-05 08:18:23.698+07	\N	\N	\N	\N	\N
59	_lt3oek	2026-06-05 08:50:23.698+07	\N	\N	\N	\N	\N
60	\N	2026-06-05 13:38:23.698+07	\N	\N	\N	\N	\N
61	Hbc5rJs	2026-06-05 13:35:23.698+07	\N	\N	\N	\N	\N
62	oZ_KQWo	2026-06-05 20:58:23.698+07	\N	\N	\N	\N	\N
63	\N	2026-06-06 09:47:23.698+07	\N	\N	\N	\N	\N
64	kXNd5S4	2026-06-06 21:20:23.698+07	\N	\N	\N	\N	\N
65	uTRrVUQ	2026-06-06 17:52:23.698+07	\N	\N	\N	\N	\N
66	Hbc5rJs	2026-06-07 16:33:23.698+07	\N	\N	\N	\N	\N
67	\N	2026-06-07 09:59:23.698+07	\N	\N	\N	\N	\N
68	kXNd5S4	2026-06-07 12:29:23.698+07	\N	\N	\N	\N	\N
69	\N	2026-06-07 12:35:23.698+07	\N	\N	\N	\N	\N
70	lpsBSiM	2026-06-07 19:10:23.698+07	\N	\N	\N	\N	\N
71	_lt3oek	2026-06-08 14:04:23.698+07	\N	\N	\N	\N	\N
72	Hbc5rJs	2026-06-08 08:39:23.698+07	\N	\N	\N	\N	\N
73	iN2Cb58	2026-06-08 21:55:23.698+07	\N	\N	\N	\N	\N
74	zUzBIb8	2026-06-08 20:12:23.698+07	\N	\N	\N	\N	\N
76	\N	2026-06-08 17:09:02.153377+07	\N	\N	\N	\N	\N
75	\N	2026-06-08 17:09:02.153505+07	\N	\N	\N	\N	\N
77	\N	2026-06-08 17:11:47.567287+07	\N	\N	\N	\N	\N
78	\N	2026-06-08 17:11:47.567231+07	\N	\N	\N	\N	\N
79	\N	2026-06-08 17:12:02.383391+07	\N	\N	\N	\N	\N
80	\N	2026-06-08 17:12:02.383455+07	\N	\N	\N	\N	\N
82	\N	2026-06-08 17:15:38.339798+07	\N	\N	\N	\N	\N
81	\N	2026-06-08 17:15:38.339749+07	\N	\N	\N	\N	\N
83	\N	2026-06-08 17:15:57.667368+07	\N	\N	\N	\N	\N
84	\N	2026-06-08 17:15:57.667291+07	\N	\N	\N	\N	\N
85	\N	2026-06-08 17:29:52.379099+07	\N	\N	\N	\N	\N
86	\N	2026-06-08 17:29:52.379148+07	\N	\N	\N	\N	\N
88	\N	2026-06-08 18:01:23.882463+07	\N	\N	\N	\N	\N
87	\N	2026-06-08 18:01:23.882388+07	\N	\N	\N	\N	\N
89	\N	2026-06-08 18:07:18.495701+07	\N	\N	\N	\N	\N
90	\N	2026-06-08 18:07:18.52163+07	\N	\N	\N	\N	\N
91	\N	2026-06-08 18:12:49.111562+07	\N	\N	\N	\N	\N
92	\N	2026-06-08 18:12:49.142132+07	\N	\N	\N	\N	\N
93	\N	2026-06-08 18:25:57.973907+07	\N	\N	\N	\N	\N
94	\N	2026-06-08 18:25:57.974116+07	\N	\N	\N	\N	\N
95	\N	2026-06-08 18:43:46.29032+07	\N	\N	\N	\N	\N
96	\N	2026-06-08 18:43:46.290364+07	\N	\N	\N	\N	\N
97	\N	2026-06-08 18:45:39.870249+07	\N	\N	\N	\N	\N
98	\N	2026-06-08 18:45:39.87043+07	\N	\N	\N	\N	\N
99	\N	2026-06-08 18:45:45.92721+07	\N	\N	\N	\N	\N
100	\N	2026-06-08 18:45:45.927349+07	\N	\N	\N	\N	\N
101	\N	2026-06-08 18:45:53.988126+07	\N	\N	\N	\N	\N
102	\N	2026-06-08 18:45:53.988921+07	\N	\N	\N	\N	\N
103	\N	2026-06-08 18:46:41.825834+07	\N	\N	\N	\N	\N
104	\N	2026-06-08 18:46:41.82584+07	\N	\N	\N	\N	\N
105	\N	2026-06-08 18:47:30.113925+07	\N	\N	\N	\N	\N
106	\N	2026-06-08 18:47:30.113931+07	\N	\N	\N	\N	\N
107	\N	2026-06-08 18:47:51.179824+07	\N	\N	\N	\N	\N
108	\N	2026-06-08 18:47:51.18128+07	\N	\N	\N	\N	\N
109	\N	2026-06-08 18:48:12.555811+07	\N	\N	\N	\N	\N
110	\N	2026-06-08 18:48:12.556116+07	\N	\N	\N	\N	\N
111	\N	2026-06-08 18:48:25.544+07	\N	\N	\N	\N	\N
112	\N	2026-06-08 18:48:25.543989+07	\N	\N	\N	\N	\N
113	\N	2026-06-08 18:48:55.569451+07	\N	\N	\N	\N	\N
114	\N	2026-06-08 18:48:55.569454+07	\N	\N	\N	\N	\N
115	\N	2026-06-08 18:49:14.194985+07	\N	\N	\N	\N	\N
116	\N	2026-06-08 18:49:14.194881+07	\N	\N	\N	\N	\N
117	\N	2026-06-08 18:49:44.906281+07	\N	\N	\N	\N	\N
118	\N	2026-06-08 18:49:44.906562+07	\N	\N	\N	\N	\N
119	\N	2026-06-08 18:50:10.506437+07	\N	\N	\N	\N	\N
120	\N	2026-06-08 18:50:10.506306+07	\N	\N	\N	\N	\N
121	\N	2026-06-08 18:50:39.683102+07	\N	\N	\N	\N	\N
122	\N	2026-06-08 18:50:39.683099+07	\N	\N	\N	\N	\N
124	\N	2026-06-08 18:51:06.953085+07	\N	\N	\N	\N	\N
123	\N	2026-06-08 18:51:06.953195+07	\N	\N	\N	\N	\N
125	\N	2026-06-08 18:51:42.633022+07	\N	\N	\N	\N	\N
126	\N	2026-06-08 18:51:42.632986+07	\N	\N	\N	\N	\N
127	\N	2026-06-08 18:52:22.166992+07	\N	\N	\N	\N	\N
128	\N	2026-06-08 18:52:22.166977+07	\N	\N	\N	\N	\N
129	\N	2026-06-08 18:55:55.842865+07	\N	\N	\N	\N	\N
130	\N	2026-06-08 18:55:55.843087+07	\N	\N	\N	\N	\N
131	\N	2026-06-09 00:39:47.476537+07	\N	\N	\N	\N	\N
132	\N	2026-06-09 00:39:47.47646+07	\N	\N	\N	\N	\N
133	\N	2026-06-09 00:44:45.70353+07	\N	\N	\N	\N	\N
134	\N	2026-06-09 00:44:45.703799+07	\N	\N	\N	\N	\N
136	\N	2026-06-09 00:48:43.868545+07	\N	\N	\N	\N	\N
135	\N	2026-06-09 00:48:43.868664+07	\N	\N	\N	\N	\N
137	\N	2026-06-09 00:50:44.366194+07	\N	\N	\N	\N	\N
138	\N	2026-06-09 00:50:44.366346+07	\N	\N	\N	\N	\N
140	\N	2026-06-09 00:51:21.301287+07	\N	\N	\N	\N	\N
139	\N	2026-06-09 00:51:21.301375+07	\N	\N	\N	\N	\N
142	\N	2026-06-09 00:53:10.659625+07	\N	\N	\N	\N	\N
141	\N	2026-06-09 00:53:10.659359+07	\N	\N	\N	\N	\N
143	\N	2026-06-09 00:54:45.695994+07	\N	\N	\N	\N	\N
144	\N	2026-06-09 00:54:45.69606+07	\N	\N	\N	\N	\N
145	\N	2026-06-09 00:54:47.667985+07	\N	\N	\N	\N	\N
146	\N	2026-06-09 00:54:47.668303+07	\N	\N	\N	\N	\N
147	\N	2026-06-09 00:54:49.118553+07	\N	\N	\N	\N	\N
148	\N	2026-06-09 00:54:49.119202+07	\N	\N	\N	\N	\N
149	\N	2026-06-09 00:56:07.706779+07	\N	\N	\N	\N	\N
150	\N	2026-06-09 00:56:07.707134+07	\N	\N	\N	\N	\N
151	\N	2026-06-09 00:56:29.36612+07	\N	\N	\N	\N	\N
152	\N	2026-06-09 00:56:29.366245+07	\N	\N	\N	\N	\N
154	\N	2026-06-09 00:56:52.946028+07	\N	\N	\N	\N	\N
153	\N	2026-06-09 00:56:52.945944+07	\N	\N	\N	\N	\N
155	\N	2026-06-09 00:57:15.631911+07	\N	\N	\N	\N	\N
156	\N	2026-06-09 00:57:15.632105+07	\N	\N	\N	\N	\N
158	\N	2026-06-09 00:57:31.980049+07	\N	\N	\N	\N	\N
157	\N	2026-06-09 00:57:31.979908+07	\N	\N	\N	\N	\N
159	\N	2026-06-09 00:58:48.806606+07	\N	\N	\N	\N	\N
160	\N	2026-06-09 00:58:48.806715+07	\N	\N	\N	\N	\N
162	\N	2026-06-09 01:00:10.734185+07	\N	\N	\N	\N	\N
161	\N	2026-06-09 01:00:10.734134+07	\N	\N	\N	\N	\N
163	\N	2026-06-09 01:00:18.952697+07	\N	\N	\N	\N	\N
164	\N	2026-06-09 01:00:18.953221+07	\N	\N	\N	\N	\N
166	\N	2026-06-09 01:01:24.919382+07	\N	\N	\N	\N	\N
165	\N	2026-06-09 01:01:24.919537+07	\N	\N	\N	\N	\N
167	\N	2026-06-09 01:01:46.815678+07	\N	\N	\N	\N	\N
168	\N	2026-06-09 01:01:46.815734+07	\N	\N	\N	\N	\N
169	\N	2026-06-09 01:05:43.602385+07	\N	\N	\N	\N	\N
170	\N	2026-06-09 01:05:43.602224+07	\N	\N	\N	\N	\N
171	\N	2026-06-09 01:06:56.643874+07	\N	\N	\N	\N	\N
172	\N	2026-06-09 01:06:56.643936+07	\N	\N	\N	\N	\N
173	\N	2026-06-09 01:07:44.039654+07	\N	\N	\N	\N	\N
174	\N	2026-06-09 01:07:44.039719+07	\N	\N	\N	\N	\N
176	\N	2026-06-09 01:15:14.89951+07	\N	\N	\N	\N	\N
175	\N	2026-06-09 01:15:14.899572+07	\N	\N	\N	\N	\N
178	\N	2026-06-09 01:16:26.101703+07	\N	\N	\N	\N	\N
177	\N	2026-06-09 01:16:26.101634+07	\N	\N	\N	\N	\N
180	\N	2026-06-09 01:17:36.473821+07	\N	\N	\N	\N	\N
179	\N	2026-06-09 01:17:36.473725+07	\N	\N	\N	\N	\N
181	\N	2026-06-09 01:19:19.636594+07	\N	\N	\N	\N	\N
182	\N	2026-06-09 01:19:19.642296+07	\N	\N	\N	\N	\N
183	\N	2026-06-09 01:19:49.515603+07	\N	\N	\N	\N	\N
184	\N	2026-06-09 01:19:49.515464+07	\N	\N	\N	\N	\N
186	\N	2026-06-09 01:22:31.963879+07	\N	\N	\N	\N	\N
185	\N	2026-06-09 01:22:31.963758+07	\N	\N	\N	\N	\N
187	\N	2026-06-09 01:24:06.939912+07	\N	\N	\N	\N	\N
188	\N	2026-06-09 01:24:06.939825+07	\N	\N	\N	\N	\N
189	\N	2026-06-09 01:27:03.578601+07	\N	\N	\N	\N	\N
190	\N	2026-06-09 01:27:03.578548+07	\N	\N	\N	\N	\N
191	\N	2026-06-09 01:28:58.127086+07	\N	\N	\N	\N	\N
192	\N	2026-06-09 01:28:58.127281+07	\N	\N	\N	\N	\N
194	\N	2026-06-09 01:31:43.790553+07	\N	\N	\N	\N	\N
193	\N	2026-06-09 01:31:43.790876+07	\N	\N	\N	\N	\N
195	\N	2026-06-09 01:33:04.434502+07	\N	\N	\N	\N	\N
196	\N	2026-06-09 01:33:04.434454+07	\N	\N	\N	\N	\N
197	\N	2026-06-09 01:35:13.017422+07	\N	\N	\N	\N	\N
198	\N	2026-06-09 01:35:13.017557+07	\N	\N	\N	\N	\N
199	\N	2026-06-09 01:35:36.378991+07	\N	\N	\N	\N	\N
200	\N	2026-06-09 01:35:36.379106+07	\N	\N	\N	\N	\N
201	\N	2026-06-09 01:36:03.496532+07	\N	\N	\N	\N	\N
202	\N	2026-06-09 01:36:03.496486+07	\N	\N	\N	\N	\N
203	\N	2026-06-09 01:38:35.771087+07	\N	\N	\N	\N	\N
204	\N	2026-06-09 01:38:35.77125+07	\N	\N	\N	\N	\N
205	\N	2026-06-09 01:39:52.322026+07	\N	\N	\N	\N	\N
206	\N	2026-06-09 01:39:52.322192+07	\N	\N	\N	\N	\N
208	\N	2026-06-09 01:41:26.157372+07	\N	\N	\N	\N	\N
207	\N	2026-06-09 01:41:26.157252+07	\N	\N	\N	\N	\N
209	\N	2026-06-09 01:42:00.976306+07	\N	\N	\N	\N	\N
210	\N	2026-06-09 01:42:00.97625+07	\N	\N	\N	\N	\N
212	\N	2026-06-09 01:42:43.643088+07	\N	\N	\N	\N	\N
211	\N	2026-06-09 01:42:43.642822+07	\N	\N	\N	\N	\N
213	\N	2026-06-09 01:42:59.924928+07	\N	\N	\N	\N	\N
214	\N	2026-06-09 01:42:59.92499+07	\N	\N	\N	\N	\N
215	\N	2026-06-09 01:43:31.686273+07	\N	\N	\N	\N	\N
216	\N	2026-06-09 01:43:31.686194+07	\N	\N	\N	\N	\N
217	\N	2026-06-09 01:43:33.008306+07	\N	\N	\N	\N	\N
218	\N	2026-06-09 01:43:33.008772+07	\N	\N	\N	\N	\N
220	\N	2026-06-09 01:43:34.099388+07	\N	\N	\N	\N	\N
219	\N	2026-06-09 01:43:34.098985+07	\N	\N	\N	\N	\N
221	\N	2026-06-09 01:43:35.400227+07	\N	\N	\N	\N	\N
222	\N	2026-06-09 01:43:35.400812+07	\N	\N	\N	\N	\N
223	\N	2026-06-09 01:43:36.413162+07	\N	\N	\N	\N	\N
224	\N	2026-06-09 01:43:36.414617+07	\N	\N	\N	\N	\N
225	\N	2026-06-09 01:43:37.316118+07	\N	\N	\N	\N	\N
226	\N	2026-06-09 01:43:37.316338+07	\N	\N	\N	\N	\N
227	\N	2026-06-09 01:43:38.487256+07	\N	\N	\N	\N	\N
228	\N	2026-06-09 01:43:38.488082+07	\N	\N	\N	\N	\N
229	\N	2026-06-09 01:43:43.226806+07	\N	\N	\N	\N	\N
230	\N	2026-06-09 01:43:43.227583+07	\N	\N	\N	\N	\N
232	\N	2026-06-09 01:43:56.657123+07	\N	\N	\N	\N	\N
231	\N	2026-06-09 01:43:56.656977+07	\N	\N	\N	\N	\N
233	\N	2026-06-09 01:44:04.241925+07	\N	\N	\N	\N	\N
234	\N	2026-06-09 01:44:04.242478+07	\N	\N	\N	\N	\N
236	\N	2026-06-09 01:44:04.90061+07	\N	\N	\N	\N	\N
235	\N	2026-06-09 01:44:04.900228+07	\N	\N	\N	\N	\N
237	\N	2026-06-09 01:44:05.327523+07	\N	\N	\N	\N	\N
238	\N	2026-06-09 01:44:05.327972+07	\N	\N	\N	\N	\N
239	\N	2026-06-09 01:44:05.776498+07	\N	\N	\N	\N	\N
240	\N	2026-06-09 01:44:05.77707+07	\N	\N	\N	\N	\N
241	\N	2026-06-09 01:44:06.319358+07	\N	\N	\N	\N	\N
242	\N	2026-06-09 01:44:06.320074+07	\N	\N	\N	\N	\N
243	\N	2026-06-09 01:44:06.844068+07	\N	\N	\N	\N	\N
244	\N	2026-06-09 01:44:06.844467+07	\N	\N	\N	\N	\N
245	\N	2026-06-09 01:44:07.223747+07	\N	\N	\N	\N	\N
246	\N	2026-06-09 01:44:07.224278+07	\N	\N	\N	\N	\N
248	\N	2026-06-09 01:44:33.40873+07	\N	\N	\N	\N	\N
247	\N	2026-06-09 01:44:33.408603+07	\N	\N	\N	\N	\N
249	\N	2026-06-09 01:44:34.800019+07	\N	\N	\N	\N	\N
250	\N	2026-06-09 01:44:34.800652+07	\N	\N	\N	\N	\N
251	\N	2026-06-09 01:44:36.054534+07	\N	\N	\N	\N	\N
252	\N	2026-06-09 01:44:36.055269+07	\N	\N	\N	\N	\N
253	\N	2026-06-09 01:44:37.271357+07	\N	\N	\N	\N	\N
254	\N	2026-06-09 01:44:37.271732+07	\N	\N	\N	\N	\N
255	\N	2026-06-09 01:44:38.307015+07	\N	\N	\N	\N	\N
256	\N	2026-06-09 01:44:38.307723+07	\N	\N	\N	\N	\N
257	\N	2026-06-09 01:45:01.840741+07	\N	\N	\N	\N	\N
258	\N	2026-06-09 01:45:01.840812+07	\N	\N	\N	\N	\N
259	\N	2026-06-09 01:45:03.034554+07	\N	\N	\N	\N	\N
260	\N	2026-06-09 01:45:03.034975+07	\N	\N	\N	\N	\N
261	\N	2026-06-09 01:45:04.04331+07	\N	\N	\N	\N	\N
262	\N	2026-06-09 01:45:04.043941+07	\N	\N	\N	\N	\N
263	\N	2026-06-09 01:45:06.215737+07	\N	\N	\N	\N	\N
264	\N	2026-06-09 01:45:06.216918+07	\N	\N	\N	\N	\N
265	\N	2026-06-09 01:45:48.875824+07	\N	\N	\N	\N	\N
266	\N	2026-06-09 01:45:48.875889+07	\N	\N	\N	\N	\N
267	\N	2026-06-09 01:45:50.980609+07	\N	\N	\N	\N	\N
268	\N	2026-06-09 01:45:50.981521+07	\N	\N	\N	\N	\N
269	\N	2026-06-09 01:45:52.257288+07	\N	\N	\N	\N	\N
270	\N	2026-06-09 01:45:52.257957+07	\N	\N	\N	\N	\N
271	\N	2026-06-09 01:45:53.393348+07	\N	\N	\N	\N	\N
272	\N	2026-06-09 01:45:53.393791+07	\N	\N	\N	\N	\N
273	\N	2026-06-09 01:48:24.001182+07	\N	\N	\N	\N	\N
274	\N	2026-06-09 01:48:24.001313+07	\N	\N	\N	\N	\N
275	\N	2026-06-09 01:48:32.161856+07	\N	\N	\N	\N	\N
276	\N	2026-06-09 01:48:32.165082+07	\N	\N	\N	\N	\N
277	\N	2026-06-09 01:48:33.469354+07	\N	\N	\N	\N	\N
278	\N	2026-06-09 01:48:33.469991+07	\N	\N	\N	\N	\N
280	\N	2026-06-09 01:49:04.15176+07	\N	\N	\N	\N	\N
279	\N	2026-06-09 01:49:04.151913+07	\N	\N	\N	\N	\N
281	\N	2026-06-09 01:49:05.190375+07	\N	\N	\N	\N	\N
282	\N	2026-06-09 01:49:05.191003+07	\N	\N	\N	\N	\N
283	\N	2026-06-09 01:49:07.759946+07	\N	\N	\N	\N	\N
284	\N	2026-06-09 01:49:07.76066+07	\N	\N	\N	\N	\N
285	\N	2026-06-09 01:49:14.718654+07	\N	\N	\N	\N	\N
286	\N	2026-06-09 01:49:14.72152+07	\N	\N	\N	\N	\N
287	\N	2026-06-09 01:49:16.041307+07	\N	\N	\N	\N	\N
288	\N	2026-06-09 01:49:16.041657+07	\N	\N	\N	\N	\N
289	\N	2026-06-09 01:49:17.317872+07	\N	\N	\N	\N	\N
290	\N	2026-06-09 01:49:17.319945+07	\N	\N	\N	\N	\N
291	\N	2026-06-09 01:49:18.428695+07	\N	\N	\N	\N	\N
292	\N	2026-06-09 01:49:18.429203+07	\N	\N	\N	\N	\N
293	\N	2026-06-09 01:49:19.795863+07	\N	\N	\N	\N	\N
294	\N	2026-06-09 01:49:19.798727+07	\N	\N	\N	\N	\N
295	\N	2026-06-09 01:49:21.205219+07	\N	\N	\N	\N	\N
296	\N	2026-06-09 01:49:21.205925+07	\N	\N	\N	\N	\N
297	\N	2026-06-09 01:49:22.702863+07	\N	\N	\N	\N	\N
298	\N	2026-06-09 01:49:22.703296+07	\N	\N	\N	\N	\N
299	\N	2026-06-09 01:49:24.250103+07	\N	\N	\N	\N	\N
300	\N	2026-06-09 01:49:24.250964+07	\N	\N	\N	\N	\N
301	\N	2026-06-09 01:49:25.746573+07	\N	\N	\N	\N	\N
302	\N	2026-06-09 01:49:25.748065+07	\N	\N	\N	\N	\N
303	\N	2026-06-09 01:49:28.474615+07	\N	\N	\N	\N	\N
304	\N	2026-06-09 01:49:28.475345+07	\N	\N	\N	\N	\N
305	\N	2026-06-09 01:49:33.24373+07	\N	\N	\N	\N	\N
306	\N	2026-06-09 01:49:33.244517+07	\N	\N	\N	\N	\N
308	\N	2026-06-09 01:51:05.751266+07	\N	\N	\N	\N	\N
307	\N	2026-06-09 01:51:05.751204+07	\N	\N	\N	\N	\N
309	\N	2026-06-09 01:51:09.225315+07	\N	\N	\N	\N	\N
310	\N	2026-06-09 01:51:09.22604+07	\N	\N	\N	\N	\N
311	\N	2026-06-09 01:51:35.583938+07	\N	\N	\N	\N	\N
312	\N	2026-06-09 01:51:35.584+07	\N	\N	\N	\N	\N
313	\N	2026-06-09 01:51:37.295005+07	\N	\N	\N	\N	\N
314	\N	2026-06-09 01:51:37.29558+07	\N	\N	\N	\N	\N
315	\N	2026-06-09 01:51:38.769225+07	\N	\N	\N	\N	\N
316	\N	2026-06-09 01:51:38.769744+07	\N	\N	\N	\N	\N
317	\N	2026-06-09 01:51:40.591753+07	\N	\N	\N	\N	\N
318	\N	2026-06-09 01:51:40.592019+07	\N	\N	\N	\N	\N
320	\N	2026-06-09 01:55:46.046429+07	\N	\N	\N	\N	\N
319	\N	2026-06-09 01:55:46.046321+07	\N	\N	\N	\N	\N
321	\N	2026-06-09 01:55:47.360608+07	\N	\N	\N	\N	\N
322	\N	2026-06-09 01:55:47.361261+07	\N	\N	\N	\N	\N
323	\N	2026-06-09 01:55:50.08232+07	\N	\N	\N	\N	\N
324	\N	2026-06-09 01:55:50.082811+07	\N	\N	\N	\N	\N
325	\N	2026-06-09 01:56:35.716567+07	\N	\N	\N	\N	\N
326	\N	2026-06-09 01:56:35.7167+07	\N	\N	\N	\N	\N
327	\N	2026-06-09 01:56:36.996064+07	\N	\N	\N	\N	\N
328	\N	2026-06-09 01:56:36.998228+07	\N	\N	\N	\N	\N
329	\N	2026-06-09 01:56:37.932821+07	\N	\N	\N	\N	\N
330	\N	2026-06-09 01:56:37.93677+07	\N	\N	\N	\N	\N
332	\N	2026-06-09 01:57:08.922116+07	\N	\N	\N	\N	\N
331	\N	2026-06-09 01:57:08.92205+07	\N	\N	\N	\N	\N
333	\N	2026-06-09 01:57:09.93832+07	\N	\N	\N	\N	\N
334	\N	2026-06-09 01:57:09.940339+07	\N	\N	\N	\N	\N
335	ClJM4No	2026-06-09 02:00:49.607718+07	\N	\N	\N	\N	\N
336	ClJM4No	2026-06-09 02:00:49.607853+07	\N	\N	\N	\N	\N
337	\N	2026-06-09 02:00:55.533537+07	\N	\N	\N	\N	\N
338	\N	2026-06-09 02:00:55.537743+07	\N	\N	\N	\N	\N
339	\N	2026-06-09 02:00:57.090223+07	\N	\N	\N	\N	\N
340	\N	2026-06-09 02:00:57.093526+07	\N	\N	\N	\N	\N
341	\N	2026-06-09 02:00:58.314686+07	\N	\N	\N	\N	\N
342	\N	2026-06-09 02:00:58.316619+07	\N	\N	\N	\N	\N
343	\N	2026-06-09 02:00:59.17563+07	\N	\N	\N	\N	\N
344	\N	2026-06-09 02:00:59.17785+07	\N	\N	\N	\N	\N
345	\N	2026-06-09 02:01:00.267103+07	\N	\N	\N	\N	\N
346	\N	2026-06-09 02:01:00.269211+07	\N	\N	\N	\N	\N
348	\N	2026-06-09 02:01:31.255668+07	\N	\N	\N	\N	\N
347	\N	2026-06-09 02:01:31.255349+07	\N	\N	\N	\N	\N
349	\N	2026-06-09 02:01:32.51119+07	\N	\N	\N	\N	\N
350	\N	2026-06-09 02:01:32.513102+07	\N	\N	\N	\N	\N
351	\N	2026-06-09 02:01:48.417002+07	\N	\N	\N	\N	\N
352	\N	2026-06-09 02:01:48.417084+07	\N	\N	\N	\N	\N
353	\N	2026-06-09 02:01:49.530351+07	\N	\N	\N	\N	\N
354	\N	2026-06-09 02:01:49.536408+07	\N	\N	\N	\N	\N
355	\N	2026-06-09 02:01:50.761678+07	\N	\N	\N	\N	\N
356	\N	2026-06-09 02:01:50.763885+07	\N	\N	\N	\N	\N
357	\N	2026-06-09 02:01:51.735682+07	\N	\N	\N	\N	\N
358	\N	2026-06-09 02:01:51.737646+07	\N	\N	\N	\N	\N
359	\N	2026-06-09 02:01:52.816511+07	\N	\N	\N	\N	\N
360	\N	2026-06-09 02:01:52.818348+07	\N	\N	\N	\N	\N
361	\N	2026-06-09 02:01:53.831304+07	\N	\N	\N	\N	\N
362	\N	2026-06-09 02:01:53.833252+07	\N	\N	\N	\N	\N
363	\N	2026-06-09 02:01:54.972084+07	\N	\N	\N	\N	\N
364	\N	2026-06-09 02:01:54.974509+07	\N	\N	\N	\N	\N
365	\N	2026-06-09 02:01:55.873925+07	\N	\N	\N	\N	\N
366	\N	2026-06-09 02:01:55.876612+07	\N	\N	\N	\N	\N
367	\N	2026-06-09 02:01:56.737905+07	\N	\N	\N	\N	\N
368	\N	2026-06-09 02:01:56.740226+07	\N	\N	\N	\N	\N
369	\N	2026-06-09 02:02:15.72476+07	\N	\N	\N	\N	\N
370	\N	2026-06-09 02:02:15.72493+07	\N	\N	\N	\N	\N
371	\N	2026-06-09 02:02:50.050276+07	\N	\N	\N	\N	\N
372	\N	2026-06-09 02:02:50.050254+07	\N	\N	\N	\N	\N
373	\N	2026-06-09 02:02:58.96631+07	\N	\N	\N	\N	\N
374	\N	2026-06-09 02:02:58.968032+07	\N	\N	\N	\N	\N
375	\N	2026-06-09 02:03:07.546088+07	\N	\N	\N	\N	\N
376	\N	2026-06-09 02:03:07.547302+07	\N	\N	\N	\N	\N
377	\N	2026-06-09 02:03:33.700805+07	\N	\N	\N	\N	\N
378	\N	2026-06-09 02:03:33.700892+07	\N	\N	\N	\N	\N
379	\N	2026-06-09 02:03:54.046355+07	\N	\N	\N	\N	\N
380	\N	2026-06-09 02:03:54.046422+07	\N	\N	\N	\N	\N
381	\N	2026-06-09 02:04:17.97257+07	\N	\N	\N	\N	\N
382	\N	2026-06-09 02:04:17.97264+07	\N	\N	\N	\N	\N
383	\N	2026-06-09 02:04:43.385602+07	\N	\N	\N	\N	\N
384	\N	2026-06-09 02:04:43.385692+07	\N	\N	\N	\N	\N
385	\N	2026-06-09 02:05:56.278267+07	\N	\N	\N	\N	\N
386	\N	2026-06-09 02:05:56.278343+07	\N	\N	\N	\N	\N
387	\N	2026-06-09 02:06:43.341176+07	\N	\N	\N	\N	\N
388	\N	2026-06-09 02:06:43.341071+07	\N	\N	\N	\N	\N
389	\N	2026-06-09 02:07:14.688607+07	\N	\N	\N	\N	\N
390	\N	2026-06-09 02:07:14.689608+07	\N	\N	\N	\N	\N
392	ClJM4No	2026-06-09 02:07:43.08867+07	\N	\N	\N	\N	\N
391	ClJM4No	2026-06-09 02:07:43.088568+07	\N	\N	\N	\N	\N
393	ClJM4No	2026-06-09 02:10:06.121329+07	\N	\N	\N	\N	\N
394	ClJM4No	2026-06-09 02:10:06.121142+07	\N	\N	\N	\N	\N
395	ClJM4No	2026-06-09 02:13:09.098087+07	\N	\N	\N	\N	\N
396	ClJM4No	2026-06-09 02:13:09.100391+07	\N	\N	\N	\N	\N
397	ClJM4No	2026-06-09 02:14:18.224887+07	\N	\N	\N	\N	\N
398	ClJM4No	2026-06-09 02:14:18.226646+07	\N	\N	\N	\N	\N
400	ClJM4No	2026-06-09 02:14:27.558399+07	\N	\N	\N	\N	\N
399	ClJM4No	2026-06-09 02:14:27.559716+07	\N	\N	\N	\N	\N
401	ClJM4No	2026-06-09 02:15:51.31278+07	\N	\N	\N	\N	\N
402	ClJM4No	2026-06-09 02:15:51.312732+07	\N	\N	\N	\N	\N
404	ClJM4No	2026-06-09 02:17:05.538689+07	\N	\N	\N	\N	\N
403	ClJM4No	2026-06-09 02:17:05.538563+07	\N	\N	\N	\N	\N
405	ClJM4No	2026-06-09 02:20:17.906302+07	\N	\N	\N	\N	\N
406	ClJM4No	2026-06-09 02:20:17.906403+07	\N	\N	\N	\N	\N
407	\N	2026-06-09 02:32:13.291763+07	\N	\N	\N	\N	\N
408	\N	2026-06-09 02:32:13.291657+07	\N	\N	\N	\N	\N
409	ClJM4No	2026-06-09 02:42:18.216772+07	\N	\N	\N	\N	\N
410	ClJM4No	2026-06-09 02:42:18.216693+07	\N	\N	\N	\N	\N
411	ClJM4No	2026-06-09 02:47:16.099413+07	\N	\N	\N	\N	\N
412	ClJM4No	2026-06-09 02:47:16.130763+07	\N	\N	\N	\N	\N
413	\N	2026-06-09 03:20:02.898451+07	\N	\N	\N	\N	\N
414	ClJM4No	2026-06-09 03:20:03.568104+07	\N	\N	\N	\N	\N
415	\N	2026-06-09 03:20:13.542097+07	\N	\N	\N	\N	\N
416	\N	2026-06-09 03:20:13.554836+07	\N	\N	\N	\N	\N
417	ClJM4No	2026-06-09 03:20:13.769194+07	\N	\N	\N	\N	\N
418	ClJM4No	2026-06-09 03:20:13.772933+07	\N	\N	\N	\N	\N
419	ClJM4No	2026-06-09 03:20:15.708571+07	\N	\N	\N	\N	\N
420	ClJM4No	2026-06-09 03:20:15.713664+07	\N	\N	\N	\N	\N
421	\N	2026-06-09 03:20:15.716515+07	\N	\N	\N	\N	\N
422	\N	2026-06-09 03:20:15.720663+07	\N	\N	\N	\N	\N
423	ClJM4No	2026-06-09 03:23:25.310186+07	\N	\N	\N	\N	\N
424	ClJM4No	2026-06-09 03:23:25.342069+07	\N	\N	\N	\N	\N
425	ClJM4Nos	2026-06-09 03:23:28.45494+07	\N	\N	\N	\N	\N
426	ClJM4Nos	2026-06-09 03:23:28.457401+07	\N	\N	\N	\N	\N
427	ClJM4Nos	2026-06-09 03:27:15.302755+07	\N	\N	\N	\N	\N
428	\N	2026-06-09 03:27:15.562908+07	\N	\N	\N	\N	\N
429	ClJM4No	2026-06-09 03:27:15.563762+07	\N	\N	\N	\N	\N
431	ClJM4Nos	2026-06-09 03:28:08.099673+07	\N	\N	\N	\N	\N
430	ClJM4Nos	2026-06-09 03:28:08.099793+07	\N	\N	\N	\N	\N
432	ClJM4Nos	2026-06-09 03:28:12.580588+07	\N	\N	\N	\N	\N
433	ClJM4Nos	2026-06-09 03:28:12.583127+07	\N	\N	\N	\N	\N
434	ClJM4Nos	2026-06-09 03:28:13.423614+07	\N	\N	\N	\N	\N
435	ClJM4Nos	2026-06-09 03:28:13.424637+07	\N	\N	\N	\N	\N
436	ClJM4No	2026-06-09 03:28:51.639788+07	\N	\N	\N	\N	\N
437	ClJM4No	2026-06-09 03:28:51.662743+07	\N	\N	\N	\N	\N
438	ClJM4No	2026-06-09 03:28:58.637611+07	\N	\N	\N	\N	\N
439	ClJM4No	2026-06-09 03:28:58.638773+07	\N	\N	\N	\N	\N
440	ClJM4No	2026-06-09 03:29:11.410369+07	\N	\N	\N	\N	\N
441	ClJM4No	2026-06-09 03:29:11.444183+07	\N	\N	\N	\N	\N
442	ClJM4Nos	2026-06-09 03:29:14.243185+07	\N	\N	\N	\N	\N
443	ClJM4Nos	2026-06-09 03:29:14.274334+07	\N	\N	\N	\N	\N
444	ClJM4Nos	2026-06-09 03:31:14.304219+07	\N	\N	\N	\N	\N
445	ClJM4Nos	2026-06-09 03:31:14.331059+07	\N	\N	\N	\N	\N
446	\N	2026-06-09 03:31:19.133615+07	\N	\N	\N	\N	\N
447	\N	2026-06-09 03:31:19.137323+07	\N	\N	\N	\N	\N
448	Ms8B8qg	2026-05-27 13:03:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; Android) Safari/100.0	Mobile	Safari	Android
449	WWVYYe0	2026-05-27 16:53:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Desktop; Windows) Chrome/100.0	Desktop	Chrome	Windows
450	sHSNSgE	2026-05-27 19:03:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; iOS) Safari/100.0	Mobile	Safari	iOS
451	\N	2026-05-28 20:33:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
452	\N	2026-05-28 15:52:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
453	R0z5x3I	2026-05-29 19:16:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
454	fUdc8N8	2026-05-29 12:17:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Tablet; Android) Chrome/100.0	Tablet	Chrome	Android
455	\N	2026-05-29 16:46:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Desktop; macOS) Chrome/100.0	Desktop	Chrome	macOS
456	\N	2026-05-29 08:14:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Tablet; iOS) Chrome/100.0	Tablet	Chrome	iOS
457	WWVYYe0	2026-05-30 17:37:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Mobile; Android) Edge/100.0	Mobile	Edge	Android
458	aZ0MeRI	2026-05-30 10:22:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; Android) Firefox/100.0	Mobile	Firefox	Android
459	SCaAZqs	2026-05-30 17:23:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Tablet; Android) Safari/100.0	Tablet	Safari	Android
460	\N	2026-05-30 21:25:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Desktop; Windows) Safari/100.0	Desktop	Safari	Windows
461	\N	2026-05-31 18:47:44.376+07	180.252.88.109	Mozilla/5.0 (Dummy; Mobile; Android) Firefox/100.0	Mobile	Firefox	Android
462	1KbawZQ	2026-05-31 09:49:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
463	\N	2026-05-31 16:34:44.376+07	110.138.80.22	Mozilla/5.0 (Dummy; Mobile; Android) Safari/100.0	Mobile	Safari	Android
464	\N	2026-05-31 21:45:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Mobile; iOS) Edge/100.0	Mobile	Edge	iOS
465	_ZEANZc	2026-05-31 21:09:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
466	R0z5x3I	2026-05-31 15:59:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; Android) Safari/100.0	Mobile	Safari	Android
467	\N	2026-05-31 12:53:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
468	\N	2026-06-01 09:03:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Desktop; macOS) Chrome/100.0	Desktop	Chrome	macOS
469	\N	2026-06-01 11:33:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
470	cEiBCBg	2026-06-01 18:46:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Desktop; Windows) Chrome/100.0	Desktop	Chrome	Windows
471	Xf_NOGw	2026-06-01 10:59:44.376+07	180.252.88.109	Mozilla/5.0 (Dummy; Mobile; iOS) Edge/100.0	Mobile	Edge	iOS
472	aZ0MeRI	2026-06-01 16:15:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
473	\N	2026-06-01 13:19:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Desktop; Windows) Chrome/100.0	Desktop	Chrome	Windows
474	Xf_NOGw	2026-06-01 17:38:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
475	SCaAZqs	2026-06-01 11:31:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
476	\N	2026-06-01 08:24:44.376+07	110.138.80.22	Mozilla/5.0 (Dummy; Desktop; Windows) Safari/100.0	Desktop	Safari	Windows
477	1KbawZQ	2026-06-02 20:57:44.376+07	110.138.80.22	Mozilla/5.0 (Dummy; Desktop; macOS) Chrome/100.0	Desktop	Chrome	macOS
478	aSXTZvY	2026-06-02 08:26:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; iOS) Safari/100.0	Mobile	Safari	iOS
479	1KbawZQ	2026-06-02 14:38:44.376+07	180.252.88.109	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
480	\N	2026-06-02 20:01:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Tablet; Android) Chrome/100.0	Tablet	Chrome	Android
481	SCaAZqs	2026-06-02 19:05:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Tablet; iOS) Chrome/100.0	Tablet	Chrome	iOS
482	sHSNSgE	2026-06-03 18:42:44.376+07	180.252.88.109	Mozilla/5.0 (Dummy; Mobile; iOS) Firefox/100.0	Mobile	Firefox	iOS
483	sHSNSgE	2026-06-03 15:50:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Mobile; Android) Firefox/100.0	Mobile	Firefox	Android
484	\N	2026-06-03 19:29:44.376+07	110.138.80.22	Mozilla/5.0 (Dummy; Tablet; iOS) Chrome/100.0	Tablet	Chrome	iOS
485	Ms8B8qg	2026-06-03 19:33:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Mobile; Android) Firefox/100.0	Mobile	Firefox	Android
486	aZ0MeRI	2026-06-03 21:10:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Desktop; macOS) Safari/100.0	Desktop	Safari	macOS
487	\N	2026-06-03 10:44:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Desktop; Windows) Chrome/100.0	Desktop	Chrome	Windows
488	\N	2026-06-04 21:17:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; iOS) Safari/100.0	Mobile	Safari	iOS
489	aZ0MeRI	2026-06-04 10:37:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Tablet; Android) Firefox/100.0	Tablet	Firefox	Android
490	fUdc8N8	2026-06-05 17:36:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Desktop; Linux) Chrome/100.0	Desktop	Chrome	Linux
491	\N	2026-06-05 19:29:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Tablet; Android) Chrome/100.0	Tablet	Chrome	Android
492	fUdc8N8	2026-06-05 18:56:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; Android) Safari/100.0	Mobile	Safari	Android
493	fUdc8N8	2026-06-05 13:33:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Mobile; Android) Edge/100.0	Mobile	Edge	Android
494	WWVYYe0	2026-06-05 09:30:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; Android) Edge/100.0	Mobile	Edge	Android
495	aZ0MeRI	2026-06-05 10:34:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Mobile; iOS) Edge/100.0	Mobile	Edge	iOS
496	\N	2026-06-05 12:43:44.376+07	110.138.80.22	Mozilla/5.0 (Dummy; Mobile; iOS) Safari/100.0	Mobile	Safari	iOS
497	fUdc8N8	2026-06-05 13:37:44.376+07	110.138.80.22	Mozilla/5.0 (Dummy; Tablet; iOS) Safari/100.0	Tablet	Safari	iOS
498	\N	2026-06-06 19:25:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Mobile; iOS) Safari/100.0	Mobile	Safari	iOS
499	\N	2026-06-06 09:06:44.376+07	110.138.80.22	Mozilla/5.0 (Dummy; Desktop; Linux) Chrome/100.0	Desktop	Chrome	Linux
500	SCaAZqs	2026-06-07 11:19:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
501	\N	2026-06-07 09:05:44.376+07	180.252.88.109	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
502	_ZEANZc	2026-06-08 13:27:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Mobile; iOS) Firefox/100.0	Mobile	Firefox	iOS
503	Xf_NOGw	2026-06-08 14:33:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
504	aSXTZvY	2026-06-08 14:21:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Tablet; iOS) Chrome/100.0	Tablet	Chrome	iOS
505	\N	2026-06-08 17:13:44.376+07	114.122.14.55	Mozilla/5.0 (Dummy; Mobile; Android) Firefox/100.0	Mobile	Firefox	Android
506	\N	2026-06-08 13:20:44.376+07	180.252.88.109	Mozilla/5.0 (Dummy; Tablet; iOS) Edge/100.0	Tablet	Edge	iOS
507	\N	2026-06-08 17:18:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
508	R0z5x3I	2026-06-08 15:39:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
509	_wwUKOE	2026-06-09 19:47:44.376+07	180.252.88.109	Mozilla/5.0 (Dummy; Tablet; Android) Edge/100.0	Tablet	Edge	Android
510	\N	2026-06-09 20:27:44.376+07	182.253.11.90	Mozilla/5.0 (Dummy; Mobile; iOS) Safari/100.0	Mobile	Safari	iOS
511	sHSNSgE	2026-06-09 20:04:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Desktop; macOS) Firefox/100.0	Desktop	Firefox	macOS
512	Xf_NOGw	2026-06-09 17:01:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Tablet; Android) Chrome/100.0	Tablet	Chrome	Android
513	R0z5x3I	2026-06-09 16:56:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; Android) Chrome/100.0	Mobile	Chrome	Android
514	\N	2026-06-09 21:50:44.376+07	36.72.215.12	Mozilla/5.0 (Dummy; Desktop; Windows) Safari/100.0	Desktop	Safari	Windows
515	\N	2026-06-09 12:52:44.376+07	103.144.15.19	Mozilla/5.0 (Dummy; Mobile; iOS) Chrome/100.0	Mobile	Chrome	iOS
516	cEiBCBg	2026-06-09 11:10:44.376+07	125.165.110.4	Mozilla/5.0 (Dummy; Tablet; iOS) Chrome/100.0	Tablet	Chrome	iOS
518	ClJM4No	2026-06-09 04:21:11.199137+07	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	Mobile	Chrome	Android
517	ClJM4No	2026-06-09 04:21:11.199052+07	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	Mobile	Chrome	Android
519	ClJM4No	2026-06-09 04:27:33.703926+07	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	Mobile	Chrome	Android
520	ClJM4No	2026-06-09 04:27:33.704629+07	127.0.0.1	Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36	Mobile	Chrome	Android
521	\N	2026-06-09 04:34:09.796217+07	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	Desktop	Chrome	macOS
522	\N	2026-06-09 04:34:09.796517+07	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	Desktop	Chrome	macOS
\.


--
-- Data for Name: rsvp; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rsvp (id, name, attend, guests, wish, "createdAt", slug, visible) FROM stdin;
1	Budi Santoso	EXCITED TO ATTEND	2	Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah mawaddah wa rahmah.	2026-06-08 07:18:23.693	FqERx0Q	t
2	Dewi Rahayu	EXCITED TO ATTEND	2	Bahagia selalu ya, semoga langgeng sampai kakek nenek!	2026-06-08 07:18:23.695	Hbc5rJs	t
3	Andi Wijaya	EXCITED TO ATTEND	1	Congrats bro! Akhirnya jadian juga haha. Selamat ya!	2026-06-08 07:18:23.695	uTRrVUQ	t
4	Sari Putri	EXCITED TO ATTEND	1	Semoga rumah tangganya penuh kasih sayang dan keberkahan. Bahagia selalu!	2026-06-08 07:18:23.695	wDQpDUA	t
5	Reza Firmansyah	Mungkin Datang	1		2026-06-08 07:18:23.696	oZ_KQWo	t
7	Hendra Pratama	Tidak Hadir	1	Mohon maaf tidak bisa hadir. Selamat ya, semoga bahagia selalu!	2026-06-08 07:18:23.696	dKxRRpc	t
8	Yuni Astuti	EXCITED TO ATTEND	2		2026-06-08 07:18:23.696	W2prO_A	t
9	Mega Lestari	EXCITED TO ATTEND	1	Wah akhirnya! Selamat ya, semoga jadi keluarga yang bahagia dan harmonis.	2026-06-08 07:18:23.696	Fi1ao1o	t
10	Fajar Nugroho	Mungkin Datang	1	Insya Allah hadir, selamat menempuh hidup baru!	2026-06-08 07:18:23.697	iN2Cb58	t
11	Rina Marlina	EXCITED TO ATTEND	3	Selamat ya adikku tersayang, semoga Allah memberkahi pernikahanmu.	2026-06-08 07:18:23.697	lpsBSiM	t
12	Nita Andriani	Tidak Hadir	1	Tidak bisa hadir tapi doaku selalu menyertai kalian berdua.	2026-06-08 07:18:23.697	9oxLors	t
13	Ahmad Rizki	EXCITED TO ATTEND	2	Semoga menjadi pasangan yang saling melengkapi dan selalu bersyukur.	2026-06-08 07:18:23.697	\N	t
14	Sinta Dewi	EXCITED TO ATTEND	1	Cantik banget undangannya! Selamat ya, semoga bahagia dunia akhirat.	2026-06-08 07:18:23.697	\N	t
15	Tomi Halim	Mungkin Datang	1	Doaku untuk kalian berdua, semoga selalu rukun dan bahagia.	2026-06-08 07:18:23.698	\N	t
16	Ratna Sari	EXCITED TO ATTEND	2		2026-06-08 07:18:23.698	\N	t
17	Eko Prasetyo	EXCITED TO ATTEND	1	Selamat! Semoga menjadi keluarga yang penuh cinta dan tawa.	2026-06-08 07:18:23.698	\N	t
6	Linda Kusuma	EXCITED TO ATTEND	1	Selamat berbahagia, semoga pernikahan kalian menjadi awal dari kehidupan yang lebih indah.	2026-06-08 07:18:23.696	UTD7i1k	t
18	Test User	EXCITED TO ATTEND	1	Test wish	2026-06-08 17:43:27.643	\N	t
19	Budi Santoso	EXCITED TO ATTEND	2	Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah mawaddah wa rahmah.	2026-06-09 04:18:44.369	Ms8B8qg	t
20	Dewi Rahayu	EXCITED TO ATTEND	2	Bahagia selalu ya, semoga langgeng sampai kakek nenek!	2026-06-09 04:18:44.374	Xf_NOGw	t
21	Andi Wijaya	EXCITED TO ATTEND	1	Congrats bro! Akhirnya jadian juga haha. Selamat ya!	2026-06-09 04:18:44.374	aZ0MeRI	t
22	Sari Putri	EXCITED TO ATTEND	1	Semoga rumah tangganya penuh kasih sayang dan keberkahan. Bahagia selalu!	2026-06-09 04:18:44.374	DSzxDrM	t
23	Reza Firmansyah	Mungkin Datang	1		2026-06-09 04:18:44.374	R0z5x3I	t
24	Linda Kusuma	EXCITED TO ATTEND	1	Selamat berbahagia, semoga pernikahan kalian menjadi awal dari kehidupan yang lebih indah.	2026-06-09 04:18:44.375	SCaAZqs	t
25	Hendra Pratama	Tidak Hadir	1	Mohon maaf tidak bisa hadir. Selamat ya, semoga bahagia selalu!	2026-06-09 04:18:44.375	WWVYYe0	t
26	Yuni Astuti	EXCITED TO ATTEND	2		2026-06-09 04:18:44.375	aSXTZvY	t
27	Mega Lestari	EXCITED TO ATTEND	1	Wah akhirnya! Selamat ya, semoga jadi keluarga yang bahagia dan harmonis.	2026-06-09 04:18:44.375	1KbawZQ	t
28	Fajar Nugroho	Mungkin Datang	1	Insya Allah hadir, selamat menempuh hidup baru!	2026-06-09 04:18:44.376	fUdc8N8	t
29	Rina Marlina	EXCITED TO ATTEND	3	Selamat ya adikku tersayang, semoga Allah memberkahi pernikahanmu.	2026-06-09 04:18:44.376	_wwUKOE	t
30	Nita Andriani	Tidak Hadir	1	Tidak bisa hadir tapi doaku selalu menyertai kalian berdua.	2026-06-09 04:18:44.376	aqIpoEQ	t
31	Ahmad Rizki	EXCITED TO ATTEND	2	Semoga menjadi pasangan yang saling melengkapi dan selalu bersyukur.	2026-06-09 04:18:44.376	\N	t
32	Sinta Dewi	EXCITED TO ATTEND	1	Cantik banget undangannya! Selamat ya, semoga bahagia dunia akhirat.	2026-06-09 04:18:44.376	\N	t
33	Tomi Halim	Mungkin Datang	1	Doaku untuk kalian berdua, semoga selalu rukun dan bahagia.	2026-06-09 04:18:44.376	\N	t
34	Ratna Sari	EXCITED TO ATTEND	2		2026-06-09 04:18:44.376	\N	t
35	Eko Prasetyo	EXCITED TO ATTEND	1	Selamat! Semoga menjadi keluarga yang penuh cinta dan tawa.	2026-06-09 04:18:44.376	\N	t
\.


--
-- Data for Name: wedding_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wedding_config (id, data, "updatedAt") FROM stdin;
1	{"gift": {"title": "Wedding Gift", "accounts": [{"bankName": "Groove Public", "bankType": "Bank BCA", "accountNumber": "00008888123"}, {"bankName": "Groove Public Invitation", "bankType": "Bank BCA", "accountNumber": "00008888123"}, {"bankName": "Groove Public Invitation", "bankType": "Bank Mandiri", "accountNumber": "00008888123"}], "popupTitle": "Konfirmasi Hadiah", "description": "Your love and prayers are the greatest gifts. For those who wish to send a token of affection, you may use the details below:", "popupLabelBank": "Bank Tujuan", "popupLabelName": "Nama Lengkap", "popupLabelNote": "Catatan", "popupSubmitText": "Kirim Konfirmasi", "popupLabelAmount": "Jumlah", "confirmButtonText": "Konfirmasi Hadiah"}, "hero": {"vow": "Two souls, one heart — bound together by love, faith, and an unending promise.", "date": "Monday, 16 June 2026", "dear": "Dear", "name1": "Riskitall", "name2": "Adel", "connector": "and", "openButton": "LET'S OPEN", "apologyText": "We apologize if there is any misspelling of name or title", "inviteTitle": "WE INVITE YOU TO CELEBRATE", "previewImage": "/assets/images/Timeless-00025-1.jpg", "backgroundImage": "/assets/images/Timeless-00025-1.jpg", "backgroundVideo": "/assets/media/Hanson-Catherine-CoupleSession.mp4", "backgroundOverlayImage": "/assets/images/Timeless-00036.jpg"}, "rsvp": {"title": "Kindly Confirm Your Presence And Share Your Blessings", "maxGuests": 2, "guestLabel": "No of Guest", "maybeLabel": "MAYBE", "description": "Your presence would mean everything to us. Please take a moment to let us know if you can join our celebration, and feel free to share your warm wishes for our journey ahead.", "unableLabel": "UNABLE ATTEND", "successMessage": "Terima kasih! RSVP kamu sudah kami terima. Sampai jumpa di hari istimewa kami.", "attendanceLabel": "EXCITED TO ATTEND", "submitButtonText": "Send"}, "audio": {"track": "/assets/media/YOU-by-Morgan-Saint.mp3", "endTime": 0, "startTime": 0}, "bride": {"image": "/assets/images/Timeless-00011.jpg", "title": "The Bride", "lastName": "Natalie", "relation": "The Daughter of", "firstName": "Adel", "facebookUrl": "", "tiktokUsername": "", "twitterUsername": "", "instagramUsername": "catherine", "relationDescription": "Grace, laughter, and love — three words that perfectly describe Catherine. Born into a family that values togetherness, she carries warmth in everything she does. The moment she met Hanson, she knew their story was only just beginning."}, "event": {"date": "MONDAY, 16 JUNE 2026", "ceremony": {"time": "At 08.00 - 09.00 AM", "title": "Holy Matrimony", "address": "Jl. Taman Palem Lestari No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia", "mapsUrl": "https://maps.app.goo.gl/eQ7KQhBcJkEZdGDt7", "location": "The Garden Grille"}, "reception": {"time": "At 11.00 AM - 02.00 PM", "title": "Reception", "address": "Jl. Taman Palem Lestari No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia", "mapsUrl": "https://maps.app.goo.gl/eQ7KQhBcJkEZdGDt7", "location": "The Garden Grille"}}, "groom": {"image": "/assets/images/Timeless-060010.jpg", "title": "The Groom", "lastName": "Hartawan", "relation": "The Son of", "firstName": "Riskitall", "facebookUrl": "", "tiktokUsername": "", "twitterUsername": "", "instagramUsername": "hanson", "relationDescription": "A dedicated professional with a heart full of warmth, Hanson is known for his calm presence and unwavering devotion. He fell in love with Catherine's kindness and knew from the very first moment that she was the one."}, "share": {"ogImage": "/assets/images/Timeless-00036.jpg", "ogTitle": "Undangan Pernikahan", "ogDescription": "Kami mengundangmu untuk merayakan hari istimewa kami. Klik tautan undangan untuk melihat detail acara dan RSVP.", "whatsappTemplate": "Halo {{name}},\\n\\nKami mengundangmu untuk hadir di pernikahan kami. Silakan buka undangan lewat link berikut:\\n{{link}}\\n\\nTolong konfirmasi ya, kami menantikan kehadiranmu."}, "gallery": {"quote": "Every love story is beautiful, but ours is my favorite. Through the highs and lows, our love grows stronger and deeper with each passing day.", "title": "Unveiling\\nOur Prewedding Story", "images": ["/assets/images/Timeless-00028.jpg", "/assets/images/Timeless-00013.jpg", "/assets/images/Timeless-00024.jpg", "/assets/images/Timeless-00002-1.jpg", "/assets/images/Timeless-00042.jpg", "/assets/images/Timeless-00001.jpg", "/assets/images/Timeless-00043-1.jpg", "/assets/images/Timeless-00045.jpg", "/assets/images/Timeless-00019.jpg", "/assets/images/Timeless-00003-1.jpg", "/assets/images/Timeless-00030-1.jpg", "/assets/images/Timeless-00033.jpg"], "columns": [{"images": ["/assets/images/Timeless-00028.jpg", "/assets/images/Timeless-00013.jpg", "/assets/images/Timeless-00024.jpg", "/assets/images/Timeless-00002-1.jpg"]}, {"images": ["/assets/images/Timeless-00042.jpg", "/assets/images/Timeless-00001.jpg", "/assets/images/Timeless-00043-1.jpg", "/assets/images/Timeless-00045.jpg"]}, {"images": ["/assets/images/Timeless-00019.jpg", "/assets/images/Timeless-00003-1.jpg", "/assets/images/Timeless-00030-1.jpg", "/assets/images/Timeless-00033.jpg"]}], "videoFile": "/assets/uploads/1780917153444-7p8mduqmds3.mp4", "videoThumb": ""}, "profile": {"quoteText": "I have loved you so much, with such folly and excess — you have become the very center of my being, and I have forgotten everything else in the world but you.", "coupleImage": "/assets/images/Timeless-00025-1.jpg", "coupleNames": "Riskitall & Adel", "quoteSource": "Gustave Flaubert"}, "sections": [{"id": "intro", "label": "Intro", "visible": true, "component": "SectionIntro"}, {"id": "profileIntro", "label": "Profile Intro", "visible": true, "component": "SectionProfileIntro"}, {"id": "groom", "label": "Groom", "visible": true, "component": "SectionGroom"}, {"id": "bride", "label": "Bride", "visible": true, "component": "SectionBride"}, {"id": "loveStory", "label": "Love Story", "visible": true, "component": "SectionLoveStory"}, {"id": "countdown", "label": "Countdown", "visible": true, "component": "SectionCountdown"}, {"id": "event", "label": "Event", "visible": true, "component": "SectionEvent"}, {"id": "livestream", "label": "Livestream", "visible": true, "component": "SectionLivestream"}, {"id": "dressCode", "label": "Dress Code", "visible": true, "component": "SectionDressCode"}, {"id": "rsvp", "label": "RSVP", "visible": true, "component": "SectionRSVP"}, {"id": "wishes", "label": "Wishes", "visible": true, "component": "SectionWishes"}, {"id": "gift", "label": "Gift", "visible": true, "component": "SectionGift"}, {"id": "gallery", "label": "Gallery", "visible": true, "component": "SectionGallery"}, {"id": "thankYou", "label": "Thank You", "visible": true, "component": "SectionThankYou"}], "thankYou": {"note": "Your presence and blessings mean the world to us. Thank you for being part of our most cherished day — we are truly honored to celebrate with you.", "title": "With Gratitude & Love", "message": "Riskitall & Adel"}, "countdown": {"date": "2026-06-16T08:00:00+07:00", "image": "/assets/images/Timeless-00046.jpg", "message": "Almost Time For Our Celebration"}, "dressCode": {"text": "WE KINDLY ENCOURAGE OUR GUESTS TO WEAR THESE COLORS FOR OUR SPECIAL DAY", "title": "Dress Code", "colors": [{"hex": "#dbd6d3", "label": "Warm White"}, {"hex": "#2a211c", "label": "Dark Espresso"}, {"hex": "#806f5f", "label": "Warm Taupe"}, {"hex": "#bca8a0", "label": "Dusty Rose"}]}, "loveStory": {"chapters": [{"date": "September 202X", "image": "/assets/images/Timeless-00023.jpg", "title": "When Two Worlds Met", "description": "202x, we started our journey as two individuals who were just getting to know each other. We were excited to explore what the future held for us and were eager to see where our paths would lead."}, {"date": "January 202X", "image": "/assets/images/Timeless-00021.jpg", "title": "Growing Together Through It All", "description": "In 202x, we continued our journey, facing challenges and obstacles along the way. We learned how to communicate effectively and work together as a team, and our relationship grew stronger as a result."}, {"date": "December 202X", "image": "/assets/images/Timeless-00034-1.jpg", "title": "The Beginning of Forever", "description": "And now, in 202x, we have reached the pinnacle of our journey – marriage. It has been a joyous and exciting ride filled with laughter, love, and endless possibilities. We have made countless memories together, from our first date to our engagement, and now our wedding day. Our journey has been a fulfilling one, and we are grateful for every moment we have shared. We look forward to continuing our adventure as a married couple."}], "sectionLabel": "Love Story", "sectionTitle": "Our Journey Together"}, "livestream": {"url": "", "date": "Monday, 16 June 2026", "image": "/assets/images/Timeless-00016-1.jpg", "title": "Can't make it in person? Join us live and celebrate with us from wherever you are.", "buttonText": "Join Now"}}	2026-06-09 04:07:28.05
\.


--
-- Data for Name: wishes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishes (id, name, message, "createdAt") FROM stdin;
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_id_seq', 2, true);


--
-- Name: guests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.guests_id_seq', 31, true);


--
-- Name: page_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.page_visits_id_seq', 522, true);


--
-- Name: rsvp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rsvp_id_seq', 35, true);


--
-- Name: wishes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishes_id_seq', 1, false);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: guests guests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_pkey PRIMARY KEY (id);


--
-- Name: guests guests_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guests
    ADD CONSTRAINT guests_slug_key UNIQUE (slug);


--
-- Name: page_visits page_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_visits
    ADD CONSTRAINT page_visits_pkey PRIMARY KEY (id);


--
-- Name: rsvp rsvp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rsvp
    ADD CONSTRAINT rsvp_pkey PRIMARY KEY (id);


--
-- Name: wedding_config wedding_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wedding_config
    ADD CONSTRAINT wedding_config_pkey PRIMARY KEY (id);


--
-- Name: wishes wishes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishes
    ADD CONSTRAINT wishes_pkey PRIMARY KEY (id);


--
-- Name: admins_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX admins_username_key ON public.admins USING btree (username);


--
-- Name: idx_guests_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guests_category ON public.guests USING btree (category);


--
-- Name: idx_guests_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_guests_slug ON public.guests USING btree (slug) WHERE (slug IS NOT NULL);


--
-- Name: idx_page_visits_visited_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_page_visits_visited_at ON public.page_visits USING btree (visited_at);


--
-- Name: idx_rsvp_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rsvp_slug ON public.rsvp USING btree (slug) WHERE (slug IS NOT NULL);


--
-- Name: idx_rsvp_visible_wish; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_rsvp_visible_wish ON public.rsvp USING btree (visible, "createdAt" DESC) WHERE ((wish IS NOT NULL) AND (wish <> ''::text));


--
-- PostgreSQL database dump complete
--

\unrestrict W11Mxp1XO2KUgQZDfJDv9dYdCtDA6ub6qlheQAHZpAUFghfSud6yvZakFxvqBOQ

