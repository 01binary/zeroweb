import React, { FC, useContext } from 'react';
import { graphql, Link } from 'gatsby';
import { getTagDescriptionById } from '../components/TagList';
import Title from '../components/Title';
import PostList from '../components/PostList';
import Summary from '../components/Summary';
import { AllPostsQuery } from '../models/AllPostsQuery';

interface IndexPageContext {
  tag: string;
  collection: string;
  numberOfPages: number;
  pageNumber: number;
  humanPageNumber: number;
  previousPagePath: string;
  nextPagePath: string;
};

interface IndexQuery {
  data: AllPostsQuery;
  pageContext: IndexPageContext;
};

const getCollectionText = (collection: string) => (
  collection[0].toUpperCase() + collection.substr(1)
);

/**
 * Index page for articles and projects
 * @param props - The index page query.
 * @returns The index page content.
 */
const PostIndex: FC<IndexQuery> = ({
  pageContext: {
    tag,
    collection,
    pageNumber,
    numberOfPages,
    nextPagePath,
    previousPagePath
  },
  data: {
    allMdx: {
      nodes,
      group
    }
  }
}) => {
  const hasNext = pageNumber < numberOfPages - 1;
  const hasPrev = pageNumber > 0;

  return (
    <main>
      <Title collection={collection}>
        {getCollectionText(collection)}
      </Title>

      {tag &&
        <Summary>All <b>{getTagDescriptionById(tag)}</b> {collection}:</Summary>
      }

      <PostList nodes={nodes} group={group} />

      <div>
        {hasPrev && <Link to={previousPagePath}>Previous</Link>}
        {hasNext && <Link to={nextPagePath}>Next</Link>}
      </div>
    </main>
  );
};

export const pageQuery = graphql`
  query($collection: String!, $skip: Int, $limit: Int, $tag: String) {
    allMdx
    (
      sort: { fields: [frontmatter___date], order: DESC },
      skip: $skip,
      limit: $limit,
      filter: {
        fields: {
          collection: { eq: $collection },
          tags: { eq: $tag }
        }
      }
    ) {
      nodes {
        slug
        timeToRead
        frontmatter {
          title,
          relativeDate: date(fromNow: true)
          date(formatString: "MMMM DD, YYYY")
        }
        fields {
          url,
          collection
          tags
        }
      }
      group(field: frontmatter___tags) {
        tag: fieldValue
        totalCount
      }
    }
  }
`

export default PostIndex;
