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
import SiteMetadataQuery from './SiteMetadataQuery';

type PostDetailsQuery = {
  slug: string;
  body: string;
  timeToRead?: number;
  frontmatter: PostMetadataQuery;
  fields: {
    url: string;
    collection: string;
    tags: Array<string>;
  };
  headings: Array<HeadingQuery>;
  mdx: PostDetailsQuery;
  allMdx: TagsQuery;
  site: {
    siteMetadata: SiteMetadataQuery;
  };
};

export default PostDetailsQuery;
