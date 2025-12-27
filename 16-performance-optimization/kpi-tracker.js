// KPI Tracker - Theo dõi và phân tích chỉ số hiệu suất chính
class KPITracker {
    constructor() {
        this.kpis = [];
        this.measurements = [];
        this.targets = [];
        this.alerts = [];
        this.dashboards = [];
        this.kpiCategories = {
            financial: 'Tài chính',
            customer: 'Khách hàng',
            operational: 'Vận hành',
            marketing: 'Marketing',
            sales: 'Bán hàng',
            hr: 'Nhân sự',
            product: 'Sản phẩm'
        };
    }

    // Định nghĩa KPI mới
    defineKPI(kpiData) {
        const kpi = {
            id: 'KPI' + Date.now(),
            name: kpiData.name,
            description: kpiData.description,
            category: kpiData.category,
            unit: kpiData.unit, // %, VND, count, ratio
            calculationMethod: kpiData.calculationMethod,
            frequency: kpiData.frequency, // daily, weekly, monthly, quarterly
            target: kpiData.target,
            threshold: {
                excellent: kpiData.threshold?.excellent,
                good: kpiData.threshold?.good,
                warning: kpiData.threshold?.warning,
                critical: kpiData.threshold?.critical
            },
            isActive: true,
            createdAt: new Date(),
            lastMeasured: null,
            currentValue: null,
            trend: 'stable' // up, down, stable
        };

        this.kpis.push(kpi);
        return kpi;
    }

    // Khởi tạo KPIs chuẩn cho doanh nghiệp
    initializeStandardKPIs() {
        const standardKPIs = [
            // Financial KPIs
            {
                name: 'Monthly Recurring Revenue (MRR)',
                description: 'Doanh thu định kỳ hàng tháng',
                category: 'financial',
                unit: 'VND',
                calculationMethod: 'sum_monthly_subscriptions',
                frequency: 'monthly',
                target: 100000000, // 100M VND
                threshold: {
                    excellent: 120000000,
                    good: 100000000,
                    warning: 80000000,
                    critical: 50000000
                }
            },
            {
                name: 'Customer Acquisition Cost (CAC)',
                description: 'Chi phí thu hút một khách hàng mới',
                category: 'marketing',
                unit: 'VND',
                calculationMethod: 'marketing_spend / new_customers',
                frequency: 'monthly',
                target: 500000, // 500K VND
                threshold: {
                    excellent: 300000,
                    good: 500000,
                    warning: 800000,
                    critical: 1200000
                }
            },
            {
                name: 'Customer Lifetime Value (CLV)',
                description: 'Giá trị trọn đời của khách hàng',
                category: 'customer',
                unit: 'VND',
                calculationMethod: 'avg_revenue_per_customer * avg_lifespan',
                frequency: 'monthly',
                target: 5000000, // 5M VND
                threshold: {
                    excellent: 8000000,
                    good: 5000000,
                    warning: 3000000,
                    critical: 1500000
                }
            },
            {
                name: 'Churn Rate',
                description: 'Tỷ lệ khách hàng rời bỏ',
                category: 'customer',
                unit: '%',
                calculationMethod: 'churned_customers / total_customers * 100',
                frequency: 'monthly',
                target: 5, // 5%
                threshold: {
                    excellent: 2,
                    good: 5,
                    warning: 10,
                    critical: 20
                }
            },
            {
                name: 'Net Promoter Score (NPS)',
                description: 'Điểm khuyến nghị của khách hàng',
                category: 'customer',
                unit: 'score',
                calculationMethod: 'promoters_percentage - detractors_percentage',
                frequency: 'quarterly',
                target: 50,
                threshold: {
                    excellent: 70,
                    good: 50,
                    warning: 30,
                    critical: 0
                }
            },
            {
                name: 'Conversion Rate',
                description: 'Tỷ lệ chuyển đổi từ lead thành customer',
                category: 'sales',
                unit: '%',
                calculationMethod: 'converted_leads / total_leads * 100',
                frequency: 'monthly',
                target: 15, // 15%
                threshold: {
                    excellent: 25,
                    good: 15,
                    warning: 10,
                    critical: 5
                }
            },
            {
                name: 'Employee Satisfaction',
                description: 'Mức độ hài lòng của nhân viên',
                category: 'hr',
                unit: 'score',
                calculationMethod: 'avg_satisfaction_survey_score',
                frequency: 'quarterly',
                target: 8, // 8/10
                threshold: {
                    excellent: 9,
                    good: 8,
                    warning: 6,
                    critical: 4
                }
            },
            {
                name: 'Website Traffic',
                description: 'Lượng truy cập website hàng tháng',
                category: 'marketing',
                unit: 'visits',
                calculationMethod: 'sum_monthly_unique_visitors',
                frequency: 'monthly',
                target: 50000,
                threshold: {
                    excellent: 100000,
                    good: 50000,
                    warning: 25000,
                    critical: 10000
                }
            }
        ];

        standardKPIs.forEach(kpiData => {
            this.defineKPI(kpiData);
        });

        return standardKPIs.length;
    }

    // Ghi nhận measurement
    recordMeasurement(kpiId, value, date = new Date(), metadata = {}) {
        const kpi = this.kpis.find(k => k.id === kpiId);
        if (!kpi) {
            throw new Error('KPI không tồn tại');
        }

        const measurement = {
            id: 'M' + Date.now(),
            kpiId,
            value,
            date: new Date(date),
            metadata,
            recordedAt: new Date()
        };

        this.measurements.push(measurement);

        // Cập nhật KPI
        kpi.currentValue = value;
        kpi.lastMeasured = new Date(date);
        kpi.trend = this.calculateTrend(kpiId);

        // Kiểm tra alerts
        this.checkAlerts(kpi, value);

        return measurement;
    }

    // Tính toán trend
    calculateTrend(kpiId) {
        const recentMeasurements = this.measurements
            .filter(m => m.kpiId === kpiId)
            .sort((a, b) => b.date - a.date)
            .slice(0, 5); // 5 measurements gần nhất

        if (recentMeasurements.length < 2) return 'stable';

        const latest = recentMeasurements[0].value;
        const previous = recentMeasurements[1].value;
        const change = ((latest - previous) / previous) * 100;

        if (change > 5) return 'up';
        if (change < -5) return 'down';
        return 'stable';
    }

    // Kiểm tra alerts
    checkAlerts(kpi, value) {
        let alertLevel = null;
        let message = '';

        if (kpi.threshold.critical !== undefined) {
            if ((kpi.unit === '%' && value <= kpi.threshold.critical) ||
                (kpi.unit !== '%' && value <= kpi.threshold.critical)) {
                alertLevel = 'critical';
                message = `${kpi.name} ở mức nguy hiểm: ${value}${kpi.unit}`;
            }
        }

        if (!alertLevel && kpi.threshold.warning !== undefined) {
            if ((kpi.unit === '%' && value <= kpi.threshold.warning) ||
                (kpi.unit !== '%' && value <= kpi.threshold.warning)) {
                alertLevel = 'warning';
                message = `${kpi.name} cần chú ý: ${value}${kpi.unit}`;
            }
        }

        if (alertLevel) {
            const alert = {
                id: 'AL' + Date.now(),
                kpiId: kpi.id,
                kpiName: kpi.name,
                level: alertLevel,
                message,
                value,
                threshold: kpi.threshold[alertLevel],
                createdAt: new Date(),
                acknowledged: false
            };

            this.alerts.push(alert);
            return alert;
        }

        return null;
    }

    // Phân tích hiệu suất KPI
    analyzeKPIPerformance(kpiId, period = 30) {
        const kpi = this.kpis.find(k => k.id === kpiId);
        if (!kpi) return null;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - period);

        const measurements = this.measurements
            .filter(m => m.kpiId === kpiId && m.date >= cutoffDate)
            .sort((a, b) => a.date - b.date);

        if (measurements.length === 0) {
            return {
                kpiName: kpi.name,
                period: `${period} ngày`,
                status: 'no_data',
                message: 'Không có dữ liệu trong khoảng thời gian này'
            };
        }

        const values = measurements.map(m => m.value);
        const currentValue = values[values.length - 1];
        const previousValue = values.length > 1 ? values[values.length - 2] : currentValue;
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const avgValue = values.reduce((sum, v) => sum + v, 0) / values.length;

        // Tính performance vs target
        const targetAchievement = kpi.target ? (currentValue / kpi.target * 100) : null;
        
        // Xác định status
        let status = 'good';
        if (kpi.threshold.critical && currentValue <= kpi.threshold.critical) status = 'critical';
        else if (kpi.threshold.warning && currentValue <= kpi.threshold.warning) status = 'warning';
        else if (kpi.threshold.excellent && currentValue >= kpi.threshold.excellent) status = 'excellent';

        // Tính volatility
        const variance = values.reduce((sum, v) => sum + Math.pow(v - avgValue, 2), 0) / values.length;
        const volatility = Math.sqrt(variance) / avgValue * 100;

        return {
            kpiName: kpi.name,
            period: `${period} ngày`,
            currentValue,
            previousValue,
            change: previousValue !== 0 ? ((currentValue - previousValue) / previousValue * 100) : 0,
            trend: kpi.trend,
            minValue,
            maxValue,
            avgValue: Math.round(avgValue * 100) / 100,
            targetAchievement: targetAchievement ? Math.round(targetAchievement * 100) / 100 : null,
            status,
            volatility: Math.round(volatility * 100) / 100,
            measurementCount: measurements.length,
            recommendations: this.generateKPIRecommendations(kpi, {
                currentValue,
                trend: kpi.trend,
                targetAchievement,
                status,
                volatility
            })
        };
    }

    // Tạo khuyến nghị cho KPI
    generateKPIRecommendations(kpi, analysis) {
        const recommendations = [];

        if (analysis.status === 'critical') {
            recommendations.push({
                priority: 'high',
                action: `${kpi.name} ở mức nguy hiểm - cần hành động ngay lập tức`,
                type: 'urgent_action'
            });
        }

        if (analysis.status === 'warning') {
            recommendations.push({
                priority: 'medium',
                action: `${kpi.name} cần cải thiện - xem xét các biện pháp tối ưu`,
                type: 'improvement'
            });
        }

        if (analysis.trend === 'down') {
            recommendations.push({
                priority: 'medium',
                action: `${kpi.name} đang có xu hướng giảm - cần phân tích nguyên nhân`,
                type: 'trend_analysis'
            });
        }

        if (analysis.volatility > 20) {
            recommendations.push({
                priority: 'low',
                action: `${kpi.name} có độ biến động cao - cần ổn định quy trình`,
                type: 'stabilization'
            });
        }

        if (analysis.targetAchievement && analysis.targetAchievement < 80) {
            recommendations.push({
                priority: 'medium',
                action: `${kpi.name} chưa đạt target - cần điều chỉnh chiến lược`,
                type: 'target_adjustment'
            });
        }

        return recommendations;
    }

    // Tạo dashboard
    createDashboard(dashboardData) {
        const dashboard = {
            id: 'DB' + Date.now(),
            name: dashboardData.name,
            description: dashboardData.description,
            kpiIds: dashboardData.kpiIds || [],
            layout: dashboardData.layout || 'grid',
            refreshInterval: dashboardData.refreshInterval || 300, // 5 minutes
            isPublic: dashboardData.isPublic || false,
            createdAt: new Date(),
            lastUpdated: new Date()
        };

        this.dashboards.push(dashboard);
        return dashboard;
    }

    // Lấy dữ liệu dashboard
    getDashboardData(dashboardId) {
        const dashboard = this.dashboards.find(d => d.id === dashboardId);
        if (!dashboard) return null;

        const kpiData = dashboard.kpiIds.map(kpiId => {
            const kpi = this.kpis.find(k => k.id === kpiId);
            if (!kpi) return null;

            const recentMeasurements = this.measurements
                .filter(m => m.kpiId === kpiId)
                .sort((a, b) => b.date - a.date)
                .slice(0, 30); // 30 measurements gần nhất

            return {
                kpi: {
                    id: kpi.id,
                    name: kpi.name,
                    unit: kpi.unit,
                    currentValue: kpi.currentValue,
                    target: kpi.target,
                    trend: kpi.trend,
                    category: kpi.category
                },
                measurements: recentMeasurements,
                status: this.getKPIStatus(kpi),
                performance: this.analyzeKPIPerformance(kpiId, 30)
            };
        }).filter(Boolean);

        return {
            dashboard,
            kpiData,
            summary: this.generateDashboardSummary(kpiData),
            lastUpdated: new Date()
        };
    }

    // Xác định status KPI
    getKPIStatus(kpi) {
        if (!kpi.currentValue) return 'no_data';

        if (kpi.threshold.critical && kpi.currentValue <= kpi.threshold.critical) return 'critical';
        if (kpi.threshold.warning && kpi.currentValue <= kpi.threshold.warning) return 'warning';
        if (kpi.threshold.excellent && kpi.currentValue >= kpi.threshold.excellent) return 'excellent';
        return 'good';
    }

    // Tạo tóm tắt dashboard
    generateDashboardSummary(kpiData) {
        const total = kpiData.length;
        const excellent = kpiData.filter(k => k.status === 'excellent').length;
        const good = kpiData.filter(k => k.status === 'good').length;
        const warning = kpiData.filter(k => k.status === 'warning').length;
        const critical = kpiData.filter(k => k.status === 'critical').length;

        const overallHealth = critical > 0 ? 'critical' :
                            warning > total * 0.3 ? 'warning' :
                            excellent > total * 0.5 ? 'excellent' : 'good';

        return {
            totalKPIs: total,
            distribution: { excellent, good, warning, critical },
            overallHealth,
            trendsUp: kpiData.filter(k => k.kpi.trend === 'up').length,
            trendsDown: kpiData.filter(k => k.kpi.trend === 'down').length,
            activeAlerts: this.alerts.filter(a => !a.acknowledged).length
        };
    }

    // Tạo báo cáo KPI tổng quan
    generateKPIReport(period = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - period);

        const activeKPIs = this.kpis.filter(k => k.isActive);
        const recentMeasurements = this.measurements.filter(m => m.date >= cutoffDate);
        const recentAlerts = this.alerts.filter(a => a.createdAt >= cutoffDate);

        const categoryPerformance = {};
        Object.keys(this.kpiCategories).forEach(category => {
            const categoryKPIs = activeKPIs.filter(k => k.category === category);
            const categoryMeasurements = recentMeasurements.filter(m => 
                categoryKPIs.some(k => k.id === m.kpiId)
            );

            categoryPerformance[category] = {
                name: this.kpiCategories[category],
                kpiCount: categoryKPIs.length,
                measurementCount: categoryMeasurements.length,
                avgPerformance: this.calculateCategoryPerformance(categoryKPIs)
            };
        });

        const topPerformers = activeKPIs
            .filter(k => k.currentValue && k.target)
            .map(k => ({
                name: k.name,
                achievement: (k.currentValue / k.target * 100).toFixed(1) + '%',
                trend: k.trend
            }))
            .sort((a, b) => parseFloat(b.achievement) - parseFloat(a.achievement))
            .slice(0, 5);

        const underPerformers = activeKPIs
            .filter(k => k.currentValue && k.target && k.currentValue < k.target * 0.8)
            .map(k => ({
                name: k.name,
                achievement: (k.currentValue / k.target * 100).toFixed(1) + '%',
                gap: k.target - k.currentValue
            }));

        return {
            summary: {
                totalKPIs: activeKPIs.length,
                measurementsRecorded: recentMeasurements.length,
                alertsGenerated: recentAlerts.length,
                period: `${period} ngày`
            },
            categoryPerformance,
            topPerformers,
            underPerformers,
            criticalAlerts: recentAlerts.filter(a => a.level === 'critical'),
            recommendations: this.generateSystemRecommendations(activeKPIs, recentAlerts)
        };
    }

    // Tính hiệu suất category
    calculateCategoryPerformance(categoryKPIs) {
        const kpisWithTargets = categoryKPIs.filter(k => k.currentValue && k.target);
        if (kpisWithTargets.length === 0) return 0;

        const totalAchievement = kpisWithTargets.reduce((sum, k) => 
            sum + (k.currentValue / k.target), 0
        );

        return ((totalAchievement / kpisWithTargets.length) * 100).toFixed(1);
    }

    // Tạo khuyến nghị hệ thống
    generateSystemRecommendations(kpis, alerts) {
        const recommendations = [];

        const criticalAlerts = alerts.filter(a => a.level === 'critical');
        if (criticalAlerts.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'urgent',
                message: `${criticalAlerts.length} KPI ở mức nguy hiểm cần xử lý ngay`,
                action: 'Review và khắc phục các KPI critical'
            });
        }

        const kpisWithoutData = kpis.filter(k => !k.currentValue);
        if (kpisWithoutData.length > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'data_quality',
                message: `${kpisWithoutData.length} KPI chưa có dữ liệu`,
                action: 'Thiết lập quy trình thu thập dữ liệu'
            });
        }

        const oldMeasurements = kpis.filter(k => {
            if (!k.lastMeasured) return true;
            const daysSinceLastMeasurement = (Date.now() - k.lastMeasured) / (1000 * 60 * 60 * 24);
            return daysSinceLastMeasurement > 7;
        });

        if (oldMeasurements.length > 0) {
            recommendations.push({
                priority: 'low',
                category: 'maintenance',
                message: `${oldMeasurements.length} KPI chưa được cập nhật trong 7 ngày`,
                action: 'Cập nhật dữ liệu KPI định kỳ'
            });
        }

        return recommendations;
    }

    // Acknowledge alert
    acknowledgeAlert(alertId, userId = 'system') {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            alert.acknowledgedBy = userId;
            alert.acknowledgedAt = new Date();
        }
        return alert;
    }
}

// Sử dụng
const kpiTracker = new KPITracker();

// Demo
console.log('KPI Tracker Demo:');

// Khởi tạo KPIs chuẩn
const standardKPICount = kpiTracker.initializeStandardKPIs();
console.log(`Initialized ${standardKPICount} standard KPIs`);

// Ghi nhận một số measurements
const mrrKPI = kpiTracker.kpis.find(k => k.name.includes('MRR'));
if (mrrKPI) {
    kpiTracker.recordMeasurement(mrrKPI.id, 85000000); // 85M VND
    console.log(`Recorded MRR: 85M VND`);
}

const cacKPI = kpiTracker.kpis.find(k => k.name.includes('CAC'));
if (cacKPI) {
    kpiTracker.recordMeasurement(cacKPI.id, 600000); // 600K VND
    console.log(`Recorded CAC: 600K VND`);
}

// Tạo dashboard
const mainDashboard = kpiTracker.createDashboard({
    name: 'Main Business Dashboard',
    description: 'Dashboard chính theo dõi KPIs quan trọng',
    kpiIds: [mrrKPI?.id, cacKPI?.id].filter(Boolean)
});

console.log(`Created dashboard: ${mainDashboard.name}`);

module.exports = KPITracker;