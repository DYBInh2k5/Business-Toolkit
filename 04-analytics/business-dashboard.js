// Business Analytics Dashboard - Theo dõi KPIs quan trọng
class BusinessDashboard {
    constructor() {
        this.metrics = {
            revenue: [],
            customers: [],
            traffic: [],
            conversion: []
        };
    }

    // Thêm dữ liệu doanh thu
    addRevenueData(date, amount, source = 'direct') {
        this.metrics.revenue.push({
            date: new Date(date),
            amount,
            source,
            timestamp: Date.now()
        });
    }

    // Thêm dữ liệu khách hàng
    addCustomerData(date, newCustomers, churnedCustomers = 0) {
        this.metrics.customers.push({
            date: new Date(date),
            new: newCustomers,
            churned: churnedCustomers,
            net: newCustomers - churnedCustomers
        });
    }

    // Tính toán MRR (Monthly Recurring Revenue)
    calculateMRR() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyRevenue = this.metrics.revenue
            .filter(r => r.date.getMonth() === currentMonth && r.date.getFullYear() === currentYear)
            .reduce((sum, r) => sum + r.amount, 0);
            
        return monthlyRevenue;
    }

    // Tính toán Customer Acquisition Cost (CAC)
    calculateCAC(marketingSpend, newCustomers) {
        return newCustomers > 0 ? (marketingSpend / newCustomers).toFixed(2) : 0;
    }

    // Tính toán Customer Lifetime Value (CLV)
    calculateCLV(averageOrderValue, purchaseFrequency, customerLifespan) {
        return (averageOrderValue * purchaseFrequency * customerLifespan).toFixed(2);
    }

    // Phân tích xu hướng tăng trưởng
    getGrowthTrend(metric, period = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - period);
        
        const recentData = this.metrics[metric]
            .filter(d => d.date >= cutoffDate)
            .sort((a, b) => a.date - b.date);
            
        if (recentData.length < 2) return { trend: 'insufficient_data', rate: 0 };
        
        const firstValue = recentData[0].amount || recentData[0].new || 0;
        const lastValue = recentData[recentData.length - 1].amount || recentData[recentData.length - 1].new || 0;
        
        const growthRate = firstValue > 0 ? ((lastValue - firstValue) / firstValue * 100).toFixed(2) : 0;
        
        return {
            trend: growthRate > 0 ? 'growing' : growthRate < 0 ? 'declining' : 'stable',
            rate: growthRate
        };
    }

    // Tạo báo cáo tổng quan
    generateExecutiveSummary() {
        const mrr = this.calculateMRR();
        const revenueGrowth = this.getGrowthTrend('revenue');
        const customerGrowth = this.getGrowthTrend('customers');
        
        const totalCustomers = this.metrics.customers.reduce((sum, c) => sum + c.net, 0);
        const totalRevenue = this.metrics.revenue.reduce((sum, r) => sum + r.amount, 0);
        
        return {
            summary: {
                mrr: `$${mrr.toLocaleString()}`,
                totalRevenue: `$${totalRevenue.toLocaleString()}`,
                totalCustomers,
                averageRevenuePerCustomer: totalCustomers > 0 ? 
                    `$${(totalRevenue / totalCustomers).toFixed(2)}` : '$0'
            },
            trends: {
                revenue: `${revenueGrowth.rate}% (${revenueGrowth.trend})`,
                customers: `${customerGrowth.rate}% (${customerGrowth.trend})`
            },
            alerts: this.generateAlerts()
        };
    }

    // Tạo cảnh báo tự động
    generateAlerts() {
        const alerts = [];
        
        // Cảnh báo doanh thu giảm
        const revenueGrowth = this.getGrowthTrend('revenue', 7);
        if (revenueGrowth.rate < -10) {
            alerts.push({
                type: 'warning',
                message: `Doanh thu giảm ${Math.abs(revenueGrowth.rate)}% trong 7 ngày qua`
            });
        }
        
        // Cảnh báo khách hàng churn cao
        const recentChurn = this.metrics.customers
            .slice(-7)
            .reduce((sum, c) => sum + c.churned, 0);
            
        if (recentChurn > 5) {
            alerts.push({
                type: 'critical',
                message: `${recentChurn} khách hàng đã rời bỏ trong tuần qua`
            });
        }
        
        return alerts;
    }

    // Export dữ liệu cho visualization
    exportForChart(metric, period = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - period);
        
        return this.metrics[metric]
            .filter(d => d.date >= cutoffDate)
            .map(d => ({
                date: d.date.toISOString().split('T')[0],
                value: d.amount || d.new || d.net || 0
            }));
    }
}


module.exports = BusinessDashboard;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng mẫu
    const dashboard = new BusinessDashboard();
    
    // Thêm dữ liệu mẫu
    dashboard.addRevenueData('2024-01-01', 5000, 'website');
    dashboard.addRevenueData('2024-01-15', 7500, 'referral');
    dashboard.addCustomerData('2024-01-01', 25, 2);
    
    console.log('Executive Summary:', dashboard.generateExecutiveSummary());
    
}