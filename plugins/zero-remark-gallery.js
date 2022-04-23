const cheerio = require(`cheerio`);

module.exports = ({
  markdownAST,
}) => {
  markdownAST.children.forEach((node) => {
    const { type, value } = node;
    if (type !== 'html' || !value.startsWith('<gallery>')) return;

    const $ = cheerio.load(value);
    const images = [];

    $('.gatsby-resp-image-wrapper').each(function () {
      const container = $(this);
      const title = container.find(`img`).attr('alt');
      const src = container.find(`img`).attr('src');
      const href = container.find(`.gatsby-resp-image-link`).attr('href');
      images.push({ title, src, href });
    });

    node.type = 'jsx';
    node.value = `<Gallery images={${JSON.stringify(images)}} />`;
    node.children = undefined;
  });

  return markdownAST;
};
