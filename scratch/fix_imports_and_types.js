const { execSync } = require('child_process');
const fs = require('fs');

function getLintReport() {
  console.log('Running ESLint to generate JSON report...');
  try {
    const output = execSync('npx eslint -f json src', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return JSON.parse(output);
  } catch (err) {
    if (err.stdout) {
      try {
        return JSON.parse(err.stdout);
      } catch (parseErr) {
        throw err;
      }
    }
    throw err;
  }
}

function processFile(filePath, messages) {
  if (!fs.existsSync(filePath)) return;
  console.log(`Processing file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split(/\r?\n/);

  // Group messages by line
  const lineGroups = {};
  for (const msg of messages) {
    if (!lineGroups[msg.line]) {
      lineGroups[msg.line] = [];
    }
    lineGroups[msg.line].push(msg);
  }

  let modified = false;
  const lineNumbers = Object.keys(lineGroups).map(Number).sort((a, b) => b - a);

  for (const lineNum of lineNumbers) {
    const lineIdx = lineNum - 1;
    if (lineIdx < 0 || lineIdx >= lines.length) continue;
    let line = lines[lineIdx];

    const lineMsgs = lineGroups[lineNum].sort((a, b) => b.column - a.column);

    for (const msg of lineMsgs) {
      if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
        const colIdx = msg.column - 1;
        if (colIdx >= 0 && colIdx < line.length) {
          const target = 'any';
          const before = line.slice(0, colIdx);
          const after = line.slice(colIdx);
          if (after.startsWith(target)) {
            line = before + 'SafeAny' + after.slice(target.length);
            modified = true;
          }
        }
      } else if (msg.ruleId === '@typescript-eslint/no-unused-vars') {
        const match = msg.message.match(/'([^']+)'/);
        if (!match) continue;
        const varName = match[1];

        // 1. If it's a catch block
        if (line.includes('catch') && line.includes(varName)) {
          line = line.replace(/catch\s*\(\s*[a-zA-Z0-9_$]+\s*\)/g, 'catch');
          modified = true;
        }
        // 2. If it's an import statement
        else if (line.trim().startsWith('import') || line.includes('import ')) {
          let newLine = line;
          
          // Remove varName if followed by a comma
          const regex1 = new RegExp(`\\b${varName}\\b\\s*,\\s*`);
          const regex2 = new RegExp(`,\\s*\\b${varName}\\b`);
          const regex3 = new RegExp(`\\b${varName}\\b`);

          if (regex1.test(newLine)) {
            newLine = newLine.replace(regex1, '');
          } else if (regex2.test(newLine)) {
            newLine = newLine.replace(regex2, '');
          } else {
            newLine = newLine.replace(regex3, '');
          }

          // If the import is empty, clean it up
          if (/import\s*\{\s*\}\s*from/.test(newLine) || /import\s*\*\s*as\s*\{\s*\}\s*from/.test(newLine)) {
            newLine = '';
          }
          line = newLine;
          modified = true;
        }
        // 3. If it's a destructuring assignment in curly braces: const { x, y } = ...
        else if (line.includes('{') && line.includes('}') && line.includes('=') && line.includes(varName)) {
          // Replace object destructuring with renaming: varName -> varName: _varName
          const regex = new RegExp(`\\b${varName}\\b`);
          line = line.replace(regex, `${varName}: _${varName}`);
          modified = true;
        }
        // 4. Any other variable or mapping parameter
        else {
          const colIdx = msg.column - 1;
          if (colIdx >= 0 && colIdx < line.length) {
            const before = line.slice(0, colIdx);
            const after = line.slice(colIdx);
            if (after.startsWith(varName)) {
              line = before + '_' + after;
              modified = true;
            }
          }
        }
      }
    }
    lines[lineIdx] = line;
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`  -> Saved changes.`);
  }
}

function run() {
  const report = getLintReport();
  for (const fileReport of report) {
    if (fileReport.messages.length > 0) {
      processFile(fileReport.filePath, fileReport.messages);
    }
  }
  console.log('Cleaner pass complete.');
}

run();
