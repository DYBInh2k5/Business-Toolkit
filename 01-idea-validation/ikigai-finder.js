#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs-extra');

class IkigaiFinder {
    constructor() {
        this.ikigaiData = {
            whatYouLove: [],
            whatYouAreGoodAt: [],
            whatTheWorldNeeds: [],
            whatYouCanBePaidFor: []
        };
    }

    async start() {
        console.log('\n🎯 IKIGAI FINDER - Tìm mục đích kinh doanh của bạn\n');
        console.log('Trả lời các câu hỏi sau để tìm ra điểm giao thoa lý tưởng:\n');

        await this.askQuestions();
        await this.analyzeResults();
        await this.saveResults();
    }

    async askQuestions() {
        // Điều bạn yêu thích
        const loveAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'loves',
                message: '❤️  Bạn yêu thích làm gì? (chọn nhiều)',
                choices: [
                    'Giải quyết vấn đề',
                    'Sáng tạo nội dung',
                    'Dạy học/Chia sẻ kiến thức',
                    'Xây dựng cộng đồng',
                    'Phân tích dữ liệu',
                    'Thiết kế/Nghệ thuật',
                    'Công nghệ/Lập trình',
                    'Bán hàng/Marketing',
                    'Quản lý/Lãnh đạo',
                    'Khác (nhập thêm)'
                ]
            },
            {
                type: 'input',
                name: 'loveOther',
                message: 'Nhập thêm điều bạn yêu thích:',
                when: (answers) => answers.loves.includes('Khác (nhập thêm)')
            }
        ]);

        this.ikigaiData.whatYouLove = loveAnswers.loves;
        if (loveAnswers.loveOther) {
            this.ikigaiData.whatYouLove.push(loveAnswers.loveOther);
        }

        // Điều bạn giỏi
        const skillAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'skills',
                message: '💪 Bạn giỏi về gì? (chọn nhiều)',
                choices: [
                    'Viết lách/Content',
                    'Lập trình/IT',
                    'Marketing/Quảng cáo',
                    'Bán hàng',
                    'Thiết kế',
                    'Phân tích/Nghiên cứu',
                    'Quản lý dự án',
                    'Giao tiếp/Thuyết trình',
                    'Tài chính/Kế toán',
                    'Khác (nhập thêm)'
                ]
            }
        ]);

        this.ikigaiData.whatYouAreGoodAt = skillAnswers.skills;

        // Điều thế giới cần
        const needAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'needs',
                message: '🌍 Thế giới đang cần gì? (theo quan sát của bạn)',
                choices: [
                    'Giải pháp môi trường',
                    'Công nghệ đơn giản hóa',
                    'Giáo dục chất lượng',
                    'Chăm sóc sức khỏe',
                    'Kết nối cộng đồng',
                    'Tiết kiệm thời gian',
                    'An toàn thông tin',
                    'Giải trí/Thư giãn',
                    'Tối ưu chi phí',
                    'Khác (nhập thêm)'
                ]
            }
        ]);

        this.ikigaiData.whatTheWorldNeeds = needAnswers.needs;

        // Điều có thể kiếm tiền
        const moneyAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'money',
                message: '💰 Bạn có thể kiếm tiền từ gì?',
                choices: [
                    'Dịch vụ tư vấn',
                    'Bán sản phẩm',
                    'Khóa học online',
                    'Phần mềm/App',
                    'Nội dung/Media',
                    'Dịch vụ freelance',
                    'Subscription/Membership',
                    'Affiliate marketing',
                    'E-commerce',
                    'Khác (nhập thêm)'
                ]
            }
        ]);

        this.ikigaiData.whatYouCanBePaidFor = moneyAnswers.money;
    }

    async analyzeResults() {
        console.log('\n📊 PHÂN TÍCH KẾT QUẢ IKIGAI\n');
        
        // Tìm điểm giao thoa
        const intersections = this.findIntersections();
        
        console.log('🎯 CÁC ĐIỂM GIAO THOA TIỀM NĂNG:');
        intersections.forEach((intersection, index) => {
            console.log(`\n${index + 1}. ${intersection.name}`);
            console.log(`   Mô tả: ${intersection.description}`);
            console.log(`   Tiềm năng: ${intersection.potential}/10`);
        });

        // Gợi ý ý tưởng kinh doanh
        console.log('\n💡 GỢI Ý Ý TƯỞNG KINH DOANH:');
        const businessIdeas = this.generateBusinessIdeas();
        businessIdeas.forEach((idea, index) => {
            console.log(`\n${index + 1}. ${idea.title}`);
            console.log(`   ${idea.description}`);
            console.log(`   Mô hình: ${idea.model}`);
        });
    }

    findIntersections() {
        // Logic đơn giản để tìm giao điểm
        const intersections = [];
        
        if (this.ikigaiData.whatYouLove.includes('Công nghệ/Lập trình') && 
            this.ikigaiData.whatYouAreGoodAt.includes('Lập trình/IT')) {
            intersections.push({
                name: 'Tech Solutions',
                description: 'Phát triển giải pháp công nghệ',
                potential: 9
            });
        }

        if (this.ikigaiData.whatYouLove.includes('Dạy học/Chia sẻ kiến thức') && 
            this.ikigaiData.whatYouCanBePaidFor.includes('Khóa học online')) {
            intersections.push({
                name: 'Education Business',
                description: 'Kinh doanh giáo dục/đào tạo',
                potential: 8
            });
        }

        return intersections;
    }

    generateBusinessIdeas() {
        return [
            {
                title: 'SaaS Platform',
                description: 'Phát triển phần mềm dịch vụ cho doanh nghiệp nhỏ',
                model: 'Subscription monthly'
            },
            {
                title: 'Online Course Platform',
                description: 'Nền tảng khóa học trực tuyến chuyên ngành',
                model: 'Course sales + Membership'
            },
            {
                title: 'Consulting Service',
                description: 'Dịch vụ tư vấn chuyên môn',
                model: 'Hourly rate + Project-based'
            }
        ];
    }

    async saveResults() {
        const results = {
            timestamp: new Date().toISOString(),
            ikigaiData: this.ikigaiData,
            analysis: 'Kết quả phân tích Ikigai'
        };

        await fs.ensureDir('./results');
        await fs.writeJson('./results/ikigai-analysis.json', results, { spaces: 2 });
        
        console.log('\n✅ Kết quả đã được lưu vào ./results/ikigai-analysis.json');
        console.log('\n🚀 Bước tiếp theo: Chạy "npm run lean-canvas" để tạo Lean Canvas');
    }
}

module.exports = IkigaiFinder;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    const finder = new IkigaiFinder();
    finder.start().catch(console.error);
}