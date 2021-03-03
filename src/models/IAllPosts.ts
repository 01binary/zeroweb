import IPost from './IPost';

export interface IPosts {
    nodes: Array<Partial<IPost>>
};

export interface IAllPosts {
    allMdx: IPosts
};
