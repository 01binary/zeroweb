import IArticleMetadata from '../models/IArticleMetadata';

interface IArticle {
    frontmatter: IArticleMetadata,
    slug: string,
    timeToRead: number
}

interface IArticlesQuery {
    nodes: Array<IArticle>
};

interface IArticleIndexQuery {
    allMdx: IArticlesQuery
};

export default IArticleIndexQuery;
