// Test All Modules - Kiểm tra tất cả modules hoạt động đúng
const BusinessToolkit = require('./index.js');

console.log('🧪 TESTING ALL BUSINESS TOOLKIT MODULES\n');

// Khởi tạo toolkit trong silent mode
const toolkit = new BusinessToolkit({ silent: true });

let passedTests = 0;
let totalTests = 0;

function test(testName, testFunction) {
    totalTests++;
    try {
        const result = testFunction();
        if (result) {
            console.log(`✅ ${testName}: PASSED`);
            passedTests++;
        } else {
            console.log(`❌ ${testName}: FAILED`);
        }
    } catch (error) {
        console.log(`❌ ${testName}: ERROR - ${error.message}`);
    }
}

// Test 1: CRM Automation
test('CRM Automation', () => {
    const customer = toolkit.tools.crm.addCustomer({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '123456789',
        visitedPricing: true
    });
    return customer && customer.id && customer.score > 0;
});

// Test 2: Financial Calculator
test('Financial Calculator - Break Even', () => {
    const result = toolkit.tools.financial.calculateBreakEven(10000, 20, 50);
    return result && result.units === 334 && result.contributionMargin === 30;
});

test('Financial Calculator - ROI', () => {
    const result = toolkit.tools.financial.calculateROI(100000, 150000, 1);
    return result && result.roi === '50.00%' && result.isPositive === true;
});

// Test 3: Content Generator
test('Content Generator', () => {
    const blog = toolkit.tools.contentGen.generateBlogOutline(
        'Test Topic',
        'test audience',
        ['keyword1', 'keyword2']
    );
    return blog && blog.title && blog.mainSections && blog.mainSections.length > 0;
});

// Test 4: Social Media Scheduler
test('Social Media Scheduler', () => {
    const post = toolkit.tools.socialMedia.generateContent('product_launch', {
        product_name: 'Test Product',
        product_description: 'test description',
        discount: '20'
    });
    return post && post.title && post.content && post.hashtags;
});

// Test 5: Business Dashboard
test('Business Dashboard', () => {
    toolkit.tools.dashboard.addRevenueData('2024-01-01', 10000, 'test');
    toolkit.tools.dashboard.addCustomerData('2024-01-01', 50, 2);
    const summary = toolkit.tools.dashboard.generateExecutiveSummary();
    return summary && summary.summary && summary.summary.totalRevenue;
});

// Test 6: Competitor Analysis
test('Competitor Analysis', () => {
    const competitor = toolkit.tools.competitor.addCompetitor({
        name: 'Test Competitor',
        marketShare: 20,
        revenue: 1000000,
        employees: 100,
        pricing: { basic: 99 }
    });
    return competitor && competitor.name && competitor.marketPosition;
});

// Test 7: Trend Analyzer
test('Trend Analyzer', () => {
    const trend = toolkit.tools.trends.addTrend({
        name: 'Test Trend',
        category: 'Technology',
        searchVolume: 10000,
        growthRate: 25,
        marketSize: 1000000
    });
    return trend && trend.name && trend.maturityLevel;
});

// Test 8: Team Builder
test('Team Builder', () => {
    toolkit.tools.team.defineOrganizationStructure({
        departments: ['Engineering', 'Marketing']
    });
    const member = toolkit.tools.team.addTeamMember({
        name: 'Test Employee',
        role: 'Developer',
        department: 'Engineering',
        level: 'Mid',
        skills: ['Programming'],
        salary: { min: 80000, max: 100000 }
    });
    return member && member.name && member.department;
});

// Test 9: Pitch Deck Generator
test('Pitch Deck Generator', () => {
    toolkit.tools.pitchDeck.setCompanyInfo({
        name: 'Test Company',
        tagline: 'Test tagline',
        stage: 'seed'
    });
    const slides = toolkit.tools.pitchDeck.generatePitchDeck({
        problem: { mainProblem: 'Test problem' },
        solution: { solution: 'Test solution' }
    });
    return slides && slides.length > 0;
});

// Test 10: Integration Test - Full Workflow
test('Integration - Full Business Workflow', () => {
    try {
        // 1. Add customer to CRM
        const customer = toolkit.tools.crm.addCustomer({
            name: 'Integration Test Customer',
            email: 'integration@test.com'
        });

        // 2. Calculate financials
        const breakeven = toolkit.tools.financial.calculateBreakEven(50000, 30, 80);

        // 3. Generate content
        const content = toolkit.tools.contentGen.generateBlogOutline('Integration Test', 'users', ['test']);

        // 4. Create social post
        const socialPost = toolkit.tools.socialMedia.generateContent('product_launch', {
            product_name: 'Integration Product',
            product_description: 'test product'
        });

        // 5. Add business data
        toolkit.tools.dashboard.addRevenueData('2024-01-01', 25000);

        return customer && breakeven && content && socialPost;
    } catch (error) {
        console.log('Integration test error:', error.message);
        return false;
    }
});

// Test 11: Error Handling
test('Error Handling - Invalid Data', () => {
    try {
        // Test with invalid break-even data (should handle gracefully)
        const result = toolkit.tools.financial.calculateBreakEven(1000, 50, 30); // price < variable cost
        return false; // Should throw error
    } catch (error) {
        return error.message.includes('cao hơn chi phí'); // Should catch the error
    }
});

// Test 12: Data Persistence
test('Data Persistence', () => {
    // Add multiple customers
    toolkit.tools.crm.addCustomer({ name: 'Customer 1', email: 'c1@test.com' });
    toolkit.tools.crm.addCustomer({ name: 'Customer 2', email: 'c2@test.com' });
    
    const report = toolkit.tools.crm.generateReport();
    return report.totalCustomers >= 2;
});

// Test 13: Performance Test
test('Performance - Large Dataset', () => {
    const startTime = Date.now();
    
    // Add 100 customers quickly
    for (let i = 0; i < 100; i++) {
        toolkit.tools.crm.addCustomer({
            name: `Customer ${i}`,
            email: `customer${i}@test.com`,
            score: Math.random() * 100
        });
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete in under 1 second
    return duration < 1000;
});

// Test 14: Memory Usage
test('Memory Usage - No Memory Leaks', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Perform multiple operations
    for (let i = 0; i < 50; i++) {
        toolkit.tools.contentGen.generateBlogOutline(`Topic ${i}`, 'audience', ['keyword']);
        toolkit.tools.socialMedia.generateContent('educational', { topic: `Topic ${i}` });
    }
    
    // Force garbage collection if available
    if (global.gc) {
        global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 50MB)
    return memoryIncrease < 50 * 1024 * 1024;
});

// Test 15: Module Dependencies
test('Module Dependencies', () => {
    // Check if all required modules are loaded
    const requiredTools = [
        'crm', 'financial', 'contentGen', 'socialMedia', 
        'dashboard', 'competitor', 'trends', 'team', 'pitchDeck'
    ];
    
    return requiredTools.every(tool => toolkit.tools[tool] && typeof toolkit.tools[tool] === 'object');
});

// Run summary
console.log('\n📊 TEST SUMMARY:');
console.log(`✅ Passed: ${passedTests}/${totalTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Business Toolkit is working perfectly.');
} else {
    console.log('\n⚠️  Some tests failed. Please check the issues above.');
}

// Generate test report
const testReport = {
    timestamp: new Date().toISOString(),
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate: ((passedTests / totalTests) * 100).toFixed(1) + '%',
    status: passedTests === totalTests ? 'ALL_PASSED' : 'SOME_FAILED'
};

console.log('\n📋 Detailed Test Report:');
console.log(JSON.stringify(testReport, null, 2));