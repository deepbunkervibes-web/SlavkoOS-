import fs from 'fs';
import path from 'path';

const srcDir = 'C:/Users/gera/Pictures/MVP-Simulation-Studio-SlavkoKernel-v7-main/src';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Replace import React, { ... } from 'react' with import * as React from 'react'
    // and extract the named imports.
    // Actually, simpler: replace 'import React from "react"' or 'import React,' with 'import * as React from "react"'
    // and if there were named imports, keep them.

    // Pattern: import React from 'react'; -> import * as React from 'react';
    if (content.includes("import React from 'react'")) {
        content = content.replace("import React from 'react'", "import * as React from 'react'");
        changed = true;
    }
    if (content.includes('import React from "react"')) {
        content = content.replace('import React from "react"', 'import * as React from "react"');
        changed = true;
    }

    // Pattern: import React, { ... } from 'react'; -> import * as React from 'react'; import { ... } from 'react';
    const namedImportMatch = content.match(/import React,\s*(\{[^}]+\})\s*from\s*['"]react['"]/);
    if (namedImportMatch) {
        const namedImports = namedImportMatch[1];
        content = content.replace(namedImportMatch[0], `import * as React from 'react';\nimport ${namedImports} from 'react'`);
        changed = true;
    }

    // 2. Fix empty interfaces: interface Props {} -> type Props = object;
    const emptyInterfaceMatch = content.match(/interface\s+(\w+)\s*\{\}/g);
    if (emptyInterfaceMatch) {
        emptyInterfaceMatch.forEach(m => {
            const name = m.match(/interface\s+(\w+)/)[1];
            content = content.replace(m, `type ${name} = object`);
        });
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
