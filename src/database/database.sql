-- Active: 1678162356695@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

DROP TABLE users;

INSERT INTO users(id, name, email, password, role, created_at, updated_at)
VALUES
("33ebabf1-c909-4f3c-b573-4b8d5d4e5a02","Luiz Paulo Kuchembuck Pinheiro","luizpaulokpinheiro@email.com","$5a695$skjToNI2gCW02HT3OtzskuhwNwbzYJFJ1RaU2YYWOV/bZJkd5p","ADMIN",DATETIME(),DATETIME()),
("0ce9d89c-5c8c-4f96-94fa-6be60293e570","Thalita Cepa Pinheiro","thalitacepa@mail.com","$5a695$skjToNI2gCW02HT3OtzskuhwNwbzYJFJ1RaU2YYWOV/bZJkd5p","NORMAL",DATETIME(),DATETIME()),
("dd993181-950b-48ab-bee7-4475176a5607","Luiz Paulo Cepa Pinheiro","luizinhopinheiro@mail.com","$5a695$skjToNI2gCW02HT3OtzskuhwNwbzYJFJ1RaU2YYWOV/bZJkd5p","NORMAL",DATETIME(),DATETIME()),
("a4a18c72-2e78-4175-9605-46f6c63c0aed","Paulo Pinheiro","paulopinheiro@mail.com","$5a695$skjToNI2gCW02HT3OtzskuhwNwbzYJFJ1RaU2YYWOV/bZJkd5p","NORMAL",DATETIME(),DATETIME());

CREATE TABLE posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER,
        dislikes INTEGER,
        comments INTEGER,
        created_at TEXT DEFAULT (DATETIME()) NOT NULL,
        updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

DROP TABLE posts;

INSERT INTO posts (id, creator_id, content, created_at, updated_at)
VALUES (
        "28587980-f073-4f34-8544-bdd3d04e0568",
        "0ce9d89c-5c8c-4f96-94fa-6be60293e570",
        "Hoje acordei disposta à fazer novas receitas!",
        DATETIME(),
        DATETIME()
    ), (
        "3ed86a84-7b11-4938-adc2-76cb34fce650",
        "dd993181-950b-48ab-bee7-4475176a5607",
        "Sabe do que mais gosto na minha escolinha? Brincar com meu amiguinhos.",
        DATETIME(),
        DATETIME()
    ), (
        "862ff385-deac-4aa8-b1ee-3d81ba3ec0f4",
        "a4a18c72-2e78-4175-9605-46f6c63c0aed",
        "Esse ano de 2023 irei fazer 96 anos. Acho que aguento mais uns 30 anos... :D",
        DATETIME(),
        DATETIME()
    );

