// Risk Assessor - Đánh giá và quản lý rủi ro doanh nghiệp
class RiskAssessor {
    constructor() {
        this.risks = [];
        this.assessments = [];
        this.mitigationPlans = [];
        this.riskCategories = {
            financial: 'Tài chính',
            operational: 'Vận hành',
            strategic: 'Chiến lược',
            compliance: 'Tuân thủ',
            technology: 'Công nghệ',
            market: 'Thị trường',
            reputation: 'Danh tiếng',
            human_resources: 'Nhân sự'
        };
        this.riskTemplates = this.initializeRiskTemplates();
    }

    // Khởi tạo templates rủi ro phổ biến
    initializeRiskTemplates() {
        return {
            cash_flow: {
                name: 'Rủi ro dòng tiền',
                category: 'financial',
                description: 'Thiếu hụt dòng tiền để duy trì hoạt động',
                indicators: ['negative_cash_flow', 'high_burn_rate', 'low_revenue'],
                impact: 'high',
                probability: 'medium',
                mitigationStrategies: [
                    'Tăng cường thu hồi công nợ',
                    'Cắt giảm chi phí không cần thiết',
                    'Tìm kiếm nguồn tài trợ bổ sung',
                    'Đa dạng hóa nguồn thu'
                ]
            },
            key_personnel: {
                name: 'Rủi ro nhân sự chủ chốt',
                category: 'human_resources',
                description: 'Mất nhân viên quan trọng hoặc thiếu kỹ năng cần thiết',
                indicators: ['high_turnover', 'key_person_dependency', 'skill_gaps'],
                impact: 'high',
                probability: 'medium',
                mitigationStrategies: [
                    'Xây dựng kế hoạch kế nhiệm',
                    'Đào tạo và phát triển nhân viên',
                    'Cải thiện chế độ đãi ngộ',
                    'Tạo môi trường làm việc tích cực'
                ]
            },
            cyber_security: {
                name: 'Rủi ro an ninh mạng',
                category: 'technology',
                description: 'Tấn công mạng, rò rỉ dữ liệu, gián đoạn hệ thống',
                indicators: ['outdated_systems', 'weak_passwords', 'no_backup'],
                impact: 'high',
                probability: 'high',
                mitigationStrategies: [
                    'Cập nhật hệ thống bảo mật',
                    'Đào tạo nhân viên về an ninh mạng',
                    'Sao lưu dữ liệu định kỳ',
                    'Thiết lập firewall và antivirus'
                ]
            },
            market_competition: {
                name: 'Rủi ro cạnh tranh thị trường',
                category: 'market',
                description: 'Đối thủ mới, thay đổi xu hướng, mất thị phần',
                indicators: ['new_competitors', 'price_pressure', 'market_saturation'],
                impact: 'medium',
                probability: 'high',
                mitigationStrategies: [
                    'Đổi mới sản phẩm/dịch vụ',
                    'Tăng cường marketing',
                    'Cải thiện trải nghiệm khách hàng',
                    'Tìm kiếm thị trường mới'
                ]
            },
            regulatory_compliance: {
                name: 'Rủi ro tuân thủ pháp lý',
                category: 'compliance',
                description: 'Vi phạm quy định, thay đổi luật pháp',
                indicators: ['regulation_changes', 'compliance_gaps', 'legal_issues'],
                impact: 'high',
                probability: 'medium',
                mitigationStrategies: [
                    'Theo dõi thay đổi pháp lý',
                    'Tư vấn luật sư chuyên nghiệp',
                    'Đào tạo nhân viên về tuân thủ',
                    'Thiết lập quy trình kiểm soát'
                ]
            },
            supply_chain: {
                name: 'Rủi ro chuỗi cung ứng',
                category: 'operational',
                description: 'Gián đoạn nguồn cung, chất lượng kém, giá cả tăng',
                indicators: ['single_supplier', 'quality_issues', 'delivery_delays'],
                impact: 'medium',
                probability: 'medium',
                mitigationStrategies: [
                    'Đa dạng hóa nhà cung cấp',
                    'Xây dựng quan hệ đối tác bền vững',
                    'Kiểm soát chất lượng nghiêm ngặt',
                    'Dự trữ hàng tồn kho hợp lý'
                ]
            }
        };
    }

    // Thêm rủi ro mới
    addRisk(riskData) {
        const risk = {
            id: 'R' + Date.now(),
            name: riskData.name,
            description: riskData.description,
            category: riskData.category,
            impact: riskData.impact, // low, medium, high, critical
            probability: riskData.probability, // low, medium, high
            riskScore: this.calculateRiskScore(riskData.impact, riskData.probability),
            indicators: riskData.indicators || [],
            owner: riskData.owner || 'unassigned',
            status: 'identified',
            createdAt: new Date(),
            lastAssessed: null,
            mitigationStatus: 'pending'
        };

        this.risks.push(risk);
        return risk;
    }

    // Tạo rủi ro từ template
    createRiskFromTemplate(templateName, customizations = {}) {
        const template = this.riskTemplates[templateName];
        if (!template) {
            throw new Error(`Template ${templateName} không tồn tại`);
        }

        const riskData = {
            name: customizations.name || template.name,
            description: customizations.description || template.description,
            category: customizations.category || template.category,
            impact: customizations.impact || template.impact,
            probability: customizations.probability || template.probability,
            indicators: customizations.indicators || template.indicators,
            owner: customizations.owner
        };

        const risk = this.addRisk(riskData);
        
        // Tạo mitigation plan từ template
        if (template.mitigationStrategies) {
            this.createMitigationPlan(risk.id, {
                strategies: template.mitigationStrategies,
                priority: this.getRiskPriority(risk.riskScore)
            });
        }

        return risk;
    }

    // Tính điểm rủi ro
    calculateRiskScore(impact, probability) {
        const impactScores = { low: 1, medium: 2, high: 3, critical: 4 };
        const probabilityScores = { low: 1, medium: 2, high: 3 };
        
        return impactScores[impact] * probabilityScores[probability];
    }

    // Xác định mức độ ưu tiên
    getRiskPriority(riskScore) {
        if (riskScore >= 9) return 'critical';
        if (riskScore >= 6) return 'high';
        if (riskScore >= 3) return 'medium';
        return 'low';
    }

    // Đánh giá rủi ro
    assessRisk(riskId, assessmentData) {
        const risk = this.risks.find(r => r.id === riskId);
        if (!risk) {
            throw new Error('Rủi ro không tồn tại');
        }

        const assessment = {
            id: 'A' + Date.now(),
            riskId,
            assessedBy: assessmentData.assessedBy,
            currentImpact: assessmentData.currentImpact,
            currentProbability: assessmentData.currentProbability,
            riskScore: this.calculateRiskScore(assessmentData.currentImpact, assessmentData.currentProbability),
            indicators: assessmentData.indicators || [],
            evidence: assessmentData.evidence || [],
            recommendations: assessmentData.recommendations || [],
            assessmentDate: new Date(),
            nextReviewDate: assessmentData.nextReviewDate || this.calculateNextReviewDate(assessmentData.currentImpact, assessmentData.currentProbability)
        };

        this.assessments.push(assessment);

        // Cập nhật risk
        risk.impact = assessmentData.currentImpact;
        risk.probability = assessmentData.currentProbability;
        risk.riskScore = assessment.riskScore;
        risk.lastAssessed = new Date();
        risk.status = 'assessed';

        return assessment;
    }

    // Tính ngày review tiếp theo
    calculateNextReviewDate(impact, probability) {
        const riskScore = this.calculateRiskScore(impact, probability);
        const nextReview = new Date();
        
        if (riskScore >= 9) {
            nextReview.setMonth(nextReview.getMonth() + 1); // 1 tháng
        } else if (riskScore >= 6) {
            nextReview.setMonth(nextReview.getMonth() + 3); // 3 tháng
        } else if (riskScore >= 3) {
            nextReview.setMonth(nextReview.getMonth() + 6); // 6 tháng
        } else {
            nextReview.setFullYear(nextReview.getFullYear() + 1); // 1 năm
        }
        
        return nextReview;
    }

    // Tạo kế hoạch giảm thiểu rủi ro
    createMitigationPlan(riskId, planData) {
        const risk = this.risks.find(r => r.id === riskId);
        if (!risk) {
            throw new Error('Rủi ro không tồn tại');
        }

        const plan = {
            id: 'MP' + Date.now(),
            riskId,
            strategies: planData.strategies || [],
            priority: planData.priority || this.getRiskPriority(risk.riskScore),
            budget: planData.budget || 0,
            timeline: planData.timeline || '3 months',
            owner: planData.owner || risk.owner,
            status: 'draft',
            createdAt: new Date(),
            approvedAt: null,
            implementationStart: null,
            completionTarget: planData.completionTarget || this.calculateCompletionTarget(planData.timeline),
            actions: []
        };

        // Tạo actions từ strategies
        plan.strategies.forEach((strategy, index) => {
            plan.actions.push({
                id: index + 1,
                description: strategy,
                status: 'pending',
                assignedTo: null,
                dueDate: null,
                completedAt: null
            });
        });

        this.mitigationPlans.push(plan);
        risk.mitigationStatus = 'planned';

        return plan;
    }

    // Tính target completion date
    calculateCompletionTarget(timeline) {
        const target = new Date();
        const timelineMap = {
            '1 month': 1,
            '3 months': 3,
            '6 months': 6,
            '1 year': 12
        };

        const months = timelineMap[timeline] || 3;
        target.setMonth(target.getMonth() + months);
        return target;
    }

    // Phân tích rủi ro tổng thể
    analyzeOverallRisk() {
        const totalRisks = this.risks.length;
        const risksByCategory = {};
        const risksByPriority = { critical: 0, high: 0, medium: 0, low: 0 };
        
        this.risks.forEach(risk => {
            // Phân loại theo category
            if (!risksByCategory[risk.category]) {
                risksByCategory[risk.category] = 0;
            }
            risksByCategory[risk.category]++;
            
            // Phân loại theo priority
            const priority = this.getRiskPriority(risk.riskScore);
            risksByPriority[priority]++;
        });

        // Tính risk exposure
        const totalRiskExposure = this.risks.reduce((sum, risk) => sum + risk.riskScore, 0);
        const averageRiskScore = totalRisks > 0 ? (totalRiskExposure / totalRisks).toFixed(2) : 0;

        // Xác định overall risk level
        let overallRiskLevel = 'low';
        if (risksByPriority.critical > 0) overallRiskLevel = 'critical';
        else if (risksByPriority.high > totalRisks * 0.3) overallRiskLevel = 'high';
        else if (risksByPriority.medium > totalRisks * 0.5) overallRiskLevel = 'medium';

        // Top risks
        const topRisks = this.risks
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 5)
            .map(r => ({
                name: r.name,
                category: r.category,
                riskScore: r.riskScore,
                priority: this.getRiskPriority(r.riskScore)
            }));

        // Risks cần review
        const risksNeedingReview = this.risks.filter(risk => {
            if (!risk.lastAssessed) return true;
            const daysSinceAssessment = (Date.now() - risk.lastAssessed) / (1000 * 60 * 60 * 24);
            const reviewInterval = this.getReviewInterval(risk.riskScore);
            return daysSinceAssessment > reviewInterval;
        });

        return {
            summary: {
                totalRisks,
                totalRiskExposure,
                averageRiskScore,
                overallRiskLevel
            },
            distribution: {
                byCategory: risksByCategory,
                byPriority: risksByPriority
            },
            topRisks,
            risksNeedingReview: risksNeedingReview.length,
            mitigationCoverage: this.calculateMitigationCoverage(),
            recommendations: this.generateRiskRecommendations()
        };
    }

    // Tính interval review theo risk score
    getReviewInterval(riskScore) {
        if (riskScore >= 9) return 30; // 30 days
        if (riskScore >= 6) return 90; // 90 days
        if (riskScore >= 3) return 180; // 180 days
        return 365; // 365 days
    }

    // Tính coverage của mitigation plans
    calculateMitigationCoverage() {
        const risksWithPlans = this.risks.filter(risk => 
            this.mitigationPlans.some(plan => plan.riskId === risk.id)
        ).length;

        const coverage = this.risks.length > 0 ? 
            (risksWithPlans / this.risks.length * 100).toFixed(1) : 0;

        const activePlans = this.mitigationPlans.filter(plan => 
            plan.status === 'approved' || plan.status === 'in_progress'
        ).length;

        return {
            totalPlans: this.mitigationPlans.length,
            activePlans,
            coverage: coverage + '%',
            risksWithoutPlans: this.risks.length - risksWithPlans
        };
    }

    // Tạo khuyến nghị rủi ro
    generateRiskRecommendations() {
        const recommendations = [];
        const analysis = this.analyzeOverallRisk();

        // Critical risks
        if (analysis.distribution.byPriority.critical > 0) {
            recommendations.push({
                priority: 'urgent',
                category: 'critical_risks',
                message: `${analysis.distribution.byPriority.critical} rủi ro ở mức critical cần xử lý ngay`,
                action: 'Triển khai kế hoạch giảm thiểu rủi ro critical'
            });
        }

        // High concentration in one category
        const maxCategoryRisks = Math.max(...Object.values(analysis.distribution.byCategory));
        if (maxCategoryRisks > this.risks.length * 0.4) {
            const dominantCategory = Object.keys(analysis.distribution.byCategory)
                .find(cat => analysis.distribution.byCategory[cat] === maxCategoryRisks);
            
            recommendations.push({
                priority: 'high',
                category: 'risk_concentration',
                message: `Tập trung rủi ro cao ở ${this.riskCategories[dominantCategory]}`,
                action: 'Đa dạng hóa và giảm thiểu rủi ro trong lĩnh vực này'
            });
        }

        // Low mitigation coverage
        const coverage = parseFloat(this.calculateMitigationCoverage().coverage);
        if (coverage < 70) {
            recommendations.push({
                priority: 'medium',
                category: 'mitigation_coverage',
                message: `Chỉ ${coverage}% rủi ro có kế hoạch giảm thiểu`,
                action: 'Xây dựng kế hoạch giảm thiểu cho các rủi ro chưa có'
            });
        }

        // Risks needing review
        if (analysis.risksNeedingReview > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'review_schedule',
                message: `${analysis.risksNeedingReview} rủi ro cần được đánh giá lại`,
                action: 'Lên lịch đánh giá lại các rủi ro đã quá hạn'
            });
        }

        return recommendations;
    }

    // Tạo risk register
    generateRiskRegister() {
        return this.risks.map(risk => {
            const latestAssessment = this.assessments
                .filter(a => a.riskId === risk.id)
                .sort((a, b) => b.assessmentDate - a.assessmentDate)[0];

            const mitigationPlan = this.mitigationPlans.find(p => p.riskId === risk.id);

            return {
                id: risk.id,
                name: risk.name,
                category: this.riskCategories[risk.category],
                impact: risk.impact,
                probability: risk.probability,
                riskScore: risk.riskScore,
                priority: this.getRiskPriority(risk.riskScore),
                owner: risk.owner,
                status: risk.status,
                lastAssessed: risk.lastAssessed,
                nextReview: latestAssessment?.nextReviewDate,
                mitigationStatus: risk.mitigationStatus,
                mitigationPlan: mitigationPlan ? {
                    status: mitigationPlan.status,
                    completionTarget: mitigationPlan.completionTarget,
                    actionsCompleted: mitigationPlan.actions.filter(a => a.status === 'completed').length,
                    totalActions: mitigationPlan.actions.length
                } : null
            };
        });
    }

    // Tạo heat map rủi ro
    generateRiskHeatMap() {
        const heatMap = {
            low: { low: [], medium: [], high: [] },
            medium: { low: [], medium: [], high: [] },
            high: { low: [], medium: [], high: [] },
            critical: { low: [], medium: [], high: [] }
        };

        this.risks.forEach(risk => {
            heatMap[risk.impact][risk.probability].push({
                name: risk.name,
                riskScore: risk.riskScore,
                category: risk.category
            });
        });

        return heatMap;
    }

    // Cập nhật trạng thái mitigation plan
    updateMitigationPlan(planId, updates) {
        const plan = this.mitigationPlans.find(p => p.id === planId);
        if (!plan) {
            throw new Error('Mitigation plan không tồn tại');
        }

        Object.keys(updates).forEach(key => {
            if (key in plan) {
                plan[key] = updates[key];
            }
        });

        // Cập nhật risk status nếu cần
        if (updates.status === 'completed') {
            const risk = this.risks.find(r => r.id === plan.riskId);
            if (risk) {
                risk.mitigationStatus = 'completed';
            }
        }

        return plan;
    }

    // Tạo báo cáo rủi ro
    generateRiskReport() {
        const overallAnalysis = this.analyzeOverallRisk();
        const riskRegister = this.generateRiskRegister();
        const heatMap = this.generateRiskHeatMap();

        return {
            executiveSummary: {
                totalRisks: overallAnalysis.summary.totalRisks,
                overallRiskLevel: overallAnalysis.summary.overallRiskLevel,
                criticalRisks: overallAnalysis.distribution.byPriority.critical,
                mitigationCoverage: this.calculateMitigationCoverage().coverage
            },
            riskAnalysis: overallAnalysis,
            riskRegister,
            heatMap,
            actionItems: this.generateActionItems(),
            generatedAt: new Date()
        };
    }

    // Tạo action items
    generateActionItems() {
        const actions = [];

        // Critical risks without mitigation
        const criticalRisksWithoutMitigation = this.risks.filter(risk => 
            this.getRiskPriority(risk.riskScore) === 'critical' && 
            risk.mitigationStatus === 'pending'
        );

        criticalRisksWithoutMitigation.forEach(risk => {
            actions.push({
                type: 'urgent',
                description: `Tạo kế hoạch giảm thiểu cho rủi ro critical: ${risk.name}`,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                owner: risk.owner
            });
        });

        // Overdue assessments
        const overdueAssessments = this.risks.filter(risk => {
            if (!risk.lastAssessed) return true;
            const daysSinceAssessment = (Date.now() - risk.lastAssessed) / (1000 * 60 * 60 * 24);
            return daysSinceAssessment > this.getReviewInterval(risk.riskScore);
        });

        overdueAssessments.forEach(risk => {
            actions.push({
                type: 'review',
                description: `Đánh giá lại rủi ro: ${risk.name}`,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
                owner: risk.owner
            });
        });

        return actions.sort((a, b) => a.dueDate - b.dueDate);
    }
}

// Sử dụng
const riskAssessor = new RiskAssessor();

// Demo
console.log('Risk Assessor Demo:');

// Tạo một số rủi ro từ templates
const cashFlowRisk = riskAssessor.createRiskFromTemplate('cash_flow', {
    owner: 'CFO'
});

const cyberSecurityRisk = riskAssessor.createRiskFromTemplate('cyber_security', {
    owner: 'CTO',
    probability: 'high'
});

console.log(`Created risks: ${cashFlowRisk.name}, ${cyberSecurityRisk.name}`);

// Đánh giá rủi ro
const assessment = riskAssessor.assessRisk(cashFlowRisk.id, {
    assessedBy: 'Risk Manager',
    currentImpact: 'high',
    currentProbability: 'medium',
    evidence: ['Negative cash flow last 2 months', 'High burn rate'],
    recommendations: ['Improve collection process', 'Reduce operational costs']
});

console.log(`Risk assessment completed with score: ${assessment.riskScore}`);

// Tạo báo cáo
const riskReport = riskAssessor.generateRiskReport();
console.log(`Risk Report - Overall Level: ${riskReport.executiveSummary.overallRiskLevel}`);
console.log(`Action Items: ${riskReport.actionItems.length}`);

module.exports = RiskAssessor;