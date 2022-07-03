/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  Gatsby static site building scripts.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import { paginate } from 'gatsby-awesome-pagination';
import { createFilePath } from 'gatsby-source-filesystem';
import { CONTENT } from './src/routes';

const Post = require.resolve('./src/components/Post/Post.tsx');
const Page = require.resolve('./src/components/Page.tsx');

const getPageUrl = (collection, relativeFilePath) => {
  if (collection === 'logs') {
    const [, projectPath, logPath] = relativeFilePath.split('/');
    return `/projects/${projectPath}/${logPath}`;
  }

  return `/${collection}${relativeFilePath}`;
};

const getPageSubcollection = (relativeFilePath) => {
  if (relativeFilePath.indexOf('/logs/') >= 0) {
    const [, , projectPath] = relativeFilePath.split('/');
    return projectPath;
  }
};

const getPagePath = (collection, slug) => {
  if (collection === 'logs') {
    const [, projectPath, logPath] = slug.split('/');
    return `/projects/${projectPath}/${logPath}`;
  } else if (collection === 'pages') {
    return `/${slug}`;
  }

  return `${collection}/${slug}`;
};

const getPageCollection = (collection, relativeFilePath) =>
  collection === 'projects' && relativeFilePath.startsWith('/logs/')
    ? 'logs'
    : collection;

const getComponentForPage = (collection) =>
  collection === 'pages' ? Page : Post;

exports.createPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  const {
    data: {
      allMdx: { nodes },
    },
    errors: postErrors,
  } = await graphql(`
    {
      allMdx {
        nodes {
          slug
          fields {
            collection
            subCollection
          }
          frontmatter {
            description
            tags
            title
          }
          rawBody
        }
      }
    }
  `);

  const {
    data: {
      allMdx: { group: tags },
    },
    errors: tagErrors,
  } = await graphql(`
    {
      allMdx {
        group(field: frontmatter___tags) {
          tag: fieldValue
        }
      }
    }
  `);

  if (postErrors || tagErrors) {
    reporter.panicOnBuild(`Error while running GraphQL queries`);
    return;
  }

  // Generate search index
  fs.writeFileSync(
    path.resolve(__dirname, './search.json'),
    JSON.stringify(
      nodes.reduce(
        (
          entries,
          {
            slug,
            fields: { collection },
            rawBody,
            frontmatter: { description, tags, title },
          }
        ) => [
          ...entries,
          {
            slug,
            collection,
            title,
            tags,
            description,
            body: rawBody.replace('\n', ' '),
          },
        ],
        []
      )
    )
  );

  // Generate posts
  nodes.forEach(({ slug, fields: { collection, subCollection } }) => {
    const path = getPagePath(collection, slug);
    const component = getComponentForPage(collection, slug);
    createPage({
      path,
      component,
      context: {
        slug,
        collection,
        subCollection,
      },
    });
  });

  // Generate top-level index pages
  const postIndex = require.resolve('./src/components/PostIndex/PostIndex.tsx');

  CONTENT.forEach(({ path, collection }) => {
    paginate({
      createPage,
      items: nodes.filter((node) => node.fields.collection === collection),
      itemsPerPage: 5,
      pathPrefix: path,
      component: postIndex,
      context: {
        collection,
      },
    });
  });

  // Generate tags pages
  CONTENT.forEach(({ path, collection }) => {
    tags.forEach(({ tag }) => {
      createPage({
        path: `${path.substring(1)}/tags/${tag}`,
        component: postIndex,
        context: {
          collection,
          tag,
        },
      });
    });
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const relativeRootPath = createFilePath({ node, getNode });
    const collection = getPageCollection(getNode(node.parent).sourceInstanceName, relativeRootPath);
    const subCollection = getPageSubcollection(relativeRootPath);
    const relativeFilePath = createFilePath({
      node,
      getNode,
      basePath: collection
    });

    createNodeField({
      node,
      name: 'collection',
      value: collection
    });

    createNodeField({
      node,
      name: 'subCollection',
      value: subCollection
    });

    createNodeField({
      node,
      name: 'url',
      value: getPageUrl(collection, relativeFilePath)
    });

    createNodeField({
      node,
      name: 'tags',
      value: node.frontmatter.tags ? node.frontmatter.tags.map(t => t.trim().toLowerCase()) : []
    });
  }
};