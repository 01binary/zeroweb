import IArticleMetadata from './IArticleMetadata';

interface IArticleFields {
    collection: string
}

interface IArticle {
    slug: string,
    body: string,
    timeToRead: number,
    frontmatter: IArticleMetadata,
    fields: IArticleFields
}

interface IArticleQuery {
    mdx: IArticle
}

export default IArticleQuery;
