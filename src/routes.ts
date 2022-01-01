/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Application route constants.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

type Route = {
  collection: string;
  path: string;
};

export const CONTENT: Route[] = [
  {
    collection: 'articles',
    path: '/',
  },
  {
    collection: 'projects',
    path: '/projects',
  },
];

const ROUTES: Route[] = [
  ...CONTENT,
  {
    collection: 'about',
    path: '/about',
  },
];

export const getPathForCollection = (coll: string) =>
  CONTENT.find(({ collection }) => collection === coll)?.path;

export default ROUTES;
