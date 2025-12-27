// Interactive Demo - Chạy từng module một cách chi tiết
const BusinessToolkit = require('./index.js');

console.log('🎪 BUSINESS TOOLKIT v3.0 - INTERACTIVE DEMO\n');

const toolkit = new BusinessToolkit({ silent: true });

// Demo từng module chi tiết
async function runInteractiveDemo() {
    console.log('='.repeat(60));
    console.log('🚀 KHỞI ĐỘNG BUSINESS TOOLKIT v3.0');
    console.log('='.repeat(60));
    console.log(`✅ Đã tải ${Object.keys(toolkit.tools).length} modules thành công!\n`);

    // 1. CRM Demo
    console.log('1️⃣  CRM AUTOMATION - Quản lý khách hàng thông minh');
    console.log('-'.repeat(50));
    
    const customer1 = toolkit.tools.crm.addCustomer({
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0901234567',
        company: 'ABC Corp',
        visitedPricing: true,
        requestedDemo: true
    });
    
    const customer2 = toolkit.tools.crm.addCustomer({
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321',
        company: 'XYZ Ltd',
        visitedPricing: false,
        requestedDemo: false
    });

    console.log(`✅ Thêm khách hàng: ${customer1.name} - Score: ${customer1.score} (${customer1.priority})`);
    console.log(`✅ Thêm khách hàng: ${customer2.name} - Score: ${customer2.score} (${customer2.priority})`);
    
    const crmReport = toolkit.tools.crm.generateReport();
    console.log(`📊 Tổng khách hàng: ${crmReport.totalCustomers}, Hot leads: ${crmReport.hotLeads}`);
    console.log('');

    // 2. Financial Calculator Demo
    console.log('2️⃣  FINANCIAL CALCULATOR - Tính toán tài chính');
    console.log('-'.repeat(50));
    
    const breakEven = toolkit.tools.financial.calculateBreakEven(100000, 30, 80);
    console.log(`💰 Break-even: ${breakEven.units} sản phẩm = ${breakEven.revenue.toLocaleString()} VND`);
    
    const roi = toolkit.tools.financial.calculateROI(500000, 750000, 1);
    console.log(`📈 ROI: ${roi.roi} trong 1 năm (${roi.isPositive ? 'Có lãi' : 'Lỗ'})`);
    
    const clv = toolkit.tools.financial.calculateCLV(200000, 2, 24, 0.3);
    console.log(`👤 Customer Lifetime Value: ${clv.clv.toLocaleString()} VND`);
    console.log('');

    // 3. Business Registration Demo
    console.log('3️⃣  BUSINESS REGISTRATION - Đăng ký doanh nghiệp');
    console.log('-'.repeat(50));
    
    const businessInfo = {
        numberOfOwners: 2,
        capitalAmount: 1000000000, // 1B VND
        businessScope: ['technology', 'consulting'],
        riskLevel: 'medium',
        growthPlan: 'aggressive'
    };
    
    const recommendations = toolkit.tools.legal.recommendBusinessType(businessInfo);
    console.log(`🏢 Khuyến nghị: ${recommendations[0].name} (Điểm: ${recommendations[0].suitability}/10)`);
    
    const costs = toolkit.tools.legal.calculateTotalCost('limited_company', ['technology']);
    console.log(`💸 Chi phí đăng ký: ${costs.totalCost.toLocaleString()} VND`);
    console.log('');

    // 4. Supply Chain Demo
    console.log('4️⃣  SUPPLY CHAIN MANAGEMENT - Quản lý chuỗi cung ứng');
    console.log('-'.repeat(50));
    
    const supplier1 = toolkit.tools.supplyChain.addSupplier({
        name: 'Tech Components Ltd',
        category: 'Technology',
        location: 'Ho Chi Minh City',
        contactInfo: { email: 'sales@techcomp.com', phone: '0901111111' },
        products: ['Processors', 'Memory'],
        leadTime: 10
    });
    
    toolkit.tools.supplyChain.evaluateSupplier(supplier1.id, {
        onTimeDelivery: 9.0,
        qualityScore: 8.5,
        priceCompetitiveness: 7.0,
        reliability: 8.8
    });
    
    console.log(`🏭 Nhà cung cấp: ${supplier1.name} - Rating: ${supplier1.rating} (${supplier1.tier})`);
    
    // Add inventory
    const item1 = toolkit.tools.supplyChain.addInventoryItem({
        name: 'Intel i7 Processor',
        sku: 'CPU-I7-001',
        currentStock: 50,
        minimumStock: 10,
        unitCost: 5000000,
        supplier: supplier1.name
    });
    
    console.log(`📦 Tồn kho: ${item1.name} - ${item1.currentStock} units`);
    console.log('');

    // 5. Customer Retention Demo
    console.log('5️⃣  CUSTOMER RETENTION - Tối ưu giữ chân khách hàng');
    console.log('-'.repeat(50));
    
    const retentionCustomer1 = toolkit.tools.retention.addCustomer({
        name: 'Lê Văn C',
        email: 'levanc@email.com',
        totalSpent: 10000000,
        orderCount: 15,
        satisfactionScore: 9,
        referrals: 3
    });
    
    const retentionCustomer2 = toolkit.tools.retention.addCustomer({
        name: 'Phạm Thị D',
        email: 'phamthid@email.com',
        totalSpent: 2000000,
        orderCount: 2,
        satisfactionScore: 5,
        lastActivity: new Date('2024-10-01')
    });
    
    console.log(`👑 ${retentionCustomer1.name}: ${retentionCustomer1.segment} - CLV: ${retentionCustomer1.lifetimeValue.toLocaleString()} VND`);
    console.log(`⚠️  ${retentionCustomer2.name}: ${retentionCustomer2.segment} - Risk: ${retentionCustomer2.churnRisk}`);
    console.log('');

    // 6. Team Builder Demo
    console.log('6️⃣  TEAM BUILDER - Xây dựng đội ngũ');
    console.log('-'.repeat(50));
    
    toolkit.tools.team.defineOrganizationStructure({
        departments: ['Engineering', 'Marketing', 'Sales']
    });
    
    const cto = toolkit.tools.team.addTeamMember({
        name: 'Nguyễn CTO',
        role: 'CTO',
        department: 'Engineering',
        level: 'Executive',
        skills: ['Leadership', 'Technical Strategy', 'Architecture'],
        salary: { min: 200000000, max: 250000000 }
    });
    
    const developer = toolkit.tools.team.addTeamMember({
        name: 'Trần Developer',
        role: 'Senior Developer',
        department: 'Engineering',
        level: 'Senior',
        skills: ['React', 'Node.js', 'AWS'],
        salary: { min: 120000000, max: 150000000 }
    });
    
    console.log(`👨‍💼 ${cto.name}: ${cto.role} - Lương: ${cto.salary.min.toLocaleString()}-${cto.salary.max.toLocaleString()} VND/năm`);
    console.log(`👨‍💻 ${developer.name}: ${developer.role} - Skills: ${developer.skills.join(', ')}`);
    
    const teamCosts = toolkit.tools.team.calculateTeamCosts();
    console.log(`💰 Chi phí team: ${teamCosts.total.toLocaleString()} VND/năm`);
    console.log('');

    // 7. Content Generator Demo
    console.log('7️⃣  CONTENT GENERATOR - Tạo nội dung AI');
    console.log('-'.repeat(50));
    
    const blogOutline = toolkit.tools.contentGen.generateBlogOutline(
        'Khởi nghiệp công nghệ tại Việt Nam',
        'doanh nhân trẻ',
        ['startup', 'công nghệ', 'Việt Nam', 'đầu tư']
    );
    
    console.log(`📝 Blog: "${blogOutline.title}"`);
    console.log(`📋 Sections: ${blogOutline.mainSections.length} phần`);
    
    const emailCampaign = toolkit.tools.contentGen.generateEmailCampaign(
        'Business Toolkit Pro',
        'doanh nhân',
        'sales'
    );
    
    console.log(`📧 Email Campaign: "${emailCampaign.subject}"`);
    console.log('');

    // 8. Social Media Demo
    console.log('8️⃣  SOCIAL MEDIA SCHEDULER - Tự động hóa marketing');
    console.log('-'.repeat(50));
    
    const productPost = toolkit.tools.socialMedia.generateContent('product_launch', {
        product_name: 'Business Toolkit Pro',
        product_description: 'bộ công cụ kinh doanh toàn diện',
        discount: '30',
        website: 'businesstoolkit.pro'
    });
    
    console.log(`📱 Social Post: "${productPost.title}"`);
    console.log(`📝 Content: ${productPost.content.substring(0, 80)}...`);
    console.log(`🏷️  Hashtags: ${productPost.hashtags.join(' ')}`);
    
    const monthlySchedule = toolkit.tools.socialMedia.generateMonthlySchedule('2024-01-01', 4);
    console.log(`📅 Monthly Schedule: ${monthlySchedule.length} bài đăng`);
    console.log('');

    // 9. Pitch Deck Demo
    console.log('9️⃣  PITCH DECK GENERATOR - Tạo bộ trình bày nhà đầu tư');
    console.log('-'.repeat(50));
    
    toolkit.tools.pitchDeck.setCompanyInfo({
        name: 'VietTech Startup',
        tagline: 'Revolutionizing Vietnamese Business',
        stage: 'series-a',
        industry: 'B2B SaaS'
    });
    
    const pitchData = {
        problem: { mainProblem: 'Vietnamese SMEs lack modern business tools' },
        solution: { solution: 'All-in-one business platform for Vietnamese market' },
        market: { tam: '$10B', sam: '$1B', som: '$100M' },
        traction: { 
            keyMetrics: { 'Users': '10,000', 'Revenue': '$100K MRR', 'Growth': '25% MoM' }
        },
        funding: { fundingAmount: '$3M', valuation: '$15M' }
    };
    
    const slides = toolkit.tools.pitchDeck.generatePitchDeck(pitchData);
    const execSummary = toolkit.tools.pitchDeck.generateExecutiveSummary();
    
    console.log(`🎯 Pitch Deck: ${slides.length} slides cho ${pitchData.funding.fundingAmount} Series A`);
    console.log(`📊 Market: TAM ${pitchData.market.tam}, SAM ${pitchData.market.sam}`);
    console.log(`💰 Ask: ${execSummary.askAmount} at ${pitchData.funding.valuation} valuation`);
    console.log('');

    // 10. Final Summary
    console.log('🎉 TỔNG KẾT DEMO');
    console.log('='.repeat(60));
    console.log(`✅ CRM: ${crmReport.totalCustomers} khách hàng, ${crmReport.hotLeads} hot leads`);
    console.log(`✅ Financial: Break-even ${breakEven.units} units, ROI ${roi.roi}`);
    console.log(`✅ Legal: ${recommendations[0].name}, chi phí ${costs.totalCost.toLocaleString()} VND`);
    console.log(`✅ Supply Chain: ${toolkit.tools.supplyChain.suppliers.length} nhà cung cấp`);
    console.log(`✅ Retention: ${toolkit.tools.retention.customers.length} khách hàng được phân tích`);
    console.log(`✅ Team: ${toolkit.tools.team.team.length} thành viên, ${teamCosts.total.toLocaleString()} VND/năm`);
    console.log(`✅ Content: Blog + Email campaigns sẵn sàng`);
    console.log(`✅ Social: ${monthlySchedule.length} bài đăng/tháng`);
    console.log(`✅ Pitch: ${slides.length} slides cho ${execSummary.askAmount} funding`);
    console.log('');
    console.log('🚀 BUSINESS TOOLKIT v3.0 - HOÀN TOÀN SẴN SÀNG CHO DOANH NGHIỆP!');
    console.log('='.repeat(60));
}

// Chạy demo
runInteractiveDemo().catch(console.error);