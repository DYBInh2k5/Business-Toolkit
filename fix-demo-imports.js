// Fix Demo Imports - Ngăn demo code chạy khi import
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing demo imports in all modules...\n');

const modulesToFix = [
    '12-legal-compliance/business-registration.js',
    '13-operations/supply-chain-manager.js', 
    '14-customer-success/retention-optimizer.js'
];

modulesToFix.forEach(moduleFile => {
    const fullPath = path.join(__dirname, moduleFile);
    
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Find demo code that runs at module level
        const lines = content.split('\n');
        let moduleExportIndex = -1;
        let demoStartIndex = -1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('module.exports')) {
                moduleExportIndex = i;
            }
            
            // Look for demo code after module.exports
            if (moduleExportIndex > -1 && i > moduleExportIndex) {
                if (line.includes('// Demo') || 
                    line.includes('console.log(') ||
                    line.includes('const ') && (line.includes('report') || line.includes('demo'))) {
                    if (demoStartIndex === -1) {
                        demoStartIndex = i;
                    }
                }
            }
        }
        
        if (demoStartIndex > -1) {
            // Wrap demo code in if (require.main === module)
            const beforeDemo = lines.slice(0, demoStartIndex);
            const demoCode = lines.slice(demoStartIndex);
            
            const newContent = [
                ...beforeDemo,
                '',
                '// Demo code - only runs when file is executed directly',
                'if (require.main === module) {',
                ...demoCode.map(line => '    ' + line),
                '}'
            ].join('\n');
            
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`✅ Fixed: ${moduleFile}`);
        } else {
            console.log(`ℹ️  No demo code found: ${moduleFile}`);
        }
    } else {
        console.log(`❌ File not found: ${moduleFile}`);
    }
});

console.log('\n🧪 Testing import after fixes...');

try {
    const BusinessToolkit = require('./index.js');
    const toolkit = new BusinessToolkit({ silent: true });
    
    console.log('✅ Import test successful');
    console.log(`✅ All ${Object.keys(toolkit.tools).length} modules loaded cleanly`);
    
} catch (error) {
    console.log('❌ Import test failed:', error.message);
}

console.log('\n🎉 Demo import fixes completed!');