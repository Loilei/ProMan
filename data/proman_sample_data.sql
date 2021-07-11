--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS public_boards CASCADE;
DROP TABLE IF EXISTS private_boards CASCADE;
DROP TABLE IF EXISTS cards;

---
--- create tables
---

CREATE TABLE statuses (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE private_boards (
    id          SERIAL PRIMARY KEY  NOT NULL UNIQUE,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE public_boards (
    id          SERIAL PRIMARY KEY  NOT NULL UNIQUE,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

---
--- insert data
---

INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, 'new');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, 'in progress');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, 'testing');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, 'done');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, 'new');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, 'in progress');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, 'testing');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, 'done');


INSERT INTO public_boards(title) VALUES ('Board 1');
INSERT INTO public_boards(title) VALUES ('Board 2');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 7, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 2);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES public_boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (board_id) REFERENCES public_boards(id);
