// Pitch Deck Generator - Tạo bộ trình bày cho nhà đầu tư
class PitchDeckGenerator {
    constructor() {
        this.slides = [];
        this.companyData = {};
        this.templates = {
            seed: 'Seed Stage Template',
            seriesA: 'Series A Template',
            seriesB: 'Series B+ Template'
        };
        this.standardSlides = [
            'title', 'problem', 'solution', 'market', 'product',
            'traction', 'business_model', 'competition', 'team',
            'financials', 'funding', 'use_of_funds'
        ];
    }

    // Thiết lập thông tin công ty
    setCompanyInfo(companyInfo) {
        this.companyData = {
            name: companyInfo.name,
            tagline: companyInfo.tagline,
            founded: companyInfo.founded,
            stage: companyInfo.stage || 'seed',
            industry: companyInfo.industry,
            location: companyInfo.location,
            website: companyInfo.website,
            logo: companyInfo.logo,
            contact: companyInfo.contact
        };
    }

    // Tạo slide title
    generateTitleSlide() {
        return {
            type: 'title',
            title: this.companyData.name,
            subtitle: this.companyData.tagline,
            content: {
                companyName: this.companyData.name,
                tagline: this.companyData.tagline,
                presentationDate: new Date().toLocaleDateString(),
                stage: this.companyData.stage,
                contact: this.companyData.contact
            },
            speakerNotes: `Giới thiệu ${this.companyData.name} - ${this.companyData.tagline}. Chúng tôi đang tìm kiếm đầu tư ${this.companyData.stage}.`
        };
    }

    // Tạo slide problem
    generateProblemSlide(problemData) {
        return {
            type: 'problem',
            title: 'Vấn đề chúng tôi giải quyết',
            content: {
                mainProblem: problemData.mainProblem,
                painPoints: problemData.painPoints || [],
                marketSize: problemData.marketSize,
                currentSolutions: problemData.currentSolutions || [],
                whyNow: problemData.whyNow
            },
            speakerNotes: `Vấn đề: ${problemData.mainProblem}. Thị trường ${problemData.marketSize}. Tại sao bây giờ: ${problemData.whyNow}`
        };
    }

    // Tạo slide solution
    generateSolutionSlide(solutionData) {
        return {
            type: 'solution',
            title: 'Giải pháp của chúng tôi',
            content: {
                solution: solutionData.solution,
                keyFeatures: solutionData.keyFeatures || [],
                uniqueValue: solutionData.uniqueValue,
                demo: solutionData.demo || null,
                benefits: solutionData.benefits || []
            },
            speakerNotes: `Giải pháp: ${solutionData.solution}. Giá trị độc nhất: ${solutionData.uniqueValue}`
        };
    }

    // Tạo slide market
    generateMarketSlide(marketData) {
        return {
            type: 'market',
            title: 'Cơ hội thị trường',
            content: {
                tam: marketData.tam, // Total Addressable Market
                sam: marketData.sam, // Serviceable Addressable Market
                som: marketData.som, // Serviceable Obtainable Market
                marketGrowth: marketData.marketGrowth,
                trends: marketData.trends || [],
                targetCustomers: marketData.targetCustomers || []
            },
            speakerNotes: `TAM: ${marketData.tam}, SAM: ${marketData.sam}, SOM: ${marketData.som}. Tăng trưởng: ${marketData.marketGrowth}%/năm`
        };
    }

    // Tạo slide traction
    generateTractionSlide(tractionData) {
        return {
            type: 'traction',
            title: 'Traction & Milestones',
            content: {
                keyMetrics: tractionData.keyMetrics || {},
                milestones: tractionData.milestones || [],
                customers: tractionData.customers || [],
                partnerships: tractionData.partnerships || [],
                awards: tractionData.awards || [],
                press: tractionData.press || []
            },
            speakerNotes: this.generateTractionNotes(tractionData)
        };
    }

    // Tạo slide business model
    generateBusinessModelSlide(businessData) {
        return {
            type: 'business_model',
            title: 'Mô hình kinh doanh',
            content: {
                revenueStreams: businessData.revenueStreams || [],
                pricingModel: businessData.pricingModel,
                customerSegments: businessData.customerSegments || [],
                channels: businessData.channels || [],
                keyPartners: businessData.keyPartners || [],
                costStructure: businessData.costStructure || []
            },
            speakerNotes: `Mô hình: ${businessData.pricingModel}. Doanh thu từ: ${businessData.revenueStreams.join(', ')}`
        };
    }

    // Tạo slide competition
    generateCompetitionSlide(competitionData) {
        return {
            type: 'competition',
            title: 'Phân tích đối thủ',
            content: {
                directCompetitors: competitionData.directCompetitors || [],
                indirectCompetitors: competitionData.indirectCompetitors || [],
                competitiveAdvantages: competitionData.competitiveAdvantages || [],
                marketPosition: competitionData.marketPosition,
                barrierToEntry: competitionData.barrierToEntry || []
            },
            speakerNotes: `Lợi thế cạnh tranh: ${competitionData.competitiveAdvantages.join(', ')}`
        };
    }

    // Tạo slide team
    generateTeamSlide(teamData) {
        return {
            type: 'team',
            title: 'Đội ngũ',
            content: {
                founders: teamData.founders || [],
                keyTeam: teamData.keyTeam || [],
                advisors: teamData.advisors || [],
                boardMembers: teamData.boardMembers || [],
                teamSize: teamData.teamSize || 0,
                hiring: teamData.hiring || []
            },
            speakerNotes: `Đội ngũ ${teamData.teamSize} người. Founders: ${teamData.founders.map(f => f.name).join(', ')}`
        };
    }

    // Tạo slide financials
    generateFinancialsSlide(financialData) {
        return {
            type: 'financials',
            title: 'Tài chính',
            content: {
                revenue: financialData.revenue || [],
                expenses: financialData.expenses || [],
                projections: financialData.projections || [],
                keyMetrics: financialData.keyMetrics || {},
                unitEconomics: financialData.unitEconomics || {},
                burnRate: financialData.burnRate,
                runway: financialData.runway
            },
            speakerNotes: this.generateFinancialNotes(financialData)
        };
    }

    // Tạo slide funding
    generateFundingSlide(fundingData) {
        return {
            type: 'funding',
            title: 'Vòng gọi vốn',
            content: {
                fundingAmount: fundingData.fundingAmount,
                valuation: fundingData.valuation,
                useOfFunds: fundingData.useOfFunds || [],
                timeline: fundingData.timeline,
                previousRounds: fundingData.previousRounds || [],
                investors: fundingData.investors || []
            },
            speakerNotes: `Gọi vốn ${fundingData.fundingAmount} với valuation ${fundingData.valuation}`
        };
    }

    // Tạo slide use of funds
    generateUseOfFundsSlide(fundsData) {
        return {
            type: 'use_of_funds',
            title: 'Sử dụng vốn',
            content: {
                breakdown: fundsData.breakdown || [],
                timeline: fundsData.timeline || '18-24 months',
                milestones: fundsData.milestones || [],
                expectedOutcomes: fundsData.expectedOutcomes || []
            },
            speakerNotes: `Sử dụng vốn trong ${fundsData.timeline}: ${fundsData.breakdown.map(b => `${b.category}: ${b.percentage}%`).join(', ')}`
        };
    }

    // Tạo pitch deck hoàn chỉnh
    generatePitchDeck(pitchData) {
        this.slides = [];

        // Title slide
        this.slides.push(this.generateTitleSlide());

        // Problem slide
        if (pitchData.problem) {
            this.slides.push(this.generateProblemSlide(pitchData.problem));
        }

        // Solution slide
        if (pitchData.solution) {
            this.slides.push(this.generateSolutionSlide(pitchData.solution));
        }

        // Market slide
        if (pitchData.market) {
            this.slides.push(this.generateMarketSlide(pitchData.market));
        }

        // Product slide (if different from solution)
        if (pitchData.product) {
            this.slides.push({
                type: 'product',
                title: 'Sản phẩm',
                content: pitchData.product,
                speakerNotes: 'Demo sản phẩm và tính năng chính'
            });
        }

        // Traction slide
        if (pitchData.traction) {
            this.slides.push(this.generateTractionSlide(pitchData.traction));
        }

        // Business model slide
        if (pitchData.businessModel) {
            this.slides.push(this.generateBusinessModelSlide(pitchData.businessModel));
        }

        // Competition slide
        if (pitchData.competition) {
            this.slides.push(this.generateCompetitionSlide(pitchData.competition));
        }

        // Team slide
        if (pitchData.team) {
            this.slides.push(this.generateTeamSlide(pitchData.team));
        }

        // Financials slide
        if (pitchData.financials) {
            this.slides.push(this.generateFinancialsSlide(pitchData.financials));
        }

        // Funding slide
        if (pitchData.funding) {
            this.slides.push(this.generateFundingSlide(pitchData.funding));
        }

        // Use of funds slide
        if (pitchData.useOfFunds) {
            this.slides.push(this.generateUseOfFundsSlide(pitchData.useOfFunds));
        }

        return this.slides;
    }

    // Tạo speaker notes cho traction
    generateTractionNotes(tractionData) {
        const notes = [];
        
        if (tractionData.keyMetrics) {
            Object.keys(tractionData.keyMetrics).forEach(metric => {
                notes.push(`${metric}: ${tractionData.keyMetrics[metric]}`);
            });
        }

        if (tractionData.milestones && tractionData.milestones.length > 0) {
            notes.push(`Milestones: ${tractionData.milestones.map(m => m.title).join(', ')}`);
        }

        return notes.join('. ');
    }

    // Tạo speaker notes cho financials
    generateFinancialNotes(financialData) {
        const notes = [];
        
        if (financialData.revenue && financialData.revenue.length > 0) {
            const latestRevenue = financialData.revenue[financialData.revenue.length - 1];
            notes.push(`Doanh thu hiện tại: ${latestRevenue.amount}`);
        }

        if (financialData.burnRate) {
            notes.push(`Burn rate: ${financialData.burnRate}/tháng`);
        }

        if (financialData.runway) {
            notes.push(`Runway: ${financialData.runway} tháng`);
        }

        return notes.join('. ');
    }

    // Tạo executive summary
    generateExecutiveSummary() {
        return {
            company: this.companyData.name,
            tagline: this.companyData.tagline,
            stage: this.companyData.stage,
            industry: this.companyData.industry,
            keyPoints: this.extractKeyPoints(),
            askAmount: this.extractFundingAmount(),
            useOfFunds: this.extractUseOfFunds(),
            timeline: '10-15 minutes presentation + Q&A'
        };
    }

    // Trích xuất điểm chính
    extractKeyPoints() {
        const keyPoints = [];
        
        this.slides.forEach(slide => {
            switch(slide.type) {
                case 'problem':
                    keyPoints.push(`Problem: ${slide.content.mainProblem}`);
                    break;
                case 'solution':
                    keyPoints.push(`Solution: ${slide.content.uniqueValue}`);
                    break;
                case 'market':
                    keyPoints.push(`Market: ${slide.content.tam} TAM`);
                    break;
                case 'traction':
                    if (slide.content.keyMetrics) {
                        const metrics = Object.keys(slide.content.keyMetrics).map(k => 
                            `${k}: ${slide.content.keyMetrics[k]}`
                        ).join(', ');
                        keyPoints.push(`Traction: ${metrics}`);
                    }
                    break;
            }
        });

        return keyPoints;
    }

    // Trích xuất số tiền gọi vốn
    extractFundingAmount() {
        const fundingSlide = this.slides.find(s => s.type === 'funding');
        return fundingSlide ? fundingSlide.content.fundingAmount : 'TBD';
    }

    // Trích xuất use of funds
    extractUseOfFunds() {
        const fundsSlide = this.slides.find(s => s.type === 'use_of_funds');
        return fundsSlide ? fundsSlide.content.breakdown : [];
    }

    // Tạo presentation script
    generatePresentationScript() {
        const script = [];
        
        this.slides.forEach((slide, index) => {
            script.push({
                slideNumber: index + 1,
                slideType: slide.type,
                title: slide.title,
                duration: this.estimateSlideDuration(slide.type),
                keyPoints: this.extractSlideKeyPoints(slide),
                speakerNotes: slide.speakerNotes,
                transitions: this.generateTransitions(index)
            });
        });

        return script;
    }

    // Ước tính thời gian cho mỗi slide
    estimateSlideDuration(slideType) {
        const durations = {
            title: '30 seconds',
            problem: '1-2 minutes',
            solution: '2-3 minutes',
            market: '1-2 minutes',
            product: '2-3 minutes',
            traction: '2-3 minutes',
            business_model: '1-2 minutes',
            competition: '1-2 minutes',
            team: '1 minute',
            financials: '2-3 minutes',
            funding: '1-2 minutes',
            use_of_funds: '1 minute'
        };

        return durations[slideType] || '1-2 minutes';
    }

    // Trích xuất điểm chính của slide
    extractSlideKeyPoints(slide) {
        const keyPoints = [];
        
        switch(slide.type) {
            case 'problem':
                keyPoints.push(slide.content.mainProblem);
                keyPoints.push(...(slide.content.painPoints || []));
                break;
            case 'solution':
                keyPoints.push(slide.content.solution);
                keyPoints.push(slide.content.uniqueValue);
                break;
            case 'traction':
                if (slide.content.keyMetrics) {
                    Object.keys(slide.content.keyMetrics).forEach(metric => {
                        keyPoints.push(`${metric}: ${slide.content.keyMetrics[metric]}`);
                    });
                }
                break;
        }

        return keyPoints;
    }

    // Tạo transitions giữa slides
    generateTransitions(slideIndex) {
        const transitions = [
            "Bây giờ chúng ta sẽ xem...",
            "Điều này dẫn chúng ta đến...",
            "Tiếp theo, tôi muốn nói về...",
            "Như bạn có thể thấy...",
            "Điều quan trọng tiếp theo là..."
        ];

        return transitions[slideIndex % transitions.length];
    }

    // Tạo Q&A preparation
    generateQAPreparation() {
        return {
            commonQuestions: [
                {
                    question: "Tại sao bây giờ? Tại sao không ai làm điều này trước đây?",
                    category: "Timing",
                    suggestedAnswer: "Nói về market timing, technology readiness, regulatory changes"
                },
                {
                    question: "Làm thế nào bạn sẽ acquire customers?",
                    category: "Customer Acquisition",
                    suggestedAnswer: "Chi tiết về marketing channels, CAC, sales strategy"
                },
                {
                    question: "Đối thủ cạnh tranh lớn nhất của bạn là gì?",
                    category: "Competition",
                    suggestedAnswer: "Thừa nhận competitors nhưng nhấn mạnh differentiation"
                },
                {
                    question: "Unit economics của bạn như thế nào?",
                    category: "Financials",
                    suggestedAnswer: "LTV/CAC ratio, gross margins, path to profitability"
                },
                {
                    question: "Bạn sẽ scale team như thế nào?",
                    category: "Team",
                    suggestedAnswer: "Hiring plan, key roles, company culture"
                }
            ],
            preparationTips: [
                "Luyện tập trả lời trong 30-60 giây",
                "Chuẩn bị data backup cho mọi claims",
                "Thừa nhận những gì bạn không biết",
                "Redirect về vision và opportunity",
                "Luôn kết thúc với next steps"
            ]
        };
    }

    // Export pitch deck
    exportPitchDeck(format = 'json') {
        const pitchDeck = {
            company: this.companyData,
            slides: this.slides,
            executiveSummary: this.generateExecutiveSummary(),
            presentationScript: this.generatePresentationScript(),
            qaPreparation: this.generateQAPreparation(),
            createdAt: new Date(),
            version: '1.0'
        };

        if (format === 'json') {
            return JSON.stringify(pitchDeck, null, 2);
        }

        return pitchDeck;
    }
}


module.exports = PitchDeckGenerator;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const pitchGenerator = new PitchDeckGenerator();
    
    // Thiết lập thông tin công ty
    pitchGenerator.setCompanyInfo({
        name: 'TechStartup AI',
        tagline: 'AI-Powered Business Automation Platform',
        founded: 2023,
        stage: 'seed',
        industry: 'B2B SaaS',
        location: 'Ho Chi Minh City, Vietnam',
        website: 'techstartup.ai',
        contact: 'founder@techstartup.ai'
    });
    
    // Tạo pitch deck
    const pitchData = {
        problem: {
            mainProblem: 'Small businesses waste 40% of time on repetitive tasks',
            painPoints: ['Manual data entry', 'Inefficient workflows', 'High operational costs'],
            marketSize: '$50B SMB automation market',
            whyNow: 'AI technology is now accessible and affordable'
        },
        solution: {
            solution: 'AI-powered automation platform for SMBs',
            uniqueValue: 'No-code AI automation that saves 20+ hours/week',
            keyFeatures: ['Drag-drop workflow builder', 'AI task automation', 'Integration hub']
        },
        market: {
            tam: '$50B',
            sam: '$5B',
            som: '$500M',
            marketGrowth: 25,
            trends: ['AI adoption', 'Remote work', 'Digital transformation']
        },
        traction: {
            keyMetrics: {
                'Monthly Users': '5,000',
                'Revenue': '$50K MRR',
                'Growth Rate': '20% MoM'
            },
            milestones: [
                { title: 'Product Launch', date: '2023-06' },
                { title: 'First 1000 Users', date: '2023-09' }
            ]
        },
        funding: {
            fundingAmount: '$2M',
            valuation: '$10M',
            timeline: 'Q1 2024'
        }
    };
    
    const slides = pitchGenerator.generatePitchDeck(pitchData);
    console.log('Pitch Deck Generated:');
    console.log(`Total slides: ${slides.length}`);
    console.log('Executive Summary:', pitchGenerator.generateExecutiveSummary());
    
}