// Trend Analyzer - Phân tích xu hướng thị trường
class TrendAnalyzer {
    constructor() {
        this.trends = [];
        this.keywords = [];
        this.industries = [];
        this.trendSources = {
            google: 'Google Trends',
            social: 'Social Media',
            news: 'News Articles',
            patents: 'Patent Filings',
            funding: 'Startup Funding'
        };
    }

    // Thêm xu hướng mới
    addTrend(trendData) {
        const trend = {
            id: Date.now(),
            name: trendData.name,
            category: trendData.category,
            description: trendData.description,
            keywords: trendData.keywords || [],
            searchVolume: trendData.searchVolume || 0,
            growthRate: trendData.growthRate || 0,
            maturityLevel: this.calculateMaturityLevel(trendData),
            marketSize: trendData.marketSize || 0,
            timeframe: trendData.timeframe || 'short-term',
            sources: trendData.sources || [],
            relatedTrends: [],
            businessOpportunities: [],
            risks: [],
            createdAt: new Date(),
            lastUpdated: new Date()
        };

        this.trends.push(trend);
        this.analyzeRelatedTrends(trend);
        return trend;
    }

    // Tính mức độ trưởng thành của xu hướng
    calculateMaturityLevel(trendData) {
        let score = 0;

        // Dựa trên search volume
        if (trendData.searchVolume > 1000000) score += 30;
        else if (trendData.searchVolume > 100000) score += 25;
        else if (trendData.searchVolume > 10000) score += 20;
        else score += 10;

        // Dựa trên growth rate
        if (trendData.growthRate > 100) score += 25; // >100% growth
        else if (trendData.growthRate > 50) score += 20;
        else if (trendData.growthRate > 20) score += 15;
        else score += 5;

        // Dựa trên market size
        if (trendData.marketSize > 1000000000) score += 25; // >1B market
        else if (trendData.marketSize > 100000000) score += 20;
        else if (trendData.marketSize > 10000000) score += 15;
        else score += 5;

        // Dựa trên số lượng sources
        score += Math.min(trendData.sources?.length * 5 || 0, 20);

        if (score >= 80) return 'Mature';
        if (score >= 60) return 'Growth';
        if (score >= 40) return 'Emerging';
        return 'Early';
    }

    // Phân tích xu hướng liên quan
    analyzeRelatedTrends(newTrend) {
        this.trends.forEach(existingTrend => {
            if (existingTrend.id !== newTrend.id) {
                const similarity = this.calculateTrendSimilarity(newTrend, existingTrend);
                if (similarity > 0.3) {
                    newTrend.relatedTrends.push({
                        trendId: existingTrend.id,
                        name: existingTrend.name,
                        similarity: similarity,
                        relationship: this.determineTrendRelationship(similarity)
                    });
                }
            }
        });
    }

    // Tính độ tương đồng giữa các xu hướng
    calculateTrendSimilarity(trend1, trend2) {
        let similarity = 0;

        // So sánh category
        if (trend1.category === trend2.category) similarity += 0.3;

        // So sánh keywords
        const commonKeywords = trend1.keywords.filter(k => trend2.keywords.includes(k));
        similarity += (commonKeywords.length / Math.max(trend1.keywords.length, trend2.keywords.length)) * 0.4;

        // So sánh timeframe
        if (trend1.timeframe === trend2.timeframe) similarity += 0.2;

        // So sánh maturity level
        if (trend1.maturityLevel === trend2.maturityLevel) similarity += 0.1;

        return Math.min(similarity, 1);
    }

    // Xác định mối quan hệ giữa xu hướng
    determineTrendRelationship(similarity) {
        if (similarity > 0.7) return 'Highly Related';
        if (similarity > 0.5) return 'Related';
        if (similarity > 0.3) return 'Somewhat Related';
        return 'Loosely Related';
    }

    // Dự đoán xu hướng tương lai
    predictFutureTrends(timeHorizon = 12) { // months
        const predictions = [];

        this.trends.forEach(trend => {
            const prediction = {
                trendName: trend.name,
                currentStage: trend.maturityLevel,
                predictedStage: this.predictNextStage(trend, timeHorizon),
                growthPotential: this.calculateGrowthPotential(trend),
                marketOpportunity: this.assessMarketOpportunity(trend),
                riskLevel: this.assessRiskLevel(trend),
                confidence: this.calculatePredictionConfidence(trend)
            };

            predictions.push(prediction);
        });

        return predictions.sort((a, b) => b.growthPotential - a.growthPotential);
    }

    // Dự đoán giai đoạn tiếp theo
    predictNextStage(trend, timeHorizon) {
        const stageProgression = ['Early', 'Emerging', 'Growth', 'Mature'];
        const currentIndex = stageProgression.indexOf(trend.maturityLevel);
        
        // Tính toán dựa trên growth rate và time horizon
        const progressionRate = trend.growthRate / 100 * (timeHorizon / 12);
        
        if (progressionRate > 0.5 && currentIndex < stageProgression.length - 1) {
            return stageProgression[currentIndex + 1];
        }
        
        return trend.maturityLevel;
    }

    // Tính tiềm năng tăng trưởng
    calculateGrowthPotential(trend) {
        let potential = trend.growthRate;

        // Điều chỉnh dựa trên maturity level
        const maturityMultiplier = {
            'Early': 1.5,
            'Emerging': 1.3,
            'Growth': 1.0,
            'Mature': 0.7
        };

        potential *= maturityMultiplier[trend.maturityLevel] || 1;

        // Điều chỉnh dựa trên market size
        if (trend.marketSize > 1000000000) potential *= 1.2;
        else if (trend.marketSize < 10000000) potential *= 0.8;

        return Math.min(potential, 200); // Cap at 200%
    }

    // Đánh giá cơ hội thị trường
    assessMarketOpportunity(trend) {
        let score = 0;

        // Market size factor
        if (trend.marketSize > 1000000000) score += 40;
        else if (trend.marketSize > 100000000) score += 30;
        else if (trend.marketSize > 10000000) score += 20;
        else score += 10;

        // Growth rate factor
        if (trend.growthRate > 50) score += 30;
        else if (trend.growthRate > 20) score += 20;
        else if (trend.growthRate > 10) score += 10;

        // Maturity level factor
        const maturityScore = {
            'Early': 30,
            'Emerging': 25,
            'Growth': 15,
            'Mature': 5
        };
        score += maturityScore[trend.maturityLevel] || 0;

        if (score >= 80) return 'Very High';
        if (score >= 60) return 'High';
        if (score >= 40) return 'Medium';
        return 'Low';
    }

    // Đánh giá mức độ rủi ro
    assessRiskLevel(trend) {
        let riskScore = 0;

        // Volatility risk (based on growth rate)
        if (trend.growthRate > 100) riskScore += 30;
        else if (trend.growthRate > 50) riskScore += 20;
        else riskScore += 10;

        // Market maturity risk
        const maturityRisk = {
            'Early': 40,
            'Emerging': 30,
            'Growth': 20,
            'Mature': 10
        };
        riskScore += maturityRisk[trend.maturityLevel] || 0;

        // Market size risk (too small = risky)
        if (trend.marketSize < 10000000) riskScore += 20;
        else if (trend.marketSize < 100000000) riskScore += 10;

        // Source diversity risk
        if (trend.sources.length < 2) riskScore += 20;
        else if (trend.sources.length < 3) riskScore += 10;

        if (riskScore >= 70) return 'High';
        if (riskScore >= 50) return 'Medium';
        return 'Low';
    }

    // Tính độ tin cậy của dự đoán
    calculatePredictionConfidence(trend) {
        let confidence = 50; // Base confidence

        // Data quality factors
        if (trend.searchVolume > 100000) confidence += 15;
        if (trend.sources.length >= 3) confidence += 15;
        if (trend.keywords.length >= 5) confidence += 10;

        // Trend stability
        if (trend.growthRate > 0 && trend.growthRate < 100) confidence += 10;

        // Market validation
        if (trend.marketSize > 100000000) confidence += 10;

        return Math.min(confidence, 95); // Cap at 95%
    }

    // Tìm kiếm cơ hội kinh doanh
    identifyBusinessOpportunities() {
        const opportunities = [];

        this.trends.forEach(trend => {
            // Emerging trends with high growth potential
            if (trend.maturityLevel === 'Emerging' && trend.growthRate > 30) {
                opportunities.push({
                    type: 'Early Mover Advantage',
                    trend: trend.name,
                    description: `Xu hướng mới nổi với tăng trưởng ${trend.growthRate}%`,
                    potential: 'High',
                    timeframe: 'Short-term',
                    investmentLevel: 'Medium'
                });
            }

            // Large market opportunities
            if (trend.marketSize > 500000000 && trend.maturityLevel !== 'Mature') {
                opportunities.push({
                    type: 'Large Market',
                    trend: trend.name,
                    description: `Thị trường lớn ${(trend.marketSize / 1000000000).toFixed(1)}B với tiềm năng tăng trưởng`,
                    potential: 'High',
                    timeframe: 'Medium-term',
                    investmentLevel: 'High'
                });
            }

            // Niche opportunities
            if (trend.searchVolume < 50000 && trend.growthRate > 50) {
                opportunities.push({
                    type: 'Niche Market',
                    trend: trend.name,
                    description: `Thị trường ngách với tăng trưởng nhanh`,
                    potential: 'Medium',
                    timeframe: 'Short-term',
                    investmentLevel: 'Low'
                });
            }
        });

        return opportunities.sort((a, b) => {
            const potentialScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return potentialScore[b.potential] - potentialScore[a.potential];
        });
    }

    // Tạo báo cáo xu hướng
    generateTrendReport() {
        const predictions = this.predictFutureTrends();
        const opportunities = this.identifyBusinessOpportunities();

        return {
            summary: {
                totalTrends: this.trends.length,
                emergingTrends: this.trends.filter(t => t.maturityLevel === 'Emerging').length,
                highGrowthTrends: this.trends.filter(t => t.growthRate > 50).length,
                largeMarkets: this.trends.filter(t => t.marketSize > 1000000000).length
            },
            topTrends: this.trends
                .sort((a, b) => b.growthRate - a.growthRate)
                .slice(0, 10)
                .map(t => ({
                    name: t.name,
                    category: t.category,
                    growthRate: t.growthRate,
                    maturityLevel: t.maturityLevel,
                    marketSize: t.marketSize
                })),
            predictions: predictions.slice(0, 5),
            opportunities: opportunities.slice(0, 5),
            recommendations: this.generateRecommendations(predictions, opportunities)
        };
    }

    // Tạo khuyến nghị
    generateRecommendations(predictions, opportunities) {
        const recommendations = [];

        // Top growth opportunities
        const highGrowthTrends = predictions.filter(p => p.growthPotential > 50);
        if (highGrowthTrends.length > 0) {
            recommendations.push({
                category: 'Growth Opportunity',
                recommendation: `Tập trung vào ${highGrowthTrends[0].trendName} - tiềm năng tăng trưởng ${highGrowthTrends[0].growthPotential.toFixed(1)}%`,
                priority: 'High'
            });
        }

        // Early stage opportunities
        const earlyTrends = this.trends.filter(t => t.maturityLevel === 'Early' && t.growthRate > 30);
        if (earlyTrends.length > 0) {
            recommendations.push({
                category: 'Early Mover',
                recommendation: `Cân nhắc đầu tư sớm vào ${earlyTrends[0].name}`,
                priority: 'Medium'
            });
        }

        // Risk management
        const highRiskTrends = predictions.filter(p => p.riskLevel === 'High');
        if (highRiskTrends.length > 0) {
            recommendations.push({
                category: 'Risk Management',
                recommendation: `Thận trọng với ${highRiskTrends[0].trendName} - mức rủi ro cao`,
                priority: 'Medium'
            });
        }

        return recommendations;
    }

    // Theo dõi xu hướng theo thời gian
    trackTrendOverTime(trendId, newData) {
        const trend = this.trends.find(t => t.id === trendId);
        if (!trend) return null;

        if (!trend.history) trend.history = [];
        
        trend.history.push({
            date: new Date(),
            searchVolume: newData.searchVolume,
            growthRate: newData.growthRate,
            marketSize: newData.marketSize
        });

        // Update current values
        trend.searchVolume = newData.searchVolume;
        trend.growthRate = newData.growthRate;
        trend.marketSize = newData.marketSize;
        trend.lastUpdated = new Date();

        // Recalculate maturity level
        trend.maturityLevel = this.calculateMaturityLevel(trend);

        return trend;
    }
}


module.exports = TrendAnalyzer;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const trendAnalyzer = new TrendAnalyzer();
    
    // Thêm xu hướng mẫu
    trendAnalyzer.addTrend({
        name: 'AI-Powered Business Tools',
        category: 'Technology',
        description: 'Công cụ kinh doanh tích hợp AI',
        keywords: ['AI', 'automation', 'business', 'productivity'],
        searchVolume: 500000,
        growthRate: 85,
        marketSize: 2500000000,
        timeframe: 'medium-term',
        sources: ['google', 'news', 'funding']
    });
    
    trendAnalyzer.addTrend({
        name: 'Sustainable Business Practices',
        category: 'Sustainability',
        description: 'Thực hành kinh doanh bền vững',
        keywords: ['sustainability', 'green', 'eco-friendly', 'ESG'],
        searchVolume: 300000,
        growthRate: 45,
        marketSize: 1200000000,
        timeframe: 'long-term',
        sources: ['news', 'social']
    });
    
    // Demo
    console.log('Trend Analysis Report:');
    const report = trendAnalyzer.generateTrendReport();
    console.log(JSON.stringify(report, null, 2));
    
}