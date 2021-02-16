import IPostMetadata from './IPostMetadata';

interface IPostFields {
    collection: string,
    allTags: Array<string>
}

interface IPost {
    slug: string,
    body: string,
    timeToRead: number,
    frontmatter: IPostMetadata,
    fields: IPostFields
}

interface IPost {
    mdx: IPost
}

export default IPost;
