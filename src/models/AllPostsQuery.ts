import PostQuery from './PostQuery';

export interface PostsQuery {
    nodes: Array<Partial<PostQuery>>;
};

export interface AllPosts {
    allMdx: PostsQuery;
};
