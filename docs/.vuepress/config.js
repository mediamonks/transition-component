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
        displayAllHeaders: true,
        sidebarDepth: 3,
        sidebar: [
            {
                title: 'Guide',
                path: '/guide/',
                collapsable: false,
                children: [
                    {
                        title: 'Muban',
                        path: '/guide/muban/',
                    },
                    {
                        title: 'Vue',
                        path: '/guide/vue/',
                    },
                    {
                        title: 'React',
                        path: '/guide/react/',
                    }
                ]
            }
        ],
    }
}
