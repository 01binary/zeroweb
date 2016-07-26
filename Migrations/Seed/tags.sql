--
-- File generated with SQLiteStudio v3.1.0 on Mon Jul 25 20:27:32 2016
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: Tags
CREATE TABLE Tags (
    Id          INTEGER NOT NULL
                        CONSTRAINT PK_Tags PRIMARY KEY AUTOINCREMENT,
    Description CHAR,
    Name        CHAR    NOT NULL,
    ParentId    INTEGER,
    CONSTRAINT FK_Tags_Tags_ParentId FOREIGN KEY (
        ParentId
    )
    REFERENCES Tags (Id) ON DELETE RESTRICT
);

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     1,
                     'News story',
                     'story',
                     NULL
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     2,
                     'Article or tutorial',
                     'article',
                     NULL
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     3,
                     'Techart project',
                     'project',
                     NULL
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     4,
                     'Engineering discipline',
                     'engineering',
                     NULL
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     5,
                     'Electrical engineering',
                     'electrical',
                     4
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     6,
                     'Mechanical engineering',
                     'mechanical',
                     4
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     7,
                     'Software engineering',
                     'software',
                     4
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     8,
                     'Everything robotics',
                     'robotics',
                     4
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     9,
                     'Design discipline',
                     'design',
                     NULL
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     10,
                     'Graphic design',
                     'graphic',
                     9
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     11,
                     'Web design',
                     'web',
                     9
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     12,
                     'Front-end and UI design',
                     'frontend',
                     9
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     13,
                     'Computer aided drafting',
                     'cad',
                     9
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     14,
                     'Industrial design',
                     'industrial',
                     9
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     15,
                     'Information technology',
                     'it',
                     NULL
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     16,
                     'Databases and sql',
                     'sql',
                     15
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     17,
                     'Art',
                     'art',
                     NULL
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     18,
                     'Music production',
                     'music',
                     17
                 );

INSERT INTO Tags (
                     Id,
                     Description,
                     Name,
                     ParentId
                 )
                 VALUES (
                     19,
                     'Oil painting',
                     'painting',
                     17
                 );


-- Index: IX_Tags_Name
CREATE UNIQUE INDEX IX_Tags_Name ON Tags (
    "Name"
);


-- Index: IX_Tags_ParentId
CREATE INDEX IX_Tags_ParentId ON Tags (
    "ParentId"
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
