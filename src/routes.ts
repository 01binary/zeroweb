interface Route {
    collection: string;
    path: string;
};

export const CONTENT: Route[] = [
    {
        collection: 'articles',
        path: '/'
    },
    {
        collection: 'projects',
        path: '/projects'
    }
];

const ROUTES: Route[] = [
    ...CONTENT,
    {
        collection: 'about',
        path: '/about'
    }
];

export default ROUTES;