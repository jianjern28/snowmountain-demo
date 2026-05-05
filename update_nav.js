const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'products.html',
    'about.html',
    'services.html',
    'gallery.html',
    'customers.html',
    'contact.html'
];

const cssInjection = `
        .menu-toggle {
            display: none;
            color: var(--white);
            font-size: 24px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .menu-toggle {
                display: block;
            }
            nav {
                flex-wrap: wrap;
            }
            ul.nav-links {
                display: none !important;
                flex-direction: column;
                width: 100%;
                position: absolute;
                top: 100%;
                left: 0;
                background-color: var(--navy);
                padding: 15px 0;
                box-shadow: 0 10px 10px rgba(0,0,0,0.1);
            }
            ul.nav-links.active {
                display: flex !important;
            }
            ul.nav-links li {
                margin: 15px 0;
                text-align: center;
            }
        }
    </style>`;

const htmlInjection = `        </a>
        <i class="fas fa-bars menu-toggle" onclick="toggleMenu()"></i>
        <ul class="nav-links" id="navMenu">`;

const jsInjection = `    <script>
        function toggleMenu() {
            document.getElementById('navMenu').classList.toggle('active');
        }
    </script>
</body>`;

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File ${file} does not exist. Skipping.`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Inject CSS
    if (!content.includes('.menu-toggle')) {
        content = content.replace('</style>', cssInjection);
    }

    // Inject HTML
    if (!content.includes('menu-toggle" onclick')) {
        content = content.replace(/<\/a>\s*<ul class="nav-links">/g, htmlInjection);
    }

    // Inject JS
    if (!content.includes('function toggleMenu()')) {
        content = content.replace(/<\/body>/g, jsInjection);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
}
