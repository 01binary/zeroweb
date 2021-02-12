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
        allMdx(
            filter: { fields: { collection: { eq: "articles" } } }
          ) {
            nodes {
              slug
            }
          }
    }`);

    // Handle errors
    if (errors) {
        reporter.panicOnBuild(`Error while running GraphQL query`);
        return;
    }

    const template = require.resolve('./src/components/Article.tsx');

    nodes.forEach(({ slug }) => {
        createPage({
            path: `articles/${slug}`,
            component: template,
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
            name: 'slug',
            value: `/${collection}${relativeFilePath}`
        });

        createNodeField({
            node,
            name: 'collection',
            value: collection
        });
    }
};