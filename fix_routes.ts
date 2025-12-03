import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function findDynamicRoutes(dir: string, routes: string[] = []): string[] {
    const files = readdirSync(dir);

    for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            if (file.startsWith('[') && file.endsWith(']')) {
                const routeFile = join(fullPath, 'route.ts');
                try {
                    statSync(routeFile);
                    routes.push(routeFile);
                } catch { }
            }
            findDynamicRoutes(fullPath, routes);
        }
    }

    return routes;
}

function fixRouteFile(filePath: string) {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Fix params interface to use Promise wrapper
    const paramsInterfaceRegex = /interface\s+RouteParams\s*\{[\s\S]*?params:\s*\{([\s\S]*?)\}/g;
    if (paramsInterfaceRegex.test(content)) {
        content = content.replace(
            /interface\s+RouteParams\s*\{([\s\S]*?)params:\s*\{([\s\S]*?)\}([\s\S]*?)\}/g,
            'interface RouteParams {$1params: Promise<{$2}>$3}'
        );
        modified = true;
    }

    // Fix route handlers to await params
    const routeHandlerRegex = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\([^)]*\{\s*params\s*\}[^)]*\)\s*\{/g;
    const matches = content.match(routeHandlerRegex);

    if (matches) {
        for (const match of matches) {
            const method = match.match(/(GET|POST|PUT|DELETE|PATCH)/)?.[0];
            if (method) {
                // Add await params destructuring after try {
                const tryBlockRegex = new RegExp(
                    `(export\\s+async\\s+function\\s+${method}\\s*\\([^)]*\\{\\s*params\\s*\\}[^)]*\\)\\s*\\{\\s*try\\s*\\{)`,
                    'g'
                );

                if (!content.includes(`const { `) || !content.includes(`} = await params`)) {
                    // We'll need to manually add this - skip for now as it's complex
                    console.log(`Skipping complex fix for ${filePath}`);
                }
            }
        }
    }

    if (modified) {
        writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed: ${filePath}`);
        return true;
    }

    return false;
}

const apiDir = 'app/api';
const routes = findDynamicRoutes(apiDir);

console.log(`Found ${routes.length} dynamic routes`);
let fixed = 0;

for (const route of routes) {
    if (fixRouteFile(route)) {
        fixed++;
    }
}

console.log(`Fixed ${fixed} files`);
