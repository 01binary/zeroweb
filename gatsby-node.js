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

    const templates = {
        'articles': require.resolve('./src/components/Article.tsx'),
        'projects': require.resolve('./src/components/Project.tsx'),
    };

    nodes.forEach(({ slug, fields: { collection } }) => {
        createPage({
            path: `${collection}/${slug}`,
            component: templates[collection],
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