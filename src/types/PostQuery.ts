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
import LogQuery from './LogQuery';

type PostDetailsQuery = {
  slug: string;
  body: string;
  timeToRead?: number;
  frontmatter: PostMetadataQuery;
  fields: {
    url: string;
    collection: string;
    subCollection?: string;
    tags: Array<string>;
  };
  headings: Array<HeadingQuery>;
  post: PostDetailsQuery;
  tagGroups: TagsQuery;
  project?: {
    frontmatter: {
      title: string;
    };
    fields: {
      url: string;
    };
  };
  logs: {
    nodes: LogQuery[];
  };
  site: {
    siteMetadata: SiteMetadataQuery;
  };
};

export default PostDetailsQuery;
