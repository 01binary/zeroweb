import React, { FC, useContext } from 'react';
import BlogContext from '../components/BlogContext';
import { getTagFilter, getTagDescriptionById } from '../components/TagList';
import Title from '../components/Title';
import PostList from '../components/PostList';
import Summary from '../components/Summary';
import { AllPostsQuery } from '../models/AllPostsQuery';

export interface IndexQuery {
  data: AllPostsQuery;
};

interface IndexProps extends IndexQuery {
  collection: string;
};

/**
 * Index page for articles and projects
 * @param props - The gatsby graphql data source. 
 * @returns The index page content.
 */
const PostIndex: FC<IndexProps> = ({
  collection,
  data: {
    allMdx: {
      nodes,
      group
    }
  }
}) => {
  const { url } = useContext(BlogContext);
  const tagId = getTagFilter(url);
  const tagDescription = getTagDescriptionById(tagId);

  return (
    <main>
      <Title collection={collection}>
        {collection[0].toUpperCase() + collection.substr(1)}
      </Title>
      {tagId &&
        <Summary>All <b>{tagDescription}</b> {collection}:</Summary>
      }
      <PostList nodes={nodes} group={group} />
    </main>
  );
};

export default PostIndex;
