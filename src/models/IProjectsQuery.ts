import IArticleMetadata from '../models/IArticleMetadata';

interface IProject {
    frontmatter: IArticleMetadata,
    slug: string
}

interface IProjectsQuery {
    nodes: Array<IProject>
};

interface IProjectIndexQuery {
    allMdx: IProjectsQuery
};

export default IProjectIndexQuery;
