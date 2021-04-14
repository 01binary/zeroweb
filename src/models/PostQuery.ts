import PostMetadataQuery from './PostMetadataQuery';
import HeadingQuery from './HeadingQuery';

interface PostFieldsQuery {
    url: string;
    collection: string;
    tags: Array<string>;
};

interface PostDetailsQuery {
    slug: string;
    body: string;
    timeToRead?: number;
    frontmatter: PostMetadataQuery;
    fields: PostFieldsQuery;
    headings: Array<HeadingQuery>;
    mdx: PostDetailsQuery;
};

export default PostDetailsQuery;
