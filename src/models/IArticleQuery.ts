import IArticleMetadata from './IArticleMetadata';

interface IArticle {
    slug: string,
    body: string,
    timeToRead: number,
    frontmatter: IArticleMetadata
}

interface IArticleQuery {
    mdx: IArticle
}

export default IArticleQuery;
