import IArticleMetadata from '../models/IArticleMetadata';

interface IArticleContent {
    slug: string,
    body: string,
    frontmatter: IArticleMetadata
}

interface IArticleQuery {
    mdx: IArticleContent
}

export default IArticleQuery;
