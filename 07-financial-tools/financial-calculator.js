// Financial Calculator - Công cụ tính toán tài chính doanh nghiệp
class FinancialCalculator {
    constructor() {
        this.taxRate = 0.20; // 20% thuế doanh nghiệp
        this.inflationRate = 0.03; // 3% lạm phát hàng năm
    }

    // Tính Break-even Point (Điểm hòa vốn)
    calculateBreakEven(fixedCosts, variableCostPerUnit, pricePerUnit) {
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        
        if (contributionMargin <= 0) {
            throw new Error('Giá bán phải cao hơn chi phí biến đổi');
        }

        const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;

        return {
            units: breakEvenUnits,
            revenue: breakEvenRevenue,
            contributionMargin,
            contributionMarginRatio: (contributionMargin / pricePerUnit * 100).toFixed(2) + '%'
        };
    }

    // Tính ROI (Return on Investment)
    calculateROI(initialInvestment, finalValue, timeInYears = 1) {
        const totalReturn = finalValue - initialInvestment;
        const roi = (totalReturn / initialInvestment) * 100;
        const annualizedROI = Math.pow((finalValue / initialInvestment), (1 / timeInYears)) - 1;

        return {
            totalReturn,
            roi: roi.toFixed(2) + '%',
            annualizedROI: (annualizedROI * 100).toFixed(2) + '%',
            isPositive: roi > 0
        };
    }

    // Tính NPV (Net Present Value)
    calculateNPV(initialInvestment, cashFlows, discountRate = 0.10) {
        let npv = -initialInvestment;

        cashFlows.forEach((cashFlow, year) => {
            npv += cashFlow / Math.pow(1 + discountRate, year + 1);
        });

        return {
            npv: npv.toFixed(2),
            isViable: npv > 0,
            discountRate: (discountRate * 100).toFixed(1) + '%'
        };
    }

    // Tính IRR (Internal Rate of Return) - Simplified
    calculateIRR(initialInvestment, cashFlows) {
        // Simplified IRR calculation using trial and error method
        let rate = 0.1; // Start with 10%
        let npv = this.calculateNPVForRate(initialInvestment, cashFlows, rate);
        
        // Iterate to find rate where NPV ≈ 0
        for (let i = 0; i < 100; i++) {
            if (Math.abs(npv) < 1) break;
            
            rate += npv > 0 ? 0.01 : -0.01;
            npv = this.calculateNPVForRate(initialInvestment, cashFlows, rate);
        }

        return {
            irr: (rate * 100).toFixed(2) + '%',
            npvAtIRR: npv.toFixed(2)
        };
    }

    // Helper function for IRR calculation
    calculateNPVForRate(initialInvestment, cashFlows, rate) {
        let npv = -initialInvestment;
        cashFlows.forEach((cashFlow, year) => {
            npv += cashFlow / Math.pow(1 + rate, year + 1);
        });
        return npv;
    }

    // Tính Payback Period (Thời gian hoàn vốn)
    calculatePaybackPeriod(initialInvestment, annualCashFlow) {
        const paybackYears = initialInvestment / annualCashFlow;
        const years = Math.floor(paybackYears);
        const months = Math.round((paybackYears - years) * 12);

        return {
            totalYears: paybackYears.toFixed(2),
            years,
            months,
            description: `${years} năm ${months} tháng`
        };
    }

    // Tính Cash Flow Projection (Dự báo dòng tiền)
    projectCashFlow(initialRevenue, growthRate, expenses, periods = 12) {
        const projection = [];
        let currentRevenue = initialRevenue;

        for (let month = 1; month <= periods; month++) {
            const revenue = currentRevenue * Math.pow(1 + growthRate, month - 1);
            const totalExpenses = expenses.fixed + (expenses.variable * revenue / 100);
            const grossProfit = revenue - totalExpenses;
            const netProfit = grossProfit * (1 - this.taxRate);

            projection.push({
                month,
                revenue: Math.round(revenue),
                expenses: Math.round(totalExpenses),
                grossProfit: Math.round(grossProfit),
                netProfit: Math.round(netProfit),
                cumulativeProfit: month === 1 ? Math.round(netProfit) : 
                    Math.round(projection[month - 2].cumulativeProfit + netProfit)
            });
        }

        return projection;
    }

    // Tính Customer Lifetime Value (CLV)
    calculateCLV(averageOrderValue, purchaseFrequency, customerLifespan, grossMargin = 0.3) {
        const annualValue = averageOrderValue * purchaseFrequency;
        const totalValue = annualValue * customerLifespan;
        const clv = totalValue * grossMargin;

        return {
            annualValue,
            totalValue,
            clv: Math.round(clv),
            monthlyValue: Math.round(clv / (customerLifespan * 12))
        };
    }

    // Tính Customer Acquisition Cost (CAC)
    calculateCAC(marketingSpend, salesSpend, newCustomers) {
        const totalSpend = marketingSpend + salesSpend;
        const cac = totalSpend / newCustomers;

        return {
            cac: Math.round(cac),
            totalSpend,
            newCustomers,
            efficiency: newCustomers > 0 ? (totalSpend / newCustomers).toFixed(2) : 'N/A'
        };
    }

    // Tính LTV/CAC Ratio
    calculateLTVCACRatio(clv, cac) {
        const ratio = clv / cac;
        let health = 'Poor';

        if (ratio >= 3) health = 'Excellent';
        else if (ratio >= 2) health = 'Good';
        else if (ratio >= 1.5) health = 'Acceptable';

        return {
            ratio: ratio.toFixed(2),
            health,
            recommendation: this.getLTVCACRecommendation(ratio)
        };
    }

    // Gợi ý dựa trên LTV/CAC ratio
    getLTVCACRecommendation(ratio) {
        if (ratio >= 3) return 'Tuyệt vời! Có thể tăng đầu tư marketing.';
        if (ratio >= 2) return 'Tốt. Tiếp tục duy trì chiến lược hiện tại.';
        if (ratio >= 1.5) return 'Chấp nhận được. Cần tối ưu hóa CAC hoặc tăng CLV.';
        return 'Cần cải thiện ngay. Giảm CAC hoặc tăng CLV.';
    }

    // Tính Unit Economics
    calculateUnitEconomics(revenue, cogs, operatingExpenses, units) {
        const revenuePerUnit = revenue / units;
        const cogsPerUnit = cogs / units;
        const opexPerUnit = operatingExpenses / units;
        const grossMarginPerUnit = revenuePerUnit - cogsPerUnit;
        const netMarginPerUnit = grossMarginPerUnit - opexPerUnit;

        return {
            revenuePerUnit: Math.round(revenuePerUnit),
            cogsPerUnit: Math.round(cogsPerUnit),
            opexPerUnit: Math.round(opexPerUnit),
            grossMarginPerUnit: Math.round(grossMarginPerUnit),
            netMarginPerUnit: Math.round(netMarginPerUnit),
            grossMarginPercent: ((grossMarginPerUnit / revenuePerUnit) * 100).toFixed(1) + '%',
            netMarginPercent: ((netMarginPerUnit / revenuePerUnit) * 100).toFixed(1) + '%'
        };
    }

    // Tính Burn Rate và Runway
    calculateBurnRate(monthlyExpenses, monthlyRevenue, currentCash) {
        const netBurn = monthlyExpenses - monthlyRevenue;
        const runway = netBurn > 0 ? Math.floor(currentCash / netBurn) : Infinity;

        return {
            grossBurn: monthlyExpenses,
            netBurn: Math.max(0, netBurn),
            runway: runway === Infinity ? 'Unlimited' : `${runway} months`,
            cashRunOutDate: runway === Infinity ? null : 
                new Date(Date.now() + runway * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        };
    }

    // Tạo báo cáo tài chính tổng quan
    generateFinancialSummary(data) {
        const {
            revenue, expenses, initialInvestment, 
            customers, marketingSpend, currentCash
        } = data;

        const roi = this.calculateROI(initialInvestment, revenue);
        const burnRate = this.calculateBurnRate(expenses, revenue, currentCash);
        const unitEconomics = this.calculateUnitEconomics(
            revenue, expenses * 0.6, expenses * 0.4, customers
        );

        return {
            profitability: {
                revenue,
                expenses,
                profit: revenue - expenses,
                profitMargin: ((revenue - expenses) / revenue * 100).toFixed(1) + '%'
            },
            efficiency: {
                roi: roi.roi,
                revenuePerCustomer: Math.round(revenue / customers),
                costPerCustomer: Math.round(expenses / customers)
            },
            sustainability: {
                burnRate: burnRate.netBurn,
                runway: burnRate.runway,
                cashPosition: currentCash
            },
            unitEconomics,
            recommendations: this.generateRecommendations(data)
        };
    }

    // Tạo gợi ý cải thiện
    generateRecommendations(data) {
        const recommendations = [];
        const profitMargin = (data.revenue - data.expenses) / data.revenue;

        if (profitMargin < 0.1) {
            recommendations.push('Cần cải thiện lợi nhuận: giảm chi phí hoặc tăng giá bán');
        }

        if (data.currentCash < data.expenses * 3) {
            recommendations.push('Dòng tiền thấp: cần tăng doanh thu hoặc gọi vốn');
        }

        const customerAcquisitionCost = data.marketingSpend / (data.customers * 0.2); // Assume 20% are new
        if (customerAcquisitionCost > data.revenue / data.customers * 0.3) {
            recommendations.push('Chi phí thu hút khách hàng cao: tối ưu hóa marketing');
        }

        return recommendations;
    }
}


module.exports = FinancialCalculator;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const calculator = new FinancialCalculator();
    
    // Ví dụ tính toán
    console.log('Break-even Analysis:');
    console.log(calculator.calculateBreakEven(50000, 20, 50));
    
    console.log('\nROI Calculation:');
    console.log(calculator.calculateROI(100000, 150000, 1));
    
    console.log('\nCash Flow Projection:');
    const cashFlow = calculator.projectCashFlow(10000, 0.05, {fixed: 5000, variable: 30}, 6);
    console.log(cashFlow.slice(0, 3)); // Show first 3 months
    
}