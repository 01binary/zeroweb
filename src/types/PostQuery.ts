/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  GraphQL post details query.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import PostMetadataQuery from './PostMetadataQuery';
import HeadingQuery from './HeadingQuery';
import TagsQuery from './TagsQuery';

interface PostFieldsQuery {
  url: string;
  collection: string;
  tags: Array<string>;
};

interface PostDetailsQuery {
  slug: string;
  body: string;
  timeToRead?: number;
  frontmatter: PostMetadataQuery;
  fields: PostFieldsQuery;
  headings: Array<HeadingQuery>;
  mdx: PostDetailsQuery;
  allMdx: TagsQuery;
};

export default PostDetailsQuery;
