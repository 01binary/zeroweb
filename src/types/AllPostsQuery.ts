/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GraphQL query that returns a post heading.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import PostQuery from './PostQuery';
import { TagGroup } from './TagsQuery';

export interface PostsQuery {
  nodes: Array<Partial<PostQuery>>;
  group: Array<TagGroup>;
};

export interface AllPostsQuery {
  allMdx: PostsQuery;
};
