--
-- PostgreSQL database dump
--

\restrict emALMAanOdhD4bhYmrf1grAHQZcGLH945gfwXhYhQdtIp15p50UuxDitPnom8wQ

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

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
-- Name: courses; Type: TABLE; Schema: public; Owner: aichurekasylbek
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    credits integer DEFAULT 3,
    enrollment_limit integer DEFAULT 20
);


ALTER TABLE public.courses OWNER TO aichurekasylbek;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: aichurekasylbek
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO aichurekasylbek;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aichurekasylbek
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: enrollments; Type: TABLE; Schema: public; Owner: aichurekasylbek
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    student_id integer,
    course_id integer,
    date_enrolled timestamp without time zone DEFAULT now()
);


ALTER TABLE public.enrollments OWNER TO aichurekasylbek;

--
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: aichurekasylbek
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.enrollments_id_seq OWNER TO aichurekasylbek;

--
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aichurekasylbek
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- Name: grades; Type: TABLE; Schema: public; Owner: aichurekasylbek
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    student_id integer,
    course_id integer,
    grade character varying(2),
    date_assigned timestamp without time zone DEFAULT now()
);


ALTER TABLE public.grades OWNER TO aichurekasylbek;

--
-- Name: grades_id_seq; Type: SEQUENCE; Schema: public; Owner: aichurekasylbek
--

CREATE SEQUENCE public.grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grades_id_seq OWNER TO aichurekasylbek;

--
-- Name: grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aichurekasylbek
--

ALTER SEQUENCE public.grades_id_seq OWNED BY public.grades.id;


--
-- Name: prerequisites; Type: TABLE; Schema: public; Owner: aichurekasylbek
--

CREATE TABLE public.prerequisites (
    id integer NOT NULL,
    course_id integer,
    prerequisite_id integer
);


ALTER TABLE public.prerequisites OWNER TO aichurekasylbek;

--
-- Name: prerequisites_id_seq; Type: SEQUENCE; Schema: public; Owner: aichurekasylbek
--

CREATE SEQUENCE public.prerequisites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.prerequisites_id_seq OWNER TO aichurekasylbek;

--
-- Name: prerequisites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aichurekasylbek
--

ALTER SEQUENCE public.prerequisites_id_seq OWNED BY public.prerequisites.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: aichurekasylbek
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(100) NOT NULL,
    password character varying(100),
    role character varying(20),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['student'::character varying, 'teacher'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO aichurekasylbek;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: aichurekasylbek
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO aichurekasylbek;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: aichurekasylbek
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- Name: grades id; Type: DEFAULT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.grades ALTER COLUMN id SET DEFAULT nextval('public.grades_id_seq'::regclass);


--
-- Name: prerequisites id; Type: DEFAULT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.prerequisites ALTER COLUMN id SET DEFAULT nextval('public.prerequisites_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: aichurekasylbek
--

COPY public.courses (id, name, credits, enrollment_limit) FROM stdin;
1	HTML Basics	3	25
2	CSS Styling	3	25
3	JavaScript Fundamentals	3	30
4	React Essentials	4	20
5	Node.js & Express	4	20
6	Databases with PostgreSQL	3	15
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: aichurekasylbek
--

COPY public.enrollments (id, student_id, course_id, date_enrolled) FROM stdin;
1	1	1	2025-10-24 19:42:30.637008
2	2	1	2025-10-24 19:42:30.637008
3	1	2	2025-10-24 19:42:30.637008
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: aichurekasylbek
--

COPY public.grades (id, student_id, course_id, grade, date_assigned) FROM stdin;
1	1	1	A	2025-10-24 19:05:59.406132
2	2	2	B+	2025-10-24 19:05:59.406132
3	1	3	A-	2025-10-24 19:05:59.406132
4	1	1	A	2025-10-24 19:47:51.977017
5	1	2	B+	2025-10-24 19:47:51.977017
6	2	1	A-	2025-10-24 19:47:51.977017
\.


--
-- Data for Name: prerequisites; Type: TABLE DATA; Schema: public; Owner: aichurekasylbek
--

COPY public.prerequisites (id, course_id, prerequisite_id) FROM stdin;
1	2	1
2	3	2
3	4	3
4	5	3
5	6	5
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: aichurekasylbek
--

COPY public.users (id, name, email, password, role) FROM stdin;
1	Adam Salamat	adam@viva.com	1234	student
2	Maria Torres	maria@viva.com	abcd	student
3	Ms. Johnson	johnson@viva.com	teach1	teacher
4	Mrs. Garner	garner@viva.com	teach2	teacher
\.


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aichurekasylbek
--

SELECT pg_catalog.setval('public.courses_id_seq', 6, true);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aichurekasylbek
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 3, true);


--
-- Name: grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aichurekasylbek
--

SELECT pg_catalog.setval('public.grades_id_seq', 6, true);


--
-- Name: prerequisites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aichurekasylbek
--

SELECT pg_catalog.setval('public.prerequisites_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: aichurekasylbek
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: prerequisites prerequisites_pkey; Type: CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: enrollments enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: grades grades_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: grades grades_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- Name: prerequisites prerequisites_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: prerequisites prerequisites_prerequisite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aichurekasylbek
--

ALTER TABLE ONLY public.prerequisites
    ADD CONSTRAINT prerequisites_prerequisite_id_fkey FOREIGN KEY (prerequisite_id) REFERENCES public.courses(id);


--
-- PostgreSQL database dump complete
--

\unrestrict emALMAanOdhD4bhYmrf1grAHQZcGLH945gfwXhYhQdtIp15p50UuxDitPnom8wQ

