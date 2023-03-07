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