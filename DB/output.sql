--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: default
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "default";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: default
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO "default";

--
-- Name: Session; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO "default";

--
-- Name: User; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    score text
);


ALTER TABLE public."User" OWNER TO "default";

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO "default";

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "default";

--
-- Name: description; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.description (
    id text NOT NULL,
    title text,
    "helperId" text,
    text text NOT NULL
);


ALTER TABLE public.description OWNER TO "default";

--
-- Name: dictation; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.dictation (
    id text NOT NULL,
    text text NOT NULL,
    title text NOT NULL,
    level text NOT NULL,
    audio_url text NOT NULL,
    audio_name text NOT NULL,
    audio_total_part integer,
    audio_duration_minutes integer,
    audio_duration_seconds integer,
    excerpt text,
    image_url character varying(255)
);


ALTER TABLE public.dictation OWNER TO "default";

--
-- Name: helper; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.helper (
    id text NOT NULL,
    title text NOT NULL,
    generate_type text NOT NULL,
    number_vote integer NOT NULL
);


ALTER TABLE public.helper OWNER TO "default";

--
-- Name: helper_word; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.helper_word (
    id text NOT NULL,
    word_id text NOT NULL,
    helper_id text NOT NULL
);


ALTER TABLE public.helper_word OWNER TO "default";

--
-- Name: score; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.score (
    id text NOT NULL,
    user_id text,
    dictation_id text,
    note integer,
    score integer,
    timer character varying(255),
    correct_words integer,
    incorrect_words integer,
    pourcentage double precision
);


ALTER TABLE public.score OWNER TO "default";

--
-- Name: score_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.score_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.score_id_seq OWNER TO "default";

--
-- Name: score_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.score_id_seq OWNED BY public.score.id;


--
-- Name: word; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.word (
    id text NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.word OWNER TO "default";

--
-- Name: score id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.score ALTER COLUMN id SET DEFAULT nextval('public.score_id_seq'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
cludzdih40002amihmx89b0yp	cludzdiff0000amih4fy28v9x	oauth	google	110280588452065573401	\N	ya29.a0Ad52N3_ZMDWjBuBIWSmUkBXU0xv5Q3QBECW-tpS7kRsfvIxAs5NhDmI1MNNuRTlvTFD3iehJVEXaN9Mj7hKxF9bapLZBIB5epxThj4R77PQVmiUpubmM5h6PNES8dwaLtZTqIqOHYl1BCVI_OFl7OhAD_JIDq8y6Icl1aCgYKAfgSARESFQHGX2MiiEMv-rHzhkjTLfPsgHlmeQ0171	1711799991	Bearer	openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6ImFkZjVlNzEwZWRmZWJlY2JlZmE5YTYxNDk1NjU0ZDAzYzBiOGVkZjgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMDM5MTMxMjE2MjM0LWVob2hyYXFmMGZpcTg4ZnRibmJ2MHZqbDFqNnJuNmJpLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTAzOTEzMTIxNjIzNC1laG9ocmFxZjBmaXE4OGZ0Ym5idjB2amwxajZybjZiaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMDI4MDU4ODQ1MjA2NTU3MzQwMSIsImVtYWlsIjoiYXZyaWxsb24uYmVub2l0NzNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJNYTdzc0RmSzhQMFdIdG5QTUprQUNRIiwibmFtZSI6Ik9uZHJlbGF0IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tmMElWX20zSXBZS3hBcEd6OC1SaDJaZTdIWUh6a1ZyWm5qVVdXc2k3ZzlIMD1zOTYtYyIsImdpdmVuX25hbWUiOiJPbmRyZWxhdCIsImlhdCI6MTcxMTc5NjM5MiwiZXhwIjoxNzExNzk5OTkyfQ.aySbA1coO9n8dWFqBpmFdcgfmykt6IoUDZ-uz5zjH2oIdqVFkRL1oFpiTAX5mItnXHNNxsob1lDsfOCdD7GcyRnOKXVmWrO-yIVVH5ocTT5P-Rnmsr7wJgKSk4eNu7d5rs37RouX5846gH0aQOkGUu43xbmZBd85Tv43-Aya7HS0It0s6S1RBa6Nbp4tIou7xRnuuAmXASsb0uyT2_-r9N0sojNSkPzwqgE3dXvzoLKmvM6jJQ2DFJq3NHviAtfZLDC0-9MnQyT9fJkRaJbWEy6_lh0-rLrPmhvw6SG6V2dpxUNzKzzz9gRFwESw5hJ8hbwbAThpgNPpP4aICFgHPA	\N
clv15sty60002rvc88q6vzdq5	clv15stsr0000rvc8nzwqftml	oauth	google	113452117107591477615	\N	ya29.a0Ad52N38ytYjO6WLQ4BGe3TmjCgavQfH8l6I1acXlGyMPKYMidHyn3gPuws_cnTNdNE7FjPQ0grGly5uCPwFC_1HR-R5HMJkbdq-FvCgBDOghkyCAEK93UM7ygAtWMxwjmfLvaZT63Up4JjdzxwFmyAL0vnSOvgpZfO5maCgYKAX4SARISFQHGX2MiICpTEUrVddq8k82hgQ8JYA0171	1713201505	Bearer	https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid	eyJhbGciOiJSUzI1NiIsImtpZCI6IjZjZTExYWVjZjllYjE0MDI0YTQ0YmJmZDFiY2Y4YjMyYTEyMjg3ZmEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM0NTIxMTcxMDc1OTE0Nzc2MTUiLCJlbWFpbCI6ImRpY3RlZS5pbnRlcmFjdGl2ZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkVHenp4bkZwX3hERF9IdDJqZjduZkEiLCJuYW1lIjoiQmVub8OudCBBVlJJTExPTiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMMkx4SC04YTJSUUVYWVJtUTZBTkh6MDlwRHNJR0xwU3JyTjJObG5wV3pkYjBBdkE9czk2LWMiLCJnaXZlbl9uYW1lIjoiQmVub8OudCIsImZhbWlseV9uYW1lIjoiQVZSSUxMT04iLCJpYXQiOjE3MTMxOTc5MDYsImV4cCI6MTcxMzIwMTUwNn0.A1NB35-0_SkuLFdLABVUgtj8APpCqlgjQVsyW-tpSjqbLz8unLHSY-jFpTgRdHhGpqxydRO8WGmYg1DE8-Dt-7g2EHXKqd8W2RZJshUKcX4mNo1LrZcFY3VkicpcdK3nI9Nsf1WAyddBPTbzd637lRUCsI08ph2YqCqImvMluKXTW6E7NUA7v1njOgySLDoYg4q9cus_j_Lmk3DMzGWFuOZJOalpw8_4-alFNEaXzxxDle0AMke7FEJDsx3Eg_tuWq96V-vgjVBH7hm4-vdTS5QlW0gHCRO9Ni6T_hRnmho-gRq_HwozvW3njmCA4MQhY8MX8KOmStLXQLGQzg7Ctg	\N
clvf4tk7z00024swktfhpfk4o	clvf4tk2q00004swk5lunuyv1	oauth	google	105410297885471459829	\N	ya29.a0Ad52N38R1BRLBDO09Dvj8BdUV5Uae5TVr6NWk5XLTQBUpOcni3neyuQwx_vj55YngdVXBJso4YZ9AZxAMDxe7ETSu_a7BGZu8bUTd4q6zMMbDQW2ww5hi9FJizWrpwa7dnqaI6mCxLaBKSinoFHfcMFjQp2awbRTArkTaCgYKASgSARISFQHGX2MiYBH4mJkhRgQpQin_CSDGMw0171	1714046386	Bearer	https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid	eyJhbGciOiJSUzI1NiIsImtpZCI6ImUxYjkzYzY0MDE0NGI4NGJkMDViZjI5NmQ2NzI2MmI2YmM2MWE0ODciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDU0MTAyOTc4ODU0NzE0NTk4MjkiLCJlbWFpbCI6Im5pY29sYXNsdXF1ZXByb0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjNxTl9QVEwwbXBqQUNCX0Q5Q1lQaHciLCJuYW1lIjoiTmljb2xhcyBMVVFVRSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKU2I1ZDdqV0ZsVmkyc3FocUtYd0Y0RnNlbDlXMmJXMTdJd3NvNWRvOFJRRXpQYnc9czk2LWMiLCJnaXZlbl9uYW1lIjoiTmljb2xhcyIsImZhbWlseV9uYW1lIjoiTFVRVUUiLCJpYXQiOjE3MTQwNDI3ODcsImV4cCI6MTcxNDA0NjM4N30.TVnk6euVCUDUnrYeFnobBTtjHWe1kXBSHIUC4beR6dQcUCPnehXY02J6SfmXx0WFypIy-l6OyY7E8_Go8cHzrKyOsPAf0JRofHj_1V_0Qzv7OpRO_33syrOd7xm2a0sM5t9v1bQziOm4RS4ECRLI1OYBbogZpVPYrvJkl56aHmyOUvE-o-3jgNMXgtIHcrhIzZcF88ATLrQANHOdQt0FpPfmJ6iSzB2PADPRwwxTvE0TLETXyxLkKATyvI0SLz1sm8sdp4YTGy8a_dlM_7cc0EoJ67MmUg9kYpApYnaZf_IOXuIq2SuCuzr8teC2FyTEI2xK1gNU3ibGgjMC77DEkw	\N
clvgxrfo70002by5coiowjfcc	clvgxrfj00000by5cc06hg6jq	oauth	google	113580530621469036516	\N	ya29.a0Ad52N3-JofeFMTRsphPprbRprjwXSevw36YJjd6EPARYLZCNKqQCwp0vEdXlpw4sRhtv5_8xCIgMS55WVj6rmi_ID0u1w4kcM3DRWUtb3zo4CAHg6ChaHv4oXhl_VvOYL04LPUI6xbViYIxB8dtwJ2GvghvtaLZMRSSnaCgYKAX4SARISFQHGX2MiilJozol7c1SiyG3pPPG7fA0171	1714155462	Bearer	https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6ImUxYjkzYzY0MDE0NGI4NGJkMDViZjI5NmQ2NzI2MmI2YmM2MWE0ODciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM1ODA1MzA2MjE0NjkwMzY1MTYiLCJlbWFpbCI6ImFydGh1cnRhc3NvdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImFldmk5d29RVENFZmRwbTBZSHJhaEEiLCJuYW1lIjoiQXJ0aHVyIFRhc3NvdCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKNGIxWnp3UVluV0V1enV2V2hmd2d3VV9XNXJ3RW9YSWRQd3FNTTd0OTF3T2FVT1E9czk2LWMiLCJnaXZlbl9uYW1lIjoiQXJ0aHVyIiwiZmFtaWx5X25hbWUiOiJUYXNzb3QiLCJpYXQiOjE3MTQxNTE4NjMsImV4cCI6MTcxNDE1NTQ2M30.NHCzIFsHRioXqucm1FyTEn3l5dQr7fpZ5az3U8T00Yqoi5yx9Shd2_LCAhd7B9tm35W_o5Q1QoWMKoD9jqoAHW15xf3yx2zcN3O4G3gg8s2NWTQOCmpNf24Uh_I2RqrnTUVWi64HViK4APH9tCKv_-tM0lBXRu2KjKQUW24SEL5EITRyHv7L-Zyc0kZqXRZrfvGjcRrs2OPhw46oH3WleJKP6xEGH0ytPfANWWxQOQiMYc734LxNeHpnArAucRV5MKU9yyZ-uNWM9J13PX6fKtOYR8ZyXKsc7IDYfmWhMPj-EoMJpf1kf8VFED5G-xP3J0BdedSR6pU_WABFuZravw	\N
clwg10gpc0002f3kylbdrrwip	clwg10gju0000f3kyxln2bww5	oauth	google	104266586880880019330	\N	ya29.a0AXooCgsUmQF0knVDA0acU1su15QdRkEE2o7t0vWOgImdw-m4tVHZPL1uT7QLI9IJ_Ju3T6JtwggopDc2zZySV-pq-vEr-2NSbUMsiFRBrVao7in-O6vrwe5yEt8X8PPueho9VsoqssanYkSlntaSJX79218vd_Zay_LnaCgYKAfQSARASFQHGX2MiSMZMKQh4GcNzza9T8QnnlQ0171	1716277238	Bearer	openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email	eyJhbGciOiJSUzI1NiIsImtpZCI6IjMyM2IyMTRhZTY5NzVhMGYwMzRlYTc3MzU0ZGMwYzI1ZDAzNjQyZGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQyNjY1ODY4ODA4ODAwMTkzMzAiLCJlbWFpbCI6ImxlZ3VlcmVyZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IldZdkFUT2lkSV9CY0dzaFhFU2t0N1EiLCJuYW1lIjoiTHVpcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKWUlYVENYX0hKaW1IWGx2RmZuS29HTzBBdmdfaDhGZ2JiUmo0SGNRVE42YUdIanlxUT1zOTYtYyIsImdpdmVuX25hbWUiOiJMdWlzIiwiaWF0IjoxNzE2MjczNjM5LCJleHAiOjE3MTYyNzcyMzl9.b5b4L7ECBMFl-Z6B-c1ad9tc-88nkP7QsLNb_xVoI1Xe8jBYlm48nsLUXBzkonTCZzjc5oZZgOLzEhy5N1XdZGWW5hXdyhxDB6qai44XLrMnDT9BZGLsMQoFxwSdMlT59JO2YxOEjqrHbp4fj7ZyS09txqLYgKg54DUnWIKWgnexkfy3yYZFruCCmiTtXFK6TfmtaAzIhuWc_NHCEoISh3x0TA4twIL14JkrJjDn2s_d7739ZtRWCESx_xQyPo2G7MlOnX2dJ5xRbQZ3SKyBUYNctjn10lBYnVtt6QYdt-lmnvZuVGzqdMu9zGj9fK6gZO4nFqGiGiji6aw2zl4hqQ	\N
clxg5je2z00025tjyc1k8sige	clxg5jdxp00005tjyfkzdf7by	oauth	google	105653664742174535793	\N	ya29.a0AXooCgtpG0H7t0aJ5rpnvNIpEdSVJY1zTA1y7n324PgGoAO7Kui-p4ihYpd7xo3l_j9EGkZ54zRQ5c3XCPm0pPVxzSq90j9lx25RZpDli6rzJg8ZYklDZUq3v0yi0SPtBI0n2tTKQ1USbnigmTP46PigkbtEi_75EsFqaCgYKAXMSARESFQHGX2Mi2oRWP6mENM9WQlYBfLyz4g0171	1718461622	Bearer	https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid	eyJhbGciOiJSUzI1NiIsImtpZCI6ImMzYWJlNDEzYjIyNjhhZTk3NjQ1OGM4MmMxNTE3OTU0N2U5NzUyN2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDU2NTM2NjQ3NDIxNzQ1MzU3OTMiLCJlbWFpbCI6InBodWNwaGFtMTMwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Inkzc0YzV3hPNVpadVlkX250N3M5aVEiLCJuYW1lIjoiUGjDumMgUGjhuqFtIEhvw6BuZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLUFFkNXMtWlFtTUZzVjJ6TEhLdXNWU3dkNmlWNnFCZUNYLU9tUmpPTXFKYUFqenVKUT1zOTYtYyIsImdpdmVuX25hbWUiOiJQaMO6YyIsImZhbWlseV9uYW1lIjoiUGjhuqFtIEhvw6BuZyIsImlhdCI6MTcxODQ1ODAyMywiZXhwIjoxNzE4NDYxNjIzfQ.BsXsOSkr8Ttkme8H4BMii1bWvzUx33zBl6URmQJjYnNyizIvacUK80tCsIpbIpRywKS3jwCkq8pQSpFw9HcY8ey2s12nzDV3HvlY0w-_s21irOsxa3LZBhvjbKKd9s5Q8Zb70Q2KMmroSVHeJVIWD9c0IDHiGO1pqjNqMXT2vmdEKYzSw5J4Ew4dZoJt3LZDh0ayzKjJkyo5mX6dnsdZxSgvProPBUAN-PMwU16Vr6rhM-lB3T2_eCfbT65cZolWxuMmEevsOwKDtA59pPdYYEXL_HE8IVvJDSufwnApU6pGG2ZS0oXIyFbulFrNo-QjktQBp3rjOCCqfsJM5n1xFQ	\N
clxrm93rd000214enauzzxwoz	clxrm93ly000014enfthsnpfb	oauth	google	102794246648109168272	\N	ya29.a0AXooCgtrbEy3p7AOr7jiYVrfwwsgXNHUTXKNAsL_VryfJvWLeY0zxxiKm_ZaspYLpDkC3stYDizyP4bO2A8jUYm1R5fgT3ntwKZ88CGUiEsigPM58Y0Sk74iLyoPGJodZXQo-PIQy4UTRmROefO1eJdKXKSBQ2CP1A0zaCgYKAVQSARASFQHGX2MiyEbmxBF1UyaGZloF09fRyQ0171	1719154823	Bearer	openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile	eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkNTgwZjBhZjdhY2U2OThhMGNlZTdmMjMwYmNhNTk0ZGM2ZGJiNTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MzExMjAxMDY1NzctOTdsY2dpNGk0Nmw5ZWx0MWxhNnZxa24xNmEwdm04OWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI3OTQyNDY2NDgxMDkxNjgyNzIiLCJlbWFpbCI6ImplYW5uaW4ubHVjYXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI1NHhyYjhPc0l5Vl9RRnF5UTNKYXNRIiwibmFtZSI6IkNhdGxvbG1kciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMUnFCVXhqWmhoa29SY0RFRGJpT1FzUkJfMHpKZ25pdFJyVFdIX2VTXzRtVndEd0hLej1zOTYtYyIsImdpdmVuX25hbWUiOiJDYXRsb2xtZHIiLCJpYXQiOjE3MTkxNTEyMjQsImV4cCI6MTcxOTE1NDgyNH0.oogHo7LaA1q0UXwoCQ6oOPYfavRuqWjIlI4v5nqp8vOm6wEbZIlwn8TWgRi6JJ6UECQk52LlNnX7XyZvr5_eDTj7w4SLiLocs-YsPOWpRqifwKNmXNxz-rvqzq36I89YDGlADkw_QOwV77ReLGBJq1Niz6RLuQRKzCMN8cPQZIpeDloU3V0wfX-y_EDWwQnZnN4aZ9_32rBNDO-8362Tn0PdWYeMLC3rg81AAUIe084dZCNkwEFKGB7nS_xXvfqOOnvLZcOnvmLbu-AdDl8rtl_BRtXe3pBirWj69tziqHdyP5SHHYoxEX3tJMxCa7x4nTuEYoc5MivBEY-6lKgmMA	\N
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
clwg10gus0004f3kyurbdixqj	e46c5699-fcb5-4500-b757-e1b2eba2e006	clwg10gju0000f3kyxln2bww5	2024-07-08 02:22:19.586
clwg5m1v2000140mzf809haop	10413cb4-bd4d-46df-9dca-36665443a447	cludzdiff0000amih4fy28v9x	2024-07-09 11:46:25.591
clvf4tkda00044swkt1z2kbx6	bf96052b-8689-4016-ab8f-5b69187dbbc3	clvf4tk2q00004swk5lunuyv1	2024-07-12 01:35:49.126
clwgc545v0001oq8stqea2h0u	4b0b1579-f4e4-4b70-b343-a3d7f97b31d6	cludzdiff0000amih4fy28v9x	2024-07-13 18:42:10.732
clvgxrfte0004by5cyceuyavg	5713df76-6989-410c-9506-2d67206b39d5	clvgxrfj00000by5cc06hg6jq	2024-05-26 17:17:44.786
clxg5je8b00045tjyhjcr7oxi	183ddb98-e58f-4025-9ed1-d191651c62af	clxg5jdxp00005tjyfkzdf7by	2024-07-15 13:27:04.906
clxrm93xw000414endigl2ao4	30395028-6f30-486c-8785-6e2dcbe29960	clxrm93ly000014enfthsnpfb	2024-07-23 14:00:26.419
clviah3400003u4hbqsdotlaq	3ee678da-7fc0-4282-8e52-5e06c43fe1c4	cludzdiff0000amih4fy28v9x	2024-06-09 09:34:07.828
clvf4xqnn00064swklj7yadra	392ebe9d-eb34-456b-9e67-f86f25feeb3c	cludzdiff0000amih4fy28v9x	2024-06-11 20:32:42.471
clwbubzkt000113nimpgfzo0n	1bd6e2d1-c589-4748-8cd0-0daf9949cc4a	cludzdiff0000amih4fy28v9x	2024-06-18 16:19:54.658
cm0i1tp0l00013dpufj3n3v2p	201b47ca-c50b-4ada-b9e9-67f0d5e1c80f	cludzdiff0000amih4fy28v9x	2024-10-01 12:54:18.85
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."User" (id, name, email, "emailVerified", image, score) FROM stdin;
cludzdiff0000amih4fy28v9x	Ondrelat	avrillon.benoit73@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocKf0IV_m3IpYKxApGz8-Rh2Ze7HYHzkVrZnjUWWsi7g9H0=s96-c	\N
clv15stsr0000rvc8nzwqftml	Benoît AVRILLON	dictee.interactive@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocL2LxH-8a2RQEXYRmQ6ANHz09pDsIGLpSrrN2NlnpWzdb0AvA=s96-c	\N
clvf4tk2q00004swk5lunuyv1	Nicolas LUQUE	nicolasluquepro@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocJSb5d7jWFlVi2sqhqKXwF4Fsel9W2bW17Iwso5do8RQEzPbw=s96-c	\N
clvgxrfj00000by5cc06hg6jq	Arthur Tassot	arthurtassot@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocJ4b1ZzwQYnWEuzuvWhfwgwU_W5rwEoXIdPwqMM7t91wOaUOQ=s96-c	\N
clwg10gju0000f3kyxln2bww5	Luis	leguerere@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocJYIXTCX_HJimHXlvFfnKoGO0Avg_h8FgbbRj4HcQTN6aGHjyqQ=s96-c	\N
clxg5jdxp00005tjyfkzdf7by	Phúc Phạm Hoàng	phucpham1301@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocKPQd5s-ZQmMFsV2zLHKusVSwd6iV6qBeCX-OmRjOMqJaAjzuJQ=s96-c	\N
clxrm93ly000014enfthsnpfb	Catlolmdr	jeannin.lucas@gmail.com	\N	https://lh3.googleusercontent.com/a/ACg8ocLRqBUxjZhhkoRcDEDbiOQsRB_0zJgnitRrTWH_eS_4mVwDwHKz=s96-c	\N
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7376d8fb-ec69-4dbe-8d4a-4aa8bda6418f	7b1cdcd0fd49cb5235cdbd70b1a47859d3ee78fd6b4a4bcc9a7a0fdc57a6d919	2024-03-28 09:27:37.342514+00	20240228140407_credential	\N	\N	2024-03-28 09:27:37.191784+00	1
368b7e02-5776-40d9-923c-e21386aeeed5	a09c87bdf7ed2d1f0a8cecaca0b762ffc6deaa027af3f024ee52acf4ddfc77b6	2024-03-28 09:27:37.537295+00	20240229090509_	\N	\N	2024-03-28 09:27:37.40401+00	1
f34a32f1-5c24-4726-8726-1b2763cc1717	22f2ffb70dfe40ec534f3f71a8885529183f0003c1e2067e68514bfeae71a6e9	2024-03-28 09:27:37.7193+00	20240229093905_dictation	\N	\N	2024-03-28 09:27:37.589112+00	1
ed680821-c140-4446-be8b-babf11a64e8c	2202e5cf387e9e34fb2fdc051987785709f32a08da5618d8e59f8b5825e7fd18	2024-03-28 09:27:37.906434+00	20240229101208_correction_champ_audio	\N	\N	2024-03-28 09:27:37.77112+00	1
a6c01f7d-6800-4b96-9853-7090f419c8c4	1c6384a2fed3246a2a9d0c60408bcee92c1d1b39eeb1fa7f7a5a722c04726cbb	2024-03-28 09:27:38.09734+00	20240229103435_ajout_title	\N	\N	2024-03-28 09:27:37.960846+00	1
2c18ed94-9f03-4685-9fd7-b3d708ae09f0	9fd872bdf700687d8a5ff3617e63c9f3145053e285733177442284901921b4bf	2024-03-28 09:27:38.286901+00	20240317122100_	\N	\N	2024-03-28 09:27:38.149447+00	1
2a77992c-0748-484d-8944-c3fc21247e68	759379b5630c6b5b30f7ed72c08679e3a38bcd4e41adef2cbc63182e5a117357	2024-03-28 09:27:38.474835+00	20240319110419_init	\N	\N	2024-03-28 09:27:38.338808+00	1
ff1425ae-224a-4184-8637-3c0977a0f168	9be1d85e68b77f9ff005f8f6c0a26e2533bdb062f85ed44a087d15a515a347a5	2024-03-28 09:27:38.658799+00	20240319154050_init	\N	\N	2024-03-28 09:27:38.526537+00	1
3694de01-7da2-4bc5-bf44-4a4198d09941	595ab7f461ddc2ff8d773765fc79c16bd2210615e6c283344df3da15be0710c0	2024-03-28 09:27:38.849029+00	20240319154404_init	\N	\N	2024-03-28 09:27:38.71379+00	1
44e9fc0c-cdd8-422e-9e5b-7c33d7a02883	03f6f0f1963fc15ade70fc121419c364d383dda37a48da02271fc5c384fa0fa6	\N	20240417151252_add_audio_total_part	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20240417151252_add_audio_total_part\n\nDatabase error code: 23502\n\nDatabase error:\nERROR: column "audio_total_part" of relation "dictation" contains null values\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23502), message: "column \\"audio_total_part\\" of relation \\"dictation\\" contains null values", detail: None, hint: None, position: None, where_: None, schema: Some("public"), table: Some("dictation"), column: Some("audio_total_part"), datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(6046), routine: Some("ATRewriteTable") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20240417151252_add_audio_total_part"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20240417151252_add_audio_total_part"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:201	2024-04-17 15:19:40.890923+00	2024-04-17 15:14:00.810527+00	0
\.


--
-- Data for Name: description; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.description (id, title, "helperId", text) FROM stdin;
club17avz000ec0ngq1gakhyc	ET	club17aev0004c0ng9nb66kt7	<p><strong>ET</strong> est une conjonction de coordination utilisée pour relier des éléments équivalents dans une phrase. <em>Exemple :</em> pommes <strong>ET</strong> poires. <strong>Astuce :</strong> Remplacez par 'ET PUIS' pour tester son utilisation.</p>
club17avz000fc0ngl4qyv1p5	EST	club17aev0004c0ng9nb66kt7	<p><strong>EST</strong> est une forme du verbe 'être' à la troisième personne du singulier. <em>Exemple :</em> Il <strong>EST</strong> tard. <strong>Astuce :</strong> Remplacez par 'ÉTAIT' pour tester son utilisation. <em>Utilisé pour décrire un état ou une caractéristique.</em></p>
club17avz000gc0ngm79hgtgn	CE	club17agk0005c0nggfyt8rre	<p><strong>CE</strong> est un déterminant démonstratif masculin singulier ou un pronom démonstratif utilisé pour désigner une personne ou une chose mentionnée précédemment ou clairement identifiable dans le contexte. <em>Exemple :</em> <strong>CE</strong> livre. <strong>Astuce :</strong> Remplacez par 'CET' si le mot suivant commence par une voyelle ou un 'h' muet pour tester son utilisation. <em>Utilisé pour pointer ou spécifier.</em></p>
club17avz000hc0ngz60lu942	SE	club17agk0005c0nggfyt8rre	<p><strong>SE</strong> est un pronom personnel réfléchi de la troisième personne, utilisé pour indiquer que l'action du verbe est réalisée par le sujet sur lui-même. <em>Exemple :</em> Il <strong>SE</strong> regarde dans le miroir. <strong>Astuce :</strong> Remplacez par 'ME' ou 'TE' pour tester son utilisation avec la première ou deuxième personne. <em>Utilisé pour exprimer une action réfléchie ou réciproque.</em></p>
\.


--
-- Data for Name: dictation; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.dictation (id, text, title, level, audio_url, audio_name, audio_total_part, audio_duration_minutes, audio_duration_seconds, excerpt, image_url) FROM stdin;
clvjy6fqh0001gcvn3oljdcb9	Le vent et le soleil se disputaient, chacun assurant qu'il était le plus fort. Quand ils ont vu un voyageur qui s'avançait, enveloppé dans son manteau, ils sont tombés d'accord que celui qui arriverait le premier à faire ôter son manteau au voyageur serait regardé comme le plus fort.	Le vent et le soleil	Débutant	audios/Le vent et le soleil	Le vent et le soleil	5	0	20	D'après la fable de Jean de La Fontaine	\N
clvjyag910000gcvn01zr1ptb	Le chat est un animal domestique. Il a quatre pattes, une queue et des moustaches. Son corps est couvert de poils doux. Il aime dormir, jouer et manger. Le chat miaule pour appeler son maître. Il est indépendant mais aussi très affectueux.	Le chat	Débutant	audios/Le chat	Le chat	8	0	26	D'après un texte de Maurice Carême	\N
clvjycihf0000gcvn3102cm9z	Le soir, quand les petits garçons rentraient de l'école, ils montaient chez elle et elle leur faisait réciter leurs leçons. Elle les faisait épeler et leur apprenait un peu d'orthographe. C'est qu'elle avait reçu de l'éducation, la brave fille. Elle n'avait pas de livres, elle n'avait que sa mémoire, où elle avait emmagasiné des fragments de romans. Elle s'en servait pour endoctriner ces enfants. Elle leur narrait aussi des histoires, et elle leur choisissait des fables.	Une institutrice improvisée	Facile	audios/Une institutrice improvisée	Une institutrice improvisée	12	0	37	Extrait du roman "Les Misérables" de Victor Hugo	\N
clvjyhcfh0003gcvnd0u6e0dy	Tout est dans un flux continuel sur la terre. Rien n'y garde une forme constante et arrêtée, et nos affections qui s'attachent aux choses extérieures passent et changent nécessairement comme elles. Toujours en avant ou en arrière de nous, elles rappellent le passé, qui n'est plus, ou préviennent l'avenir, qui souvent ne doit point être.	La montagne	Facile	audios/La montagne	La montagne	8	0	25	Extrait des Rêveries du promeneur solitaire de Jean-Jacques Rousseau	\N
clvjyi5we0005gcvn40vcdx50	L'esprit de la conversation consiste bien moins à en montrer beaucoup qu'à en faire trouver aux autres. Celui qui sort de votre entretien content de soi et de son esprit l'est de vous parfaitement. Les hommes n'aiment point à vous admirer, ils veulent plaire ; ils cherchent moins à être instruits et même réjouis qu'à être goûtés et applaudis.	L'art de la conversation	Intermédiaire	audios/L'art de la conversation	L'art de la conversation	5	0	23	Extrait des Caractères de La Bruyère	\N
clvjyjz66000agcvn3t1xbo0q	Petit poisson deviendra grand pourvu que Dieu lui prête vie. Mais le lâcher en attendant, je tiens pour moi que c'est folie, car de le rattraper il n'est pas trop certain. Un carpeau qui n'était encore que fretin fut pris par un pêcheur au bord d'une rivière. Tout fait nombre, dit l'homme en voyant son butin, voilà commencement de chère et de festin.	Le petit poisson et le pêcheur	Intermédiaire	audios/Le petit poisson et le pêcheur	Le petit poisson et le pêcheur	8	0	28	D'après la fable de Jean de La Fontaine	\N
clvjykd06000bgcvnf5vphpoc	Il existe à Paris une puissance extraordinaire, compréhensible seulement dans cette extraordinaire cité. Quand tout a été dit pour ou contre, la grandeur écrase, l'industrie épouvante. La poésie manque. Cependant il est des phénomènes d'activité tels, des multiplicités de vices, de vertus, de pensées qui s'y amoncellent au point que l'image de la société présente des contrastes heurtés, des oppositions bizarres.	La peau de chagrin	Intermédiaire	audios/La peau de chagrin	La peau de chagrin	11	0	35	La Peau de chagrin d'Honoré de Balzac	\N
clvksrcsr0000jovn7e3abrpt	Le chat et la souris ont vécu en bons amis dans le même logis. Mais un jour la souris a été prise au piège. Le chat a promis de la sauver si elle lui donnait un baiser. La souris a refusé et le chat l'a mangée.	Le chat et la souris	Facile	audios/Le chat et la souris	Le chat et la souris	4	0	18	D'après la fable de Jean de La Fontaine	\N
clvkz65t70000aovncjjt7hrn	Va-t'en, chétif insecte, excrément de la terre ! C'est en ces mots que le lion parlait un jour au moucheron. L'autre lui déclara la guerre. Penses-tu, lui dit-il, que ton titre de roi me fasse peur ni me soucie ? Un bœuf est plus puissant que toi, je le mène à ma fantaisie.	Le lion et le moucheron	Facile	audios/Le lion et le moucheron	Le lion et le moucheron	10	0	29	D'après la fable de Jean de La Fontaine	\N
clvl3dqt70000aovn1d0m02fz	Paris est une véritable mer. Jetez-y la sonde, vous n'en connaîtrez jamais la profondeur. Promenez-vous, faites-y le tour, vous ne saurez jamais à quoi vous vous engagez en y entrant. Ce que vous y trouvez de plus merveilleux, c'est ce hasard qui surgit à tout moment. Ce qu'il ne faut jamais y faire, c'est de spéculer.	Le père Goriot	Facile	audios/Le père Goriot	Le père Goriot	10	0	29	Le Père Goriot d'Honoré de Balzac	\N
clvl3flwu0001aovn2g7zefsm	La rose est une belle fleur. Elle a des pétales doux et colorés. Son parfum est agréable. La rose peut être rouge, rose, jaune ou blanche. Elle pousse sur un arbuste épineux. On offre souvent des roses pour dire je t'aime ou pour faire plaisir.	La rose	Débutant	audios/La rose	La rose	8	0	25	D'après un texte de Pierre Gamarra	\N
clvl3i9k30002aovn71asf5r5	Il se rencontre dans certaines provinces des maisons dont la vue inspire une mélancolie égale à celle que provoquent les cloîtres les plus sombres, les landes les plus ternes ou les ruines les plus tristes. Peut-être y a-t-il à la fois dans ces maisons et le silence du cloître, et l'aridité des landes, et les ossements des ruines ; la vie et le mouvement y sont si tranquilles qu'un étranger les croirait inhabitées, s'il ne rencontrait tout à coup le regard pâle et froid d'une personne immobile.	Eugénie Grandet	Intermédiaire	audios/Eugénie Grandet	Eugénie Grandet	7	0	32	Eugénie Grandet d'Honoré de Balzac	\N
clvl3ppcr0003aovn8jmdhyru	Le papillon est un insecte qui vole. Il a de grandes ailes colorées. Il butine le nectar des fleurs. Avant de devenir papillon, il était une chenille. Puis il s'est transformé dans son cocon. Le papillon ne vit pas longtemps mais il est très beau.	Le papillon	Débutant	audios/Le papillon	Le papillon	7	0	24	D'après un texte de Maurice Carême	\N
clvl400590004aovn25ss1klb	Le chien est un animal domestique. Il est le meilleur ami de l'homme. Il y a beaucoup de races de chiens différentes. Le chien aime jouer à la balle et se promener. Il est fidèle et obéissant. Il peut aussi garder la maison et aider les personnes handicapées.	Le chien	Débutant	audios/Le chien	Le chien	6	0	23	D'après un texte de Pierre Gamarra	\N
clvl421wa0005aovn4nbo4xgl	Compère le renard se mit un jour en frais, et retint à dîner commère la cigogne. Le régal fut petit et sans beaucoup d'apprêts : le galant, pour toute besogne, avait un brouet clair ; il vivait chichement. Ce brouet fut par lui servi sur une assiette : la cigogne au long bec n'en put attraper miette.	Le renard et la cigogne	Avancé	audios/Le renard et la cigogne	Le renard et la cigogne	9	0	29	D'après la fable de Jean de La Fontaine	\N
clvl477fz0006aovn3bx88izj	La fourmi est un petit insecte. Elle est noire ou rouge. Elle vit dans une fourmilière. La fourmi est très travailleuse. Elle passe son temps à chercher de la nourriture. Elle porte des charges très lourdes. Les fourmis s'entraident et sont très organisées.	La fourmi	Débutant	audios/La fourmi	La fourmi	7	0	24	D'après un texte de Jean de La Fontaine	\N
clvl48n290007aovnbqsz5bxz	La tulipe est une jolie fleur. Elle a des pétales de toutes les couleurs. La tulipe pousse au printemps. Elle a besoin de soleil et d'eau. On peut offrir des tulipes en cadeau. Les tulipes viennent de Hollande. Elles décorent les parcs et les jardins.	La tulipe	Débutant	audios/La tulipe	La tulipe	7	0	24	D'après un texte de Hans Christian Andersen	\N
clvl4ca540008aovnga3kccpi	La lune est un astre dans le ciel. Elle brille la nuit quand il fait noir. La lune est ronde et blanche. Parfois, on ne voit qu'un morceau de lune. C'est un croissant de lune. La lune tourne autour de la Terre. Elle éclaire moins fort que le soleil.	La lune	Débutant	audios/La lune	La lune	8	0	25	D'après un texte de Jules Verne	\N
clwg5kcg000013svnaivh2zra	Le soir était venu. La nuit se faisait. Le grand ciel bleu crépusculaire s'étendait immense et livide au-dessus de la route sans fin. Des brumes lointaines montaient dans la clarté du soir. L'ombre allongeait la solitude. Pas un passant. Pas un bruit. Même l'horizon était noir. Une sorte de paix funèbre enveloppait cette contrée ravagée.	Les misérables	Intermédiaire	audios/Les misérables	Les misérables	9	0	33	Les Misérables de Victor Hugo	\N
cm0hozn0d00002kn6gcit9jq6	Quels que soient nos goûts, le voyage semble offrir# une multitude d'expériences. Certains préfèrent les plages ensoleillées, d'autres les montagnes enneigées. Ces aventuriers# consacrent souvent leurs économies# à découvrir de nouveaux horizons, tout en sachant# que leurs attentes# pourraient être déçues. Quelquefois déroutés par l'inconnu# mais rarement découragés, ils s'adaptent aux coutumes locales. Les plus curieux d'entre eux# cherchent à s'immerger# dans la culture du pays visité. Leurs récits, parfois enjolivés, peuvent inspirer d'autres personnes# à explorer le monde.	L'expérience du voyage	Intermédiaire	audios/L'expérience du voyage	L'expérience du voyage	21	0	48	\N	\N
\.


--
-- Data for Name: helper; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.helper (id, title, generate_type, number_vote) FROM stdin;
club17aev0004c0ng9nb66kt7	EST / ET	AI	0
club17agk0005c0nggfyt8rre	CE / SE	AI	0
\.


--
-- Data for Name: helper_word; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.helper_word (id, word_id, helper_id) FROM stdin;
club17ajr0006c0ngeosfp1lh	club17abq0000c0ngcf3sgc94	club17aev0004c0ng9nb66kt7
club17ajr0007c0ng9dqlt5gt	club17abq0001c0ng5d55rdb9	club17aev0004c0ng9nb66kt7
club17amp0008c0ngiswrl3sz	club17abq0000c0ngcf3sgc94	club17aev0004c0ng9nb66kt7
club17amp0009c0ngizfjwppe	club17abq0001c0ng5d55rdb9	club17aev0004c0ng9nb66kt7
club17app000ac0ng43ejetwx	club17abq0002c0ngqiskp0pu	club17agk0005c0nggfyt8rre
club17app000bc0ng8w2p5w9o	club17abq0003c0ngp7m8kjwe	club17agk0005c0nggfyt8rre
club17asv000cc0nggkjhwxsa	club17abq0002c0ngqiskp0pu	club17agk0005c0nggfyt8rre
club17asv000dc0ngipkze758	club17abq0003c0ngp7m8kjwe	club17agk0005c0nggfyt8rre
\.


--
-- Data for Name: score; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.score (id, user_id, dictation_id, note, score, timer, correct_words, incorrect_words, pourcentage) FROM stdin;
clvktqxul0000vsvn33im0j8w	cludzdiff0000amih4fy28v9x	clvjyag910000gcvn01zr1ptb	12	910	00:01:06	37	8	82.22222222222221
clvktsvpp0001vsvn452k5usx	cludzdiff0000amih4fy28v9x	clvjyag910000gcvn01zr1ptb	15	1033	00:00:55	38	5	88.37209302325581
clvkupdby0002vsvndutc5kip	cludzdiff0000amih4fy28v9x	clvjy6fqh0001gcvn3oljdcb9	9	860	00:01:12	43	11	79.62962962962963
clvkwugo70004vsvn3wwzb6p4	cludzdiff0000amih4fy28v9x	clvjyhcfh0003gcvnd0u6e0dy	0	972	00:02:41	44	20	68.75
clvkwwvk30005vsvnelcp5pax	cludzdiff0000amih4fy28v9x	clvjyhcfh0003gcvnd0u6e0dy	11	1376	00:01:36	47	9	83.92857142857143
clvkwyq6t0006vsvng7ev1q5b	cludzdiff0000amih4fy28v9x	clvksrcsr0000jovn7e3abrpt	5	1098	00:01:12	37	15	71.15384615384616
clvl1a59m0008vsvn8bdab0fm	cludzdiff0000amih4fy28v9x	clvkz65t70000aovncjjt7hrn	3	1094	00:02:12	47	17	73.4375
clvl1ddpl0009vsvn9krvaw0b	cludzdiff0000amih4fy28v9x	clvjycihf0000gcvn3102cm9z	8	1361	00:02:15	66	12	84.61538461538461
clvqiywh9000009l6gg5730w4	cludzdiff0000amih4fy28v9x	clvl48n290007aovnbqsz5bxz	18	1146	00:01:11	43	2	95.55555555555556
clw0h0ayk000009l1dga7fupc	cludzdiff0000amih4fy28v9x	clvl3ppcr0003aovn8jmdhyru	1	639	00:01:42	38	19	66.66666666666666
clw0lkszs000009lb9khfbkmi	cludzdiff0000amih4fy28v9x	clvl4ca540008aovnga3kccpi	18	1136	00:01:25	48	2	96
clw0ly3uy0000qovncuwxdksi	cludzdiff0000amih4fy28v9x	clvjyhcfh0003gcvnd0u6e0dy	8	1258	00:01:53	48	12	80
clwg5ogup000090vn0m24b8xq	cludzdiff0000amih4fy28v9x	clwg5kcg000013svnaivh2zra	14	2030	00:01:38	52	6	89.65517241379311
clwgcaztq000009mja46z8xwf	cludzdiff0000amih4fy28v9x	clvjykd06000bgcvnf5vphpoc	-16	891	00:04:09	44	36	55.00000000000001
clwgchjbm000009l8ffmnfc5c	cludzdiff0000amih4fy28v9x	clvjyjz66000agcvn3t1xbo0q	-3	1246	00:04:40	51	23	68.91891891891892
clwgckuz6000109l8emu75rvu	cludzdiff0000amih4fy28v9x	clvjyi5we0005gcvn40vcdx50	1	1417	00:02:05	48	19	71.64179104477611
clwhj2m7i000009md5tazg2vf	cludzdiff0000amih4fy28v9x	clvl400590004aovn25ss1klb	7	829	00:01:26	42	13	76.36363636363637
clwhj4pdj000109mdak2i2kor	cludzdiff0000amih4fy28v9x	clvl3flwu0001aovn2g7zefsm	14	1004	00:01:00	41	6	87.2340425531915
clwqbkkbu0000s4vn2g2vcjrf	cludzdiff0000amih4fy28v9x	clvl3dqt70000aovn1d0m02fz	-36	0	00:00:00	0	56	0
clwqbms5m0001s4vngkdk3t7t	cludzdiff0000amih4fy28v9x	clvl400590004aovn25ss1klb	1	698	00:01:16	40	19	67.79661016949152
clwqbog6t0002s4vn7yjj7lqz	cludzdiff0000amih4fy28v9x	clvl477fz0006aovn3bx88izj	-23	0	00:00:00	0	43	0
clwqbr0ui0003s4vnd2wmcab6	cludzdiff0000amih4fy28v9x	clvl477fz0006aovn3bx88izj	-23	0	00:00:00	0	43	0
clwqbtpyr0004s4vng40vf02q	cludzdiff0000amih4fy28v9x	clvl3ppcr0003aovn8jmdhyru	-25	0	00:00:00	0	45	0
clwqbx4l80005s4vn468k136m	cludzdiff0000amih4fy28v9x	clvjyag910000gcvn01zr1ptb	-22	0	00:00:00	0	42	0
clwqbxoh60006s4vngjlqaahf	cludzdiff0000amih4fy28v9x	clvl48n290007aovnbqsz5bxz	-25	0	00:00:00	0	45	0
clwqc0ika0007s4vn4fqeea49	cludzdiff0000amih4fy28v9x	clvl3flwu0001aovn2g7zefsm	-25	0	00:00:00	0	45	0
clwqeesf60008s4vnd1nc0i9o	cludzdiff0000amih4fy28v9x	clvl3ppcr0003aovn8jmdhyru	-25	0	00:00:00	0	45	0
clwqfj0sp0009s4vn0fk26spy	cludzdiff0000amih4fy28v9x	clvl4ca540008aovnga3kccpi	17	1118	00:01:06	47	3	94
clwqfo1sp000as4vn8pzqdg4o	cludzdiff0000amih4fy28v9x	clvl477fz0006aovn3bx88izj	3	705	00:01:28	37	17	68.51851851851852
clwqhwv8m000bs4vn3w5zb1mx	cludzdiff0000amih4fy28v9x	clvl3flwu0001aovn2g7zefsm	11	949	00:01:00	41	9	82
clx5ht24m000009jx1zhvdigz	clwg10gju0000f3kyxln2bww5	clvkz65t70000aovncjjt7hrn	11	1374	00:02:04	50	9	84.7457627118644
clxrmkczn000009jvhq8m1eiz	clxrm93ly000014enfthsnpfb	clvl421wa0005aovn4nbo4xgl	-37	0	00:00:00	0	57	0
\.


--
-- Data for Name: word; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.word (id, name) FROM stdin;
club17abq0000c0ngcf3sgc94	EST
club17abq0001c0ng5d55rdb9	ET
club17abq0002c0ngqiskp0pu	CE
club17abq0003c0ngp7m8kjwe	SE
\.


--
-- Name: score_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.score_id_seq', 2, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: description description_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.description
    ADD CONSTRAINT description_pkey PRIMARY KEY (id);


--
-- Name: dictation dictation_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.dictation
    ADD CONSTRAINT dictation_pkey PRIMARY KEY (id);


--
-- Name: helper helper_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.helper
    ADD CONSTRAINT helper_pkey PRIMARY KEY (id);


--
-- Name: helper_word helper_word_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.helper_word
    ADD CONSTRAINT helper_word_pkey PRIMARY KEY (id);


--
-- Name: score score_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.score
    ADD CONSTRAINT score_pkey PRIMARY KEY (id);


--
-- Name: word word_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.word
    ADD CONSTRAINT word_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: dictation_title_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX dictation_title_key ON public.dictation USING btree (title);


--
-- Name: helper_title_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX helper_title_key ON public.helper USING btree (title);


--
-- Name: word_name_key; Type: INDEX; Schema: public; Owner: default
--

CREATE UNIQUE INDEX word_name_key ON public.word USING btree (name);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: description description_helperId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.description
    ADD CONSTRAINT "description_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES public.helper(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: helper_word helper_word_helper_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.helper_word
    ADD CONSTRAINT helper_word_helper_id_fkey FOREIGN KEY (helper_id) REFERENCES public.helper(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: helper_word helper_word_word_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.helper_word
    ADD CONSTRAINT helper_word_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.word(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: score score_dictation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.score
    ADD CONSTRAINT score_dictation_id_fkey FOREIGN KEY (dictation_id) REFERENCES public.dictation(id);


--
-- Name: score score_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.score
    ADD CONSTRAINT score_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: default
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

