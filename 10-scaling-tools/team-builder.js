// Team Builder - Công cụ xây dựng và quản lý đội ngũ
class TeamBuilder {
    constructor() {
        this.team = [];
        this.roles = [];
        this.departments = [];
        this.hiringPipeline = [];
        this.performanceMetrics = {};
        this.organizationChart = {};
    }

    // Định nghĩa cấu trúc tổ chức
    defineOrganizationStructure(structure) {
        this.organizationChart = {
            ceo: structure.ceo || 'CEO',
            departments: structure.departments || [],
            reportingLines: structure.reportingLines || {},
            decisionMaking: structure.decisionMaking || 'hierarchical'
        };

        // Tự động tạo roles cần thiết
        this.generateRequiredRoles();
        return this.organizationChart;
    }

    // Tạo roles cần thiết dựa trên cấu trúc
    generateRequiredRoles() {
        const standardRoles = {
            'Engineering': [
                { title: 'CTO', level: 'Executive', skills: ['Leadership', 'Technical Strategy'], priority: 'High' },
                { title: 'Senior Developer', level: 'Senior', skills: ['Programming', 'Architecture'], priority: 'High' },
                { title: 'DevOps Engineer', level: 'Mid', skills: ['AWS', 'Docker', 'CI/CD'], priority: 'Medium' },
                { title: 'QA Engineer', level: 'Mid', skills: ['Testing', 'Automation'], priority: 'Medium' }
            ],
            'Marketing': [
                { title: 'CMO', level: 'Executive', skills: ['Marketing Strategy', 'Brand Management'], priority: 'High' },
                { title: 'Digital Marketing Manager', level: 'Senior', skills: ['SEO', 'SEM', 'Social Media'], priority: 'High' },
                { title: 'Content Creator', level: 'Mid', skills: ['Writing', 'Design', 'Video'], priority: 'Medium' },
                { title: 'Marketing Analyst', level: 'Mid', skills: ['Analytics', 'Data Analysis'], priority: 'Medium' }
            ],
            'Sales': [
                { title: 'VP Sales', level: 'Executive', skills: ['Sales Strategy', 'Team Management'], priority: 'High' },
                { title: 'Account Executive', level: 'Senior', skills: ['B2B Sales', 'Negotiation'], priority: 'High' },
                { title: 'Sales Development Rep', level: 'Junior', skills: ['Lead Generation', 'Cold Calling'], priority: 'Medium' },
                { title: 'Customer Success Manager', level: 'Mid', skills: ['Customer Relations', 'Account Management'], priority: 'High' }
            ],
            'Operations': [
                { title: 'COO', level: 'Executive', skills: ['Operations Management', 'Process Optimization'], priority: 'Medium' },
                { title: 'HR Manager', level: 'Senior', skills: ['Recruitment', 'Employee Relations'], priority: 'Medium' },
                { title: 'Finance Manager', level: 'Senior', skills: ['Financial Planning', 'Accounting'], priority: 'High' },
                { title: 'Office Manager', level: 'Mid', skills: ['Administration', 'Vendor Management'], priority: 'Low' }
            ]
        };

        this.organizationChart.departments.forEach(dept => {
            if (standardRoles[dept]) {
                standardRoles[dept].forEach(role => {
                    this.addRole({
                        ...role,
                        department: dept,
                        status: 'open'
                    });
                });
            }
        });
    }

    // Thêm role mới
    addRole(roleData) {
        const role = {
            id: Date.now(),
            title: roleData.title,
            department: roleData.department,
            level: roleData.level, // Junior, Mid, Senior, Executive
            skills: roleData.skills || [],
            responsibilities: roleData.responsibilities || [],
            salary: this.estimateSalary(roleData.level, roleData.department),
            priority: roleData.priority || 'Medium',
            status: roleData.status || 'open', // open, interviewing, filled
            createdAt: new Date()
        };

        this.roles.push(role);
        return role;
    }

    // Ước tính lương dựa trên level và department
    estimateSalary(level, department) {
        const baseSalaries = {
            'Junior': { base: 40000, multiplier: { 'Engineering': 1.2, 'Marketing': 1.0, 'Sales': 1.1, 'Operations': 0.9 } },
            'Mid': { base: 65000, multiplier: { 'Engineering': 1.3, 'Marketing': 1.0, 'Sales': 1.2, 'Operations': 0.95 } },
            'Senior': { base: 90000, multiplier: { 'Engineering': 1.4, 'Marketing': 1.1, 'Sales': 1.3, 'Operations': 1.0 } },
            'Executive': { base: 150000, multiplier: { 'Engineering': 1.5, 'Marketing': 1.2, 'Sales': 1.4, 'Operations': 1.1 } }
        };

        const levelData = baseSalaries[level] || baseSalaries['Mid'];
        const multiplier = levelData.multiplier[department] || 1.0;
        
        return {
            min: Math.round(levelData.base * multiplier * 0.8),
            max: Math.round(levelData.base * multiplier * 1.2),
            equity: level === 'Executive' ? '0.5-2%' : level === 'Senior' ? '0.1-0.5%' : '0.01-0.1%'
        };
    }

    // Thêm thành viên team
    addTeamMember(memberData) {
        const member = {
            id: Date.now(),
            name: memberData.name,
            email: memberData.email,
            role: memberData.role,
            department: memberData.department,
            level: memberData.level,
            skills: memberData.skills || [],
            startDate: memberData.startDate || new Date(),
            salary: memberData.salary,
            performance: {
                rating: 0,
                goals: [],
                achievements: [],
                feedback: []
            },
            status: 'active' // active, on_leave, terminated
        };

        this.team.push(member);
        
        // Cập nhật role status
        const role = this.roles.find(r => r.title === memberData.role && r.department === memberData.department);
        if (role) {
            role.status = 'filled';
            role.filledBy = member.id;
        }

        return member;
    }

    // Tính toán chi phí nhân sự
    calculateTeamCosts() {
        const costs = {
            monthly: 0,
            annual: 0,
            byDepartment: {},
            byLevel: {},
            benefits: 0,
            total: 0
        };

        this.team.forEach(member => {
            const monthlySalary = (member.salary.min + member.salary.max) / 2 / 12;
            costs.monthly += monthlySalary;
            costs.annual += monthlySalary * 12;

            // By department
            if (!costs.byDepartment[member.department]) {
                costs.byDepartment[member.department] = 0;
            }
            costs.byDepartment[member.department] += monthlySalary * 12;

            // By level
            if (!costs.byLevel[member.level]) {
                costs.byLevel[member.level] = 0;
            }
            costs.byLevel[member.level] += monthlySalary * 12;
        });

        // Estimate benefits (30% of salary)
        costs.benefits = costs.annual * 0.3;
        costs.total = costs.annual + costs.benefits;

        return costs;
    }

    // Phân tích khoảng trống kỹ năng
    analyzeSkillGaps() {
        const requiredSkills = {};
        const currentSkills = {};
        const gaps = [];

        // Collect required skills from roles
        this.roles.forEach(role => {
            role.skills.forEach(skill => {
                requiredSkills[skill] = (requiredSkills[skill] || 0) + 1;
            });
        });

        // Collect current skills from team
        this.team.forEach(member => {
            member.skills.forEach(skill => {
                currentSkills[skill] = (currentSkills[skill] || 0) + 1;
            });
        });

        // Identify gaps
        Object.keys(requiredSkills).forEach(skill => {
            const required = requiredSkills[skill];
            const current = currentSkills[skill] || 0;
            
            if (current < required) {
                gaps.push({
                    skill,
                    required,
                    current,
                    gap: required - current,
                    priority: this.calculateSkillPriority(skill)
                });
            }
        });

        return gaps.sort((a, b) => b.gap - a.gap);
    }

    // Tính độ ưu tiên của kỹ năng
    calculateSkillPriority(skill) {
        const highPrioritySkills = [
            'Leadership', 'Programming', 'Sales', 'Marketing Strategy',
            'Financial Planning', 'Customer Relations'
        ];

        const mediumPrioritySkills = [
            'Design', 'Analytics', 'Project Management', 'Communication'
        ];

        if (highPrioritySkills.includes(skill)) return 'High';
        if (mediumPrioritySkills.includes(skill)) return 'Medium';
        return 'Low';
    }

    // Tạo kế hoạch tuyển dụng
    createHiringPlan(timeframe = 12) { // months
        const plan = {
            timeframe,
            phases: [],
            totalCost: 0,
            priorityHires: [],
            timeline: {}
        };

        // Sắp xếp roles theo độ ưu tiên
        const openRoles = this.roles.filter(r => r.status === 'open');
        const prioritizedRoles = openRoles.sort((a, b) => {
            const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return priorityScore[b.priority] - priorityScore[a.priority];
        });

        // Chia thành các phases
        const rolesPerPhase = Math.ceil(prioritizedRoles.length / 4);
        for (let i = 0; i < 4; i++) {
            const phaseRoles = prioritizedRoles.slice(i * rolesPerPhase, (i + 1) * rolesPerPhase);
            if (phaseRoles.length > 0) {
                plan.phases.push({
                    phase: i + 1,
                    month: (i * 3) + 1,
                    roles: phaseRoles,
                    estimatedCost: this.calculatePhaseCost(phaseRoles),
                    duration: '2-3 months'
                });
            }
        }

        // Tính tổng chi phí
        plan.totalCost = plan.phases.reduce((sum, phase) => sum + phase.estimatedCost, 0);

        // Priority hires (first 3 months)
        plan.priorityHires = prioritizedRoles.slice(0, 3);

        return plan;
    }

    // Tính chi phí tuyển dụng cho phase
    calculatePhaseCost(roles) {
        return roles.reduce((sum, role) => {
            const avgSalary = (role.salary.min + role.salary.max) / 2;
            const recruitmentCost = avgSalary * 0.2; // 20% of annual salary
            return sum + recruitmentCost;
        }, 0);
    }

    // Đánh giá hiệu suất team
    evaluateTeamPerformance() {
        const evaluation = {
            teamSize: this.team.length,
            averageRating: 0,
            departmentPerformance: {},
            topPerformers: [],
            improvementNeeded: [],
            recommendations: []
        };

        let totalRating = 0;
        let ratedMembers = 0;

        this.team.forEach(member => {
            if (member.performance.rating > 0) {
                totalRating += member.performance.rating;
                ratedMembers++;

                // Department performance
                if (!evaluation.departmentPerformance[member.department]) {
                    evaluation.departmentPerformance[member.department] = {
                        members: 0,
                        totalRating: 0,
                        average: 0
                    };
                }
                evaluation.departmentPerformance[member.department].members++;
                evaluation.departmentPerformance[member.department].totalRating += member.performance.rating;

                // Top performers (rating >= 4)
                if (member.performance.rating >= 4) {
                    evaluation.topPerformers.push({
                        name: member.name,
                        role: member.role,
                        rating: member.performance.rating
                    });
                }

                // Improvement needed (rating < 3)
                if (member.performance.rating < 3) {
                    evaluation.improvementNeeded.push({
                        name: member.name,
                        role: member.role,
                        rating: member.performance.rating
                    });
                }
            }
        });

        evaluation.averageRating = ratedMembers > 0 ? (totalRating / ratedMembers).toFixed(1) : 0;

        // Calculate department averages
        Object.keys(evaluation.departmentPerformance).forEach(dept => {
            const deptData = evaluation.departmentPerformance[dept];
            deptData.average = (deptData.totalRating / deptData.members).toFixed(1);
        });

        // Generate recommendations
        evaluation.recommendations = this.generatePerformanceRecommendations(evaluation);

        return evaluation;
    }

    // Tạo khuyến nghị về hiệu suất
    generatePerformanceRecommendations(evaluation) {
        const recommendations = [];

        if (evaluation.averageRating < 3.5) {
            recommendations.push({
                category: 'Performance Improvement',
                recommendation: 'Cần cải thiện hiệu suất tổng thể của team',
                priority: 'High'
            });
        }

        if (evaluation.improvementNeeded.length > evaluation.teamSize * 0.2) {
            recommendations.push({
                category: 'Training',
                recommendation: 'Tổ chức training cho nhân viên có hiệu suất thấp',
                priority: 'High'
            });
        }

        if (evaluation.topPerformers.length > 0) {
            recommendations.push({
                category: 'Retention',
                recommendation: `Tạo chương trình retention cho ${evaluation.topPerformers.length} top performers`,
                priority: 'Medium'
            });
        }

        return recommendations;
    }

    // Tạo báo cáo team
    generateTeamReport() {
        const costs = this.calculateTeamCosts();
        const skillGaps = this.analyzeSkillGaps();
        const hiringPlan = this.createHiringPlan();
        const performance = this.evaluateTeamPerformance();

        return {
            summary: {
                totalMembers: this.team.length,
                openRoles: this.roles.filter(r => r.status === 'open').length,
                departments: Object.keys(costs.byDepartment).length,
                monthlyCost: costs.monthly,
                annualCost: costs.total
            },
            teamComposition: {
                byDepartment: this.getTeamByDepartment(),
                byLevel: this.getTeamByLevel(),
                skillDistribution: this.getSkillDistribution()
            },
            costs,
            skillGaps: skillGaps.slice(0, 5),
            hiringPlan,
            performance,
            recommendations: this.generateTeamRecommendations(costs, skillGaps, performance)
        };
    }

    // Phân bố team theo department
    getTeamByDepartment() {
        const distribution = {};
        this.team.forEach(member => {
            distribution[member.department] = (distribution[member.department] || 0) + 1;
        });
        return distribution;
    }

    // Phân bố team theo level
    getTeamByLevel() {
        const distribution = {};
        this.team.forEach(member => {
            distribution[member.level] = (distribution[member.level] || 0) + 1;
        });
        return distribution;
    }

    // Phân bố kỹ năng
    getSkillDistribution() {
        const distribution = {};
        this.team.forEach(member => {
            member.skills.forEach(skill => {
                distribution[skill] = (distribution[skill] || 0) + 1;
            });
        });
        return distribution;
    }

    // Tạo khuyến nghị tổng thể
    generateTeamRecommendations(costs, skillGaps, performance) {
        const recommendations = [];

        // Cost optimization
        if (costs.total > 2000000) { // > 2M annually
            recommendations.push({
                category: 'Cost Optimization',
                recommendation: 'Chi phí nhân sự cao - cân nhắc remote work hoặc outsourcing',
                priority: 'Medium'
            });
        }

        // Skill gaps
        if (skillGaps.length > 0) {
            recommendations.push({
                category: 'Skill Development',
                recommendation: `Ưu tiên tuyển dụng hoặc training cho ${skillGaps[0].skill}`,
                priority: 'High'
            });
        }

        // Team size
        if (this.team.length < 5) {
            recommendations.push({
                category: 'Team Growth',
                recommendation: 'Team còn nhỏ - cần tuyển dụng thêm để scale',
                priority: 'High'
            });
        }

        return recommendations;
    }
}


module.exports = TeamBuilder;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    // Sử dụng
    const teamBuilder = new TeamBuilder();
    
    // Định nghĩa cấu trúc tổ chức
    teamBuilder.defineOrganizationStructure({
        ceo: 'CEO',
        departments: ['Engineering', 'Marketing', 'Sales'],
        decisionMaking: 'collaborative'
    });
    
    // Thêm thành viên team
    teamBuilder.addTeamMember({
        name: 'John Doe',
        email: 'john@company.com',
        role: 'CTO',
        department: 'Engineering',
        level: 'Executive',
        skills: ['Leadership', 'Technical Strategy', 'Programming'],
        salary: { min: 180000, max: 220000 }
    });
    
    teamBuilder.addTeamMember({
        name: 'Jane Smith',
        email: 'jane@company.com',
        role: 'Senior Developer',
        department: 'Engineering',
        level: 'Senior',
        skills: ['Programming', 'Architecture', 'React'],
        salary: { min: 120000, max: 140000 }
    });
    
    // Demo
    console.log('Team Report:');
    const report = teamBuilder.generateTeamReport();
    console.log(JSON.stringify(report, null, 2));
    
}