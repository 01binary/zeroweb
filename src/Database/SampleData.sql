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
        Key,
        LocationLatitude,
        LocationLongitude,
        LocationName,
        LocationZoom,
        Views
    )
    VALUES (
        1,
        22,
        'This is an article about arts and crafts, all artsy and craftsy.',
        '08/22/2016',
        1,
        '',
        'Arts and Crafts in September!',
        'arts-and-crafts-in-september',
        NULL,
        NULL,
        NULL,
        0,
        0
    ),
    (
        2,
        22,
        'A web design article about webpack 2 or something like that.',
        '08/24/2016',
        1,
        '',
        'Webpack2 and you',
        'webpack2-and-you',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        3,
        22,
        'Mechanical engineering is a tough subject!',
        '09/01/2016',
        1,
        '',
        'Mechanical engineering is tough',
        'mechanical-engineering-tough',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        4,
        22,
        'I want to make a robot dog',
        '09/04/2016',
        1,
        '',
        'My robot dog',
        'my-robot-dog',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        5,
        22,
        'Draw more happy trees.',
        '08/15/2016',
        1,
        '',
        'Painting trees',
        'painting-trees',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        6,
        22,
        'Sometimes intruding is better than extruding. Just kidding.',
        '08/17/2016',
        1,
        '',
        'Extruding in Inventor',
        'extruding-in-inventor',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        7,
        22,
        'Raymond Loewy loves custom desk drawers and cars.',
        '08/20/2016',
        1,
        '',
        'History of industrial design',
        'history-of-industrial-design',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        8,
        22,
        'CSS processing in Webpack 2 can be done many ways.',
        '08/21/2016',
        1,
        '',
        'Webpack2 CSS',
        'webpack2-css',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        9,
        22,
        'Underpainting is a great first step to the painting process.',
        '08/15/2016',
        1,
        '',
        'The underpainting',
        'the-underpainting',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        10,
        22,
        'Bending is often not the way to go, as it generates weird geometry and mostly applies to sheet metal.',
        '08/17/2016',
        1,
        '',
        'Bending in Inventor',
        'bending-in-inventor',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        11,
        22,
        'A CNC machine, at least for wood, is indispensable to an industrial designer.',
        '08/19/2016',
        1,
        '',
        'Making a CNC machine',
        'making-a-cnc-machine',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        12,
        22,
        'Always go to UX user studies before putting in a web design feature.',
        '08/21/2016',
        1,
        '',
        'The importance of UX',
        'the-importance-of-ux',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        13,
        22,
        'Manufacturability should be first in any design. Otherwise the thing will be impossible to make.',
        '08/08/2016',
        1,
        '',
        'Design for Manufacturability',
        'design-for-manufacturability',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        14,
        22,
        'We sure talk about web a lot. That''s because the long awaited conversion from native to web is finally taking hold.',
        '08/12/2016',
        1,
        '',
        'The Native to Web transition',
        'the-native-to-web-transition',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        15,
        22,
        'Custom high-torque motors are still not being sold, so in the robotics field you will often find yourself winding your own. A great coil winder is indispensable!',
        '08/03/2016',
        1,
        '',
        'Winding Coils',
        'winding-coils',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        16,
        22,
        'Heap allocation structures can help with memory fragmentation in memory-intensive apps.',
        '08/05/2016',
        1,
        '',
        'Heap data structures',
        'heap-data-structures',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    );

COMMIT TRANSACTION;

BEGIN TRANSACTION;

    INSERT INTO Metadata (
        Id,
        ArticleId,
        TagId
    )

    -- tags --

    VALUES (
        -- meta id --
        1,
        -- article id --
        1,
        -- tag id --
        1
    ),
    (
        -- meta id --
        2,
        -- article id --
        2,
        -- tag id --
        1
    ),
    (
        -- meta id --
        3,
        -- article id --
        3,
        -- tag id --
        1
    ),
    (
        -- meta id --
        4,
        -- article id --
        4,
        -- tag id --
        1
    ),
    (
        -- meta id --
        5,
        -- article id --
        5,
        -- tag id --
        1
    ),
    (
        -- meta id --
        6,
        -- article id --
        6,
        -- tag id --
        1
    ),
    (
        -- meta id --
        7,
        -- article id --
        7,
        -- tag id --
        1
    ),
    (
        -- meta id --
        8,
        -- article id --
        8,
        -- tag id --
        1
    ),
    (
        -- meta id --
        9,
        -- article id --
        9,
        -- tag id --
        1
    ),
    (
        -- meta id --
        10,
        -- article id --
        10,
        -- tag id --
        1
    ),
    (
        -- meta id --
        11,
        -- article id --
        11,
        -- tag id --
        1
    ),
    (
        -- meta id --
        12,
        -- article id --
        12,
        -- tag id --
        1
    ),
    (
        -- meta id --
        13,
        -- article id --
        13,
        -- tag id --
        1
    ),
    (
        -- meta id --
        14,
        -- article id --
        14,
        -- tag id --
        1
    ),
    (
        -- meta id --
        15,
        -- article id --
        15,
        -- tag id --
        1
    ),
    (
        -- meta id --
        16,
        -- article id --
        16,
        -- tag id --
        1
    ),

    -- subtags

    (
        -- meta id --
        17,
        -- article id --
        1,
        -- tag id --
        19
    ),
    (
        -- meta id --
        18,
        -- article id --
        2,
        -- tag id --
        12
    ),
    (
        -- meta id --
        19,
        -- article id --
        3,
        -- tag id --
        7
    ),
    (
        -- meta id --
        20,
        -- article id --
        4,
        -- tag id --
        9
    ),
    (
        -- meta id --
        21,
        -- article id --
        5,
        -- tag id --
        21
    ),
    (
        -- meta id --
        22,
        -- article id --
        6,
        -- tag id --
        7
    ),
    (
        -- meta id --
        23,
        -- article id --
        7,
        -- tag id --
        16
    ),
    (
        -- meta id --
        24,
        -- article id --
        8,
        -- tag id --
        12
    ),
    (
        -- meta id --
        25,
        -- article id --
        9,
        -- tag id --
        21
    ),
    (
        -- meta id --
        26,
        -- article id --
        10,
        -- tag id --
        15
    ),
    (
        -- meta id --
        27,
        -- article id --
        11,
        -- tag id --
        16
    ),
    (
        -- meta id --
        28,
        -- article id --
        12,
        -- tag id --
        13
    ),
    (
        -- meta id --
        29,
        -- article id --
        13,
        -- tag id --
        7
    ),
    (
        -- meta id --
        30,
        -- article id --
        14,
        -- tag id --
        12
    ),
    (
        -- meta id --
        31,
        -- article id --
        15,
        -- tag id --
        9
    ),
    (
        -- meta id --
        32,
        -- article id --
        16,
        -- tag id --
        8
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
