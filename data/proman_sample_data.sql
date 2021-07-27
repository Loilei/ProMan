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

-- TODO users table

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS public_boards CASCADE;
DROP TABLE IF EXISTS private_boards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;

---
--- create tables
---

-- TODO users table

CREATE TABLE statuses (
    id                 SERIAL PRIMARY KEY  NOT NULL,
    public_board_id    INTEGER                     ,
    private_board_id   INTEGER                     ,
    title              VARCHAR(200)        NOT NULL
);

CREATE TABLE private_boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    user_id     INTEGER             NOT NULL,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE public_boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL
);

CREATE TABLE cards (
    id                 SERIAL PRIMARY KEY  NOT NULL,
    public_board_id    INTEGER                     ,
    private_board_id   INTEGER                     ,
    status_id          INTEGER             NOT NULL,
    title              VARCHAR (200)       NOT NULL,
    card_order         INTEGER             NOT NULL
);

---
--- insert data
---

-- TODO users table

INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, null, 'new');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, null, 'in progress');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, null, 'testing');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 1, null, 'done');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, null, 'new');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, null, 'in progress');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, null, 'testing');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), 2, null, 'done');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), null, 1, 'new');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), null, 1, 'in progress');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), null, 1, 'testing');
INSERT INTO statuses VALUES (nextval('cards_id_seq'), null, 1, 'done');


INSERT INTO public_boards(title) VALUES ('Board 1');
INSERT INTO public_boards(title) VALUES ('Board 2');

INSERT INTO private_boards(user_id, title) VALUES (4, 'Board 1');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, null, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, null, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, null, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, null, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, null, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, null, 4, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, null, 5, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, null, 5, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, null, 6, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, null, 7, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, null, 8, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, null, 8, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), null, 1, 9, 'col 1 card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), null, 1, 10, 'col 2 card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), null, 1, 11, 'col 3 card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), null, 1, 12, 'col 4 card', 2);

---
--- add constraints
---

-- TODO users table

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_public_board_id FOREIGN KEY (public_board_id) REFERENCES public_boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_private_board_id FOREIGN KEY (private_board_id) REFERENCES private_boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_statuses_public_board_id FOREIGN KEY (public_board_id) REFERENCES public_boards(id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_statuses_private_board_id FOREIGN KEY (private_board_id) REFERENCES private_boards(id);

ALTER TABLE ONLY private_boards
    ADD CONSTRAINT fk_private_boards_user_id FOREIGN KEY (user_id) REFERENCES users(id);
