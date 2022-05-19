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
      const img = container.find(`img`);
      const title = img.attr('alt');
      const src = img.attr('src');
      const srcSet = img.attr('srcset').split(',');
      const href = container.find(`.gatsby-resp-image-link`).attr('href');
      images.push({ title, src, href, set: srcSet.map(entry => entry.split(' ')[0]) });
    });

    node.type = 'jsx';
    node.value = `<Gallery images={${JSON.stringify(images)}} />`;
    node.children = undefined;
  });

  return markdownAST;
};
