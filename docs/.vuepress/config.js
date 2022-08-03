const fs = require('fs');
const path = require('path');

function upperFirstCharacter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateChildPages(root) {
  const files = fs.readdirSync(path.join(__dirname, '../guide/muban'))

  return files
    .filter((value) => value !== 'README.md')
    .map((value) => {
      const [ fileName ]  = value.split('.');
      const [_, ...title] = fileName.split('-')

      return {
        title: upperFirstCharacter(title.join(' ')),
        path: `/guide/${root}/${fileName}`
      }
    })
}

module.exports = {
  port: 8081,
  title: 'Transition Component',
  description: 'A tool to add GSAP transitions to your components',
  base: '/transition-component/',
  markdown: {
    lineNumbers: true,
  },
  plugins: [['@vuepress/back-to-top', true]],
  themeConfig: {
    smoothScroll: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    repo: 'mediamonks/transition-component',
    docsDir: 'docs',
    sidebar: [
      {
        title: 'Muban',
        path: '/guide/muban/',
        sidebarDepth: 2,
        collapsable: false,
        children: generateChildPages('muban')
      },
      {
        title: 'React',
        path: '/guide/react/',
        collapsable: false,
        sidebarDepth: 2,
        children: generateChildPages('react')
      },
    ]
  },
};
