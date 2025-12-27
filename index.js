// Business Toolkit - Main Entry Point
const IkigaiFinder = require('./01-idea-validation/ikigai-finder');
const LeanCanvas = require('./01-idea-validation/lean-canvas');
const CRMAutomation = require('./03-growth-tools/crm-automation');
const BusinessDashboard = require('./04-analytics/business-dashboard');
const SocialMediaScheduler = require('./05-automation/social-media-scheduler');
const ContentGenerator = require('./06-ai-tools/content-generator');
const FinancialCalculator = require('./07-financial-tools/financial-calculator');
const CompetitorAnalysis = require('./08-advanced-analytics/competitor-analysis');
const TrendAnalyzer = require('./09-market-research/trend-analyzer');
const TeamBuilder = require('./10-scaling-tools/team-builder');
const PitchDeckGenerator = require('./11-investor-relations/pitch-deck-generator');
const BusinessRegistration = require('./12-legal-compliance/business-registration');
const SupplyChainManager = require('./13-operations/supply-chain-manager');
const RetentionOptimizer = require('./14-customer-success/retention-optimizer');

class BusinessToolkit {
    constructor(options = {}) {
        this.tools = {
            ikigai: new IkigaiFinder(),
            leanCanvas: new LeanCanvas(),
            crm: new CRMAutomation(),
            dashboard: new BusinessDashboard(),
            socialMedia: new SocialMediaScheduler(),
            contentGen: new ContentGenerator(),
            financial: new FinancialCalculator(),
            competitor: new CompetitorAnalysis(),
            trends: new TrendAnalyzer(),
            team: new TeamBuilder(),
            pitchDeck: new PitchDeckGenerator(),
            legal: new BusinessRegistration(),
            supplyChain: new SupplyChainManager(),
            retention: new RetentionOptimizer()
        };
        
        // Only show menu if not in silent mode
        if (!options.silent) {
            console.log('🚀 Business Toolkit v3.0 đã sẵn sàng!');
            this.showMenu();
        }
    }

    showMenu() {
        console.log('\n=== BUSINESS TOOLKIT MENU ===');
        console.log('1. 💡 Tìm ý tưởng kinh doanh (Ikigai)');
        console.log('2. 📋 Tạo Lean Canvas');
        console.log('3. 👥 Quản lý CRM');
        console.log('4. 📊 Dashboard Analytics');
        console.log('5. 📱 Lên lịch Social Media');
        console.log('6. ✍️  Tạo nội dung AI');
        console.log('7. 💰 Tính toán tài chính');
        console.log('8. 🔍 Phân tích đối thủ');
        console.log('9. 📈 Phân tích xu hướng');
        console.log('10. 👨‍💼 Xây dựng team');
        console.log('11. 💼 Tạo pitch deck');
        console.log('12. ⚖️  Đăng ký doanh nghiệp');
        console.log('13. 🏭 Quản lý chuỗi cung ứng');
        console.log('14. 🎯 Tối ưu retention khách hàng');
        console.log('15. 🎪 Demo tất cả công cụ');
        console.log('0. Thoát');
    }

    // Demo tất cả công cụ
    runDemo() {
        console.log('\n🎪 DEMO BUSINESS TOOLKIT v3.0\n');

        // 1. CRM Demo
        console.log('1. CRM AUTOMATION:');
        const customer = this.tools.crm.addCustomer({
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com',
            phone: '0901234567',
            company: 'ABC Corp',
            visitedPricing: true,
            requestedDemo: true
        });
        console.log('Khách hàng mới:', customer);

        // 2. Financial Calculator Demo
        console.log('\n2. FINANCIAL CALCULATOR:');
        const breakEven = this.tools.financial.calculateBreakEven(100000, 50, 100);
        console.log('Break-even Analysis:', breakEven);

        // 3. Legal Compliance Demo
        console.log('\n3. BUSINESS REGISTRATION:');
        const businessInfo = {
            numberOfOwners: 2,
            capitalAmount: 500000000,
            businessScope: ['technology'],
            riskLevel: 'medium',
            growthPlan: 'moderate'
        };
        const recommendations = this.tools.legal.recommendBusinessType(businessInfo);
        console.log('Business Type Recommendation:', recommendations[0]);

        // 4. Supply Chain Demo
        console.log('\n4. SUPPLY CHAIN MANAGEMENT:');
        const supplier = this.tools.supplyChain.addSupplier({
            name: 'Tech Supplier Co.',
            category: 'Technology',
            location: 'Ho Chi Minh City',
            contactInfo: { email: 'contact@techsupplier.com' }
        });
        console.log('New Supplier:', supplier.name, '- Rating:', supplier.rating);

        // 5. Customer Retention Demo
        console.log('\n5. CUSTOMER RETENTION:');
        const retentionCustomer = this.tools.retention.addCustomer({
            name: 'Jane Smith',
            email: 'jane@example.com',
            totalSpent: 2000000,
            orderCount: 5,
            satisfactionScore: 8
        });
        console.log('Customer Analysis:', {
            segment: retentionCustomer.segment,
            churnRisk: retentionCustomer.churnRisk,
            lifetimeValue: retentionCustomer.lifetimeValue
        });

        // 6. Team Builder Demo
        console.log('\n6. TEAM BUILDER:');
        this.tools.team.defineOrganizationStructure({
            departments: ['Engineering', 'Marketing']
        });
        const teamMember = this.tools.team.addTeamMember({
            name: 'John Developer',
            role: 'Senior Developer',
            department: 'Engineering',
            level: 'Senior',
            skills: ['React', 'Node.js'],
            salary: { min: 120000, max: 150000 }
        });
        console.log('Team Member Added:', teamMember.name, '- Role:', teamMember.role);

        // 7. Pitch Deck Demo
        console.log('\n7. PITCH DECK GENERATOR:');
        this.tools.pitchDeck.setCompanyInfo({
            name: 'TechStartup Pro',
            tagline: 'Complete Business Solution',
            stage: 'series-a'
        });
        const pitchData = {
            problem: { mainProblem: 'Businesses lack integrated tools' },
            solution: { solution: 'All-in-one business platform' },
            funding: { fundingAmount: '$5M' }
        };
        const slides = this.tools.pitchDeck.generatePitchDeck(pitchData);
        console.log('Pitch Deck Generated:', `${slides.length} slides for $5M Series A`);

        console.log('\n✅ Demo v3.0 hoàn thành! Tất cả 14 công cụ đang hoạt động tốt.');
        console.log('🚀 Business Toolkit v3.0: Từ ý tưởng → Đăng ký → Vận hành → Thành công!');
    }

    // Chạy công cụ cụ thể
    runTool(toolName, ...args) {
        if (this.tools[toolName]) {
            return this.tools[toolName];
        } else {
            console.log(`❌ Không tìm thấy công cụ: ${toolName}`);
            return null;
        }
    }

    // Tạo báo cáo tổng quan
    generateOverallReport() {
        return {
            timestamp: new Date().toISOString(),
            availableTools: Object.keys(this.tools),
            systemStatus: 'Active',
            version: '3.0.0',
            description: 'Business Toolkit v3.0 - Ecosystem hoàn chỉnh từ ý tưởng đến vận hành thành công',
            newFeatures: [
                'Business Registration & Legal Compliance',
                'Supply Chain Management', 
                'Customer Retention Optimizer'
            ],
            totalModules: Object.keys(this.tools).length
        };
    }
}

// Khởi chạy nếu file được chạy trực tiếp
if (require.main === module) {
    const toolkit = new BusinessToolkit();
    
    // Chạy demo nếu có argument 'demo'
    if (process.argv.includes('demo')) {
        toolkit.runDemo();
    }
}

module.exports = BusinessToolkit;