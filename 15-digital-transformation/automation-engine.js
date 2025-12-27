// Automation Engine - Tự động hóa quy trình kinh doanh
class AutomationEngine {
    constructor() {
        this.workflows = [];
        this.triggers = [];
        this.actions = [];
        this.conditions = [];
        this.executionHistory = [];
        this.templates = this.initializeTemplates();
    }

    // Khởi tạo templates workflow phổ biến
    initializeTemplates() {
        return {
            lead_nurturing: {
                name: 'Lead Nurturing Sequence',
                description: 'Tự động nuôi dưỡng leads thành customers',
                triggers: ['new_lead_created', 'lead_score_updated'],
                workflow: [
                    { action: 'send_welcome_email', delay: 0 },
                    { action: 'add_to_crm', delay: 0 },
                    { action: 'send_follow_up_email', delay: 3 * 24 * 60 }, // 3 days
                    { action: 'assign_to_sales', delay: 7 * 24 * 60, condition: 'lead_score > 70' },
                    { action: 'send_nurture_content', delay: 14 * 24 * 60, condition: 'lead_score < 70' }
                ]
            },
            customer_onboarding: {
                name: 'Customer Onboarding',
                description: 'Hướng dẫn khách hàng mới sử dụng sản phẩm',
                triggers: ['new_customer_signup', 'payment_completed'],
                workflow: [
                    { action: 'send_welcome_package', delay: 0 },
                    { action: 'create_onboarding_tasks', delay: 0 },
                    { action: 'schedule_demo_call', delay: 24 * 60 }, // 1 day
                    { action: 'send_tutorial_series', delay: 2 * 24 * 60 }, // 2 days
                    { action: 'check_product_usage', delay: 7 * 24 * 60 }, // 1 week
                    { action: 'send_feedback_survey', delay: 30 * 24 * 60 } // 1 month
                ]
            },
            invoice_management: {
                name: 'Invoice Management',
                description: 'Tự động hóa quy trình hóa đơn',
                triggers: ['order_completed', 'subscription_renewed'],
                workflow: [
                    { action: 'generate_invoice', delay: 0 },
                    { action: 'send_invoice_email', delay: 0 },
                    { action: 'send_payment_reminder', delay: 7 * 24 * 60, condition: 'payment_status = pending' },
                    { action: 'send_overdue_notice', delay: 14 * 24 * 60, condition: 'payment_status = overdue' },
                    { action: 'suspend_service', delay: 30 * 24 * 60, condition: 'payment_status = overdue' }
                ]
            },
            customer_retention: {
                name: 'Customer Retention',
                description: 'Giữ chân khách hàng có nguy cơ churn',
                triggers: ['low_engagement_detected', 'support_ticket_created'],
                workflow: [
                    { action: 'analyze_customer_health', delay: 0 },
                    { action: 'send_check_in_email', delay: 0, condition: 'health_score < 50' },
                    { action: 'offer_discount', delay: 24 * 60, condition: 'churn_risk = high' },
                    { action: 'schedule_success_call', delay: 2 * 24 * 60, condition: 'churn_risk = high' },
                    { action: 'send_win_back_campaign', delay: 7 * 24 * 60, condition: 'no_response' }
                ]
            },
            social_media_automation: {
                name: 'Social Media Automation',
                description: 'Tự động đăng bài và tương tác social media',
                triggers: ['new_blog_post', 'product_launch', 'scheduled_time'],
                workflow: [
                    { action: 'create_social_posts', delay: 0 },
                    { action: 'schedule_posts', delay: 0 },
                    { action: 'monitor_engagement', delay: 60 }, // 1 hour
                    { action: 'respond_to_comments', delay: 2 * 60 }, // 2 hours
                    { action: 'analyze_performance', delay: 24 * 60 } // 1 day
                ]
            }
        };
    }

    // Tạo workflow mới
    createWorkflow(workflowData) {
        const workflow = {
            id: 'WF' + Date.now(),
            name: workflowData.name,
            description: workflowData.description,
            triggers: workflowData.triggers || [],
            steps: workflowData.steps || [],
            conditions: workflowData.conditions || [],
            status: 'active',
            createdAt: new Date(),
            executionCount: 0,
            successRate: 0,
            averageExecutionTime: 0
        };

        this.workflows.push(workflow);
        return workflow;
    }

    // Tạo workflow từ template
    createFromTemplate(templateName, customizations = {}) {
        const template = this.templates[templateName];
        if (!template) {
            throw new Error(`Template ${templateName} không tồn tại`);
        }

        const workflow = {
            id: 'WF' + Date.now(),
            name: customizations.name || template.name,
            description: customizations.description || template.description,
            triggers: customizations.triggers || template.triggers,
            steps: customizations.steps || template.workflow,
            status: 'active',
            createdAt: new Date(),
            executionCount: 0,
            successRate: 0,
            templateUsed: templateName
        };

        this.workflows.push(workflow);
        return workflow;
    }

    // Thêm trigger
    addTrigger(triggerData) {
        const trigger = {
            id: 'TR' + Date.now(),
            name: triggerData.name,
            type: triggerData.type, // event, schedule, condition
            event: triggerData.event,
            conditions: triggerData.conditions || [],
            workflowId: triggerData.workflowId,
            isActive: true,
            createdAt: new Date()
        };

        this.triggers.push(trigger);
        return trigger;
    }

    // Thêm action
    addAction(actionData) {
        const action = {
            id: 'AC' + Date.now(),
            name: actionData.name,
            type: actionData.type, // email, api_call, database_update, notification
            config: actionData.config || {},
            retryCount: actionData.retryCount || 3,
            timeout: actionData.timeout || 30000, // 30 seconds
            createdAt: new Date()
        };

        this.actions.push(action);
        return action;
    }

    // Thực thi workflow
    async executeWorkflow(workflowId, triggerData = {}) {
        const workflow = this.workflows.find(w => w.id === workflowId);
        if (!workflow || workflow.status !== 'active') {
            throw new Error('Workflow không tồn tại hoặc không active');
        }

        const execution = {
            id: 'EX' + Date.now(),
            workflowId,
            triggerData,
            startTime: new Date(),
            status: 'running',
            steps: [],
            errors: []
        };

        try {
            for (let i = 0; i < workflow.steps.length; i++) {
                const step = workflow.steps[i];
                
                // Kiểm tra điều kiện
                if (step.condition && !this.evaluateCondition(step.condition, triggerData)) {
                    execution.steps.push({
                        stepIndex: i,
                        action: step.action,
                        status: 'skipped',
                        reason: 'Condition not met'
                    });
                    continue;
                }

                // Delay nếu cần
                if (step.delay > 0) {
                    await this.delay(step.delay * 60 * 1000); // Convert minutes to milliseconds
                }

                // Thực thi action
                const stepResult = await this.executeAction(step.action, triggerData);
                execution.steps.push({
                    stepIndex: i,
                    action: step.action,
                    status: stepResult.success ? 'completed' : 'failed',
                    result: stepResult,
                    executedAt: new Date()
                });

                if (!stepResult.success && step.required !== false) {
                    throw new Error(`Step ${i} failed: ${stepResult.error}`);
                }
            }

            execution.status = 'completed';
            execution.endTime = new Date();
            execution.duration = execution.endTime - execution.startTime;

            // Cập nhật workflow stats
            workflow.executionCount++;
            workflow.successRate = this.calculateSuccessRate(workflowId);

        } catch (error) {
            execution.status = 'failed';
            execution.endTime = new Date();
            execution.error = error.message;
            execution.errors.push(error.message);
        }

        this.executionHistory.push(execution);
        return execution;
    }

    // Đánh giá điều kiện
    evaluateCondition(condition, data) {
        try {
            // Simple condition evaluation
            // In production, use a proper expression evaluator
            const operators = {
                '>': (a, b) => a > b,
                '<': (a, b) => a < b,
                '>=': (a, b) => a >= b,
                '<=': (a, b) => a <= b,
                '=': (a, b) => a == b,
                '!=': (a, b) => a != b
            };

            // Parse condition like "lead_score > 70"
            const parts = condition.split(/\s*(>|<|>=|<=|=|!=)\s*/);
            if (parts.length !== 3) return false;

            const [field, operator, value] = parts;
            const fieldValue = this.getFieldValue(field, data);
            const compareValue = isNaN(value) ? value : parseFloat(value);

            return operators[operator] ? operators[operator](fieldValue, compareValue) : false;
        } catch (error) {
            console.error('Condition evaluation error:', error);
            return false;
        }
    }

    // Lấy giá trị field từ data
    getFieldValue(field, data) {
        const keys = field.split('.');
        let value = data;
        
        for (const key of keys) {
            value = value && value[key];
        }
        
        return value;
    }

    // Thực thi action
    async executeAction(actionName, data) {
        try {
            switch (actionName) {
                case 'send_welcome_email':
                    return await this.sendEmail('welcome', data);
                
                case 'send_follow_up_email':
                    return await this.sendEmail('follow_up', data);
                
                case 'add_to_crm':
                    return await this.addToCRM(data);
                
                case 'assign_to_sales':
                    return await this.assignToSales(data);
                
                case 'send_nurture_content':
                    return await this.sendNurtureContent(data);
                
                case 'generate_invoice':
                    return await this.generateInvoice(data);
                
                case 'send_payment_reminder':
                    return await this.sendPaymentReminder(data);
                
                case 'analyze_customer_health':
                    return await this.analyzeCustomerHealth(data);
                
                case 'create_social_posts':
                    return await this.createSocialPosts(data);
                
                default:
                    return { success: false, error: `Unknown action: ${actionName}` };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Mock action implementations
    async sendEmail(type, data) {
        // Simulate email sending
        await this.delay(1000);
        return { 
            success: true, 
            result: `Email ${type} sent to ${data.email || 'recipient'}` 
        };
    }

    async addToCRM(data) {
        await this.delay(500);
        return { 
            success: true, 
            result: `Contact added to CRM: ${data.name || data.email}` 
        };
    }

    async assignToSales(data) {
        await this.delay(300);
        return { 
            success: true, 
            result: `Lead assigned to sales team` 
        };
    }

    async sendNurtureContent(data) {
        await this.delay(800);
        return { 
            success: true, 
            result: `Nurture content sent` 
        };
    }

    async generateInvoice(data) {
        await this.delay(1200);
        return { 
            success: true, 
            result: `Invoice generated: INV-${Date.now()}` 
        };
    }

    async sendPaymentReminder(data) {
        await this.delay(600);
        return { 
            success: true, 
            result: `Payment reminder sent` 
        };
    }

    async analyzeCustomerHealth(data) {
        await this.delay(2000);
        const healthScore = Math.floor(Math.random() * 100);
        return { 
            success: true, 
            result: `Customer health analyzed: ${healthScore}/100` 
        };
    }

    async createSocialPosts(data) {
        await this.delay(1500);
        return { 
            success: true, 
            result: `Social posts created for ${data.platform || 'all platforms'}` 
        };
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Tính success rate
    calculateSuccessRate(workflowId) {
        const executions = this.executionHistory.filter(e => e.workflowId === workflowId);
        if (executions.length === 0) return 0;
        
        const successful = executions.filter(e => e.status === 'completed').length;
        return ((successful / executions.length) * 100).toFixed(1);
    }

    // Phân tích hiệu suất workflow
    analyzeWorkflowPerformance(workflowId) {
        const workflow = this.workflows.find(w => w.id === workflowId);
        if (!workflow) return null;

        const executions = this.executionHistory.filter(e => e.workflowId === workflowId);
        
        const analysis = {
            workflowName: workflow.name,
            totalExecutions: executions.length,
            successfulExecutions: executions.filter(e => e.status === 'completed').length,
            failedExecutions: executions.filter(e => e.status === 'failed').length,
            successRate: this.calculateSuccessRate(workflowId) + '%',
            averageExecutionTime: this.calculateAverageExecutionTime(executions),
            commonErrors: this.getCommonErrors(executions),
            recommendations: this.generatePerformanceRecommendations(workflow, executions)
        };

        return analysis;
    }

    // Tính thời gian thực thi trung bình
    calculateAverageExecutionTime(executions) {
        const completedExecutions = executions.filter(e => e.duration);
        if (completedExecutions.length === 0) return 0;

        const totalTime = completedExecutions.reduce((sum, e) => sum + e.duration, 0);
        return Math.round(totalTime / completedExecutions.length);
    }

    // Lấy lỗi phổ biến
    getCommonErrors(executions) {
        const errors = {};
        executions.forEach(execution => {
            execution.errors.forEach(error => {
                errors[error] = (errors[error] || 0) + 1;
            });
        });

        return Object.entries(errors)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([error, count]) => ({ error, count }));
    }

    // Tạo khuyến nghị cải thiện
    generatePerformanceRecommendations(workflow, executions) {
        const recommendations = [];
        const successRate = parseFloat(this.calculateSuccessRate(workflow.id));

        if (successRate < 80) {
            recommendations.push({
                type: 'reliability',
                message: 'Success rate thấp - cần review và tối ưu workflow',
                priority: 'high'
            });
        }

        const avgTime = this.calculateAverageExecutionTime(executions);
        if (avgTime > 300000) { // 5 minutes
            recommendations.push({
                type: 'performance',
                message: 'Thời gian thực thi quá lâu - cần tối ưu các action',
                priority: 'medium'
            });
        }

        const recentFailures = executions
            .filter(e => e.status === 'failed')
            .filter(e => Date.now() - e.startTime < 24 * 60 * 60 * 1000); // Last 24 hours

        if (recentFailures.length > 3) {
            recommendations.push({
                type: 'stability',
                message: 'Nhiều lỗi gần đây - cần kiểm tra hệ thống',
                priority: 'high'
            });
        }

        return recommendations;
    }

    // Tạo báo cáo tổng quan
    generateAutomationReport() {
        const totalWorkflows = this.workflows.length;
        const activeWorkflows = this.workflows.filter(w => w.status === 'active').length;
        const totalExecutions = this.executionHistory.length;
        const successfulExecutions = this.executionHistory.filter(e => e.status === 'completed').length;

        const topPerformingWorkflows = this.workflows
            .map(w => ({
                name: w.name,
                executions: w.executionCount,
                successRate: this.calculateSuccessRate(w.id)
            }))
            .sort((a, b) => parseFloat(b.successRate) - parseFloat(a.successRate))
            .slice(0, 5);

        return {
            summary: {
                totalWorkflows,
                activeWorkflows,
                totalExecutions,
                overallSuccessRate: totalExecutions > 0 ? 
                    ((successfulExecutions / totalExecutions) * 100).toFixed(1) + '%' : '0%',
                automationSavings: this.calculateAutomationSavings()
            },
            topPerformingWorkflows,
            recentActivity: this.getRecentActivity(),
            recommendations: this.generateSystemRecommendations()
        };
    }

    // Tính tiết kiệm từ automation
    calculateAutomationSavings() {
        const totalExecutions = this.executionHistory.length;
        const avgTimePerManualTask = 15; // minutes
        const hourlyRate = 500000; // VND per hour
        
        const timeSaved = totalExecutions * avgTimePerManualTask; // minutes
        const costSaved = (timeSaved / 60) * hourlyRate; // VND

        return {
            timeSavedMinutes: timeSaved,
            timeSavedHours: Math.round(timeSaved / 60),
            costSavedVND: Math.round(costSaved),
            tasksAutomated: totalExecutions
        };
    }

    // Lấy hoạt động gần đây
    getRecentActivity() {
        return this.executionHistory
            .sort((a, b) => b.startTime - a.startTime)
            .slice(0, 10)
            .map(e => ({
                workflowName: this.workflows.find(w => w.id === e.workflowId)?.name || 'Unknown',
                status: e.status,
                startTime: e.startTime,
                duration: e.duration
            }));
    }

    // Tạo khuyến nghị hệ thống
    generateSystemRecommendations() {
        const recommendations = [];

        if (this.workflows.length === 0) {
            recommendations.push({
                type: 'setup',
                message: 'Bắt đầu với các workflow template cơ bản',
                priority: 'high'
            });
        }

        const inactiveWorkflows = this.workflows.filter(w => w.status !== 'active').length;
        if (inactiveWorkflows > 0) {
            recommendations.push({
                type: 'optimization',
                message: `${inactiveWorkflows} workflow không active - cần review`,
                priority: 'medium'
            });
        }

        const oldExecutions = this.executionHistory.filter(
            e => Date.now() - e.startTime > 30 * 24 * 60 * 60 * 1000 // 30 days
        ).length;

        if (oldExecutions > 1000) {
            recommendations.push({
                type: 'maintenance',
                message: 'Cần cleanup execution history cũ',
                priority: 'low'
            });
        }

        return recommendations;
    }
}

// Sử dụng
const automationEngine = new AutomationEngine();

// Demo
console.log('Automation Engine Demo:');

// Tạo workflow từ template
const leadNurturingWorkflow = automationEngine.createFromTemplate('lead_nurturing', {
    name: 'Lead Nurturing cho SaaS'
});

console.log('Created workflow:', leadNurturingWorkflow.name);

// Thực thi workflow (demo)
automationEngine.executeWorkflow(leadNurturingWorkflow.id, {
    email: 'prospect@example.com',
    name: 'John Prospect',
    lead_score: 75,
    source: 'website'
}).then(execution => {
    console.log('Workflow execution:', execution.status);
    console.log('Steps completed:', execution.steps.length);
});

module.exports = AutomationEngine;