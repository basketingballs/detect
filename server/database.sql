--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)

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

--
-- Name: check_account_references(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_account_references() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM doctor WHERE account_id = NEW.account_id
    UNION ALL
    SELECT 1 FROM sys_admin WHERE account_id = NEW.account_id
  ) THEN
    RAISE EXCEPTION 'The inserted account value is already in use';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_account_references() OWNER TO postgres;

--
-- Name: check_done_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_done_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF  OLD.status = '4'
  AND
  OLD.status <> NEW.status
   
  THEN
    RAISE EXCEPTION 'cannot revert what is marked as done';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_done_status() OWNER TO postgres;

--
-- Name: check_person_references(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_person_references() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM doctor WHERE person_id = NEW.person_id
    UNION ALL
    SELECT 1 FROM sys_admin WHERE person_id = NEW.person_id
  ) THEN
    RAISE EXCEPTION 'The inserted account value is already in use';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_person_references() OWNER TO postgres;

--
-- Name: check_unit_camp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_unit_camp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF  
  NEW.status = 1
  AND
  EXISTS (
    SELECT 1 FROM camp_unit WHERE status = 1 AND unit_id = NEW.unit_id
    )
   
  THEN
    UPDATE camp_unit SET status = 4 WHERE status =1 AND unit_id = NEW.unit_id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_unit_camp() OWNER TO postgres;

--
-- Name: delete_parents(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_parents() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM account WHERE account_id = OLD.account_id;
  DELETE FROM person WHERE id = OLD.person_id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.delete_parents() OWNER TO postgres;

--
-- Name: delete_parents_subject(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_parents_subject() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM person WHERE id = OLD.person_id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.delete_parents_subject() OWNER TO postgres;

--
-- Name: prevent_update_account(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_update_account() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.account_id <> OLD.account_id THEN
    RAISE EXCEPTION 'The account_id column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_update_account() OWNER TO postgres;

--
-- Name: prevent_update_account_type(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_update_account_type() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.account_type <> OLD.account_type THEN
    RAISE EXCEPTION 'The account_type column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_update_account_type() OWNER TO postgres;

--
-- Name: prevent_update_person(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_update_person() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.person_id <> OLD.person_id THEN
    RAISE EXCEPTION 'The person column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_update_person() OWNER TO postgres;

--
-- Name: prevent_update_unit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_update_unit() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.static_location_id <> OLD.static_location_id THEN
    RAISE EXCEPTION 'The person column cannot be modified.';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_update_unit() OWNER TO postgres;

--
-- Name: set_end_date(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_end_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.status = 4 AND NEW.status <> OLD.status THEN
    NEW.end_date := CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_end_date() OWNER TO postgres;

--
-- Name: set_unit_status(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_unit_status() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF  NEW.status = 4 AND NEW.status <> OLD.status
  THEN
    UPDATE unit_doc SET status = 4 WHERE camp_unit_id = NEW.camp_unit_id;
    UPDATE unit_lab SET status = 4 WHERE camp_unit_id = NEW.camp_unit_id;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_unit_status() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    account_id integer NOT NULL,
    email text NOT NULL,
    phone text,
    pw_hash text NOT NULL,
    account_type text NOT NULL,
    CONSTRAINT account_account_type_check CHECK ((account_type = ANY (ARRAY['sysadmin'::text, 'doctor'::text, 'lab'::text]))),
    CONSTRAINT email_format_check CHECK ((email ~ '[A-Za-z0-9.+-]+@[a-z]+\.[A-Za-z]{3}'::text)),
    CONSTRAINT phone_format_check CHECK ((phone ~ '\+213[5-7][0-9]{8}'::text))
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: account_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_account_id_seq OWNER TO postgres;

--
-- Name: account_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_account_id_seq OWNED BY public.account.account_id;


--
-- Name: camp_unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.camp_unit (
    camp_unit_id integer NOT NULL,
    unit_id integer NOT NULL,
    camp_id integer NOT NULL,
    status integer DEFAULT 3 NOT NULL,
    start_date date DEFAULT CURRENT_DATE,
    end_date date
);


ALTER TABLE public.camp_unit OWNER TO postgres;

--
-- Name: camp_unit_camp_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.camp_unit_camp_unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.camp_unit_camp_unit_id_seq OWNER TO postgres;

--
-- Name: camp_unit_camp_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.camp_unit_camp_unit_id_seq OWNED BY public.camp_unit.camp_unit_id;


--
-- Name: campaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign (
    campaign_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    status integer DEFAULT 3 NOT NULL,
    start_date date DEFAULT CURRENT_DATE,
    end_date date,
    created_date date DEFAULT CURRENT_DATE NOT NULL,
    created_by integer NOT NULL
);


ALTER TABLE public.campaign OWNER TO postgres;

--
-- Name: campaign_campaign_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.campaign_campaign_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.campaign_campaign_id_seq OWNER TO postgres;

--
-- Name: campaign_campaign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.campaign_campaign_id_seq OWNED BY public.campaign.campaign_id;


--
-- Name: doctor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor (
    doctor_id integer NOT NULL,
    person_id integer NOT NULL,
    account_id integer NOT NULL,
    status integer DEFAULT 2 NOT NULL,
    speciality integer NOT NULL,
    created_by integer NOT NULL,
    CONSTRAINT doctor_status_check CHECK ((status = ANY (ARRAY[1, 2])))
);


ALTER TABLE public.doctor OWNER TO postgres;

--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctor_doctor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doctor_doctor_id_seq OWNER TO postgres;

--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctor_doctor_id_seq OWNED BY public.doctor.doctor_id;


--
-- Name: laboratory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.laboratory (
    lab_id integer NOT NULL,
    name text NOT NULL,
    status integer DEFAULT 2 NOT NULL,
    account_id integer NOT NULL,
    static_location_id integer,
    created_date date DEFAULT CURRENT_DATE NOT NULL,
    created_by integer NOT NULL
);


ALTER TABLE public.laboratory OWNER TO postgres;

--
-- Name: laboratory_lab_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.laboratory_lab_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.laboratory_lab_id_seq OWNER TO postgres;

--
-- Name: laboratory_lab_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.laboratory_lab_id_seq OWNED BY public.laboratory.lab_id;


--
-- Name: person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    birthdate date NOT NULL,
    is_male boolean NOT NULL,
    created_date date DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE public.person OWNER TO postgres;

--
-- Name: speciality; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.speciality (
    speciality_id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.speciality OWNER TO postgres;

--
-- Name: speciality_speciality_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.speciality_speciality_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.speciality_speciality_id_seq OWNER TO postgres;

--
-- Name: speciality_speciality_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.speciality_speciality_id_seq OWNED BY public.speciality.speciality_id;


--
-- Name: static_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.static_location (
    static_location_id integer NOT NULL,
    wilaya text NOT NULL,
    dayra text NOT NULL,
    baladya text NOT NULL,
    neighbourhood text NOT NULL,
    postal_code character varying(20) NOT NULL
);


ALTER TABLE public.static_location OWNER TO postgres;

--
-- Name: static_location_static_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.static_location_static_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.static_location_static_location_id_seq OWNER TO postgres;

--
-- Name: static_location_static_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.static_location_static_location_id_seq OWNED BY public.static_location.static_location_id;


--
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status (
    status_id integer NOT NULL,
    status_text text NOT NULL
);


ALTER TABLE public.status OWNER TO postgres;

--
-- Name: status_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.status_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.status_status_id_seq OWNER TO postgres;

--
-- Name: status_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.status_status_id_seq OWNED BY public.status.status_id;


--
-- Name: subject; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subject (
    subject_id integer NOT NULL,
    person_id integer NOT NULL,
    static_location_id integer,
    email text NOT NULL,
    phone text,
    created_by integer NOT NULL,
    CONSTRAINT subject_email_check CHECK ((email ~ '[A-Za-z0-9.+-]+@[a-z]+\.[A-Za-z]{3}'::text)),
    CONSTRAINT subject_phone_check CHECK ((phone ~ '\+213[5-7][0-9]{8}'::text))
);


ALTER TABLE public.subject OWNER TO postgres;

--
-- Name: subject_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subject_subject_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subject_subject_id_seq OWNER TO postgres;

--
-- Name: subject_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subject_subject_id_seq OWNED BY public.subject.subject_id;


--
-- Name: subject_tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subject_tests (
    test_id integer NOT NULL,
    subject_id integer NOT NULL,
    doctor_id integer NOT NULL,
    unit_id integer NOT NULL,
    lab_id integer NOT NULL,
    camp_id integer NOT NULL,
    test_result integer,
    doctor_notes text,
    test_date date DEFAULT CURRENT_DATE NOT NULL,
    CONSTRAINT subject_tests_test_result_check CHECK ((test_result = ANY (ARRAY[0, 1, 2, 3, 4])))
);


ALTER TABLE public.subject_tests OWNER TO postgres;

--
-- Name: subject_tests_test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subject_tests_test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subject_tests_test_id_seq OWNER TO postgres;

--
-- Name: subject_tests_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subject_tests_test_id_seq OWNED BY public.subject_tests.test_id;


--
-- Name: sys_admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sys_admin (
    admin_id integer NOT NULL,
    person_id integer NOT NULL,
    account_id integer NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    level integer NOT NULL,
    created_by integer,
    CONSTRAINT sys_admin_level_check CHECK ((level = ANY (ARRAY[1, 2, 3]))),
    CONSTRAINT sys_admin_status_check CHECK ((status = ANY (ARRAY[1, 2])))
);


ALTER TABLE public.sys_admin OWNER TO postgres;

--
-- Name: sys_admin_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sys_admin_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sys_admin_admin_id_seq OWNER TO postgres;

--
-- Name: sys_admin_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sys_admin_admin_id_seq OWNED BY public.sys_admin.admin_id;


--
-- Name: temp_email_confirmation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temp_email_confirmation (
    email text NOT NULL,
    code text,
    count integer DEFAULT 0
);


ALTER TABLE public.temp_email_confirmation OWNER TO postgres;

--
-- Name: test_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_data (
    test_data_id integer NOT NULL,
    test_id integer NOT NULL,
    is_smoker boolean,
    eat_before_test boolean
);


ALTER TABLE public.test_data OWNER TO postgres;

--
-- Name: test_data_test_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.test_data_test_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_data_test_data_id_seq OWNER TO postgres;

--
-- Name: test_data_test_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.test_data_test_data_id_seq OWNED BY public.test_data.test_data_id;


--
-- Name: test_result; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test_result (
    test_result_id integer NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.test_result OWNER TO postgres;

--
-- Name: unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit (
    unit_id integer NOT NULL,
    name text NOT NULL,
    status integer DEFAULT 2 NOT NULL,
    static_location_id integer NOT NULL,
    created_date date DEFAULT CURRENT_DATE NOT NULL,
    created_by integer NOT NULL
);


ALTER TABLE public.unit OWNER TO postgres;

--
-- Name: unit_doc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_doc (
    unit_doc_id integer NOT NULL,
    camp_unit_id integer NOT NULL,
    doctor_id integer NOT NULL,
    status integer DEFAULT 3 NOT NULL,
    start_date date DEFAULT CURRENT_DATE,
    end_date date
);


ALTER TABLE public.unit_doc OWNER TO postgres;

--
-- Name: unit_doc_unit_doc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_doc_unit_doc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unit_doc_unit_doc_id_seq OWNER TO postgres;

--
-- Name: unit_doc_unit_doc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_doc_unit_doc_id_seq OWNED BY public.unit_doc.unit_doc_id;


--
-- Name: unit_lab; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_lab (
    unit_lab_id integer NOT NULL,
    camp_unit_id integer NOT NULL,
    lab_id integer NOT NULL,
    status integer DEFAULT 3 NOT NULL,
    start_date date,
    end_date date
);


ALTER TABLE public.unit_lab OWNER TO postgres;

--
-- Name: unit_lab_unit_lab_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_lab_unit_lab_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unit_lab_unit_lab_id_seq OWNER TO postgres;

--
-- Name: unit_lab_unit_lab_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_lab_unit_lab_id_seq OWNED BY public.unit_lab.unit_lab_id;


--
-- Name: unit_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_unit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unit_unit_id_seq OWNER TO postgres;

--
-- Name: unit_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_unit_id_seq OWNED BY public.unit.unit_id;


--
-- Name: account account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN account_id SET DEFAULT nextval('public.account_account_id_seq'::regclass);


--
-- Name: camp_unit camp_unit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.camp_unit ALTER COLUMN camp_unit_id SET DEFAULT nextval('public.camp_unit_camp_unit_id_seq'::regclass);


--
-- Name: campaign campaign_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign ALTER COLUMN campaign_id SET DEFAULT nextval('public.campaign_campaign_id_seq'::regclass);


--
-- Name: doctor doctor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor ALTER COLUMN doctor_id SET DEFAULT nextval('public.doctor_doctor_id_seq'::regclass);


--
-- Name: laboratory lab_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory ALTER COLUMN lab_id SET DEFAULT nextval('public.laboratory_lab_id_seq'::regclass);


--
-- Name: speciality speciality_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.speciality ALTER COLUMN speciality_id SET DEFAULT nextval('public.speciality_speciality_id_seq'::regclass);


--
-- Name: static_location static_location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.static_location ALTER COLUMN static_location_id SET DEFAULT nextval('public.static_location_static_location_id_seq'::regclass);


--
-- Name: status status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status ALTER COLUMN status_id SET DEFAULT nextval('public.status_status_id_seq'::regclass);


--
-- Name: subject subject_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject ALTER COLUMN subject_id SET DEFAULT nextval('public.subject_subject_id_seq'::regclass);


--
-- Name: subject_tests test_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests ALTER COLUMN test_id SET DEFAULT nextval('public.subject_tests_test_id_seq'::regclass);


--
-- Name: sys_admin admin_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_admin ALTER COLUMN admin_id SET DEFAULT nextval('public.sys_admin_admin_id_seq'::regclass);


--
-- Name: test_data test_data_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_data ALTER COLUMN test_data_id SET DEFAULT nextval('public.test_data_test_data_id_seq'::regclass);


--
-- Name: unit unit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit ALTER COLUMN unit_id SET DEFAULT nextval('public.unit_unit_id_seq'::regclass);


--
-- Name: unit_doc unit_doc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_doc ALTER COLUMN unit_doc_id SET DEFAULT nextval('public.unit_doc_unit_doc_id_seq'::regclass);


--
-- Name: unit_lab unit_lab_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_lab ALTER COLUMN unit_lab_id SET DEFAULT nextval('public.unit_lab_unit_lab_id_seq'::regclass);


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (account_id, email, phone, pw_hash, account_type) FROM stdin;
\.


--
-- Data for Name: camp_unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.camp_unit (camp_unit_id, unit_id, camp_id, status, start_date, end_date) FROM stdin;
\.


--
-- Data for Name: campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaign (campaign_id, name, description, status, start_date, end_date, created_date, created_by) FROM stdin;
\.


--
-- Data for Name: doctor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor (doctor_id, person_id, account_id, status, speciality, created_by) FROM stdin;
\.


--
-- Data for Name: laboratory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.laboratory (lab_id, name, status, account_id, static_location_id, created_date, created_by) FROM stdin;
\.


--
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.person (id, first_name, last_name, birthdate, is_male, created_date) FROM stdin;
\.


--
-- Data for Name: speciality; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.speciality (speciality_id, name) FROM stdin;
1	oncology
2	cancer
\.


--
-- Data for Name: static_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.static_location (static_location_id, wilaya, dayra, baladya, neighbourhood, postal_code) FROM stdin;
\.


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status (status_id, status_text) FROM stdin;
1	active
2	inactive
3	draft
4	done
\.


--
-- Data for Name: subject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subject (subject_id, person_id, static_location_id, email, phone, created_by) FROM stdin;
\.


--
-- Data for Name: subject_tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subject_tests (test_id, subject_id, doctor_id, unit_id, lab_id, camp_id, test_result, doctor_notes, test_date) FROM stdin;
\.


--
-- Data for Name: sys_admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sys_admin (admin_id, person_id, account_id, status, level, created_by) FROM stdin;
\.


--
-- Data for Name: temp_email_confirmation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temp_email_confirmation (email, code, count) FROM stdin;
\.


--
-- Data for Name: test_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_data (test_data_id, test_id, is_smoker, eat_before_test) FROM stdin;
\.


--
-- Data for Name: test_result; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_result (test_result_id, value) FROM stdin;
0	negative
1	positive
2	undeterminable
3	in_proccessing
4	not_recieved
\.


--
-- Data for Name: unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit (unit_id, name, status, static_location_id, created_date, created_by) FROM stdin;
\.


--
-- Data for Name: unit_doc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_doc (unit_doc_id, camp_unit_id, doctor_id, status, start_date, end_date) FROM stdin;
\.


--
-- Data for Name: unit_lab; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_lab (unit_lab_id, camp_unit_id, lab_id, status, start_date, end_date) FROM stdin;
\.


--
-- Name: account_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_account_id_seq', 1, false);


--
-- Name: camp_unit_camp_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.camp_unit_camp_unit_id_seq', 1, false);


--
-- Name: campaign_campaign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.campaign_campaign_id_seq', 1, false);


--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctor_doctor_id_seq', 1, false);


--
-- Name: laboratory_lab_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.laboratory_lab_id_seq', 1, false);


--
-- Name: speciality_speciality_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.speciality_speciality_id_seq', 2, true);


--
-- Name: static_location_static_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.static_location_static_location_id_seq', 1, false);


--
-- Name: status_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.status_status_id_seq', 4, true);


--
-- Name: subject_subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subject_subject_id_seq', 1, false);


--
-- Name: subject_tests_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subject_tests_test_id_seq', 1, false);


--
-- Name: sys_admin_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sys_admin_admin_id_seq', 1, false);


--
-- Name: test_data_test_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_data_test_data_id_seq', 1, false);


--
-- Name: unit_doc_unit_doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_doc_unit_doc_id_seq', 1, false);


--
-- Name: unit_lab_unit_lab_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_lab_unit_lab_id_seq', 1, false);


--
-- Name: unit_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_unit_id_seq', 1, false);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);


--
-- Name: camp_unit camp_unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.camp_unit
    ADD CONSTRAINT camp_unit_pkey PRIMARY KEY (camp_unit_id);


--
-- Name: campaign campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign
    ADD CONSTRAINT campaign_pkey PRIMARY KEY (campaign_id);


--
-- Name: doctor doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (doctor_id);


--
-- Name: laboratory laboratory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory
    ADD CONSTRAINT laboratory_pkey PRIMARY KEY (lab_id);


--
-- Name: person person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pkey PRIMARY KEY (id);


--
-- Name: speciality speciality_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.speciality
    ADD CONSTRAINT speciality_pkey PRIMARY KEY (speciality_id);


--
-- Name: static_location static_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.static_location
    ADD CONSTRAINT static_location_pkey PRIMARY KEY (static_location_id);


--
-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (status_id);


--
-- Name: subject subject_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_pkey PRIMARY KEY (subject_id);


--
-- Name: subject_tests subject_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests
    ADD CONSTRAINT subject_tests_pkey PRIMARY KEY (test_id);


--
-- Name: sys_admin sys_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_admin
    ADD CONSTRAINT sys_admin_pkey PRIMARY KEY (admin_id);


--
-- Name: temp_email_confirmation temp_email_confirmation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temp_email_confirmation
    ADD CONSTRAINT temp_email_confirmation_pkey PRIMARY KEY (email);


--
-- Name: test_data test_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_data
    ADD CONSTRAINT test_data_pkey PRIMARY KEY (test_data_id);


--
-- Name: test_result test_result_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_result
    ADD CONSTRAINT test_result_pkey PRIMARY KEY (test_result_id);


--
-- Name: unit_doc unit_doc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_doc
    ADD CONSTRAINT unit_doc_pkey PRIMARY KEY (unit_doc_id);


--
-- Name: unit_lab unit_lab_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_lab
    ADD CONSTRAINT unit_lab_pkey PRIMARY KEY (unit_lab_id);


--
-- Name: unit unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_pkey PRIMARY KEY (unit_id);


--
-- Name: unique_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_account ON public.sys_admin USING btree (account_id);


--
-- Name: unique_account_doctor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_account_doctor ON public.doctor USING btree (account_id);


--
-- Name: unique_created_by_null; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_created_by_null ON public.sys_admin USING btree (created_by) WHERE (created_by IS NULL);


--
-- Name: unique_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_email ON public.account USING btree (email);


--
-- Name: unique_person; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_person ON public.sys_admin USING btree (person_id);


--
-- Name: unique_person_doctor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_person_doctor ON public.doctor USING btree (person_id);


--
-- Name: unique_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_phone ON public.account USING btree (phone);


--
-- Name: doctor check_doctor_account_references; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_doctor_account_references BEFORE INSERT ON public.doctor FOR EACH ROW EXECUTE FUNCTION public.check_account_references();


--
-- Name: doctor check_doctor_person_references; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_doctor_person_references BEFORE INSERT ON public.doctor FOR EACH ROW EXECUTE FUNCTION public.check_person_references();


--
-- Name: campaign check_done_status_camp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_done_status_camp BEFORE INSERT ON public.campaign FOR EACH ROW EXECUTE FUNCTION public.check_done_status();


--
-- Name: camp_unit check_done_status_unit_camp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_done_status_unit_camp BEFORE INSERT ON public.camp_unit FOR EACH ROW EXECUTE FUNCTION public.check_done_status();


--
-- Name: unit_doc check_done_status_unit_doc; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_done_status_unit_doc BEFORE INSERT ON public.unit_doc FOR EACH ROW EXECUTE FUNCTION public.check_done_status();


--
-- Name: unit_lab check_done_status_unit_lab; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_done_status_unit_lab BEFORE INSERT ON public.unit_lab FOR EACH ROW EXECUTE FUNCTION public.check_done_status();


--
-- Name: sys_admin check_sys_admin_account_references; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_sys_admin_account_references BEFORE INSERT ON public.sys_admin FOR EACH ROW EXECUTE FUNCTION public.check_account_references();


--
-- Name: sys_admin check_sys_admin_person_references; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_sys_admin_person_references BEFORE INSERT ON public.sys_admin FOR EACH ROW EXECUTE FUNCTION public.check_person_references();


--
-- Name: camp_unit check_unit_camp_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_unit_camp_trigger BEFORE INSERT ON public.camp_unit FOR EACH ROW EXECUTE FUNCTION public.check_unit_camp();


--
-- Name: doctor delete_parents_doctor; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_parents_doctor AFTER DELETE ON public.doctor FOR EACH ROW EXECUTE FUNCTION public.delete_parents();


--
-- Name: subject delete_parents_subject_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_parents_subject_trigger AFTER DELETE ON public.subject FOR EACH ROW EXECUTE FUNCTION public.delete_parents_subject();


--
-- Name: sys_admin delete_parents_sys_admin; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_parents_sys_admin AFTER DELETE ON public.sys_admin FOR EACH ROW EXECUTE FUNCTION public.delete_parents();


--
-- Name: account prevent_update_account_type_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_update_account_type_trigger BEFORE UPDATE ON public.account FOR EACH ROW EXECUTE FUNCTION public.prevent_update_account_type();


--
-- Name: doctor prevent_update_doctor_account_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_update_doctor_account_trigger BEFORE UPDATE ON public.doctor FOR EACH ROW EXECUTE FUNCTION public.prevent_update_account();


--
-- Name: doctor prevent_update_doctor_person_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_update_doctor_person_trigger BEFORE UPDATE ON public.doctor FOR EACH ROW EXECUTE FUNCTION public.prevent_update_person();


--
-- Name: sys_admin prevent_update_sys_admin_account_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_update_sys_admin_account_trigger BEFORE UPDATE ON public.sys_admin FOR EACH ROW EXECUTE FUNCTION public.prevent_update_account();


--
-- Name: sys_admin prevent_update_sys_admin_person_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_update_sys_admin_person_trigger BEFORE UPDATE ON public.sys_admin FOR EACH ROW EXECUTE FUNCTION public.prevent_update_person();


--
-- Name: unit prevent_update_unit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER prevent_update_unit_trigger BEFORE UPDATE ON public.unit FOR EACH ROW EXECUTE FUNCTION public.prevent_update_unit();


--
-- Name: camp_unit set_camp_unit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_camp_unit_trigger BEFORE UPDATE ON public.camp_unit FOR EACH ROW EXECUTE FUNCTION public.set_end_date();


--
-- Name: unit_doc set_doc_unit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_doc_unit_trigger BEFORE UPDATE ON public.unit_doc FOR EACH ROW EXECUTE FUNCTION public.set_end_date();


--
-- Name: unit_lab set_lab_unit_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_lab_unit_trigger BEFORE UPDATE ON public.unit_lab FOR EACH ROW EXECUTE FUNCTION public.set_end_date();


--
-- Name: camp_unit set_unit_status_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_unit_status_trigger AFTER UPDATE ON public.camp_unit FOR EACH ROW EXECUTE FUNCTION public.set_unit_status();


--
-- Name: camp_unit camp_unit_camp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.camp_unit
    ADD CONSTRAINT camp_unit_camp_id_fkey FOREIGN KEY (camp_id) REFERENCES public.campaign(campaign_id) ON DELETE CASCADE;


--
-- Name: camp_unit camp_unit_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.camp_unit
    ADD CONSTRAINT camp_unit_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- Name: camp_unit camp_unit_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.camp_unit
    ADD CONSTRAINT camp_unit_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(unit_id) ON DELETE CASCADE;


--
-- Name: campaign campaign_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign
    ADD CONSTRAINT campaign_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.sys_admin(admin_id);


--
-- Name: campaign campaign_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign
    ADD CONSTRAINT campaign_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- Name: doctor doctor_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- Name: doctor doctor_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.sys_admin(admin_id) ON DELETE CASCADE;


--
-- Name: doctor doctor_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: doctor doctor_speciality_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_speciality_fkey FOREIGN KEY (speciality) REFERENCES public.speciality(speciality_id);


--
-- Name: doctor doctor_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- Name: laboratory laboratory_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory
    ADD CONSTRAINT laboratory_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id);


--
-- Name: laboratory laboratory_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory
    ADD CONSTRAINT laboratory_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.sys_admin(admin_id);


--
-- Name: laboratory laboratory_static_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory
    ADD CONSTRAINT laboratory_static_location_id_fkey FOREIGN KEY (static_location_id) REFERENCES public.static_location(static_location_id);


--
-- Name: laboratory laboratory_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory
    ADD CONSTRAINT laboratory_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- Name: subject subject_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.doctor(doctor_id);


--
-- Name: subject subject_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id);


--
-- Name: subject subject_static_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject
    ADD CONSTRAINT subject_static_location_id_fkey FOREIGN KEY (static_location_id) REFERENCES public.static_location(static_location_id);


--
-- Name: subject_tests subject_tests_camp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests
    ADD CONSTRAINT subject_tests_camp_id_fkey FOREIGN KEY (camp_id) REFERENCES public.campaign(campaign_id) ON DELETE CASCADE;


--
-- Name: subject_tests subject_tests_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests
    ADD CONSTRAINT subject_tests_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: subject_tests subject_tests_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests
    ADD CONSTRAINT subject_tests_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.laboratory(lab_id) ON DELETE CASCADE;


--
-- Name: subject_tests subject_tests_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests
    ADD CONSTRAINT subject_tests_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subject(subject_id) ON DELETE CASCADE;


--
-- Name: subject_tests subject_tests_test_result_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests
    ADD CONSTRAINT subject_tests_test_result_fkey FOREIGN KEY (test_result) REFERENCES public.test_result(test_result_id);


--
-- Name: subject_tests subject_tests_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_tests
    ADD CONSTRAINT subject_tests_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.unit(unit_id) ON DELETE CASCADE;


--
-- Name: sys_admin sys_admin_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_admin
    ADD CONSTRAINT sys_admin_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- Name: sys_admin sys_admin_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_admin
    ADD CONSTRAINT sys_admin_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.sys_admin(admin_id);


--
-- Name: sys_admin sys_admin_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_admin
    ADD CONSTRAINT sys_admin_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(id) ON DELETE CASCADE;


--
-- Name: sys_admin sys_admin_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sys_admin
    ADD CONSTRAINT sys_admin_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- Name: test_data test_data_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_data
    ADD CONSTRAINT test_data_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.subject_tests(test_id) ON DELETE CASCADE;


--
-- Name: unit unit_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.sys_admin(admin_id);


--
-- Name: unit_doc unit_doc_camp_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_doc
    ADD CONSTRAINT unit_doc_camp_unit_id_fkey FOREIGN KEY (camp_unit_id) REFERENCES public.camp_unit(camp_unit_id);


--
-- Name: unit_doc unit_doc_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_doc
    ADD CONSTRAINT unit_doc_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: unit_doc unit_doc_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_doc
    ADD CONSTRAINT unit_doc_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- Name: unit_lab unit_lab_camp_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_lab
    ADD CONSTRAINT unit_lab_camp_unit_id_fkey FOREIGN KEY (camp_unit_id) REFERENCES public.camp_unit(camp_unit_id);


--
-- Name: unit_lab unit_lab_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_lab
    ADD CONSTRAINT unit_lab_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.laboratory(lab_id) ON DELETE CASCADE;


--
-- Name: unit_lab unit_lab_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_lab
    ADD CONSTRAINT unit_lab_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- Name: unit unit_static_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_static_location_id_fkey FOREIGN KEY (static_location_id) REFERENCES public.static_location(static_location_id) ON DELETE CASCADE;


--
-- Name: unit unit_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit
    ADD CONSTRAINT unit_status_fkey FOREIGN KEY (status) REFERENCES public.status(status_id);


--
-- PostgreSQL database dump complete
--

