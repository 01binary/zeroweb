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
        'Art discipline',
        'art',
        NULL
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
    VALUES
    (
        -- id
        1,
        -- author id
        22,
        -- content
        'This is a sample web design article.',
        -- date
        '01/30/2017',
        -- pub, thumb
        1, '',
        -- title
        'web design article',
        -- key
        'web-design-article',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        2,
        -- author id
        22,
        -- content
        'Sample mechanical engineering article.',
        -- date
        '02/01/2017',
        -- pub, thumb
        1, '',
        -- title
        'mechanical engineering article',
        -- key
        'mechanical-engineering-article',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        3,
        -- author id
        22,
        -- content
        'A sample article about robotics',
        -- date
        '02/05/2017',
        -- pub, thumb
        1, '',
        -- title
        'robotics article',
        -- key
        'robotics-article',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        4,
        -- author id
        22,
        -- content
        'Software engineering article on dependency injection',
        -- date
        '02/27/2017',
        -- pub, thumb
        1, '',
        -- title
        'software engineering article',
        -- key
        'software-engineering-article',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        5,
        -- author id
        22,
        -- content
        'Another software engineering article about heap data structures.',
        -- date
        '01/09/2017',
        -- pub, thumb
        1, '',
        -- title
        'another software enginnering article',
        -- key
        'another-software-engineering-article',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        6,
        -- author id
        22,
        -- content
        'This is an article on the art of music production.',
        -- date
        '01/02/2017',
        -- pub, thumb
        1, '',
        -- title
        'art of music production',
        -- key
        'art-of-music-production',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        7,
        -- author id
        22,
        -- content
        'More web design topics for testing',
        -- date
        '01/06/2017',
        -- pub, thumb
        1, '',
        -- title
        'more web design',
        -- key
        'more-web-design',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        8,
        -- author id
        22,
        -- content
        'Robotics again dealing with custom coil winding',
        -- date
        '01/08/2017',
        -- pub, thumb
        1, '',
        -- title
        'robotics again',
        -- key
        'robotics-again',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        9,
        -- author id
        22,
        -- content
        'This is an article about underpainting while painting, you know, anything really',
        -- date
        '12/20/2016',
        -- pub, thumb
        1, '',
        -- title
        'underpainting',
        -- key
        'underpainting',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- missed stuff from feb mechanical
    (
        -- id
        10,
        -- author id
        22,
        -- content
        'This is one more mechanical engineering article, because it is cool and related to industrial design',
        -- date
        '01/30/2017',
        -- pub, thumb
        1, '',
        -- title
        'one more mechanical',
        -- key
        'one-more-mechanical',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- missing two robotocs from feb
    (
        -- id
        11,
        -- author id
        22,
        -- content
        'Another robotics article posted in feb, about ai',
        -- date
        '02/04/2017',
        -- pub, thumb
        1, '',
        -- title
        'robotics ai',
        -- key
        'robotics-ai',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        12,
        -- author id
        22,
        -- content
        'Water based actuators are a viable alternative to magnets',
        -- date
        '02/05/2017',
        -- pub, thumb
        1, '',
        -- title
        'water based actuators',
        -- key
        'water-based-actuators',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- missing software article from jan
    (
        -- id
        13,
        -- author id
        22,
        -- content
        'Article filler sample data software engineering in January',
        -- date
        '01/15/2017',
        -- pub, thumb
        1, '',
        -- title
        'filler engineering',
        -- key
        'filler-engineering',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- missing robotics article from jan
    (
        -- id
        14,
        -- author id
        22,
        -- content
        'Locomotion is hard, especially chaining those paths together.',
        -- date
        '01/06/2017',
        -- pub, thumb
        1, '',
        -- title
        'quadrupedal locomotion',
        -- key
        'quadrupedal-locomotion',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- continue dec 5 - dec 11
    (
        -- id
        15,
        -- author id
        22,
        -- content
        'The tolerance stack, you know, something terribly exciting and useful.',
        -- date
        '12/05/2016',
        -- pub, thumb
        1, '',
        -- title
        'the tolerance stack',
        -- key
        'the-tolerance-stack',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    (
        -- id
        16,
        -- author id
        22,
        -- content
        'Machining difficult parts is often more expensive than laser cutting, which is more expensive than casting.',
        -- date
        '12/05/2016',
        -- pub, thumb
        1, '',
        -- title
        'machining, laser cutting, or investing',
        -- key
        'machining-laser-cutting-investing',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- nov 14 - nov 20
    -- design-ui
    (
        -- id
        17,
        -- author id
        22,
        -- content
        'The use of grids in ui design is extremely important.',
        -- date
        '11/16/2016',
        -- pub, thumb
        1, '',
        -- title
        'grids in design',
        -- key
        'grids-in-design',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-robotics #1
    (
        -- id
        18,
        -- author id
        22,
        -- content
        'Robotics is all about them busses and controllers.',
        -- date
        '11/17/2016',
        -- pub, thumb
        1, '',
        -- title
        'controllers and buses',
        -- key
        'controllers-and-buses',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-robotics #2
    (
        -- id
        19,
        -- author id
        22,
        -- content
        'Robotics is also much about sensors.',
        -- date
        '11/19/2016',
        -- pub, thumb
        1, '',
        -- title
        'much about sensors',
        -- key
        'much-about-sensors',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-robotics #2
    (
        -- id
        20,
        -- author id
        22,
        -- content
        'Point cloud computer vision in robotics.',
        -- date
        '11/20/2016',
        -- pub, thumb
        1, '',
        -- title
        'point cloud computer vision',
        -- key
        'point-cloud-computer-vision',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- nov 7 - nov 13
    -- painting
    (
        -- id
        21,
        -- author id
        22,
        -- content
        'Do not overuse the shiny stuff when painting, it ruins everything but smells good.',
        -- date
        '11/08/2016',
        -- pub, thumb
        1, '',
        -- title
        'painting addons',
        -- key
        'painting-addons',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- design web
    (
        -- id
        22,
        -- author id
        22,
        -- content
        'Web desining pairs well with coffee.',
        -- date
        '11/11/2016',
        -- pub, thumb
        1, '',
        -- title
        'web code and coffee',
        -- key
        'web-code-and-coffee',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- oct 24 - 30
    -- design industrial
    (
        -- id
        23,
        -- author id
        22,
        -- content
        'Industrial design is mostly about desk drawers',
        -- date
        '10/26/2016',
        -- pub, thumb
        1, '',
        -- title
        'desk drawers and industrial design',
        -- key
        'desk-drawers-and-industrial-design',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- oct 10 - 16
    (
        -- id
        24,
        -- author id
        22,
        -- content
        'React optimizations are mostly about shouldComponentUpdate',
        -- date
        '11/12/2016',
        -- pub, thumb
        1, '',
        -- title
        'optimizing react apps',
        -- key
        'optimizing-react-apps',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- sep 26 - oct 2
    -- art-music 1
    (
        -- id
        25,
        -- author id
        22,
        -- content
        'Compressor side chaining allows you to stop pumping so much with drums and bass.',
        -- date
        '09/27/2016',
        -- pub, thumb
        1, '',
        -- title
        'compressor side chain',
        -- key
        'compressor-side-chain',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- art-music 2
    (
        -- id
        26,
        -- author id
        22,
        -- content
        'Cut the guitars pretty high on the low frequencies to leave breathing room for bass and kick. Basses sound better than low guitars anyway.',
        -- date
        '10/01/2016',
        -- pub, thumb
        1, '',
        -- title
        'guitar frequencies',
        -- key
        'guitar-frequencies',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-electrical
    (
        -- id
        27,
        -- author id
        22,
        -- content
        'Do not stick your fingers in power outlets. Do not re-drill power outlets to accept fingers.',
        -- date
        '10/02/2016',
        -- pub, thumb
        1, '',
        -- title
        'hacking power outlets',
        -- key
        'hacking-power-outlets',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- sep 19 - sep 25
    -- art-painting
    (
        -- id
        28,
        -- author id
        22,
        -- content
        'Always wash your brushes, and if you cant find something that does the job, look harder',
        -- date
        '09/20/2016',
        -- pub, thumb
        1, '',
        -- title
        'cleaning up after painting',
        -- key
        'cleaning-up-after-painting',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-electrical 1
    (
        -- id
        29,
        -- author id
        22,
        -- content
        'Double check your stuff on an oscilloscope',
        -- date
        '09/22/2016',
        -- pub, thumb
        1, '',
        -- title
        'using oscilloscopes',
        -- key
        'using-oscilloscopes',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-electrical 2
    (
        -- id
        30,
        -- author id
        22,
        -- content
        'Use smoke absorption devices when welding inside',
        -- date
        '09/23/2016',
        -- pub, thumb
        1, '',
        -- title
        'smoke absorption',
        -- key
        'smoke-absorption',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-electrical 3
    (
        -- id
        31,
        -- author id
        22,
        -- content
        'Never touch open capacitors no matter how small',
        -- date
        '09/24/2016',
        -- pub, thumb
        1, '',
        -- title
        'capacitor safety tips',
        -- key
        'capacitor-safety-tips',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- sep 12 - sep 18
    (
        -- id
        32,
        -- author id
        22,
        -- content
        'Design fillets to fall off gradually, this makes them look designed.',
        -- date
        '09/12/2016',
        -- pub, thumb
        1, '',
        -- title
        'fillet design',
        -- key
        'fillet-design',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- sep 5 - sep 11
    (
        -- id
        33,
        -- author id
        22,
        -- content
        'Know your common algorithms big O notation cause it is truly NOT useful.',
        -- date
        '09/08/2016',
        -- pub, thumb
        1, '',
        -- title
        'the big o notation',
        -- key
        'the-big-o-notation',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- aug 22 - sep 4
    -- arts-crafts
    (
        -- id
        34,
        -- author id
        22,
        -- content
        'Polishing high-quality models can be done with Tamiya primer.',
        -- date
        '08/23/2016',
        -- pub, thumb
        1, '',
        -- title
        'polishing 3d prints',
        -- key
        'polishing-3d-prints',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- design-web
    (
        -- id
        35,
        -- author id
        22,
        -- content
        'Using GraphQL as an API gateway between backend and middle tier',
        -- date
        '08/23/2016',
        -- pub, thumb
        1, '',
        -- title
        'graphql in an api gateway',
        -- key
        'graph-ql-in-an-api-gateway',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-mechanical
    (
        -- id
        36,
        -- author id
        22,
        -- content
        'Provide real drawings with ISO renderings',
        -- date
        '08/24/2016',
        -- pub, thumb
        1, '',
        -- title
        'iso views in drawings',
        -- key
        'iso-views-in-drawings',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-robotics
    (
        -- id
        37,
        -- author id
        22,
        -- content
        'An overview of stability margins used in generating walking gaits',
        -- date
        '09/03/2016',
        -- pub, thumb
        1, '',
        -- title
        'stability margins',
        -- key
        'stability-margins',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- aug 15-21
    -- art-painting 1
    (
        -- id
        38,
        -- author id
        22,
        -- content
        'Choosing a stable platform for painting, that you can reproduce every day, is important to producing quality work.',
        -- date
        '08/16/2016',
        -- pub, thumb
        1, '',
        -- title
        'the painting platform',
        -- key
        'the-painting-platform',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- art-painting 2
    (
        -- id
        39,
        -- author id
        22,
        -- content
        'Use palette knives to obtain stucco effects.',
        -- date
        '08/18/2016',
        -- pub, thumb
        1, '',
        -- title
        'using palette knives',
        -- key
        'using-palette-knives',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- design-cad
    (
        -- id
        40,
        -- author id
        22,
        -- content
        'Design all the large featues first, according to their proportion to each other and the model.',
        -- date
        '08/20/2016',
        -- pub, thumb
        1, '',
        -- title
        'draft large features first',
        -- key
        'draft-large-features-first',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- design-industrial
    (
        -- id
        41,
        -- author id
        22,
        -- content
        'Yet another industrial design article.',
        -- date
        '08/21/2016',
        -- pub, thumb
        1, '',
        -- title
        'more on design',
        -- key
        'more-on-design',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- design-web
    (
        -- id
        42,
        -- author id
        22,
        -- content
        'One more web design article.',
        -- date
        '08/21/2016',
        -- pub, thumb
        1, '',
        -- title
        'one more web design',
        -- key
        'one-more-web-design',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- aug 8 - aug 14
    -- design-industrial
    (
        -- id
        43,
        -- author id
        22,
        -- content
        'Polycurves in design can be formulated.',
        -- date
        '08/08/2016',
        -- pub, thumb
        1, '',
        -- title
        'polycurves in design',
        -- key
        'polycurves-in-design',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- design-web 1
    (
        -- id
        44,
        -- author id
        22,
        -- content
        'Amazon API gateways are hard to setup, but eventually worth it.',
        -- date
        '08/10/2016',
        -- pub, thumb
        1, '',
        -- title
        'amazon api gateways',
        -- key
        'amazon-api-gateways',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- design-web 2
    (
        -- id
        45,
        -- author id
        22,
        -- content
        'SVG handling in browsers is still not ready for prime time, but closer than ever.',
        -- date
        '08/12/2016',
        -- pub, thumb
        1, '',
        -- title
        'browser svg handling',
        -- key
        'browser-svg-handling',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- aug 1 - aug 7
    -- engineering-robotics 1
    (
        -- id
        46,
        -- author id
        22,
        -- content
        'This is the very first robotics article posted on the site. Worth a reference.',
        -- date
        '08/01/2016',
        -- pub, thumb
        1, '',
        -- title
        'first robotics article',
        -- key
        'first-robotics-article',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-robotics 1
    (
        -- id
        47,
        -- author id
        22,
        -- content
        'Point cloud processing is the most common way to detect geometry blobs for collision detection. Do it with infra though, no need for lights and shadows interfering.',
        -- date
        '08/03/2016',
        -- pub, thumb
        1, '',
        -- title
        'point cloud detection',
        -- key
        'point-cloud-detection',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-robotics 3
    (
        -- id
        48,
        -- author id
        22,
        -- content
        'Correctly calculating moments of inertia is integral to manufacturing a stable robot.',
        -- date
        '08/07/2016',
        -- pub, thumb
        1, '',
        -- title
        'calculating moments of inertia',
        -- key
        'calculating-moments-of-inertia',
        -- optional
        NULL, NULL, NULL, 0, 0
    ),
    -- engineering-software
    (
        -- id
        49,
        -- author id
        22,
        -- content
        'Inversion of control started getting big a couple of years ago and quickly became mainstream.',
        -- date
        '08/07/2016',
        -- pub, thumb
        1, '',
        -- title
        'inversion of control',
        -- key
        'inversion-of-control',
        -- optional
        NULL, NULL, NULL, 0, 0
    );

COMMIT TRANSACTION;

BEGIN TRANSACTION;

    INSERT INTO Metadata (
        Id,
        ArticleId,
        TagId
    )

    -- tags --

    VALUES
    -- article 1 > story
    (
        -- meta id --
        1,
        -- article id --
        1,
        -- tag id --
        1
    ),
    -- article 1 > design
    (
        -- meta id --
        2,
        -- article id --
        1,
        -- tag id --
        10
    ),
    -- article 1 > web
    (
        -- meta id --
        3,
        -- article id --
        1,
        -- tag id --
        12
    ),
    -- article 2 > story
    (
        -- meta id --
        4,
        -- article id --
        2,
        -- tag id --
        1
    ),
    -- article 2 > engineering
    (
        -- meta id --
        5,
        -- article id --
        2,
        -- tag id --
        5
    ),
    -- article 2 > mechanical
    (
        -- meta id --
        6,
        -- article id --
        2,
        -- tag id --
        7
    ),
    -- article 3 > story
    (
        -- meta id --
        7,
        -- article id --
        3,
        -- tag id --
        1
    ),
    -- article 3 > engineering
    (
        -- meta id --
        8,
        -- article id --
        3,
        -- tag id --
        5
    ),
    -- article 3 > robotics
    (
        -- meta id --
        9,
        -- article id --
        3,
        -- tag id --
        9
    ),
    -- article 4 > story
    (
        -- meta id --
        10,
        -- article id --
        4,
        -- tag id --
        1
    ),
    -- article 4 > engineering
    (
        -- meta id --
        11,
        -- article id --
        4,
        -- tag id --
        5
    ),
    -- article 4 > software
    (
        -- meta id --
        12,
        -- article id --
        4,
        -- tag id --
        8
    ),
        -- article 5 > story
    (
        -- meta id --
        13,
        -- article id --
        5,
        -- tag id --
        1
    ),
    -- article 5 > engineering
    (
        -- meta id --
        14,
        -- article id --
        5,
        -- tag id --
        5
    ),
    -- article 5 > software
    (
        -- meta id --
        15,
        -- article id --
        5,
        -- tag id --
        8
    ),
    -- article 6 > story
    (
        -- meta id --
        16,
        -- article id --
        6,
        -- tag id --
        1
    ),
    -- article 6 > art
    (
        -- meta id --
        17,
        -- article id --
        6,
        -- tag id --
        19
    ),
    -- article 6 > music
    (
        -- meta id --
        18,
        -- article id --
        6,
        -- tag id --
        20
    ),
    -- article 7 > story
    (
        -- meta id --
        19,
        -- article id --
        7,
        -- tag id --
        1
    ),
    -- article 7 > design
    (
        -- meta id --
        20,
        -- article id --
        7,
        -- tag id --
        10
    ),
    -- article 7 > web
    (
        -- meta id --
        21,
        -- article id --
        7,
        -- tag id --
        12
    ),
    -- article 8 > story
    (
        -- meta id --
        146,
        -- article id --
        8,
        -- tag id --
        1
    ),
    -- article 8 > engineering
    (
        -- meta id --
        22,
        -- article id --
        8,
        -- tag id --
        5
    ),
    -- article 8 > robotics
    (
        -- meta id --
        23,
        -- article id --
        8,
        -- tag id --
        9
    ),
    -- article 9 > story
    (
        -- meta id --
        24,
        -- article id --
        9,
        -- tag id --
        1
    ),
    -- article 9 > art
    (
        -- meta id --
        25,
        -- article id --
        9,
        -- tag id --
        19
    ),
    -- article 9 > painting
    (
        -- meta id --
        26,
        -- article id --
        9,
        -- tag id --
        21
    ),
    -- article 10 > story
    (
        -- meta id --
        27,
        -- article id --
        10,
        -- tag id --
        1
    ),
    -- article 10 > engineering
    (
        -- meta id --
        28,
        -- article id --
        10,
        -- tag id --
        5
    ),
    -- article 10 > mechanical
    (
        -- meta id --
        29,
        -- article id --
        10,
        -- tag id --
        7
    ),
    -- article 11 > story
    (
        -- meta id --
        30,
        -- article id --
        11,
        -- tag id --
        1
    ),
    -- article 11 > engineering
    (
        -- meta id --
        31,
        -- article id --
        11,
        -- tag id --
        5
    ),
    -- article 11 > robotics
    (
        -- meta id --
        32,
        -- article id --
        11,
        -- tag id --
        9
    ),
    -- article 12 > story
    (
        -- meta id --
        33,
        -- article id --
        12,
        -- tag id --
        1
    ),
    -- article 12 > engineering
    (
        -- meta id --
        34,
        -- article id --
        12,
        -- tag id --
        5
    ),
    -- article 11 > robotics
    (
        -- meta id --
        35,
        -- article id --
        12,
        -- tag id --
        9
    ),
    -- article 13 > story
    (
        -- meta id --
        36,
        -- article id --
        13,
        -- tag id --
        1
    ),
    -- article 13 > engineering
    (
        -- meta id --
        37,
        -- article id --
        13,
        -- tag id --
        5
    ),
    -- article 13 > software
    (
        -- meta id --
        38,
        -- article id --
        13,
        -- tag id --
        8
    ),
    -- article 14 > story
    (
        -- meta id --
        39,
        -- article id --
        14,
        -- tag id --
        1
    ),
    -- article 14 > engineering
    (
        -- meta id --
        40,
        -- article id --
        14,
        -- tag id --
        5
    ),
    -- article 14 > robotics
    (
        -- meta id --
        41,
        -- article id --
        14,
        -- tag id --
        9
    ),
    -- article 15 > story
    (
        -- meta id --
        42,
        -- article id --
        15,
        -- tag id --
        1
    ),
    -- article 15 > engineering
    (
        -- meta id --
        43,
        -- article id --
        15,
        -- tag id --
        5
    ),
    -- article 15 > mechanical
    (
        -- meta id --
        44,
        -- article id --
        15,
        -- tag id --
        7
    ),
    -- article 16 > story
    (
        -- meta id --
        45,
        -- article id --
        16,
        -- tag id --
        1
    ),
    -- article 16 > engineering
    (
        -- meta id --
        46,
        -- article id --
        16,
        -- tag id --
        5
    ),
    -- article 16 > mechanical
    (
        -- meta id --
        47,
        -- article id --
        16,
        -- tag id --
        7
    ),
    -- article 17 > story
    (
        -- meta id --
        48,
        -- article id --
        17,
        -- tag id --
        1
    ),
    -- article 17 > design
    (
        -- meta id --
        49,
        -- article id --
        17,
        -- tag id --
        10
    ),
    -- article 17 > ui
    (
        -- meta id --
        50,
        -- article id --
        17,
        -- tag id --
        13
    ),
    -- article 18 > story
    (
        -- meta id --
        51,
        -- article id --
        18,
        -- tag id --
        1
    ),
    -- article 18 > engineering
    (
        -- meta id --
        52,
        -- article id --
        18,
        -- tag id --
        5
    ),
    -- article 18 > robotics
    (
        -- meta id --
        53,
        -- article id --
        18,
        -- tag id --
        9
    ),
    -- article 19 > story
    (
        -- meta id --
        54,
        -- article id --
        19,
        -- tag id --
        1
    ),
    -- article 19 > engineering
    (
        -- meta id --
        55,
        -- article id --
        19,
        -- tag id --
        5
    ),
    -- article 19 > robotics
    (
        -- meta id --
        56,
        -- article id --
        19,
        -- tag id --
        9
    ),
    -- article 20 > story
    (
        -- meta id --
        57,
        -- article id --
        20,
        -- tag id --
        1
    ),
    -- article 20 > engineering
    (
        -- meta id --
        58,
        -- article id --
        20,
        -- tag id --
        5
    ),
    -- article 20 > robotics
    (
        -- meta id --
        59,
        -- article id --
        20,
        -- tag id --
        9
    ),
    -- article 21 > story
    (
        -- meta id --
        60,
        -- article id --
        21,
        -- tag id --
        1
    ),
    -- article 21 > art
    (
        -- meta id --
        61,
        -- article id --
        21,
        -- tag id --
        19
    ),
    -- article 21 > painting
    (
        -- meta id --
        62,
        -- article id --
        21,
        -- tag id --
        21
    ),
    -- article 22 > story
    (
        -- meta id --
        63,
        -- article id --
        22,
        -- tag id --
        1
    ),
    -- article 22 > design
    (
        -- meta id --
        64,
        -- article id --
        22,
        -- tag id --
        10
    ),
    -- article 22 > web
    (
        -- meta id --
        65,
        -- article id --
        22,
        -- tag id --
        12
    ),
    -- article 23 > story
    (
        -- meta id --
        66,
        -- article id --
        23,
        -- tag id --
        1
    ),
    -- article 23 > design
    (
        -- meta id --
        67,
        -- article id --
        23,
        -- tag id --
        10
    ),
    -- article 23 > industrial
    (
        -- meta id --
        68,
        -- article id --
        23,
        -- tag id --
        16
    ),
    -- article 24 > story
    (
        -- meta id --
        69,
        -- article id --
        24,
        -- tag id --
        1
    ),
    -- article 24 > design
    (
        -- meta id --
        70,
        -- article id --
        24,
        -- tag id --
        10
    ),
    -- article 24 > web
    (
        -- meta id --
        71,
        -- article id --
        24,
        -- tag id --
        12
    ),
    -- article 25 > story
    (
        -- meta id --
        72,
        -- article id --
        25,
        -- tag id --
        1
    ),
    -- article 25 > art
    (
        -- meta id --
        73,
        -- article id --
        25,
        -- tag id --
        19
    ),
    -- article 25 > music
    (
        -- meta id --
        74,
        -- article id --
        25,
        -- tag id --
        20
    ),
    -- article 26 > story
    (
        -- meta id --
        75,
        -- article id --
        26,
        -- tag id --
        1
    ),
    -- article 26 > art
    (
        -- meta id --
        76,
        -- article id --
        26,
        -- tag id --
        19
    ),
    -- article 26 > music
    (
        -- meta id --
        77,
        -- article id --
        26,
        -- tag id --
        20
    ),
    -- article 27 > story
    (
        -- meta id --
        78,
        -- article id --
        27,
        -- tag id --
        1
    ),
    -- article 27 > engineering
    (
        -- meta id --
        79,
        -- article id --
        27,
        -- tag id --
        5
    ),
    -- article 27 > electrical
    (
        -- meta id --
        80,
        -- article id --
        27,
        -- tag id --
        6
    ),
    -- article 28 > story
    (
        -- meta id --
        81,
        -- article id --
        28,
        -- tag id --
        1
    ),
    -- article 28 > art
    (
        -- meta id --
        82,
        -- article id --
        28,
        -- tag id --
        19
    ),
    -- article 28 > painting
    (
        -- meta id --
        83,
        -- article id --
        28,
        -- tag id --
        21
    ),
    -- article 29 > story
    (
        -- meta id --
        84,
        -- article id --
        29,
        -- tag id --
        1
    ),
    -- article 29 > engineering
    (
        -- meta id --
        85,
        -- article id --
        29,
        -- tag id --
        5
    ),
    -- article 29 > electrical
    (
        -- meta id --
        86,
        -- article id --
        29,
        -- tag id --
        6
    ),
    -- article 30 > story
    (
        -- meta id --
        87,
        -- article id --
        30,
        -- tag id --
        1
    ),
    -- article 30 > engineering
    (
        -- meta id --
        88,
        -- article id --
        30,
        -- tag id --
        5
    ),
    -- article 30 > electrical
    (
        -- meta id --
        89,
        -- article id --
        30,
        -- tag id --
        6
    ),
    -- article 31 > story
    (
        -- meta id --
        90,
        -- article id --
        31,
        -- tag id --
        1
    ),
    -- article 31 > engineering
    (
        -- meta id --
        91,
        -- article id --
        31,
        -- tag id --
        5
    ),
    -- article 31 > electrical
    (
        -- meta id --
        92,
        -- article id --
        31,
        -- tag id --
        6
    ),
    -- article 32 > story
    (
        -- meta id --
        93,
        -- article id --
        32,
        -- tag id --
        1
    ),
    -- article 32 > design
    (
        -- meta id --
        94,
        -- article id --
        32,
        -- tag id --
        10
    ),
    -- article 32 > design
    (
        -- meta id --
        95,
        -- article id --
        32,
        -- tag id --
        16
    ),
    -- article 33 > story
    (
        -- meta id --
        96,
        -- article id --
        33,
        -- tag id --
        1
    ),
    -- article 33 > engineering
    (
        -- meta id --
        97,
        -- article id --
        33,
        -- tag id --
        5
    ),
    -- article 33 > software
    (
        -- meta id --
        98,
        -- article id --
        33,
        -- tag id --
        8
    ),
    -- article 34 > story
    (
        -- meta id --
        99,
        -- article id --
        34,
        -- tag id --
        1
    ),
    -- article 34 > art
    (
        -- meta id --
        100,
        -- article id --
        34,
        -- tag id --
        19
    ),
    -- article 35 > story
    (
        -- meta id --
        101,
        -- article id --
        35,
        -- tag id --
        1
    ),
    -- article 35 > design
    (
        -- meta id --
        102,
        -- article id --
        35,
        -- tag id --
        10
    ),
    -- article 35 > web
    (
        -- meta id --
        103,
        -- article id --
        35,
        -- tag id --
        12
    ),
    -- article 36 > story
    (
        -- meta id --
        104,
        -- article id --
        36,
        -- tag id --
        1
    ),
    -- article 36 > engineering
    (
        -- meta id --
        105,
        -- article id --
        36,
        -- tag id --
        5
    ),
    -- article 36 > mechanical
    (
        -- meta id --
        106,
        -- article id --
        36,
        -- tag id --
        7
    ),
    -- article 37 > story
    (
        -- meta id --
        107,
        -- article id --
        37,
        -- tag id --
        1
    ),
    -- article 37 > engineering
    (
        -- meta id --
        108,
        -- article id --
        37,
        -- tag id --
        5
    ),
    -- article 37 > robotics
    (
        -- meta id --
        109,
        -- article id --
        37,
        -- tag id --
        9
    ),
    -- article 38 > story
    (
        -- meta id --
        110,
        -- article id --
        38,
        -- tag id --
        1
    ),
    -- article 38 > art
    (
        -- meta id --
        111,
        -- article id --
        38,
        -- tag id --
        19
    ),
    -- article 38 > painting
    (
        -- meta id --
        112,
        -- article id --
        38,
        -- tag id --
        21
    ),
    -- article 39 > story
    (
        -- meta id --
        113,
        -- article id --
        39,
        -- tag id --
        1
    ),
    -- article 39 > art
    (
        -- meta id --
        114,
        -- article id --
        39,
        -- tag id --
        19
    ),
    -- article 39 > painting
    (
        -- meta id --
        115,
        -- article id --
        39,
        -- tag id --
        21
    ),
    -- article 40 > story
    (
        -- meta id --
        116,
        -- article id --
        40,
        -- tag id --
        1
    ),
    -- article 40 > design
    (
        -- meta id --
        117,
        -- article id --
        40,
        -- tag id --
        10
    ),
    -- article 40 > cad
    (
        -- meta id --
        118,
        -- article id --
        40,
        -- tag id --
        15
    ),
    -- article 41 > story
    (
        -- meta id --
        119,
        -- article id --
        41,
        -- tag id --
        1
    ),
    -- article 41 > design
    (
        -- meta id --
        120,
        -- article id --
        41,
        -- tag id --
        10
    ),
    -- article 41 > industrial
    (
        -- meta id --
        121,
        -- article id --
        41,
        -- tag id --
        16
    ),
    -- article 42 > story
    (
        -- meta id --
        122,
        -- article id --
        42,
        -- tag id --
        1
    ),
    -- article 42 > design
    (
        -- meta id --
        123,
        -- article id --
        42,
        -- tag id --
        10
    ),
    -- article 42 > web
    (
        -- meta id --
        124,
        -- article id --
        42,
        -- tag id --
        12
    ),
    -- article 43 > story
    (
        -- meta id --
        125,
        -- article id --
        43,
        -- tag id --
        1
    ),
    -- article 43 > design
    (
        -- meta id --
        126,
        -- article id --
        43,
        -- tag id --
        10
    ),
    -- article 43 > industrial
    (
        -- meta id --
        127,
        -- article id --
        43,
        -- tag id --
        16
    ),
    -- article 44 > story
    (
        -- meta id --
        128,
        -- article id --
        44,
        -- tag id --
        1
    ),
    -- article 44 > design
    (
        -- meta id --
        129,
        -- article id --
        44,
        -- tag id --
        10
    ),
    -- article 44 > web
    (
        -- meta id --
        130,
        -- article id --
        44,
        -- tag id --
        12
    ),
    -- article 45 > story
    (
        -- meta id --
        131,
        -- article id --
        45,
        -- tag id --
        1
    ),
    -- article 45 > design
    (
        -- meta id --
        132,
        -- article id --
        45,
        -- tag id --
        10
    ),
    -- article 45 > web
    (
        -- meta id --
        133,
        -- article id --
        45,
        -- tag id --
        12
    ),
    -- article 46 > story
    (
        -- meta id --
        134,
        -- article id --
        46,
        -- tag id --
        1
    ),
    -- article 46 > engineering
    (
        -- meta id --
        135,
        -- article id --
        46,
        -- tag id --
        5
    ),
    -- article 46 > robotics
    (
        -- meta id --
        136,
        -- article id --
        46,
        -- tag id --
        9
    ),
    -- article 47 > story
    (
        -- meta id --
        137,
        -- article id --
        47,
        -- tag id --
        1
    ),
    -- article 47 > engineering
    (
        -- meta id --
        138,
        -- article id --
        47,
        -- tag id --
        5
    ),
    -- article 47 > robotics
    (
        -- meta id --
        139,
        -- article id --
        47,
        -- tag id --
        9
    ),
    -- article 48 > story
    (
        -- meta id --
        140,
        -- article id --
        48,
        -- tag id --
        1
    ),
    -- article 48 > engineering
    (
        -- meta id --
        141,
        -- article id --
        48,
        -- tag id --
        5
    ),
    -- article 48 > robotics
    (
        -- meta id --
        142,
        -- article id --
        48,
        -- tag id --
        9
    ),
    -- article 49 > story
    (
        -- meta id --
        143,
        -- article id --
        49,
        -- tag id --
        1
    ),
    -- article 49 > engineering
    (
        -- meta id --
        144,
        -- article id --
        49,
        -- tag id --
        5
    ),
    -- article 49 > software
    (
        -- meta id --
        145,
        -- article id --
        49,
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
