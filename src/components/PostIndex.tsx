/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Index page template (articles and projects).
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import { getTagDescriptionById } from '../components/TagList';
import Title from '../components/Title';
import PostList from '../components/PostList';
import Summary from '../components/Summary';
import { AllPostsQuery } from '../types/AllPostsQuery';
import { Pagination, PaginationProps } from './Pagination';

const Container = styled.main`
  padding-bottom: calc(
    max(env(safe-area-inset-bottom), ${(props) => props.theme.spacingTriple})
  );

  @media (max-width: ${(props) => props.theme.mobile}) {
    padding-bottom: calc(max(env(safe-area-inset-bottom), 5em));
  }
`;

type IndexQuery = {
  data: AllPostsQuery;
  pageContext: {
    tag: string;
  } & PaginationProps;
};

const PostIndex: FC<IndexQuery> = ({
  pageContext: {
    tag,
    collection,
    numberOfPages,
    humanPageNumber,
    nextPagePath,
    previousPagePath,
  },
  data: {
    allMdx: { nodes, group },
  },
}) => (
  <Container>
    <Title collection={collection}>{collection}</Title>

    {tag && (
      <Summary>
        All <b>{getTagDescriptionById(tag)}</b> {collection}:
      </Summary>
    )}

    <PostList nodes={nodes} group={group} />

    <Pagination
      {...{
        collection,
        numberOfPages,
        humanPageNumber,
        nextPagePath,
        previousPagePath,
      }}
    />
  </Container>
);

export const pageQuery = graphql`
  query($collection: String!, $skip: Int, $limit: Int, $tag: String) {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
      filter: {
        fields: { collection: { eq: $collection }, tags: { eq: $tag } }
      }
    ) {
      nodes {
        slug
        timeToRead
        frontmatter {
          title
          relativeDate: date(fromNow: true)
          date(formatString: "MMMM DD, YYYY")
        }
        fields {
          url
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
`;

export default PostIndex;
