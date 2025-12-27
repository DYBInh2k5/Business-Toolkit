// Social Media Automation - Lên lịch và quản lý nội dung
class SocialMediaScheduler {
    constructor() {
        this.posts = [];
        this.platforms = ['facebook', 'instagram', 'linkedin', 'twitter'];
        this.contentTemplates = this.initializeTemplates();
    }

    // Khởi tạo templates nội dung
    initializeTemplates() {
        return {
            product_launch: {
                title: "🚀 Ra mắt sản phẩm mới!",
                content: "Chúng tôi vui mừng giới thiệu {product_name} - {product_description}. Đặt hàng ngay để nhận ưu đãi {discount}%!",
                hashtags: ["#newproduct", "#launch", "#innovation"],
                cta: "Tìm hiểu thêm tại {website}"
            },
            educational: {
                title: "💡 Mẹo hữu ích",
                content: "Bạn có biết: {tip_content}? Đây là một trong những bí quyết giúp {benefit}.",
                hashtags: ["#tips", "#education", "#business"],
                cta: "Follow để nhận thêm tips hữu ích!"
            },
            behind_scenes: {
                title: "🎬 Hậu trường",
                content: "Một ngày làm việc tại {company_name}. {behind_scenes_story}",
                hashtags: ["#behindthescenes", "#team", "#culture"],
                cta: "Chia sẻ câu chuyện của bạn trong comments!"
            },
            customer_story: {
                title: "⭐ Câu chuyện khách hàng",
                content: "Cảm ơn {customer_name} đã tin tưởng sử dụng dịch vụ của chúng tôi! '{testimonial}'",
                hashtags: ["#testimonial", "#customer", "#success"],
                cta: "Bạn cũng có câu chuyện tương tự? Hãy chia sẻ!"
            }
        };
    }

    // Tạo nội dung từ template
    generateContent(templateType, variables = {}) {
        const template = this.contentTemplates[templateType];
        if (!template) throw new Error('Template không tồn tại');

        let content = template.content;
        
        // Thay thế variables
        Object.keys(variables).forEach(key => {
            content = content.replace(new RegExp(`{${key}}`, 'g'), variables[key]);
        });

        return {
            title: template.title,
            content,
            hashtags: template.hashtags,
            cta: template.cta.replace(/{(\w+)}/g, (match, key) => variables[key] || match)
        };
    }

    // Lên lịch đăng bài
    schedulePost(postData) {
        const post = {
            id: Date.now(),
            ...postData,
            status: 'scheduled',
            createdAt: new Date(),
            scheduledFor: new Date(postData.scheduledFor)
        };

        this.posts.push(post);
        return post;
    }

    // Tạo lịch đăng bài tự động cho tháng
    generateMonthlySchedule(startDate, postsPerWeek = 5) {
        const schedule = [];
        const currentDate = new Date(startDate);
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const contentTypes = Object.keys(this.contentTemplates);
        let contentIndex = 0;

        while (currentDate < endDate) {
            // Bỏ qua cuối tuần
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                const contentType = contentTypes[contentIndex % contentTypes.length];
                
                schedule.push({
                    date: new Date(currentDate),
                    contentType,
                    platforms: this.selectOptimalPlatforms(contentType),
                    timeSlot: this.getOptimalPostTime(currentDate.getDay())
                });
                
                contentIndex++;
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return schedule.slice(0, postsPerWeek * 4); // Giới hạn số bài/tháng
    }

    // Chọn platform tối ưu theo loại nội dung
    selectOptimalPlatforms(contentType) {
        const platformMap = {
            product_launch: ['facebook', 'instagram', 'linkedin'],
            educational: ['linkedin', 'twitter'],
            behind_scenes: ['instagram', 'facebook'],
            customer_story: ['facebook', 'linkedin']
        };

        return platformMap[contentType] || ['facebook'];
    }

    // Thời gian đăng bài tối ưu
    getOptimalPostTime(dayOfWeek) {
        const timeMap = {
            1: '09:00', // Thứ 2
            2: '10:00', // Thứ 3  
            3: '14:00', // Thứ 4
            4: '11:00', // Thứ 5
            5: '15:00'  // Thứ 6
        };

        return timeMap[dayOfWeek] || '12:00';
    }

    // Phân tích hiệu suất
    analyzePerformance() {
        const publishedPosts = this.posts.filter(p => p.status === 'published');
        
        if (publishedPosts.length === 0) {
            return { message: 'Chưa có dữ liệu để phân tích' };
        }

        const platformStats = {};
        const contentTypeStats = {};

        publishedPosts.forEach(post => {
            // Thống kê theo platform
            post.platforms.forEach(platform => {
                if (!platformStats[platform]) {
                    platformStats[platform] = { posts: 0, totalEngagement: 0 };
                }
                platformStats[platform].posts++;
                platformStats[platform].totalEngagement += post.engagement || 0;
            });

            // Thống kê theo loại nội dung
            if (!contentTypeStats[post.contentType]) {
                contentTypeStats[post.contentType] = { posts: 0, totalEngagement: 0 };
            }
            contentTypeStats[post.contentType].posts++;
            contentTypeStats[post.contentType].totalEngagement += post.engagement || 0;
        });

        return {
            totalPosts: publishedPosts.length,
            platformPerformance: Object.keys(platformStats).map(platform => ({
                platform,
                posts: platformStats[platform].posts,
                avgEngagement: (platformStats[platform].totalEngagement / platformStats[platform].posts).toFixed(2)
            })),
            contentPerformance: Object.keys(contentTypeStats).map(type => ({
                contentType: type,
                posts: contentTypeStats[type].posts,
                avgEngagement: (contentTypeStats[type].totalEngagement / contentTypeStats[type].posts).toFixed(2)
            }))
        };
    }

    // Gợi ý nội dung dựa trên hiệu suất
    getContentSuggestions() {
        const performance = this.analyzePerformance();
        
        if (performance.message) {
            return ['Hãy bắt đầu đăng nội dung để nhận gợi ý!'];
        }

        const suggestions = [];
        
        // Gợi ý dựa trên content type hiệu quả nhất
        const bestContent = performance.contentPerformance
            .sort((a, b) => b.avgEngagement - a.avgEngagement)[0];
            
        if (bestContent) {
            suggestions.push(`Tăng tần suất đăng ${bestContent.contentType} vì có engagement cao nhất (${bestContent.avgEngagement})`);
        }

        // Gợi ý platform
        const bestPlatform = performance.platformPerformance
            .sort((a, b) => b.avgEngagement - a.avgEngagement)[0];
            
        if (bestPlatform) {
            suggestions.push(`Tập trung vào ${bestPlatform.platform} vì có hiệu suất tốt nhất`);
        }

        return suggestions;
    }
}


module.exports = SocialMediaScheduler;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const scheduler = new SocialMediaScheduler();
    
    // Tạo nội dung từ template
    const productPost = scheduler.generateContent('product_launch', {
        product_name: 'App quản lý tài chính',
        product_description: 'giúp bạn theo dõi chi tiêu thông minh',
        discount: '20',
        website: 'myapp.com'
    });
    
    console.log('Generated Post:', productPost);
    
    // Tạo lịch đăng bài tháng
    const monthlySchedule = scheduler.generateMonthlySchedule('2024-02-01', 3);
    console.log('Monthly Schedule:', monthlySchedule.slice(0, 5)); // Hiển thị 5 bài đầu
    
}