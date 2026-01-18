const fs = require('fs');
const path = require('path');

function parseSpoilerLog(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\r\n');
  
  const itemLocations = [];
  let currentGeneralLocation = null;
  
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) {
      continue;
    }
    
    // Check if this is a sphere number line (starts with number followed by colon)
    if (/^\d+:\s*$/.test(line)) {
      continue;
    }
    
    // Check if this is a general location (indented by 2 spaces, ends with colon)
    const generalLocationMatch = line.match(/^  ([^:]+):\s*$/);
    if (generalLocationMatch) {
      currentGeneralLocation = generalLocationMatch[1].trim();
      continue;
    }
    
    // Check if this is a detailed location with an item (indented by 6+ spaces, has colon)
    const detailedLocationMatch = line.match(/^      (.+?):\s+(.+)$/);
    if (detailedLocationMatch && currentGeneralLocation) {
      const detailedLocation = detailedLocationMatch[1].trim();
      const item = detailedLocationMatch[2].trim();
      
      // Skip items with "Defeat" in the name
      if (item.includes('Defeat')) {
        continue;
      }
      
      // Skip small keys and big keys
      if (item.includes('Small Key') || item.includes('Big Key')) {
        continue;
      }
      
      itemLocations.push({
        item,
        generalLocation: currentGeneralLocation,
        detailedLocation: detailedLocation
      });
    }
  }
  
  return itemLocations;
}

// Main execution
if (require.main === module) {
  // Get the file path from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node parse-spoiler-log.js <path-to-spoiler-log.txt>');
    process.exit(1);
  }
  
  const spoilerLogPath = args[0];
  
  if (!fs.existsSync(spoilerLogPath)) {
    console.error(`Error: File not found: ${spoilerLogPath}`);
    process.exit(1);
  }
  
  try {
    const itemLocations = parseSpoilerLog(spoilerLogPath);
    
    // Output as formatted JSON
    console.log(JSON.stringify(itemLocations, null, 2));
  } catch (error) {
    console.error('Error parsing spoiler log:', error.message);
    process.exit(1);
  }
}

module.exports = { parseSpoilerLog };
