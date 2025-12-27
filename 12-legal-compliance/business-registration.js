// Business Registration & Legal Compliance Tool
class BusinessRegistration {
    constructor() {
        this.businessTypes = {
            'sole_proprietorship': 'Doanh nghiệp tư nhân',
            'partnership': 'Công ty hợp danh',
            'limited_company': 'Công ty TNHH',
            'joint_stock': 'Công ty cổ phần',
            'cooperative': 'Hợp tác xã'
        };
        
        this.registrationSteps = [];
        this.requiredDocuments = [];
        this.licenses = [];
        this.taxObligations = [];
    }

    // Tư vấn loại hình doanh nghiệp
    recommendBusinessType(businessInfo) {
        const {
            numberOfOwners,
            capitalAmount,
            businessScope,
            riskLevel,
            growthPlan
        } = businessInfo;

        let recommendations = [];

        // Doanh nghiệp tư nhân
        if (numberOfOwners === 1 && capitalAmount < 500000000) {
            recommendations.push({
                type: 'sole_proprietorship',
                name: this.businessTypes.sole_proprietorship,
                pros: [
                    'Thủ tục đơn giản',
                    'Chi phí thấp',
                    'Quyết định nhanh chóng',
                    'Ít báo cáo'
                ],
                cons: [
                    'Trách nhiệm vô hạn',
                    'Khó huy động vốn',
                    'Phụ thuộc vào cá nhân'
                ],
                suitability: numberOfOwners === 1 && capitalAmount < 100000000 ? 9 : 7
            });
        }

        // Công ty TNHH
        if (numberOfOwners <= 50 && capitalAmount >= 100000000) {
            recommendations.push({
                type: 'limited_company',
                name: this.businessTypes.limited_company,
                pros: [
                    'Trách nhiệm hữu hạn',
                    'Dễ quản lý',
                    'Uy tín cao',
                    'Bảo vệ tài sản cá nhân'
                ],
                cons: [
                    'Thủ tục phức tạp hơn',
                    'Chi phí cao hơn',
                    'Nhiều báo cáo'
                ],
                suitability: 8
            });
        }

        // Công ty cổ phần
        if (growthPlan === 'aggressive' && capitalAmount >= 1000000000) {
            recommendations.push({
                type: 'joint_stock',
                name: this.businessTypes.joint_stock,
                pros: [
                    'Dễ huy động vốn',
                    'Có thể niêm yết',
                    'Tính minh bạch cao',
                    'Khả năng mở rộng lớn'
                ],
                cons: [
                    'Thủ tục phức tạp',
                    'Chi phí cao',
                    'Nhiều quy định',
                    'Công khai thông tin'
                ],
                suitability: 9
            });
        }

        return recommendations.sort((a, b) => b.suitability - a.suitability);
    }

    // Tạo checklist đăng ký kinh doanh
    generateRegistrationChecklist(businessType, location = 'Ho Chi Minh City') {
        const baseSteps = [
            {
                step: 1,
                title: 'Chuẩn bị hồ sơ',
                description: 'Thu thập và chuẩn bị các giấy tờ cần thiết',
                estimatedTime: '2-3 ngày',
                cost: '0 VND',
                documents: this.getRequiredDocuments(businessType)
            },
            {
                step: 2,
                title: 'Đặt tên doanh nghiệp',
                description: 'Kiểm tra và đặt tên doanh nghiệp',
                estimatedTime: '1 ngày',
                cost: '100,000 VND',
                notes: 'Kiểm tra trùng tên trên cổng thông tin quốc gia'
            },
            {
                step: 3,
                title: 'Nộp hồ sơ đăng ký',
                description: 'Nộp hồ sơ tại Sở Kế hoạch và Đầu tư',
                estimatedTime: '1 ngày',
                cost: this.getRegistrationFee(businessType),
                location: this.getRegistrationOffice(location)
            },
            {
                step: 4,
                title: 'Nhận Giấy chứng nhận đăng ký',
                description: 'Nhận GCNĐKDN sau khi được duyệt',
                estimatedTime: '15 ngày làm việc',
                cost: '0 VND'
            },
            {
                step: 5,
                title: 'Khắc dấu',
                description: 'Khắc dấu công ty theo quy định',
                estimatedTime: '1 ngày',
                cost: '200,000 - 500,000 VND'
            },
            {
                step: 6,
                title: 'Mở tài khoản ngân hàng',
                description: 'Mở tài khoản doanh nghiệp',
                estimatedTime: '1-2 ngày',
                cost: 'Phí theo ngân hàng'
            },
            {
                step: 7,
                title: 'Đăng ký thuế',
                description: 'Đăng ký mã số thuế và các loại thuế',
                estimatedTime: '3-5 ngày',
                cost: '0 VND'
            }
        ];

        // Thêm bước đặc biệt cho từng loại hình
        if (businessType === 'joint_stock') {
            baseSteps.splice(4, 0, {
                step: 4.5,
                title: 'Đại hội đồng cổ đông thành lập',
                description: 'Tổ chức ĐHĐCĐ thành lập công ty',
                estimatedTime: '1 ngày',
                cost: '0 VND'
            });
        }

        return baseSteps;
    }

    // Lấy danh sách giấy tờ cần thiết
    getRequiredDocuments(businessType) {
        const commonDocs = [
            'CMND/CCCD của người đại diện pháp luật',
            'Bản sao hộ khẩu',
            'Giấy tờ chứng minh địa chỉ trụ sở'
        ];

        const specificDocs = {
            'sole_proprietorship': [
                'Đơn đăng ký doanh nghiệp tư nhân'
            ],
            'limited_company': [
                'Điều lệ công ty',
                'Danh sách thành viên',
                'Giấy ủy quyền (nếu có)'
            ],
            'joint_stock': [
                'Điều lệ công ty',
                'Danh sách cổ đông sáng lập',
                'Biên bản họp ĐHĐCĐ thành lập',
                'Nghị quyết ĐHĐCĐ'
            ]
        };

        return [...commonDocs, ...(specificDocs[businessType] || [])];
    }

    // Tính phí đăng ký
    getRegistrationFee(businessType) {
        const fees = {
            'sole_proprietorship': '100,000 VND',
            'partnership': '300,000 VND',
            'limited_company': '300,000 VND',
            'joint_stock': '500,000 VND',
            'cooperative': '200,000 VND'
        };

        return fees[businessType] || '300,000 VND';
    }

    // Lấy địa chỉ cơ quan đăng ký
    getRegistrationOffice(location) {
        const offices = {
            'Ho Chi Minh City': 'Sở Kế hoạch và Đầu tư TP.HCM - 59 Lý Tự Trọng, Q.1',
            'Hanoi': 'Sở Kế hoạch và Đầu tư Hà Nội - 2 Lê Phụng Hiểu, Hoàn Kiếm',
            'Da Nang': 'Sở Kế hoạch và Đầu tư Đà Nẵng - 24 Trần Phú, Hải Châu'
        };

        return offices[location] || 'Sở Kế hoạch và Đầu tư địa phương';
    }

    // Kiểm tra giấy phép kinh doanh cần thiết
    checkRequiredLicenses(businessScope) {
        const licenses = [];

        // Giấy phép theo ngành nghề
        const licenseMap = {
            'food_beverage': {
                name: 'Giấy phép vệ sinh an toàn thực phẩm',
                authority: 'Sở Y tế',
                validity: '3 năm',
                cost: '500,000 - 1,000,000 VND'
            },
            'education': {
                name: 'Giấy phép hoạt động giáo dục',
                authority: 'Sở Giáo dục và Đào tạo',
                validity: '5 năm',
                cost: '1,000,000 - 2,000,000 VND'
            },
            'healthcare': {
                name: 'Giấy phép hoạt động khám chữa bệnh',
                authority: 'Sở Y tế',
                validity: '5 năm',
                cost: '2,000,000 - 5,000,000 VND'
            },
            'construction': {
                name: 'Chứng chỉ hành nghề xây dựng',
                authority: 'Sở Xây dựng',
                validity: '5 năm',
                cost: '1,000,000 - 3,000,000 VND'
            },
            'transport': {
                name: 'Giấy phép kinh doanh vận tải',
                authority: 'Sở Giao thông Vận tải',
                validity: '5 năm',
                cost: '500,000 - 2,000,000 VND'
            }
        };

        businessScope.forEach(scope => {
            if (licenseMap[scope]) {
                licenses.push(licenseMap[scope]);
            }
        });

        return licenses;
    }

    // Tạo lịch trình đăng ký
    createRegistrationTimeline(businessType, startDate = new Date()) {
        const checklist = this.generateRegistrationChecklist(businessType);
        const timeline = [];
        let currentDate = new Date(startDate);

        checklist.forEach(step => {
            const duration = this.parseDuration(step.estimatedTime);
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + duration);

            timeline.push({
                step: step.step,
                title: step.title,
                startDate: new Date(currentDate),
                endDate: new Date(endDate),
                duration: step.estimatedTime,
                cost: step.cost,
                status: 'pending'
            });

            currentDate = new Date(endDate);
            currentDate.setDate(currentDate.getDate() + 1); // 1 day buffer
        });

        return timeline;
    }

    // Parse duration string to days
    parseDuration(durationStr) {
        if (durationStr.includes('ngày')) {
            const match = durationStr.match(/(\d+)/);
            return match ? parseInt(match[1]) : 1;
        }
        return 1;
    }

    // Tính tổng chi phí đăng ký
    calculateTotalCost(businessType, businessScope = [], location = 'Ho Chi Minh City') {
        const checklist = this.generateRegistrationChecklist(businessType, location);
        const licenses = this.checkRequiredLicenses(businessScope);

        let totalCost = 0;
        let breakdown = [];

        // Chi phí đăng ký cơ bản
        checklist.forEach(step => {
            if (step.cost && step.cost !== '0 VND' && !step.cost.includes('theo')) {
                const cost = this.parseCost(step.cost);
                totalCost += cost;
                breakdown.push({
                    item: step.title,
                    cost: step.cost,
                    amount: cost
                });
            }
        });

        // Chi phí giấy phép
        licenses.forEach(license => {
            const cost = this.parseCost(license.cost);
            totalCost += cost;
            breakdown.push({
                item: license.name,
                cost: license.cost,
                amount: cost
            });
        });

        return {
            totalCost,
            breakdown,
            currency: 'VND',
            note: 'Chi phí có thể thay đổi theo quy định mới'
        };
    }

    // Parse cost string to number
    parseCost(costStr) {
        if (costStr.includes('-')) {
            const costs = costStr.match(/(\d+(?:,\d+)*)/g);
            if (costs && costs.length >= 2) {
                return parseInt(costs[1].replace(/,/g, ''));
            }
        }
        const match = costStr.match(/(\d+(?:,\d+)*)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    }

    // Kiểm tra nghĩa vụ thuế
    getTaxObligations(businessType, revenue = 0) {
        const obligations = [];

        // Thuế thu nhập doanh nghiệp
        if (businessType !== 'sole_proprietorship') {
            obligations.push({
                type: 'Thuế thu nhập doanh nghiệp',
                rate: '20%',
                frequency: 'Hàng quý',
                deadline: 'Ngày 30 tháng sau quý',
                description: 'Thuế trên lợi nhuận trước thuế'
            });
        } else {
            obligations.push({
                type: 'Thuế thu nhập cá nhân',
                rate: '0.5% - 2%',
                frequency: 'Hàng quý',
                deadline: 'Ngày 20 tháng sau quý',
                description: 'Thuế khoán hoặc theo tỷ lệ % doanh thu'
            });
        }

        // Thuế VAT
        if (revenue > 1000000000) { // > 1 tỷ
            obligations.push({
                type: 'Thuế giá trị gia tăng (VAT)',
                rate: '0%, 5%, 10%',
                frequency: 'Hàng tháng',
                deadline: 'Ngày 20 tháng sau',
                description: 'Thuế VAT theo từng loại hàng hóa, dịch vụ'
            });
        }

        // Bảo hiểm xã hội
        obligations.push({
            type: 'Bảo hiểm xã hội',
            rate: '17.5% lương',
            frequency: 'Hàng tháng',
            deadline: 'Ngày 15 tháng sau',
            description: 'BHXH, BHYT, BHTN cho nhân viên'
        });

        return obligations;
    }

    // Tạo báo cáo tổng quan
    generateComplianceReport(businessInfo) {
        const {
            businessType,
            businessScope,
            location,
            expectedRevenue
        } = businessInfo;

        const recommendations = this.recommendBusinessType(businessInfo);
        const checklist = this.generateRegistrationChecklist(businessType, location);
        const licenses = this.checkRequiredLicenses(businessScope);
        const costs = this.calculateTotalCost(businessType, businessScope, location);
        const timeline = this.createRegistrationTimeline(businessType);
        const taxes = this.getTaxObligations(businessType, expectedRevenue);

        return {
            businessTypeRecommendations: recommendations,
            registrationProcess: {
                steps: checklist.length,
                estimatedDuration: `${timeline.length * 2} - ${timeline.length * 3} ngày`,
                totalCost: costs.totalCost.toLocaleString() + ' VND'
            },
            requiredLicenses: licenses,
            costBreakdown: costs,
            timeline: timeline,
            taxObligations: taxes,
            nextSteps: this.generateNextSteps(businessType),
            warnings: this.generateWarnings(businessInfo)
        };
    }

    // Tạo bước tiếp theo
    generateNextSteps(businessType) {
        return [
            'Chuẩn bị đầy đủ giấy tờ theo danh sách',
            'Kiểm tra tên doanh nghiệp trên cổng thông tin',
            'Chuẩn bị địa chỉ trụ sở hợp lệ',
            'Liên hệ luật sư nếu cần tư vấn chuyên sâu',
            'Chuẩn bị vốn điều lệ theo quy định'
        ];
    }

    // Tạo cảnh báo
    generateWarnings(businessInfo) {
        const warnings = [];

        if (businessInfo.capitalAmount < 100000000) {
            warnings.push({
                type: 'warning',
                message: 'Vốn điều lệ thấp có thể ảnh hưởng đến uy tín doanh nghiệp'
            });
        }

        if (businessInfo.businessScope.includes('food_beverage')) {
            warnings.push({
                type: 'important',
                message: 'Ngành F&B cần nhiều giấy phép đặc biệt và kiểm tra định kỳ'
            });
        }

        if (businessInfo.numberOfOwners > 10) {
            warnings.push({
                type: 'info',
                message: 'Nhiều thành viên cần quy định rõ ràng về quản trị công ty'
            });
        }

        return warnings;
    }
}

module.exports = BusinessRegistration;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    const registration = new BusinessRegistration();
    
    const businessInfo = {
        numberOfOwners: 2,
        capitalAmount: 500000000, // 500M VND
        businessScope: ['technology', 'consulting'],
        riskLevel: 'medium',
        growthPlan: 'moderate',
        location: 'Ho Chi Minh City',
        expectedRevenue: 2000000000 // 2B VND
    };

    console.log('Business Registration Report:');
    const report = registration.generateComplianceReport(businessInfo);
    console.log(JSON.stringify(report, null, 2));
}