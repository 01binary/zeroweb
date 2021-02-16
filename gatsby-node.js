const createFilePath = require('gatsby-source-filesystem').createFilePath;

exports.createPages = async ({
    actions: { createPage },
    graphql,
    reporter
}) => {
    const {
        errors,
        data: { allMdx: { nodes } }
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

    if (errors) {
        reporter.panicOnBuild(`Error while running GraphQL query`);
        return;
    }

    const post = require.resolve('./src/components/Post.tsx');

    nodes.forEach(({ slug, fields: { collection } }) => {
        createPage({
            path: `${collection}/${slug}`,
            component: post,
            context: {
                // Template GraphQL query parameters
                slug: slug,
            },
        })
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
            value: node.frontmatter.tags
                .split(',')
                .map(t => t.trim().toLowerCase())
        });
    }
};