import IArticleMetadata from '../models/IArticleMetadata';

interface IArticle {
    frontmatter: IArticleMetadata,
    slug: string,
    timeToRead: number
}

interface IArticlesQuery {
    nodes: Array<IArticle>
};

export default IArticlesQuery;
