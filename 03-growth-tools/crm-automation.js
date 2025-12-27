// CRM Automation Tool - Quản lý khách hàng tự động
class CRMAutomation {
    constructor() {
        this.customers = [];
        this.automationRules = [];
    }

    // Thêm khách hàng mới
    addCustomer(customerData) {
        const customer = {
            id: Date.now(),
            ...customerData,
            createdAt: new Date(),
            lastContact: null,
            stage: 'lead',
            score: 0
        };
        
        this.customers.push(customer);
        this.calculateLeadScore(customer);
        this.triggerAutomation(customer, 'new_customer');
        
        return customer;
    }

    // Tính điểm lead scoring
    calculateLeadScore(customer) {
        let score = 0;
        
        // Điểm dựa trên thông tin cơ bản
        if (customer.email) score += 10;
        if (customer.phone) score += 15;
        if (customer.company) score += 20;
        
        // Điểm dựa trên hành vi
        if (customer.visitedPricing) score += 25;
        if (customer.downloadedContent) score += 20;
        if (customer.requestedDemo) score += 40;
        
        customer.score = score;
        
        // Phân loại lead
        if (score >= 70) customer.priority = 'hot';
        else if (score >= 40) customer.priority = 'warm';
        else customer.priority = 'cold';
    }

    // Tự động gửi email theo giai đoạn
    setupEmailSequence() {
        return {
            welcome: {
                delay: 0,
                subject: "Chào mừng bạn đến với [Tên công ty]!",
                template: "welcome_email"
            },
            followUp1: {
                delay: 3, // 3 ngày
                subject: "Bạn có cần hỗ trợ gì không?",
                template: "follow_up_1"
            },
            valueContent: {
                delay: 7, // 1 tuần
                subject: "Tài liệu miễn phí dành cho bạn",
                template: "value_content"
            },
            salesCall: {
                delay: 14, // 2 tuần
                subject: "Lịch tư vấn miễn phí 15 phút",
                template: "sales_call"
            }
        };
    }

    // Trigger automation rules
    triggerAutomation(customer, event) {
        const rules = this.automationRules.filter(rule => rule.trigger === event);
        
        rules.forEach(rule => {
            console.log(`Executing automation: ${rule.name} for customer ${customer.id}`);
            rule.action(customer);
        });
    }

    // Báo cáo hiệu suất
    generateReport() {
        const totalCustomers = this.customers.length;
        const hotLeads = this.customers.filter(c => c.priority === 'hot').length;
        const conversions = this.customers.filter(c => c.stage === 'customer').length;
        
        return {
            totalCustomers,
            hotLeads,
            conversions,
            conversionRate: totalCustomers > 0 ? (conversions / totalCustomers * 100).toFixed(2) : 0,
            averageScore: totalCustomers > 0 ? 
                (this.customers.reduce((sum, c) => sum + c.score, 0) / totalCustomers).toFixed(1) : 0
        };
    }
}


module.exports = CRMAutomation;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const crm = new CRMAutomation();
    
    // Thêm rule tự động
    crm.automationRules.push({
        name: "Welcome Email",
        trigger: "new_customer",
        action: (customer) => {
            console.log(`Sending welcome email to ${customer.email}`);
            // Tích hợp với email service
        }
    });
    
    // Export
}