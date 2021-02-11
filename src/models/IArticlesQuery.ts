export interface IArticleMetadata {
    title: string,
    date: string,
    tags: string
}

export interface IArticle {
    frontmatter: IArticleMetadata,
    slug: string,
    timeToRead: number
}

export interface IArticles {
    node: IArticle
}

export interface IArticlesQuery {
    edges: Array<IArticles>
};
