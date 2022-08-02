module.exports = {
  title: 'Transition Component',
  description: 'A tool to add GSAP transitions to your components',
  base: '/transition-component/',
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
    ],
    repo: 'mediamonks/transition-component',
    docsDir: 'docs',
    sidebarDepth: 3,
    sidebar: [
      {
        title: 'Muban',
        path: 'guide/muban/',
      },
      {
        title: 'React',
        path: 'guide/react/',
      },
    ],
  },
};
