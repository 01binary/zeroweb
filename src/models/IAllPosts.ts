import IPostMetadata from './IPostMetadata';
import IPost from './IPost';

interface IPosts {
    nodes: Array<Partial<IPost>>
};

interface IAllPosts {
    allMdx: IPosts
};

export default IAllPosts;
