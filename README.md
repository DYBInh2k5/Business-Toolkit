# Business Toolkit 🚀

Bộ công cụ toàn diện hỗ trợ phát triển doanh nghiệp từ ý tưởng đến thành công, được xây dựng dựa trên lộ trình 5 giai đoạn kinh doanh.

## 🎯 Tính năng chính

### 1. Giai đoạn Tìm ý tưởng (01-idea-validation)
- **Ikigai Finder**: Tìm ý tưởng kinh doanh phù hợp
- **Lean Canvas**: Tạo kế hoạch kinh doanh 1 trang

### 2. Giai đoạn MVP (02-mvp-builder)  
- **Landing Page Generator**: Tạo trang web bán hàng
- **Product Validator**: Kiểm tra tính khả thi sản phẩm

### 3. Giai đoạn Tăng trưởng (03-growth-tools)
- **CRM Automation**: Quản lý khách hàng tự động
- **Lead Scoring**: Chấm điểm và phân loại khách hàng
- **Email Sequences**: Chuỗi email tự động

### 4. Giai đoạn Phân tích (04-analytics)
- **Business Dashboard**: Theo dõi KPIs quan trọng
- **Growth Analytics**: Phân tích xu hướng tăng trưởng
- **Performance Reports**: Báo cáo hiệu suất chi tiết

### 5. Giai đoạn Tự động hóa (05-automation)
- **Social Media Scheduler**: Lên lịch đăng bài tự động
- **Content Calendar**: Lịch nội dung marketing
- **Performance Tracking**: Theo dõi hiệu suất social media

### 6. Công cụ AI (06-ai-tools)
- **Content Generator**: Tạo nội dung marketing tự động
- **Blog Outline**: Tạo outline bài viết
- **Email Campaigns**: Tạo chiến dịch email
- **Ad Copy**: Tạo nội dung quảng cáo

### 7. Công cụ Tài chính (07-financial-tools)
- **Break-even Analysis**: Phân tích điểm hòa vốn
- **ROI Calculator**: Tính toán lợi nhuận đầu tư
- **Cash Flow Projection**: Dự báo dòng tiền
- **Unit Economics**: Phân tích kinh tế đơn vị

## 🚀 Cài đặt và Sử dụng

```bash
# Clone repository
git clone [repository-url]
cd business-toolkit

# Cài đặt dependencies
npm install

# Chạy demo tất cả công cụ
npm run demo

# Hoặc chạy từng công cụ riêng lẻ
npm run idea-validator
npm run lean-canvas
npm run landing-page
npm run analytics
```

## 💡 Ví dụ sử dụng

### 1. Tìm ý tưởng với Ikigai

```javascript
const BusinessToolkit = require('./index');
const toolkit = new BusinessToolkit();

const ikigaiResult = toolkit.tools.ikigai.findIkigai(
    ['lập trình', 'marketing', 'thiết kế'],
    ['công nghệ', 'giáo dục', 'sức khỏe'],
    ['phần mềm', 'khóa học online', 'app mobile'],
    ['tự động hóa', 'giáo dục số', 'chăm sóc sức khỏe']
);
```

### 2. Quản lý khách hàng với CRM

```javascript
const customer = toolkit.tools.crm.addCustomer({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    company: 'ABC Corp',
    visitedPricing: true,
    requestedDemo: true
});

console.log('Lead Score:', customer.score);
console.log('Priority:', customer.priority);
```

### 3. Tính toán tài chính

```javascript
// Phân tích điểm hòa vốn
const breakEven = toolkit.tools.financial.calculateBreakEven(
    100000, // Chi phí cố định
    50,     // Chi phí biến đổi/sản phẩm
    100     // Giá bán/sản phẩm
);

// Tính ROI
const roi = toolkit.tools.financial.calculateROI(
    200000, // Đầu tư ban đầu
    300000, // Giá trị cuối
    1       // Thời gian (năm)
);
```

### 4. Tạo nội dung với AI

```javascript
const blogOutline = toolkit.tools.contentGen.generateBlogOutline(
    'Marketing Digital',
    'chủ doanh nghiệp nhỏ',
    ['SEO', 'social media', 'content marketing']
);

const emailCampaign = toolkit.tools.contentGen.generateEmailCampaign(
    'App quản lý tài chính',
    'doanh nhân trẻ',
    'sales'
);
```

### 5. Lên lịch Social Media

```javascript
const socialPost = toolkit.tools.socialMedia.generateContent('product_launch', {
    product_name: 'Business App',
    product_description: 'ứng dụng quản lý doanh nghiệp',
    discount: '30',
    website: 'myapp.com'
});

const monthlySchedule = toolkit.tools.socialMedia.generateMonthlySchedule(
    '2024-02-01',
    5 // 5 bài/tuần
);
```

## 📊 Dashboard và Analytics

```javascript
// Thêm dữ liệu doanh thu
toolkit.tools.dashboard.addRevenueData('2024-01-01', 50000, 'website');
toolkit.tools.dashboard.addCustomerData('2024-01-01', 100, 5);

// Tạo báo cáo tổng quan
const summary = toolkit.tools.dashboard.generateExecutiveSummary();
console.log('MRR:', summary.summary.mrr);
console.log('Growth Rate:', summary.trends.revenue);
```

## 🛠️ Cấu trúc Project

```
business-toolkit/
├── 01-idea-validation/     # Công cụ tìm và validate ý tưởng
├── 02-mvp-builder/         # Xây dựng MVP
├── 03-growth-tools/        # Công cụ tăng trưởng
├── 04-analytics/           # Phân tích và báo cáo
├── 05-automation/          # Tự động hóa marketing
├── 06-ai-tools/           # Công cụ AI
├── 07-financial-tools/     # Tính toán tài chính
├── index.js               # Entry point chính
├── package.json           # Dependencies
└── README.md             # Tài liệu này
```

## 🎯 Roadmap

- [ ] Tích hợp API thực tế (Google Analytics, Facebook, etc.)
- [ ] Web interface với React/Vue
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real-time notifications
- [ ] Mobile app companion
- [ ] Advanced AI features
- [ ] Multi-language support

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

---

**Business Toolkit** - Từ ý tưởng đến thành công! 🚀