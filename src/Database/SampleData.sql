PRAGMA foreign_keys = off;

BEGIN TRANSACTION;

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
    ),
    (
        2,
        'Article or tutorial',
        'article',
        NULL
    ),
    (
        3,
        'Techart project',
        'project',
        NULL
    ),
    (
        4,
        'About 01 binary',
        'about',
        NULL
    ),
    (
        5,
        'Engineering discipline',
        'engineering',
        NULL
    ),
    (
        6,
        'Electrical engineering',
        'electrical',
        5
    ),
    (
        7,
        'Mechanical engineering',
        'mechanical',
        5
    ),
    (
        8,
        'Software engineering',
        'software',
        5
    ),
    (
        9,
        'Robotics disciplines',
        'robotics',
        5
    ),
    (
        10,
        'Design discipline',
        'design',
        NULL
    ),
    (
        11,
        'Graphic design',
        'graphic',
        10
    ),
    (
        12,
        'Web design',
        'web',
        10
    ),
    (
        13,
        'User interface design',
        'ui',
        10
    ),
    (
        14,
        'Database design',
        'database',
        10
    ),
    (
        15,
        'Computer aided drafting',
        'cad',
        10
    ),
    (
        16,
        'Industrial design',
        'industrial',
        10
    ),
    (
        17,
        'Information technology discipline',
        'it',
        NULL
    ),
    (
        18,
        'SQL database design',
        'sql',
        17
    ),
    (
        19,
        'Fine art',
        'art',
        1
    ),
    (
        20,
        'Music recording & production',
        'music',
        19
    ),
    (
        21,
        'Oil painting',
        'painting',
        19
    ),
    (
        22,
        'Site author',
        'zero',
        NULL
    );

COMMIT TRANSACTION;

BEGIN TRANSACTION;

    INSERT INTO Articles (
        Id,
        AuthorId,
        Content,
        Date,
        Published,
        Thumbnail,
        Title,
        LocationLatitude,
        LocationLongitude,
        LocationName,
        LocationZoom,
        Views
    )
    VALUES (
        1,
        22,
        'This is a story published quite some time ago. Let''s not test markdown right now, just adding comments.',
        '08/17/2016',
        1,
        '',
        'The sample news story with very long title to ensure it overlaps tags',
        45.4467013,
        -122.7666811,
        'Bavarian Sausage',
        20,
        98
    );

COMMIT TRANSACTION;

BEGIN TRANSACTION;

    INSERT INTO Metadata (
        Id,
        ArticleId,
        TagId
    )
    VALUES (
        1,
        1,
        1
    ),
    (
        2,
        1,
        5
    ),
    (
        3,
        1,
        9
    );

COMMIT TRANSACTION;

BEGIN TRANSACTION;

    INSERT INTO Comments (
        Id,
        Author,
        Content,
        Date,
        ArticleId,
        Published
    )
    VALUES (
        1,
        'facebookUser',
        'hello',
        '2016-08-22 21:23:07.750387',
        1,
        1
    ),
    (
        2,
        'facebookUser',
        'hello, world!',
        '2016-08-23 13:04:44.815979',
        1,
        1
    ),
    (
        3,
        'facebookUser',
        'I am with facebook',
        '2016-08-23 13:16:52.721504',
        1,
        1
    ),
    (
        4,
        's=ex',
        'hello, world!',
        '2016-08-24 08:48:00.521429',
        1,
        1
    ),
    (
        5,
        'efefe',
        'testing',
        '2016-08-24 08:49:41.856112',
        1,
        1
    ),
    (
        6,
        'efefe',
        'another comment from same user!',
        '2016-08-24 08:49:59.610016',
        1,
        1
    ),
    (
        7,
        'val',
        'hello world',
        '2016-08-24 19:48:18.492534',
        1,
        1
    ),
    (
        8,
        'val',
        'hey!',
        '2016-08-24 19:51:14.103351',
        1,
        1
    ),
    (
        9,
        'tigar',
        'uio',
        '2016-08-24 19:59:10.68629',
        1,
        1
    ),
    (
        10,
        'tris',
        'testing comments',
        '2016-08-24 19:59:49.930305',
        1,
        1
    ),
    (
        11,
        'tris',
        'another one as tris',
        '2016-08-24 20:00:43.134166',
        1,
        1
    ),
    (
        12,
        'fk',
        '[0] squad',
        '2016-08-24 20:08:11.971083',
        1,
        0
    ),
    (
        13,
        'as',
        'jhkj',
        '2016-08-24 20:08:52.74086',
        1,
        0
    ),
    (
        14,
        's=ex',
        'Please associate with facebook permanently',
        '2016-08-25 12:52:21.773537',
        1,
        0
    ),
    (
        15,
        'Valeriy',
        'who am I?',
        '2016-09-12 23:25:51.81852',
        1,
        0
    ),
    (
        16,
        'Valeriy',
        'still me?',
        '2016-09-12 23:29:24.146631',
        1,
        0
    ),
    (
        17,
        'rx',
        'hello',
        '2016-09-13 00:21:25.88394',
        1,
        0
    ),
    (
        18,
        'Valeriy',
        'testing',
        '2016-10-09 10:18:42.660499',
        1,
        1
    ),
    (
        19,
        'Valeriy',
        'testing comment after error',
        '2016-10-09 20:00:21.871661',
        1,
        1
    ),
    (
        20,
        'Valeriy',
        'What if
    my comment
    spans multiple lines?',
        '2016-10-13 07:19:09.998461',
        1,
        1
    ),
    (
        21,
        'twitterUser',
        'This is a comment from someone logged in using Twitter!!!11',
        '2016-10-22 14:46:45.040542',
        1,
        0
    ),
    (
        22,
        'zeroms',
        'one from me',
        '2016-10-23 13:09:30.860672',
        1,
        0
    ),
    (
        23,
        'chacha',
        'another comment',
        '2016-10-23 15:44:30.690858',
        1,
        0
    ),
    (
        24,
        'GoogleUser',
        'This is from Google+',
        '2016-10-23 16:36:31.756052',
        1,
        0
    ),
    (
        25,
        'GoogleUser',
        'hey',
        '2016-10-23 18:23:34.596795',
        1,
        0
    );

COMMIT TRANSACTION;

PRAGMA foreign_keys = on;
