import IPostMetadata from './IPostMetadata';
import IHeading from './IHeading';

interface IPostFields {
    url: string,
    collection: string,
    tags: Array<string>
}

interface IPost {
    slug: string,
    body: string,
    timeToRead?: number,
    frontmatter: IPostMetadata,
    fields: IPostFields,
    headings: Array<IHeading>
}

interface IPost {
    mdx: IPost
}

export default IPost;
