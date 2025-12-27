// AI Content Generator - Tạo nội dung marketing tự động
class ContentGenerator {
    constructor() {
        this.contentTypes = {
            blog_post: 'Bài viết blog',
            email_campaign: 'Email marketing',
            product_description: 'Mô tả sản phẩm',
            social_post: 'Bài đăng mạng xã hội',
            ad_copy: 'Nội dung quảng cáo',
            press_release: 'Thông cáo báo chí'
        };
        
        this.tones = {
            professional: 'Chuyên nghiệp',
            friendly: 'Thân thiện',
            urgent: 'Khẩn cấp',
            informative: 'Thông tin',
            persuasive: 'Thuyết phục',
            casual: 'Thoải mái'
        };
    }

    // Tạo blog post outline
    generateBlogOutline(topic, targetAudience, keywords = []) {
        const outline = {
            title: this.generateTitle(topic, 'blog_post'),
            introduction: {
                hook: this.generateHook(topic),
                problem: `Vấn đề mà ${targetAudience} đang gặp phải`,
                solution: `Cách ${topic} có thể giải quyết vấn đề này`
            },
            mainSections: this.generateMainSections(topic, keywords),
            conclusion: {
                summary: 'Tóm tắt các điểm chính',
                cta: this.generateCTA('blog_post', topic)
            },
            seoElements: {
                metaDescription: `Tìm hiểu về ${topic} - Hướng dẫn chi tiết và thực tế nhất`,
                keywords: keywords,
                internalLinks: [`/blog/${topic.toLowerCase().replace(/\s+/g, '-')}`, `/resources/${topic.toLowerCase().replace(/\s+/g, '-')}`]
            }
        };

        return outline;
    }

    // Tạo tiêu đề hấp dẫn
    generateTitle(topic, contentType) {
        const titleFormats = {
            blog_post: [
                `Hướng dẫn chi tiết về ${topic} cho người mới bắt đầu`,
                `${topic}: Bí quyết thành công mà ít ai biết`,
                `7 cách hiệu quả để cải thiện ${topic}`,
                `Tại sao ${topic} quan trọng cho doanh nghiệp của bạn?`,
                `${topic} - Từ cơ bản đến nâng cao`
            ],
            email_campaign: [
                `🎯 Cơ hội đặc biệt về ${topic}`,
                `Đừng bỏ lỡ: ${topic} giảm giá 50%`,
                `${topic} - Ưu đãi chỉ có hôm nay!`,
                `Bí mật về ${topic} mà bạn cần biết`
            ],
            social_post: [
                `💡 Mẹo hay về ${topic}`,
                `🔥 Xu hướng ${topic} năm 2024`,
                `✨ ${topic} thay đổi cuộc sống bạn như thế nào?`
            ]
        };

        const formats = titleFormats[contentType] || titleFormats.blog_post;
        return formats[Math.floor(Math.random() * formats.length)];
    }

    // Tạo hook thu hút
    generateHook(topic) {
        const hooks = [
            `Bạn có biết rằng 90% doanh nghiệp thất bại vì không hiểu rõ về ${topic}?`,
            `Trong 5 phút tới, bạn sẽ học được điều mà tôi mất 5 năm mới khám phá ra về ${topic}.`,
            `Nếu tôi chỉ có 60 giây để nói với bạn về ${topic}, đây là điều tôi sẽ nói...`,
            `Câu chuyện này về ${topic} sẽ thay đổi cách bạn nhìn nhận vấn đề.`
        ];

        return hooks[Math.floor(Math.random() * hooks.length)];
    }

    // Tạo các phần chính của bài viết
    generateMainSections(topic, keywords) {
        return [
            {
                title: `${topic} là gì?`,
                content: 'Định nghĩa và giải thích cơ bản',
                keywords: keywords.slice(0, 2)
            },
            {
                title: `Tại sao ${topic} quan trọng?`,
                content: 'Lợi ích và tầm quan trọng',
                keywords: keywords.slice(2, 4)
            },
            {
                title: `Cách thực hiện ${topic} hiệu quả`,
                content: 'Hướng dẫn từng bước chi tiết',
                keywords: keywords.slice(4, 6)
            },
            {
                title: `Lỗi thường gặp khi làm ${topic}`,
                content: 'Những sai lầm cần tránh',
                keywords: keywords.slice(6, 8)
            },
            {
                title: `Công cụ hỗ trợ ${topic}`,
                content: 'Danh sách tools và resources',
                keywords: keywords.slice(8, 10)
            }
        ];
    }

    // Tạo email marketing campaign
    generateEmailCampaign(product, audience, goal) {
        const campaign = {
            subject: this.generateEmailSubject(product, goal),
            preheader: `Khám phá ${product} ngay hôm nay`,
            body: {
                greeting: `Chào ${audience},`,
                opening: `Chúng tôi vui mừng giới thiệu ${product} - giải pháp tuyệt vời cho ${goal}`,
                mainContent: `${product} sẽ giúp bạn đạt được mục tiêu ${goal} một cách hiệu quả`,
                socialProof: `Hơn 1000+ khách hàng đã tin tưởng sử dụng ${product}`,
                cta: this.generateCTA('email_campaign', product),
                closing: 'Trân trọng,\nTeam Marketing'
            },
            followUp: ['Email follow-up sau 3 ngày', 'Email follow-up sau 1 tuần']
        };

        return campaign;
    }

    // Tạo subject line email
    generateEmailSubject(product, goal) {
        const subjects = {
            sales: [
                `🎯 ${product} - Ưu đãi đặc biệt chỉ dành cho bạn`,
                `Cuối cùng! ${product} đã có mặt tại Việt Nam`,
                `${product} giảm 50% - Chỉ còn 24h`
            ],
            engagement: [
                `Bí quyết sử dụng ${product} hiệu quả nhất`,
                `${product} - Câu chuyện thành công của khách hàng`,
                `Cập nhật mới từ ${product}`
            ],
            retention: [
                `Chúng tôi nhớ bạn! Quay lại với ${product}`,
                `${product} - Tính năng mới dành riêng cho bạn`,
                `Ưu đãi đặc biệt cho khách hàng thân thiết`
            ]
        };

        const goalSubjects = subjects[goal] || subjects.sales;
        return goalSubjects[Math.floor(Math.random() * goalSubjects.length)];
    }

    // Tạo mô tả sản phẩm
    generateProductDescription(product, features, benefits, targetCustomer) {
        return {
            headline: `${product} - Giải pháp hoàn hảo cho ${targetCustomer}`,
            description: `${product} được thiết kế đặc biệt để giúp ${targetCustomer} ${benefits[0]}.`,
            keyFeatures: features.map(feature => ({
                feature,
                benefit: `Giúp bạn ${this.featureToBenefit(feature)}`
            })),
            specifications: this.generateSpecifications(product),
            pricing: this.generatePricingCopy(product),
            guarantee: '30 ngày hoàn tiền 100% nếu không hài lòng',
            cta: `Đặt hàng ${product} ngay hôm nay!`
        };
    }

    // Chuyển đổi tính năng thành lợi ích
    featureToBenefit(feature) {
        const benefitMap = {
            'tự động hóa': 'tiết kiệm thời gian và công sức',
            'báo cáo': 'đưa ra quyết định chính xác',
            'bảo mật': 'an tâm về dữ liệu',
            'tích hợp': 'làm việc hiệu quả hơn',
            'di động': 'làm việc mọi lúc mọi nơi'
        };

        return benefitMap[feature.toLowerCase()] || 'cải thiện hiệu suất công việc';
    }

    // Tạo nội dung quảng cáo
    generateAdCopy(product, platform, budget, objective) {
        const adFormats = {
            facebook: {
                headline: `${product} - Thay đổi cách bạn làm việc`,
                description: `Khám phá ${product} ngay hôm nay. Miễn phí dùng thử 14 ngày!`,
                cta: 'Dùng thử miễn phí'
            },
            google: {
                headline1: `${product} Chính Hãng`,
                headline2: 'Giảm Giá 30% Hôm Nay',
                description: `${product} - Giải pháp tốt nhất cho doanh nghiệp. Đặt hàng ngay!`,
                cta: 'Mua ngay'
            },
            instagram: {
                caption: `✨ ${product} đang thay đổi cách chúng ta làm việc! Bạn đã thử chưa? #${product.replace(/\s+/g, '')} #innovation`,
                cta: 'Tìm hiểu thêm'
            }
        };

        return adFormats[platform] || adFormats.facebook;
    }

    // Tạo CTA hiệu quả
    generateCTA(contentType, topic) {
        const ctas = {
            blog_post: [
                `Tải xuống hướng dẫn chi tiết về ${topic}`,
                `Đăng ký nhận thêm tips về ${topic}`,
                `Chia sẻ bài viết nếu bạn thấy hữu ích`
            ],
            email_campaign: [
                'Mua ngay - Ưu đãi có hạn',
                'Dùng thử miễn phí 14 ngày',
                'Tìm hiểu thêm'
            ],
            social_post: [
                'Like và share nếu bạn đồng ý!',
                'Comment câu hỏi của bạn bên dưới',
                'Follow để nhận thêm tips hữu ích'
            ]
        };

        const typeCTAs = ctas[contentType] || ctas.blog_post;
        return typeCTAs[Math.floor(Math.random() * typeCTAs.length)];
    }

    // Phân tích hiệu suất nội dung
    analyzeContentPerformance(contentData) {
        const analysis = {
            readabilityScore: this.calculateReadability(contentData.text),
            seoScore: this.calculateSEOScore(contentData),
            engagementPrediction: this.predictEngagement(contentData),
            suggestions: []
        };

        // Gợi ý cải thiện
        if (analysis.readabilityScore < 60) {
            analysis.suggestions.push('Sử dụng câu ngắn hơn để dễ đọc');
        }

        if (analysis.seoScore < 70) {
            analysis.suggestions.push('Thêm keywords vào tiêu đề và nội dung');
        }

        return analysis;
    }

    // Tính điểm dễ đọc
    calculateReadability(text) {
        const sentences = text.split(/[.!?]+/).length;
        const words = text.split(/\s+/).length;
        const avgWordsPerSentence = words / sentences;

        // Điểm dựa trên độ dài câu (càng ngắn càng dễ đọc)
        if (avgWordsPerSentence <= 15) return 90;
        if (avgWordsPerSentence <= 20) return 75;
        if (avgWordsPerSentence <= 25) return 60;
        return 40;
    }

    // Tính điểm SEO
    calculateSEOScore(contentData) {
        let score = 0;
        
        if (contentData.title && contentData.title.length >= 30 && contentData.title.length <= 60) score += 20;
        if (contentData.metaDescription && contentData.metaDescription.length >= 120 && contentData.metaDescription.length <= 160) score += 20;
        if (contentData.keywords && contentData.keywords.length >= 3) score += 20;
        if (contentData.text && contentData.text.length >= 300) score += 20;
        if (contentData.headings && contentData.headings.length >= 3) score += 20;

        return score;
    }

    // Dự đoán engagement
    predictEngagement(contentData) {
        let score = 50; // Base score

        // Factors that increase engagement
        if (contentData.hasImages) score += 15;
        if (contentData.hasVideo) score += 25;
        if (contentData.hasQuestion) score += 10;
        if (contentData.hasCTA) score += 10;
        if (contentData.isPersonalized) score += 20;

        return Math.min(score, 100);
    }
}


module.exports = ContentGenerator;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const generator = new ContentGenerator();
    
    // Tạo blog outline
    const blogOutline = generator.generateBlogOutline(
        'Marketing Digital', 
        'chủ doanh nghiệp nhỏ',
        ['SEO', 'social media', 'content marketing', 'email marketing']
    );
    
    console.log('Blog Outline:', JSON.stringify(blogOutline, null, 2));
    
}