import fs from 'fs';
import { parseCSV } from './client/src/lib/csvParser.js';
import { detectFields } from './client/src/lib/fieldMapping.js';

// Read the 74-field CSV
const csvPath = '/home/ubuntu/upload/1764692965_45bed3ac-ac7d-4bdd-a44f-b72adee76eca.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

console.log('📄 Testing Enrichment Flow with 74-Field CSV\n');
console.log('='.repeat(80));

try {
  // Parse CSV
  console.log('\n1️⃣  Parsing CSV...');
  const parsed = parseCSV(csvContent);
  console.log(`✅ Parsed successfully`);
  console.log(`   - Columns: ${parsed.columns.length}`);
  console.log(`   - Rows: ${parsed.rowCount}`);
  
  // Detect fields
  console.log('\n2️⃣  Detecting fields...');
  const mappings = detectFields(parsed.columns, parsed.rows);
  
  // Count auto-mapped fields
  const autoMapped = mappings.filter(m => m.isAutoMapped);
  const unmapped = mappings.filter(m => !m.mappedField);
  
  console.log(`✅ Field detection complete`);
  console.log(`   - Auto-mapped: ${autoMapped.length}/${parsed.columns.length}`);
  console.log(`   - Unmapped: ${unmapped.length}/${parsed.columns.length}`);
  console.log(`   - Success rate: ${Math.round((autoMapped.length / parsed.columns.length) * 100)}%`);
  
  // Show first 10 mappings
  console.log('\n3️⃣  Sample Mappings (first 10):');
  console.log('='.repeat(80));
  mappings.slice(0, 10).forEach((m, i) => {
    const status = m.isAutoMapped ? '✅' : '⚠️ ';
    const field = m.mappedField || 'UNMAPPED';
    console.log(`${status} ${m.csvColumn.padEnd(30)} → ${field.padEnd(25)} (${m.completeness}% complete)`);
  });
  
  // Show unmapped fields
  if (unmapped.length > 0) {
    console.log('\n4️⃣  Unmapped Fields:');
    console.log('='.repeat(80));
    unmapped.forEach(m => {
      console.log(`⚠️  ${m.csvColumn} (${m.completeness}% complete)`);
    });
  }
  
  // Show mapping summary by field type
  console.log('\n5️⃣  Mapping Summary:');
  console.log('='.repeat(80));
  const fieldCounts = {};
  mappings.forEach(m => {
    if (m.mappedField) {
      fieldCounts[m.mappedField] = (fieldCounts[m.mappedField] || 0) + 1;
    }
  });
  Object.entries(fieldCounts).sort((a, b) => b[1] - a[1]).forEach(([field, count]) => {
    console.log(`   ${field}: ${count} column(s)`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Test Complete!\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
