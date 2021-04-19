const createFilePath = require('gatsby-source-filesystem').createFilePath;

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

    // Generate tags
    const index = {
        articles: require.resolve('./src/pages/index.tsx'),
        projects: require.resolve('./src/pages/projects.tsx'),
    };

    Object
        .keys(index)
        .forEach((collection) => {
            tags.forEach(({ tag }) => {
                createPage({
                    path: `${collection}/tags/${tag}`,
                    component: index[collection],
                    context: {
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