interface TagsQuery {
    group: TagGroup[];
};

export interface TagGroup {
    tag: string,
    totalCount: number
};

export default TagsQuery;
