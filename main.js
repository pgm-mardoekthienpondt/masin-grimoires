const fs = require('fs');
const html = fs.readFileSync('grimoire_table.html', 'utf8');

function extractTableRows(html) {
    const table = html.match(/<table[^>]*>[\s\S]*?<\/table>/g);
    if (!table) return null;
    const rows = table[0].match(/<tr[^>]*>[\s\S]*?<\/tr>/g);
    return rows;
}

const $rows = extractTableRows(html);




const categories = ["oblivion", "spirituality", "salvation", "awakening"];
const grimoires = [];



if ($rows) {
  $rows.forEach(row => {
    // Extract cells from each row
    const cells = row.match(/<td>(.*?)<\/td>/gs);

    if (cells) {
      cells.forEach((cell, index) => {
        // Extract name, source, and full text
        const nameMatch = cell.match(/<u>(.*?)<\/u>/);
        const sourceMatch = cell.match(/<a.*?>(.*?)<\/a>/);
        const fullText = cell.replace(/<[^>]*>/g, '').trim();

        const name = nameMatch ? nameMatch[1].trim() : null;
        const source = sourceMatch ? sourceMatch[1].trim() : null;

        if (name && source) {
          grimoires.push({
            name,
            source,
            category: categories[index],
            full_text: fullText
          });
        }
      });
    }
  });
}

// Create the final JSON structure
const output = { grimoires };

// Write to a JSON file
fs.writeFileSync('grimoires.json', JSON.stringify(output, null, 2), 'utf-8');

console.log('Grimoires have been exported to grimoires.json');
