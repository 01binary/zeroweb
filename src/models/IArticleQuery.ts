import IArticleMetadata from '../models/IArticleMetadata';

interface IArticleContent {
    html: string,
    frontmatter: IArticleMetadata
}

interface IArticleQuery {
    mdx: IArticleContent
}

export default IArticleQuery;
