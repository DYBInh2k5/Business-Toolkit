// Fix Import Issues - Ngăn output khi import modules
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing import issues...\n');

// List of files that might have console.log in constructors or module level
const filesToFix = [
    '01-idea-validation/ikigai-finder.js',
    '01-idea-validation/lean-canvas.js',
    '03-growth-tools/crm-automation.js',
    '04-analytics/business-dashboard.js',
    '05-automation/social-media-scheduler.js',
    '06-ai-tools/content-generator.js',
    '07-financial-tools/financial-calculator.js',
    '08-advanced-analytics/competitor-analysis.js',
    '09-market-research/trend-analyzer.js',
    '10-scaling-tools/team-builder.js',
    '11-investor-relations/pitch-deck-generator.js'
];

let fixedFiles = 0;

filesToFix.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let originalContent = content;
        
        // Check if file has demo code at the end that runs on import
        const lines = content.split('\n');
        let inDemoSection = false;
        let demoStartIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Look for demo sections
            if (line.includes('// Demo') || line.includes('// Sử dụng') || line.includes('console.log(')) {
                if (!inDemoSection && i > lines.length * 0.8) { // Only in last 20% of file
                    inDemoSection = true;
                    demoStartIndex = i;
                }
            }
            
            // Look for module.exports
            if (line.startsWith('module.exports')) {
                if (inDemoSection && demoStartIndex > -1) {
                    // Move module.exports before demo section
                    const beforeDemo = lines.slice(0, demoStartIndex);
                    const demoSection = lines.slice(demoStartIndex, i);
                    const moduleExport = lines[i];
                    const afterExport = lines.slice(i + 1);
                    
                    // Wrap demo section in if statement
                    const newContent = [
                        ...beforeDemo,
                        '',
                        moduleExport,
                        '',
                        '// Demo code - only runs when file is executed directly',
                        'if (require.main === module) {',
                        ...demoSection.map(line => '    ' + line),
                        ...afterExport.map(line => '    ' + line),
                        '}'
                    ].join('\n');
                    
                    content = newContent;
                    break;
                }
            }
        }
        
        // If content changed, write it back
        if (content !== originalContent) {
            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            fixedFiles++;
        } else {
            console.log(`ℹ️  No changes needed: ${filePath}`);
        }
    } else {
        console.log(`❌ File not found: ${filePath}`);
    }
});

console.log(`\n🎯 Summary: Fixed ${fixedFiles} files`);

// Test the fixes
console.log('\n🧪 Testing imports after fixes...');

try {
    // Test silent import
    const BusinessToolkit = require('./index.js');
    const toolkit = new BusinessToolkit({ silent: true });
    
    console.log('✅ Silent import successful');
    console.log(`✅ All ${Object.keys(toolkit.tools).length} tools loaded`);
    
    // Quick functionality test
    const customer = toolkit.tools.crm.addCustomer({
        name: 'Test Customer',
        email: 'test@example.com'
    });
    
    if (customer && customer.id) {
        console.log('✅ Basic functionality test passed');
    } else {
        console.log('❌ Basic functionality test failed');
    }
    
} catch (error) {
    console.log('❌ Import test failed:', error.message);
}

console.log('\n🎉 Import fixes completed!');