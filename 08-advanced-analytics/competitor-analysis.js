// Competitor Analysis Tool - Phân tích đối thủ cạnh tranh
class CompetitorAnalysis {
    constructor() {
        this.competitors = [];
        this.analysisFrameworks = {
            swot: ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
            portersFive: ['Rivalry', 'Suppliers', 'Buyers', 'Substitutes', 'NewEntrants'],
            valueChain: ['Primary', 'Support']
        };
    }

    // Thêm đối thủ cạnh tranh
    addCompetitor(competitorData) {
        const competitor = {
            id: Date.now(),
            name: competitorData.name,
            website: competitorData.website,
            marketShare: competitorData.marketShare || 0,
            revenue: competitorData.revenue || 0,
            employees: competitorData.employees || 0,
            foundedYear: competitorData.foundedYear,
            products: competitorData.products || [],
            pricing: competitorData.pricing || {},
            strengths: [],
            weaknesses: [],
            marketPosition: this.calculateMarketPosition(competitorData),
            lastUpdated: new Date()
        };

        this.competitors.push(competitor);
        return competitor;
    }

    // Tính toán vị thế thị trường
    calculateMarketPosition(data) {
        let score = 0;
        
        // Điểm dựa trên thị phần
        if (data.marketShare > 30) score += 40;
        else if (data.marketShare > 15) score += 30;
        else if (data.marketShare > 5) score += 20;
        else score += 10;

        // Điểm dựa trên doanh thu
        if (data.revenue > 1000000000) score += 30; // > 1B
        else if (data.revenue > 100000000) score += 25; // > 100M
        else if (data.revenue > 10000000) score += 20; // > 10M
        else score += 10;

        // Điểm dựa trên số nhân viên
        if (data.employees > 1000) score += 20;
        else if (data.employees > 100) score += 15;
        else if (data.employees > 10) score += 10;
        else score += 5;

        // Điểm dựa trên tuổi công ty
        const age = new Date().getFullYear() - (data.foundedYear || new Date().getFullYear());
        if (age > 10) score += 10;
        else if (age > 5) score += 7;
        else score += 5;

        if (score >= 80) return 'Market Leader';
        if (score >= 60) return 'Strong Player';
        if (score >= 40) return 'Challenger';
        return 'Niche Player';
    }

    // Phân tích SWOT cho đối thủ
    analyzeSWOT(competitorId, swotData) {
        const competitor = this.competitors.find(c => c.id === competitorId);
        if (!competitor) return null;

        competitor.swotAnalysis = {
            strengths: swotData.strengths || [],
            weaknesses: swotData.weaknesses || [],
            opportunities: swotData.opportunities || [],
            threats: swotData.threats || [],
            analyzedAt: new Date()
        };

        return competitor.swotAnalysis;
    }

    // So sánh giá cả
    comparePricing() {
        const pricingComparison = this.competitors.map(competitor => ({
            name: competitor.name,
            pricing: competitor.pricing,
            priceRange: this.calculatePriceRange(competitor.pricing),
            competitiveness: this.calculatePriceCompetitiveness(competitor.pricing)
        }));

        return {
            comparison: pricingComparison,
            marketAverage: this.calculateMarketAveragePrice(),
            recommendations: this.generatePricingRecommendations(pricingComparison)
        };
    }

    // Tính khoảng giá
    calculatePriceRange(pricing) {
        const prices = Object.values(pricing).filter(p => typeof p === 'number');
        if (prices.length === 0) return 'N/A';

        const min = Math.min(...prices);
        const max = Math.max(...prices);
        
        return min === max ? `$${min}` : `$${min} - $${max}`;
    }

    // Tính độ cạnh tranh về giá
    calculatePriceCompetitiveness(pricing) {
        const avgPrice = this.calculateMarketAveragePrice();
        const competitorAvg = Object.values(pricing).reduce((sum, price) => sum + price, 0) / Object.values(pricing).length;
        
        if (competitorAvg < avgPrice * 0.8) return 'Very Competitive';
        if (competitorAvg < avgPrice * 0.9) return 'Competitive';
        if (competitorAvg < avgPrice * 1.1) return 'Market Rate';
        if (competitorAvg < avgPrice * 1.3) return 'Premium';
        return 'Luxury';
    }

    // Tính giá trung bình thị trường
    calculateMarketAveragePrice() {
        const allPrices = [];
        this.competitors.forEach(competitor => {
            Object.values(competitor.pricing).forEach(price => {
                if (typeof price === 'number') allPrices.push(price);
            });
        });

        return allPrices.length > 0 ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length : 0;
    }

    // Phân tích thị phần
    analyzeMarketShare() {
        const totalMarketShare = this.competitors.reduce((sum, c) => sum + c.marketShare, 0);
        const marketShareAnalysis = this.competitors.map(competitor => ({
            name: competitor.name,
            marketShare: competitor.marketShare,
            percentage: totalMarketShare > 0 ? (competitor.marketShare / totalMarketShare * 100).toFixed(1) : 0,
            position: competitor.marketPosition,
            trend: this.calculateMarketTrend(competitor)
        }));

        return {
            analysis: marketShareAnalysis.sort((a, b) => b.marketShare - a.marketShare),
            marketConcentration: this.calculateMarketConcentration(),
            opportunities: this.identifyMarketOpportunities()
        };
    }

    // Tính độ tập trung thị trường (HHI - Herfindahl-Hirschman Index)
    calculateMarketConcentration() {
        const totalMarketShare = this.competitors.reduce((sum, c) => sum + c.marketShare, 0);
        const hhi = this.competitors.reduce((sum, competitor) => {
            const share = competitor.marketShare / totalMarketShare * 100;
            return sum + (share * share);
        }, 0);

        let concentration = 'Low';
        if (hhi > 2500) concentration = 'High';
        else if (hhi > 1500) concentration = 'Moderate';

        return {
            hhi: hhi.toFixed(0),
            level: concentration,
            interpretation: this.interpretHHI(hhi)
        };
    }

    // Giải thích chỉ số HHI
    interpretHHI(hhi) {
        if (hhi > 2500) return 'Thị trường tập trung cao - ít đối thủ mạnh';
        if (hhi > 1500) return 'Thị trường tập trung vừa - cạnh tranh khá';
        return 'Thị trường phân tán - cạnh tranh cao';
    }

    // Xác định cơ hội thị trường
    identifyMarketOpportunities() {
        const opportunities = [];
        
        // Tìm khoảng trống về giá
        const priceGaps = this.findPriceGaps();
        if (priceGaps.length > 0) {
            opportunities.push({
                type: 'Price Gap',
                description: `Có khoảng trống giá ở mức ${priceGaps.join(', ')}`,
                potential: 'Medium'
            });
        }

        // Tìm thị trường ngách chưa được khai thác
        const underservedSegments = this.findUnderservedSegments();
        opportunities.push(...underservedSegments);

        // Phân tích điểm yếu của đối thủ
        const competitorWeaknesses = this.analyzeCompetitorWeaknesses();
        opportunities.push(...competitorWeaknesses);

        return opportunities;
    }

    // Tìm khoảng trống về giá
    findPriceGaps() {
        const allPrices = [];
        this.competitors.forEach(competitor => {
            Object.values(competitor.pricing).forEach(price => {
                if (typeof price === 'number') allPrices.push(price);
            });
        });

        allPrices.sort((a, b) => a - b);
        const gaps = [];

        for (let i = 1; i < allPrices.length; i++) {
            const gap = allPrices[i] - allPrices[i-1];
            if (gap > allPrices[i-1] * 0.5) { // Gap > 50% of previous price
                gaps.push(`$${allPrices[i-1]} - $${allPrices[i]}`);
            }
        }

        return gaps;
    }

    // Tìm phân khúc chưa được phục vụ tốt
    findUnderservedSegments() {
        const segments = [];
        
        // Phân tích dựa trên sản phẩm
        const productCategories = {};
        this.competitors.forEach(competitor => {
            competitor.products.forEach(product => {
                productCategories[product.category] = (productCategories[product.category] || 0) + 1;
            });
        });

        Object.keys(productCategories).forEach(category => {
            if (productCategories[category] < 2) {
                segments.push({
                    type: 'Underserved Segment',
                    description: `Ít đối thủ trong phân khúc ${category}`,
                    potential: 'High'
                });
            }
        });

        return segments;
    }

    // Phân tích điểm yếu của đối thủ
    analyzeCompetitorWeaknesses() {
        const opportunities = [];
        
        this.competitors.forEach(competitor => {
            if (competitor.swotAnalysis && competitor.swotAnalysis.weaknesses.length > 0) {
                competitor.swotAnalysis.weaknesses.forEach(weakness => {
                    opportunities.push({
                        type: 'Competitor Weakness',
                        description: `${competitor.name}: ${weakness}`,
                        potential: 'Medium'
                    });
                });
            }
        });

        return opportunities;
    }

    // Tạo báo cáo phân tích đối thủ
    generateCompetitorReport() {
        const marketShare = this.analyzeMarketShare();
        const pricing = this.comparePricing();
        
        return {
            summary: {
                totalCompetitors: this.competitors.length,
                marketLeaders: this.competitors.filter(c => c.marketPosition === 'Market Leader').length,
                averageMarketShare: (this.competitors.reduce((sum, c) => sum + c.marketShare, 0) / this.competitors.length).toFixed(1),
                marketConcentration: marketShare.marketConcentration.level
            },
            topCompetitors: this.competitors
                .sort((a, b) => b.marketShare - a.marketShare)
                .slice(0, 5)
                .map(c => ({
                    name: c.name,
                    marketShare: c.marketShare,
                    position: c.marketPosition,
                    revenue: c.revenue
                })),
            marketAnalysis: marketShare,
            pricingAnalysis: pricing,
            strategicRecommendations: this.generateStrategicRecommendations()
        };
    }

    // Tạo khuyến nghị chiến lược
    generateStrategicRecommendations() {
        const recommendations = [];
        
        const marketConcentration = this.calculateMarketConcentration();
        if (marketConcentration.level === 'Low') {
            recommendations.push({
                category: 'Market Entry',
                recommendation: 'Thị trường phân tán - cơ hội tốt để gia nhập',
                priority: 'High'
            });
        }

        const pricingAnalysis = this.comparePricing();
        if (pricingAnalysis.recommendations.length > 0) {
            recommendations.push({
                category: 'Pricing Strategy',
                recommendation: pricingAnalysis.recommendations[0],
                priority: 'Medium'
            });
        }

        const opportunities = this.identifyMarketOpportunities();
        opportunities.slice(0, 3).forEach(opp => {
            recommendations.push({
                category: 'Market Opportunity',
                recommendation: opp.description,
                priority: opp.potential
            });
        });

        return recommendations;
    }

    // Tạo gợi ý giá cả
    generatePricingRecommendations(pricingComparison) {
        const recommendations = [];
        const avgPrice = this.calculateMarketAveragePrice();
        
        const premiumCount = pricingComparison.filter(p => p.competitiveness === 'Premium' || p.competitiveness === 'Luxury').length;
        const competitiveCount = pricingComparison.filter(p => p.competitiveness === 'Very Competitive' || p.competitiveness === 'Competitive').length;
        
        if (premiumCount > competitiveCount) {
            recommendations.push('Cơ hội định giá cạnh tranh để chiếm thị phần');
        } else if (competitiveCount > premiumCount) {
            recommendations.push('Thị trường cạnh tranh về giá - cần tập trung vào giá trị gia tăng');
        }
        
        recommendations.push(`Giá trung bình thị trường: $${avgPrice.toFixed(2)}`);
        
        return recommendations;
    }

    // Tính xu hướng thị trường (giả lập)
    calculateMarketTrend(competitor) {
        // Trong thực tế, cần dữ liệu lịch sử
        const trends = ['Growing', 'Stable', 'Declining'];
        return trends[Math.floor(Math.random() * trends.length)];
    }
}


module.exports = CompetitorAnalysis;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const competitorAnalysis = new CompetitorAnalysis();
    
    // Thêm đối thủ mẫu
    competitorAnalysis.addCompetitor({
        name: 'TechCorp',
        website: 'techcorp.com',
        marketShare: 25,
        revenue: 500000000,
        employees: 2000,
        foundedYear: 2010,
        products: [
            { name: 'Product A', category: 'Software' },
            { name: 'Product B', category: 'Hardware' }
        ],
        pricing: {
            basic: 99,
            pro: 199,
            enterprise: 499
        }
    });
    
    competitorAnalysis.addCompetitor({
        name: 'InnovateLab',
        website: 'innovatelab.com',
        marketShare: 15,
        revenue: 200000000,
        employees: 800,
        foundedYear: 2015,
        products: [
            { name: 'Innovation Suite', category: 'Software' }
        ],
        pricing: {
            starter: 49,
            professional: 149,
            enterprise: 299
        }
    });
    
    // Demo
    console.log('Competitor Analysis Report:');
    const report = competitorAnalysis.generateCompetitorReport();
    console.log(JSON.stringify(report, null, 2));
    
}