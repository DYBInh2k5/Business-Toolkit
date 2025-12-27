// Customer Retention Optimizer - Tối ưu hóa giữ chân khách hàng
class RetentionOptimizer {
    constructor() {
        this.customers = [];
        this.segments = [];
        this.campaigns = [];
        this.touchpoints = [];
        this.churnPredictionModel = {};
        this.retentionStrategies = {};
    }

    // Thêm khách hàng
    addCustomer(customerData) {
        const customer = {
            id: Date.now(),
            ...customerData,
            joinDate: customerData.joinDate || new Date(),
            lastActivity: customerData.lastActivity || new Date(),
            totalSpent: customerData.totalSpent || 0,
            orderCount: customerData.orderCount || 0,
            avgOrderValue: customerData.totalSpent / (customerData.orderCount || 1),
            lifetimeValue: 0,
            churnRisk: 'low',
            segment: 'new',
            engagementScore: 0,
            satisfactionScore: customerData.satisfactionScore || 0,
            supportTickets: customerData.supportTickets || 0,
            referrals: customerData.referrals || 0,
            status: 'active'
        };

        // Tính toán các metrics
        customer.lifetimeValue = this.calculateCLV(customer);
        customer.engagementScore = this.calculateEngagementScore(customer);
        customer.churnRisk = this.predictChurnRisk(customer);
        customer.segment = this.segmentCustomer(customer);

        this.customers.push(customer);
        return customer;
    }

    // Tính Customer Lifetime Value
    calculateCLV(customer) {
        const monthlyValue = customer.avgOrderValue * (customer.orderCount / this.getCustomerAgeInMonths(customer));
        const estimatedLifespan = this.estimateCustomerLifespan(customer);
        return monthlyValue * estimatedLifespan;
    }

    // Tính tuổi khách hàng theo tháng
    getCustomerAgeInMonths(customer) {
        const now = new Date();
        const joinDate = new Date(customer.joinDate);
        const diffTime = Math.abs(now - joinDate);
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        return Math.max(diffMonths, 1);
    }

    // Ước tính tuổi thọ khách hàng
    estimateCustomerLifespan(customer) {
        // Dựa trên engagement và satisfaction
        let baseLifespan = 24; // 24 months

        if (customer.satisfactionScore >= 8) baseLifespan += 12;
        else if (customer.satisfactionScore >= 6) baseLifespan += 6;
        else if (customer.satisfactionScore < 4) baseLifespan -= 12;

        if (customer.referrals > 0) baseLifespan += customer.referrals * 3;
        if (customer.supportTickets > 5) baseLifespan -= 6;

        return Math.max(baseLifespan, 6);
    }

    // Tính điểm engagement
    calculateEngagementScore(customer) {
        let score = 0;

        // Frequency of orders
        const orderFrequency = customer.orderCount / this.getCustomerAgeInMonths(customer);
        if (orderFrequency >= 2) score += 30;
        else if (orderFrequency >= 1) score += 20;
        else if (orderFrequency >= 0.5) score += 10;

        // Recency of last activity
        const daysSinceLastActivity = Math.floor((new Date() - new Date(customer.lastActivity)) / (1000 * 60 * 60 * 24));
        if (daysSinceLastActivity <= 7) score += 25;
        else if (daysSinceLastActivity <= 30) score += 15;
        else if (daysSinceLastActivity <= 90) score += 5;

        // Monetary value
        if (customer.avgOrderValue >= 1000000) score += 25; // >= 1M VND
        else if (customer.avgOrderValue >= 500000) score += 15;
        else if (customer.avgOrderValue >= 100000) score += 10;

        // Satisfaction and referrals
        if (customer.satisfactionScore >= 8) score += 15;
        else if (customer.satisfactionScore >= 6) score += 10;

        if (customer.referrals > 0) score += Math.min(customer.referrals * 5, 20);

        return Math.min(score, 100);
    }

    // Dự đoán rủi ro churn
    predictChurnRisk(customer) {
        let riskScore = 0;

        // Recency factors
        const daysSinceLastActivity = Math.floor((new Date() - new Date(customer.lastActivity)) / (1000 * 60 * 60 * 24));
        if (daysSinceLastActivity > 90) riskScore += 40;
        else if (daysSinceLastActivity > 60) riskScore += 25;
        else if (daysSinceLastActivity > 30) riskScore += 15;

        // Engagement factors
        if (customer.engagementScore < 30) riskScore += 30;
        else if (customer.engagementScore < 50) riskScore += 15;

        // Satisfaction factors
        if (customer.satisfactionScore < 4) riskScore += 25;
        else if (customer.satisfactionScore < 6) riskScore += 15;

        // Support issues
        if (customer.supportTickets > 5) riskScore += 20;
        else if (customer.supportTickets > 2) riskScore += 10;

        // Order pattern
        const orderFrequency = customer.orderCount / this.getCustomerAgeInMonths(customer);
        if (orderFrequency < 0.25) riskScore += 20;

        if (riskScore >= 70) return 'high';
        if (riskScore >= 40) return 'medium';
        return 'low';
    }

    // Phân khúc khách hàng
    segmentCustomer(customer) {
        const age = this.getCustomerAgeInMonths(customer);
        const clv = customer.lifetimeValue;
        const engagement = customer.engagementScore;

        // Champions: High CLV, High Engagement
        if (clv >= 10000000 && engagement >= 70) return 'champions';

        // Loyal Customers: High CLV, Medium Engagement
        if (clv >= 5000000 && engagement >= 50) return 'loyal';

        // Potential Loyalists: Medium CLV, High Engagement
        if (clv >= 2000000 && engagement >= 70) return 'potential_loyalists';

        // New Customers: Recent joiners
        if (age <= 3) return 'new';

        // At Risk: High CLV but Low Engagement
        if (clv >= 5000000 && engagement < 40) return 'at_risk';

        // Cannot Lose Them: High CLV, Very Low Engagement
        if (clv >= 10000000 && engagement < 30) return 'cannot_lose';

        // Hibernating: Low recent activity
        const daysSinceLastActivity = Math.floor((new Date() - new Date(customer.lastActivity)) / (1000 * 60 * 60 * 24));
        if (daysSinceLastActivity > 90) return 'hibernating';

        return 'regular';
    }

    // Tạo chiến lược retention cho từng segment
    createRetentionStrategy(segment) {
        const strategies = {
            champions: {
                name: 'VIP Treatment',
                tactics: [
                    'Exclusive early access to new products',
                    'Personal account manager',
                    'Special discounts and rewards',
                    'Invite to exclusive events',
                    'Request for testimonials and referrals'
                ],
                frequency: 'Monthly',
                budget: 'High',
                expectedROI: '300-500%'
            },
            loyal: {
                name: 'Loyalty Reinforcement',
                tactics: [
                    'Loyalty program with points',
                    'Birthday and anniversary offers',
                    'Product recommendations',
                    'Satisfaction surveys',
                    'Cross-sell opportunities'
                ],
                frequency: 'Bi-weekly',
                budget: 'Medium',
                expectedROI: '200-300%'
            },
            potential_loyalists: {
                name: 'Engagement Boost',
                tactics: [
                    'Educational content',
                    'Product tutorials',
                    'Community building',
                    'Gamification elements',
                    'Social proof sharing'
                ],
                frequency: 'Weekly',
                budget: 'Medium',
                expectedROI: '150-250%'
            },
            new: {
                name: 'Onboarding Excellence',
                tactics: [
                    'Welcome series emails',
                    'Product onboarding guide',
                    'First purchase incentive',
                    'Customer success check-ins',
                    'Educational resources'
                ],
                frequency: 'Daily (first week), then weekly',
                budget: 'Low',
                expectedROI: '100-200%'
            },
            at_risk: {
                name: 'Win-Back Campaign',
                tactics: [
                    'Personalized offers',
                    'Feedback surveys',
                    'Product usage analysis',
                    'Customer success intervention',
                    'Special attention from support'
                ],
                frequency: 'Weekly',
                budget: 'High',
                expectedROI: '200-400%'
            },
            cannot_lose: {
                name: 'Emergency Retention',
                tactics: [
                    'Executive-level outreach',
                    'Customized solutions',
                    'Significant discounts',
                    'Service recovery',
                    'Dedicated support team'
                ],
                frequency: 'Immediate and ongoing',
                budget: 'Very High',
                expectedROI: '500-1000%'
            },
            hibernating: {
                name: 'Reactivation Campaign',
                tactics: [
                    'We miss you emails',
                    'Special comeback offers',
                    'Product updates and news',
                    'Limited-time promotions',
                    'Survey about absence reasons'
                ],
                frequency: 'Monthly',
                budget: 'Low',
                expectedROI: '50-150%'
            },
            regular: {
                name: 'Standard Engagement',
                tactics: [
                    'Regular newsletters',
                    'Seasonal promotions',
                    'Product recommendations',
                    'Customer feedback requests',
                    'Social media engagement'
                ],
                frequency: 'Bi-weekly',
                budget: 'Low',
                expectedROI: '100-200%'
            }
        };

        return strategies[segment] || strategies.regular;
    }

    // Tạo campaign retention
    createRetentionCampaign(campaignData) {
        const campaign = {
            id: 'RC' + Date.now(),
            name: campaignData.name,
            targetSegment: campaignData.targetSegment,
            strategy: this.createRetentionStrategy(campaignData.targetSegment),
            startDate: campaignData.startDate || new Date(),
            endDate: campaignData.endDate,
            budget: campaignData.budget || 0,
            channels: campaignData.channels || ['email', 'sms'],
            metrics: {
                targetCustomers: 0,
                reached: 0,
                engaged: 0,
                converted: 0,
                revenue: 0,
                cost: 0,
                roi: 0
            },
            status: 'active',
            createdAt: new Date()
        };

        // Tính target customers
        campaign.metrics.targetCustomers = this.customers.filter(c => c.segment === campaignData.targetSegment).length;

        this.campaigns.push(campaign);
        return campaign;
    }

    // Phân tích churn
    analyzeChurn() {
        const totalCustomers = this.customers.length;
        const churnedCustomers = this.customers.filter(c => c.status === 'churned').length;
        const atRiskCustomers = this.customers.filter(c => c.churnRisk === 'high').length;
        const mediumRiskCustomers = this.customers.filter(c => c.churnRisk === 'medium').length;

        const churnRate = totalCustomers > 0 ? (churnedCustomers / totalCustomers * 100).toFixed(2) : 0;

        // Phân tích nguyên nhân churn
        const churnReasons = this.analyzeChurnReasons();

        // Dự đoán churn trong 30 ngày tới
        const predictedChurn = this.predictUpcomingChurn();

        return {
            overview: {
                totalCustomers,
                churnedCustomers,
                churnRate: churnRate + '%',
                atRiskCustomers,
                mediumRiskCustomers
            },
            churnReasons,
            predictedChurn,
            recommendations: this.generateChurnPreventionRecommendations()
        };
    }

    // Phân tích nguyên nhân churn
    analyzeChurnReasons() {
        const churnedCustomers = this.customers.filter(c => c.status === 'churned');
        const reasons = {
            'Low Satisfaction': churnedCustomers.filter(c => c.satisfactionScore < 4).length,
            'Inactivity': churnedCustomers.filter(c => {
                const daysSinceLastActivity = Math.floor((new Date() - new Date(c.lastActivity)) / (1000 * 60 * 60 * 24));
                return daysSinceLastActivity > 180;
            }).length,
            'Support Issues': churnedCustomers.filter(c => c.supportTickets > 5).length,
            'Price Sensitivity': churnedCustomers.filter(c => c.avgOrderValue < 100000).length,
            'Competition': Math.floor(churnedCustomers.length * 0.3), // Estimated
            'Other': Math.floor(churnedCustomers.length * 0.2) // Estimated
        };

        return reasons;
    }

    // Dự đoán churn sắp tới
    predictUpcomingChurn() {
        const highRiskCustomers = this.customers.filter(c => c.churnRisk === 'high' && c.status === 'active');
        const mediumRiskCustomers = this.customers.filter(c => c.churnRisk === 'medium' && c.status === 'active');

        return {
            next30Days: Math.floor(highRiskCustomers.length * 0.7),
            next90Days: Math.floor(highRiskCustomers.length * 0.9 + mediumRiskCustomers.length * 0.3),
            potentialRevenueLoss: this.calculatePotentialRevenueLoss(highRiskCustomers, mediumRiskCustomers)
        };
    }

    // Tính potential revenue loss
    calculatePotentialRevenueLoss(highRisk, mediumRisk) {
        const highRiskLoss = highRisk.reduce((sum, customer) => sum + customer.lifetimeValue * 0.7, 0);
        const mediumRiskLoss = mediumRisk.reduce((sum, customer) => sum + customer.lifetimeValue * 0.3, 0);
        
        return {
            highRisk: Math.round(highRiskLoss),
            mediumRisk: Math.round(mediumRiskLoss),
            total: Math.round(highRiskLoss + mediumRiskLoss)
        };
    }

    // Tạo gợi ý ngăn chặn churn
    generateChurnPreventionRecommendations() {
        const recommendations = [];

        const highRiskCount = this.customers.filter(c => c.churnRisk === 'high').length;
        if (highRiskCount > 0) {
            recommendations.push({
                priority: 'High',
                action: `Triển khai chiến dịch retention khẩn cấp cho ${highRiskCount} khách hàng high-risk`,
                expectedImpact: 'Giảm 50-70% churn risk',
                timeline: 'Ngay lập tức'
            });
        }

        const lowSatisfactionCount = this.customers.filter(c => c.satisfactionScore < 4).length;
        if (lowSatisfactionCount > 0) {
            recommendations.push({
                priority: 'High',
                action: `Cải thiện customer experience cho ${lowSatisfactionCount} khách hàng không hài lòng`,
                expectedImpact: 'Tăng satisfaction score 2-3 điểm',
                timeline: '2-4 tuần'
            });
        }

        const inactiveCount = this.customers.filter(c => {
            const daysSinceLastActivity = Math.floor((new Date() - new Date(c.lastActivity)) / (1000 * 60 * 60 * 24));
            return daysSinceLastActivity > 60;
        }).length;

        if (inactiveCount > 0) {
            recommendations.push({
                priority: 'Medium',
                action: `Chạy reactivation campaign cho ${inactiveCount} khách hàng không hoạt động`,
                expectedImpact: 'Reactivate 20-30% khách hàng',
                timeline: '1-2 tuần'
            });
        }

        return recommendations;
    }

    // Tối ưu hóa customer journey
    optimizeCustomerJourney() {
        const journeyStages = {
            awareness: { customers: 0, conversionRate: 0, avgTime: 0 },
            consideration: { customers: 0, conversionRate: 0, avgTime: 0 },
            purchase: { customers: 0, conversionRate: 0, avgTime: 0 },
            onboarding: { customers: 0, conversionRate: 0, avgTime: 0 },
            adoption: { customers: 0, conversionRate: 0, avgTime: 0 },
            advocacy: { customers: 0, conversionRate: 0, avgTime: 0 }
        };

        // Phân tích từng stage
        this.customers.forEach(customer => {
            const stage = this.identifyCustomerStage(customer);
            if (journeyStages[stage]) {
                journeyStages[stage].customers++;
            }
        });

        // Tính conversion rates (simplified)
        Object.keys(journeyStages).forEach((stage, index) => {
            if (index > 0) {
                const prevStage = Object.keys(journeyStages)[index - 1];
                const prevCustomers = journeyStages[prevStage].customers;
                journeyStages[stage].conversionRate = prevCustomers > 0 ? 
                    (journeyStages[stage].customers / prevCustomers * 100).toFixed(1) : 0;
            }
        });

        return {
            stages: journeyStages,
            bottlenecks: this.identifyJourneyBottlenecks(journeyStages),
            optimizationOpportunities: this.identifyOptimizationOpportunities(journeyStages)
        };
    }

    // Xác định stage của customer
    identifyCustomerStage(customer) {
        const age = this.getCustomerAgeInMonths(customer);
        const orderCount = customer.orderCount;
        const engagement = customer.engagementScore;

        if (orderCount === 0) return 'awareness';
        if (orderCount === 1 && age <= 1) return 'purchase';
        if (orderCount <= 2 && age <= 3) return 'onboarding';
        if (engagement >= 70 && customer.referrals > 0) return 'advocacy';
        if (engagement >= 50) return 'adoption';
        return 'consideration';
    }

    // Xác định bottlenecks trong journey
    identifyJourneyBottlenecks(stages) {
        const bottlenecks = [];
        
        Object.keys(stages).forEach((stage, index) => {
            if (index > 0) {
                const conversionRate = parseFloat(stages[stage].conversionRate);
                if (conversionRate < 50) {
                    bottlenecks.push({
                        stage,
                        conversionRate: conversionRate + '%',
                        severity: conversionRate < 25 ? 'High' : 'Medium'
                    });
                }
            }
        });

        return bottlenecks;
    }

    // Xác định cơ hội tối ưu hóa
    identifyOptimizationOpportunities(stages) {
        const opportunities = [];

        // Low conversion stages
        Object.keys(stages).forEach(stage => {
            const conversionRate = parseFloat(stages[stage].conversionRate);
            if (conversionRate < 60 && conversionRate > 0) {
                opportunities.push({
                    type: 'Conversion Optimization',
                    stage,
                    currentRate: conversionRate + '%',
                    targetRate: Math.min(conversionRate + 20, 80) + '%',
                    actions: this.getStageOptimizationActions(stage)
                });
            }
        });

        return opportunities;
    }

    // Lấy actions để tối ưu từng stage
    getStageOptimizationActions(stage) {
        const actions = {
            awareness: ['Improve SEO', 'Content marketing', 'Social media presence'],
            consideration: ['Product demos', 'Case studies', 'Free trials'],
            purchase: ['Simplify checkout', 'Payment options', 'Trust signals'],
            onboarding: ['Welcome series', 'Product tutorials', 'Success metrics'],
            adoption: ['Feature education', 'Usage analytics', 'Proactive support'],
            advocacy: ['Referral program', 'Review requests', 'Community building']
        };

        return actions[stage] || ['Analyze user behavior', 'A/B test improvements'];
    }

    // Tạo báo cáo retention tổng quan
    generateRetentionReport() {
        const churnAnalysis = this.analyzeChurn();
        const journeyOptimization = this.optimizeCustomerJourney();
        const segmentAnalysis = this.analyzeCustomerSegments();

        return {
            summary: {
                totalCustomers: this.customers.length,
                churnRate: churnAnalysis.overview.churnRate,
                avgCLV: this.calculateAverageCLV(),
                retentionRate: this.calculateRetentionRate(),
                avgEngagementScore: this.calculateAverageEngagement()
            },
            churnAnalysis,
            segmentAnalysis,
            journeyOptimization,
            activeCampaigns: this.campaigns.filter(c => c.status === 'active').length,
            recommendations: this.generateOverallRecommendations(),
            actionItems: this.generateActionItems()
        };
    }

    // Phân tích segments
    analyzeCustomerSegments() {
        const segments = {};
        
        this.customers.forEach(customer => {
            const segment = customer.segment;
            if (!segments[segment]) {
                segments[segment] = {
                    count: 0,
                    totalCLV: 0,
                    avgEngagement: 0,
                    churnRisk: { high: 0, medium: 0, low: 0 }
                };
            }
            
            segments[segment].count++;
            segments[segment].totalCLV += customer.lifetimeValue;
            segments[segment].avgEngagement += customer.engagementScore;
            segments[segment].churnRisk[customer.churnRisk]++;
        });

        // Calculate averages
        Object.keys(segments).forEach(segment => {
            const data = segments[segment];
            data.avgCLV = Math.round(data.totalCLV / data.count);
            data.avgEngagement = Math.round(data.avgEngagement / data.count);
            data.percentage = ((data.count / this.customers.length) * 100).toFixed(1) + '%';
        });

        return segments;
    }

    // Tính CLV trung bình
    calculateAverageCLV() {
        const totalCLV = this.customers.reduce((sum, customer) => sum + customer.lifetimeValue, 0);
        return Math.round(totalCLV / this.customers.length);
    }

    // Tính retention rate
    calculateRetentionRate() {
        const activeCustomers = this.customers.filter(c => c.status === 'active').length;
        return ((activeCustomers / this.customers.length) * 100).toFixed(1) + '%';
    }

    // Tính engagement trung bình
    calculateAverageEngagement() {
        const totalEngagement = this.customers.reduce((sum, customer) => sum + customer.engagementScore, 0);
        return Math.round(totalEngagement / this.customers.length);
    }

    // Tạo khuyến nghị tổng thể
    generateOverallRecommendations() {
        const recommendations = [];

        const highRiskCount = this.customers.filter(c => c.churnRisk === 'high').length;
        const totalCustomers = this.customers.length;

        if (highRiskCount / totalCustomers > 0.15) {
            recommendations.push({
                category: 'Churn Prevention',
                recommendation: 'Tỷ lệ khách hàng high-risk cao - cần chiến lược retention tích cực',
                priority: 'High'
            });
        }

        const avgEngagement = this.calculateAverageEngagement();
        if (avgEngagement < 50) {
            recommendations.push({
                category: 'Engagement',
                recommendation: 'Điểm engagement thấp - cần cải thiện customer experience',
                priority: 'Medium'
            });
        }

        const championsCount = this.customers.filter(c => c.segment === 'champions').length;
        if (championsCount / totalCustomers < 0.1) {
            recommendations.push({
                category: 'Growth',
                recommendation: 'Ít champions - cần phát triển chương trình loyalty mạnh hơn',
                priority: 'Medium'
            });
        }

        return recommendations;
    }

    // Tạo action items
    generateActionItems() {
        const actions = [];

        const highRiskCustomers = this.customers.filter(c => c.churnRisk === 'high');
        if (highRiskCustomers.length > 0) {
            actions.push({
                action: `Liên hệ ngay ${highRiskCustomers.length} khách hàng high-risk`,
                deadline: '24 hours',
                responsible: 'Customer Success Team'
            });
        }

        const inactiveCustomers = this.customers.filter(c => {
            const daysSinceLastActivity = Math.floor((new Date() - new Date(c.lastActivity)) / (1000 * 60 * 60 * 24));
            return daysSinceLastActivity > 30;
        });

        if (inactiveCustomers.length > 0) {
            actions.push({
                action: `Chạy reactivation email cho ${inactiveCustomers.length} khách hàng inactive`,
                deadline: '3 days',
                responsible: 'Marketing Team'
            });
        }

        return actions;
    }
}

module.exports = RetentionOptimizer;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    const retention = new RetentionOptimizer();
    
    retention.addCustomer({
        name: 'John Doe',
        email: 'john@example.com',
        joinDate: new Date('2023-01-15'),
        lastActivity: new Date('2024-12-20'),
        totalSpent: 5000000,
        orderCount: 8,
        satisfactionScore: 7,
        supportTickets: 1,
        referrals: 2
    });

    console.log('Retention Report:');
    const report = retention.generateRetentionReport();
    console.log(JSON.stringify(report, null, 2));
}