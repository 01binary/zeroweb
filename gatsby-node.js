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

import { paginate } from 'gatsby-awesome-pagination';
import { createFilePath } from 'gatsby-source-filesystem';
import { CONTENT } from './src/routes';

exports.createPages = async ({
    actions: { createPage },
    graphql,
    reporter
}) => {
    const {
        data: { allMdx: { nodes } },
        errprs: postErrors,
    } = await graphql(`
    {
        allMdx {
            nodes {
                slug,
                fields {
                    collection
                }
            }
          }
    }`);

    const {
        data: { allMdx: { group: tags } },
        errors: tagErrors,
    } = await graphql(`
    {
        allMdx {
          group(field: frontmatter___tags) {
            tag: fieldValue
          }
        }
    }`);

    if (postErrors || tagErrors) {
        reporter.panicOnBuild(`Error while running GraphQL queries`);
        return;
    }

    // Generate posts
    const post = require.resolve('./src/components/Post.tsx');

    nodes.forEach(({
        slug,
        fields: {
            collection
        }
    }) => {
        createPage({
            path: `${collection}/${slug}`,
            component: post,
            context: {
                slug,
                collection
            },
        });
    });

    // Generate index pages
    const postIndex = require.resolve('./src/components/PostIndex.tsx');

    CONTENT.forEach(({ path, collection }) => {
        paginate({
            createPage,
            items: nodes
                .filter(node => node.fields.collection === collection),
            itemsPerPage: 5,
            pathPrefix: path,
            component: postIndex,
            context: {
                collection
            }
        });
    });

    // Generate tags pages
    CONTENT.forEach(({ path, collection}) => {
        tags.forEach(({ tag }) => {
            createPage({
                path: `${path.substring(1)}/tags/${tag}`,
                component: postIndex,
                context: {
                    collection,
                    tag
                }
            });
        });
    });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;

    if (node.internal.type === `Mdx`) {
        const collection = getNode(node.parent).sourceInstanceName;
        const relativeFilePath = createFilePath({
            node,
            getNode,
            basePath: collection
        });

        createNodeField({
            node,
            name: 'url',
            value: `/${collection}${relativeFilePath}`
        });

        createNodeField({
            node,
            name: 'collection',
            value: collection
        });

        createNodeField({
            node,
            name: 'tags',
            value: node.frontmatter.tags.map(t => t.trim().toLowerCase())
        });
    }
};