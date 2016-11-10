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
        'This is a story published quite some time ago. Let''s not test markdown right now, just adding comments.',
        '08/17/2016',
        1,
        '',
        'The sample news story with very long title to ensure it overlaps tags',
        'the-sample-news-story-with-very-long-title-to-ensure-it-overlaps-tags',' 
        45.4467013,
        -122.7666811,
        'Bavarian Sausage',
        20,
        98
    ),
    (
        2,
        22,
        'This is a more recent story with some content.',
        '11/06/2016',
        1,
        '',
        'more recent',
        'more-recent',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        3,
        22,
        'This is a slightly less recent story with different content.',
        '11/05/2016',
        1,
        '',
        'little less recent',
        'little-less-recent',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        4,
        22,
        'Just a little less recent than the other one.',
        '11/04/2016',
        1,
        '',
        'little-r less recent',
        'little-r-less-recent',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        5,
        22,
        'This is beginning of November story, posted just at the start of the month.',
        '11/01/2016',
        1,
        '',
        'beginning of the month',
        'beginning-of-the-month',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        6,
        22,
        'This was posted at the end of the previous month. Still not dusty yet but definitely older.',
        '10/28/2016',
        1,
        '',
        'end of last month',
        'end-of-last-month',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        7,
        22,
        'Just a little before the end of previous month.',
        '10/25/2016',
        1,
        '',
        'before end of last month',
        'before-end-of-last-month',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        8,
        22,
        'So this was posted middle of last month. Test content here.',
        '10/15/2016',
        1,
        '',
        'middle of last month',
        'middle-of-last-month',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        9,
        22,
        'This is right around the second week of October. When all the cool stuff happens.',
        '10/10/2016',
        1,
        '',
        'second week of last month',
        'second-week-of-last-month',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        10,
        22,
        'First week of last month just around the corner. Who knows anymore what was happening back then?',
        '10/05/2016',
        1,
        '',
        'first week of last month',
        'first-week-of-last-month',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        11,
        22,
        'End of September. Still had some warm and sunny days back then, before all turned to shit.',
        '9/23/2016',
        1,
        '',
        'older article',
        'older-article',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        12,
        22,
        'Middle of September. Summer still somewhat at large, I suppose',
        '9/15/2016',
        1,
        '',
        'olderer article',
        'olderer-article',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        13,
        22,
        'Second week of September. Testing testing.',
        '9/10/2016',
        1,
        '',
        'much older article',
        'much-older-article',
        NULL,
        NULL,
        NULL,
        NULL,
        0
    ),
    (
        14,
        22,
        'First week of September. Testing testing there!',
        '9/03/2016',
        1,
        '',
        'oldest article',
        'oldest-article',
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
