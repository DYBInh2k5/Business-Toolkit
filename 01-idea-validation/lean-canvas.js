#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs-extra');

class LeanCanvasGenerator {
    constructor() {
        this.canvas = {
            problem: [],
            customerSegments: [],
            uniqueValueProposition: '',
            solution: [],
            channels: [],
            revenueStreams: [],
            costStructure: [],
            keyMetrics: [],
            unfairAdvantage: ''
        };
    }

    async start() {
        console.log('\n📋 LEAN CANVAS GENERATOR\n');
        console.log('Tạo kế hoạch kinh doanh 1 trang với 9 yếu tố cốt lõi\n');

        await this.fillCanvas();
        await this.generateCanvas();
        await this.saveCanvas();
    }

    async fillCanvas() {
        // 1. Problem
        const problemAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'problem1',
                message: '❗ Vấn đề #1 mà khách hàng gặp phải:'
            },
            {
                type: 'input',
                name: 'problem2',
                message: '❗ Vấn đề #2 (tùy chọn):',
                default: ''
            },
            {
                type: 'input',
                name: 'problem3',
                message: '❗ Vấn đề #3 (tùy chọn):',
                default: ''
            }
        ]);

        this.canvas.problem = [problemAnswers.problem1, problemAnswers.problem2, problemAnswers.problem3]
            .filter(p => p.trim() !== '');

        // 2. Customer Segments
        const customerAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'segments',
                message: '👥 Phân khúc khách hàng mục tiêu:',
                choices: [
                    'Doanh nghiệp nhỏ (SME)',
                    'Startup công nghệ',
                    'Freelancer/Cá nhân',
                    'Doanh nghiệp lớn',
                    'Học sinh/Sinh viên',
                    'Chuyên gia/Quản lý',
                    'Người tiêu dùng cá nhân',
                    'Khác (nhập thêm)'
                ]
            },
            {
                type: 'input',
                name: 'customSegment',
                message: 'Nhập phân khúc khách hàng khác:',
                when: (answers) => answers.segments.includes('Khác (nhập thêm)')
            }
        ]);

        this.canvas.customerSegments = customerAnswers.segments;
        if (customerAnswers.customSegment) {
            this.canvas.customerSegments.push(customerAnswers.customSegment);
        }

        // 3. Unique Value Proposition
        const uvpAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'uvp',
                message: '🎯 Đề xuất giá trị độc nhất (1 câu ngắn gọn):',
                validate: (input) => input.length > 10 || 'Vui lòng nhập ít nhất 10 ký tự'
            }
        ]);

        this.canvas.uniqueValueProposition = uvpAnswer.uvp;

        // 4. Solution
        const solutionAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'solution1',
                message: '💡 Giải pháp #1:'
            },
            {
                type: 'input',
                name: 'solution2',
                message: '💡 Giải pháp #2 (tùy chọn):',
                default: ''
            }
        ]);

        this.canvas.solution = [solutionAnswers.solution1, solutionAnswers.solution2]
            .filter(s => s.trim() !== '');

        // 5. Channels
        const channelAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'channels',
                message: '📢 Kênh tiếp cận khách hàng:',
                choices: [
                    'Website/Landing page',
                    'Social Media (Facebook, Instagram)',
                    'Google Ads/SEO',
                    'Email Marketing',
                    'Referral/Word of mouth',
                    'Partnership',
                    'Direct Sales',
                    'Content Marketing/Blog',
                    'Events/Workshops'
                ]
            }
        ]);

        this.canvas.channels = channelAnswers.channels;

        // 6. Revenue Streams
        const revenueAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'revenue',
                message: '💰 Nguồn doanh thu:',
                choices: [
                    'Bán sản phẩm một lần',
                    'Subscription/Thuê bao',
                    'Freemium model',
                    'Commission/Hoa hồng',
                    'Advertising/Quảng cáo',
                    'Consulting/Tư vấn',
                    'Licensing/Bản quyền',
                    'Transaction fees'
                ]
            }
        ]);

        this.canvas.revenueStreams = revenueAnswers.revenue;

        // 7. Cost Structure
        const costAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'costs',
                message: '💸 Cơ cấu chi phí chính:',
                choices: [
                    'Nhân sự/Lương',
                    'Marketing/Quảng cáo',
                    'Công nghệ/Hosting',
                    'Văn phòng/Thuê mặt bằng',
                    'Nguyên vật liệu',
                    'Legal/Pháp lý',
                    'R&D/Nghiên cứu phát triển',
                    'Customer Support'
                ]
            }
        ]);

        this.canvas.costStructure = costAnswers.costs;

        // 8. Key Metrics
        const metricsAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'metrics',
                message: '📊 Chỉ số quan trọng cần theo dõi:',
                choices: [
                    'Monthly Recurring Revenue (MRR)',
                    'Customer Acquisition Cost (CAC)',
                    'Lifetime Value (LTV)',
                    'Churn Rate',
                    'Daily/Monthly Active Users',
                    'Conversion Rate',
                    'Net Promoter Score (NPS)',
                    'Gross Margin'
                ]
            }
        ]);

        this.canvas.keyMetrics = metricsAnswers.metrics;

        // 9. Unfair Advantage
        const advantageAnswer = await inquirer.prompt([
            {
                type: 'input',
                name: 'advantage',
                message: '🛡️  Lợi thế bất công (khó copy):',
                default: 'Chưa xác định'
            }
        ]);

        this.canvas.unfairAdvantage = advantageAnswer.advantage;
    }

    async generateCanvas() {
        console.log('\n' + '='.repeat(80));
        console.log('📋 LEAN CANVAS - KẾ HOẠCH KINH DOANH 1 TRANG');
        console.log('='.repeat(80));

        console.log('\n🎯 ĐỀ XUẤT GIÁ TRỊ ĐỘC NHẤT');
        console.log(`   ${this.canvas.uniqueValueProposition}`);

        console.log('\n❗ VẤN ĐỀ');
        this.canvas.problem.forEach((p, i) => console.log(`   ${i+1}. ${p}`));

        console.log('\n💡 GIẢI PHÁP');
        this.canvas.solution.forEach((s, i) => console.log(`   ${i+1}. ${s}`));

        console.log('\n👥 PHÂN KHÚC KHÁCH HÀNG');
        this.canvas.customerSegments.forEach((c, i) => console.log(`   • ${c}`));

        console.log('\n📢 KÊNH PHÂN PHỐI');
        this.canvas.channels.forEach((c, i) => console.log(`   • ${c}`));

        console.log('\n💰 NGUỒN DOANH THU');
        this.canvas.revenueStreams.forEach((r, i) => console.log(`   • ${r}`));

        console.log('\n💸 CƠ CẤU CHI PHÍ');
        this.canvas.costStructure.forEach((c, i) => console.log(`   • ${c}`));

        console.log('\n📊 CHỈ SỐ QUAN TRỌNG');
        this.canvas.keyMetrics.forEach((m, i) => console.log(`   • ${m}`));

        console.log('\n🛡️  LỢI THẾ BẤT CÔNG');
        console.log(`   ${this.canvas.unfairAdvantage}`);

        console.log('\n' + '='.repeat(80));
    }

    async saveCanvas() {
        const canvasData = {
            timestamp: new Date().toISOString(),
            canvas: this.canvas,
            htmlVersion: this.generateHTML()
        };

        await fs.ensureDir('./results');
        await fs.writeJson('./results/lean-canvas.json', canvasData, { spaces: 2 });
        
        // Tạo file HTML để in hoặc chia sẻ
        await fs.writeFile('./results/lean-canvas.html', canvasData.htmlVersion);
        
        console.log('\n✅ Lean Canvas đã được lưu:');
        console.log('   📄 JSON: ./results/lean-canvas.json');
        console.log('   🌐 HTML: ./results/lean-canvas.html');
        console.log('\n🚀 Bước tiếp theo: Chạy "npm run landing-page" để tạo landing page');
    }

    generateHTML() {
        return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lean Canvas</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .canvas { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 10px; }
        .box { border: 2px solid #333; padding: 15px; min-height: 150px; }
        .box h3 { margin-top: 0; color: #333; }
        .uvp { grid-column: 3; background: #f0f8ff; }
        .problem { grid-column: 1; }
        .solution { grid-column: 5; }
        .metrics { grid-column: 1; }
        .advantage { grid-column: 5; }
        .customer { grid-column: 3; }
        .channels { grid-column: 4; }
        .revenue { grid-column: 5; }
        .cost { grid-column: 1; grid-column-end: 3; }
    </style>
</head>
<body>
    <h1>🎯 LEAN CANVAS</h1>
    <div class="canvas">
        <div class="box problem">
            <h3>❗ VẤN ĐỀ</h3>
            ${this.canvas.problem.map(p => `<p>• ${p}</p>`).join('')}
        </div>
        <div class="box uvp">
            <h3>🎯 ĐỀ XUẤT GIÁ TRỊ ĐỘC NHẤT</h3>
            <p>${this.canvas.uniqueValueProposition}</p>
        </div>
        <div class="box solution">
            <h3>💡 GIẢI PHÁP</h3>
            ${this.canvas.solution.map(s => `<p>• ${s}</p>`).join('')}
        </div>
        <div class="box metrics">
            <h3>📊 CHỈ SỐ QUAN TRỌNG</h3>
            ${this.canvas.keyMetrics.map(m => `<p>• ${m}</p>`).join('')}
        </div>
        <div class="box customer">
            <h3>👥 KHÁCH HÀNG</h3>
            ${this.canvas.customerSegments.map(c => `<p>• ${c}</p>`).join('')}
        </div>
        <div class="box advantage">
            <h3>🛡️ LỢI THẾ BẤT CÔNG</h3>
            <p>${this.canvas.unfairAdvantage}</p>
        </div>
        <div class="box cost">
            <h3>💸 CƠ CẤU CHI PHÍ</h3>
            ${this.canvas.costStructure.map(c => `<p>• ${c}</p>`).join('')}
        </div>
        <div class="box channels">
            <h3>📢 KÊNH</h3>
            ${this.canvas.channels.map(c => `<p>• ${c}</p>`).join('')}
        </div>
        <div class="box revenue">
            <h3>💰 DOANH THU</h3>
            ${this.canvas.revenueStreams.map(r => `<p>• ${r}</p>`).join('')}
        </div>
    </div>
    <p><small>Tạo bởi Business Toolkit - ${new Date().toLocaleDateString('vi-VN')}</small></p>
</body>
</html>`;
    }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
    const generator = new LeanCanvasGenerator();
    generator.start().catch(console.error);
}

module.exports = LeanCanvasGenerator;