CREATE TABLE IF NOT EXISTS currency
(
    id SERIAL NOT NULL PRIMARY KEY,
    "date" DATE,
    "timestamp" INT,
    base CHARACTER VARYING(3),
    rate TEXT
);

CREATE TABLE IF NOT EXISTS daily
(
    id SERIAL NOT NULL PRIMARY KEY,
    "date" DATE,
    previousdate DATE,
    "timestamp" DATE,
    valute TEXT
);
