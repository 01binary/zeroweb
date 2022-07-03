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

export type PostsQuery = {
  nodes: Array<PostQuery>;
  group: Array<TagGroup>;
};

export type AllPostsQuery = {
  allMdx: PostsQuery;
};
