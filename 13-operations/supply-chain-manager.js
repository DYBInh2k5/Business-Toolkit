// Supply Chain Manager - Quản lý chuỗi cung ứng
class SupplyChainManager {
    constructor() {
        this.suppliers = [];
        this.products = [];
        this.inventory = [];
        this.orders = [];
        this.logistics = [];
        this.qualityStandards = {};
    }

    // Thêm nhà cung cấp
    addSupplier(supplierData) {
        const supplier = {
            id: Date.now(),
            name: supplierData.name,
            category: supplierData.category,
            location: supplierData.location,
            contactInfo: supplierData.contactInfo,
            products: supplierData.products || [],
            rating: 0,
            performance: {
                onTimeDelivery: 0,
                qualityScore: 0,
                priceCompetitiveness: 0,
                reliability: 0
            },
            contracts: [],
            certifications: supplierData.certifications || [],
            paymentTerms: supplierData.paymentTerms || 'Net 30',
            minimumOrder: supplierData.minimumOrder || 0,
            leadTime: supplierData.leadTime || 7,
            status: 'active',
            createdAt: new Date()
        };

        this.suppliers.push(supplier);
        return supplier;
    }

    // Đánh giá nhà cung cấp
    evaluateSupplier(supplierId, evaluation) {
        const supplier = this.suppliers.find(s => s.id === supplierId);
        if (!supplier) return null;

        const {
            onTimeDelivery,
            qualityScore,
            priceCompetitiveness,
            reliability,
            communication,
            flexibility
        } = evaluation;

        // Cập nhật performance metrics
        supplier.performance = {
            onTimeDelivery: onTimeDelivery || supplier.performance.onTimeDelivery,
            qualityScore: qualityScore || supplier.performance.qualityScore,
            priceCompetitiveness: priceCompetitiveness || supplier.performance.priceCompetitiveness,
            reliability: reliability || supplier.performance.reliability,
            communication: communication || 0,
            flexibility: flexibility || 0
        };

        // Tính overall rating
        const metrics = Object.values(supplier.performance);
        supplier.rating = (metrics.reduce((sum, score) => sum + score, 0) / metrics.length).toFixed(1);

        // Phân loại supplier
        supplier.tier = this.classifySupplier(supplier.rating);

        return supplier;
    }

    // Phân loại nhà cung cấp
    classifySupplier(rating) {
        if (rating >= 8.5) return 'Strategic Partner';
        if (rating >= 7.0) return 'Preferred Supplier';
        if (rating >= 5.5) return 'Approved Supplier';
        return 'Under Review';
    }

    // Quản lý kho hàng
    addInventoryItem(itemData) {
        const item = {
            id: Date.now(),
            productId: itemData.productId,
            name: itemData.name,
            sku: itemData.sku,
            category: itemData.category,
            currentStock: itemData.currentStock || 0,
            minimumStock: itemData.minimumStock || 10,
            maximumStock: itemData.maximumStock || 1000,
            reorderPoint: itemData.reorderPoint || 20,
            unitCost: itemData.unitCost || 0,
            location: itemData.location || 'Main Warehouse',
            supplier: itemData.supplier,
            lastUpdated: new Date(),
            movements: []
        };

        this.inventory.push(item);
        return item;
    }

    // Cập nhật tồn kho
    updateInventory(itemId, quantity, type = 'adjustment', reason = '') {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return null;

        const movement = {
            date: new Date(),
            type, // 'in', 'out', 'adjustment'
            quantity,
            previousStock: item.currentStock,
            reason,
            user: 'system'
        };

        if (type === 'in') {
            item.currentStock += quantity;
        } else if (type === 'out') {
            item.currentStock -= quantity;
        } else if (type === 'adjustment') {
            item.currentStock = quantity;
        }

        item.movements.push(movement);
        item.lastUpdated = new Date();

        // Kiểm tra cảnh báo tồn kho
        this.checkStockAlerts(item);

        return item;
    }

    // Kiểm tra cảnh báo tồn kho
    checkStockAlerts(item) {
        const alerts = [];

        if (item.currentStock <= item.minimumStock) {
            alerts.push({
                type: 'low_stock',
                severity: 'high',
                message: `${item.name} sắp hết hàng (${item.currentStock} units)`,
                action: 'Cần đặt hàng ngay'
            });
        }

        if (item.currentStock <= item.reorderPoint) {
            alerts.push({
                type: 'reorder_point',
                severity: 'medium',
                message: `${item.name} đã đến điểm đặt hàng lại`,
                action: 'Tạo purchase order'
            });
        }

        if (item.currentStock >= item.maximumStock) {
            alerts.push({
                type: 'overstock',
                severity: 'low',
                message: `${item.name} tồn kho quá nhiều`,
                action: 'Xem xét giảm đặt hàng'
            });
        }

        return alerts;
    }

    // Tạo đơn đặt hàng
    createPurchaseOrder(orderData) {
        const order = {
            id: 'PO' + Date.now(),
            supplierId: orderData.supplierId,
            items: orderData.items,
            totalAmount: this.calculateOrderTotal(orderData.items),
            currency: orderData.currency || 'VND',
            paymentTerms: orderData.paymentTerms || 'Net 30',
            deliveryDate: orderData.deliveryDate,
            deliveryAddress: orderData.deliveryAddress,
            status: 'pending',
            createdAt: new Date(),
            createdBy: orderData.createdBy || 'system',
            notes: orderData.notes || ''
        };

        this.orders.push(order);
        return order;
    }

    // Tính tổng giá trị đơn hàng
    calculateOrderTotal(items) {
        return items.reduce((total, item) => {
            return total + (item.quantity * item.unitPrice);
        }, 0);
    }

    // Theo dõi giao hàng
    trackDelivery(orderId, trackingInfo) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return null;

        if (!order.tracking) {
            order.tracking = [];
        }

        order.tracking.push({
            timestamp: new Date(),
            status: trackingInfo.status,
            location: trackingInfo.location,
            notes: trackingInfo.notes,
            estimatedDelivery: trackingInfo.estimatedDelivery
        });

        // Cập nhật trạng thái đơn hàng
        if (trackingInfo.status === 'delivered') {
            order.status = 'completed';
            order.deliveredAt = new Date();
            
            // Cập nhật inventory khi nhận hàng
            this.receiveOrder(orderId);
        }

        return order;
    }

    // Nhận hàng và cập nhật kho
    receiveOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return null;

        order.items.forEach(orderItem => {
            const inventoryItem = this.inventory.find(i => i.sku === orderItem.sku);
            if (inventoryItem) {
                this.updateInventory(
                    inventoryItem.id,
                    orderItem.quantity,
                    'in',
                    `Received from PO ${orderId}`
                );
            }
        });

        return order;
    }

    // Phân tích hiệu suất chuỗi cung ứng
    analyzeSupplyChainPerformance() {
        const analysis = {
            supplierPerformance: this.analyzeSupplierPerformance(),
            inventoryHealth: this.analyzeInventoryHealth(),
            orderFulfillment: this.analyzeOrderFulfillment(),
            costAnalysis: this.analyzeCosts(),
            riskAssessment: this.assessSupplyChainRisks()
        };

        return analysis;
    }

    // Phân tích hiệu suất nhà cung cấp
    analyzeSupplierPerformance() {
        const totalSuppliers = this.suppliers.length;
        const activeSuppliers = this.suppliers.filter(s => s.status === 'active').length;
        const avgRating = this.suppliers.reduce((sum, s) => sum + parseFloat(s.rating || 0), 0) / totalSuppliers;

        const tierDistribution = {};
        this.suppliers.forEach(supplier => {
            const tier = supplier.tier || 'Unrated';
            tierDistribution[tier] = (tierDistribution[tier] || 0) + 1;
        });

        return {
            totalSuppliers,
            activeSuppliers,
            averageRating: avgRating.toFixed(1),
            tierDistribution,
            topPerformers: this.suppliers
                .filter(s => s.rating >= 8.0)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5)
                .map(s => ({ name: s.name, rating: s.rating, tier: s.tier }))
        };
    }

    // Phân tích tình trạng kho hàng
    analyzeInventoryHealth() {
        const totalItems = this.inventory.length;
        const lowStockItems = this.inventory.filter(i => i.currentStock <= i.minimumStock).length;
        const overstockItems = this.inventory.filter(i => i.currentStock >= i.maximumStock).length;
        
        const totalValue = this.inventory.reduce((sum, item) => {
            return sum + (item.currentStock * item.unitCost);
        }, 0);

        const turnoverRate = this.calculateInventoryTurnover();

        return {
            totalItems,
            lowStockItems,
            overstockItems,
            stockHealthScore: ((totalItems - lowStockItems - overstockItems) / totalItems * 100).toFixed(1) + '%',
            totalInventoryValue: totalValue,
            averageTurnoverRate: turnoverRate,
            alerts: this.getAllStockAlerts()
        };
    }

    // Tính tỷ lệ quay vòng hàng tồn kho
    calculateInventoryTurnover() {
        // Simplified calculation - would need historical data for accurate calculation
        const avgInventoryValue = this.inventory.reduce((sum, item) => {
            return sum + (item.currentStock * item.unitCost);
        }, 0) / this.inventory.length;

        return avgInventoryValue > 0 ? (12).toFixed(1) : 0; // Assuming monthly turnover
    }

    // Lấy tất cả cảnh báo tồn kho
    getAllStockAlerts() {
        const allAlerts = [];
        this.inventory.forEach(item => {
            const alerts = this.checkStockAlerts(item);
            allAlerts.push(...alerts);
        });
        return allAlerts;
    }

    // Phân tích thực hiện đơn hàng
    analyzeOrderFulfillment() {
        const totalOrders = this.orders.length;
        const completedOrders = this.orders.filter(o => o.status === 'completed').length;
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        
        const onTimeDeliveries = this.orders.filter(order => {
            if (order.deliveredAt && order.deliveryDate) {
                return new Date(order.deliveredAt) <= new Date(order.deliveryDate);
            }
            return false;
        }).length;

        const fulfillmentRate = totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0;
        const onTimeRate = completedOrders > 0 ? (onTimeDeliveries / completedOrders * 100).toFixed(1) : 0;

        return {
            totalOrders,
            completedOrders,
            pendingOrders,
            fulfillmentRate: fulfillmentRate + '%',
            onTimeDeliveryRate: onTimeRate + '%',
            averageLeadTime: this.calculateAverageLeadTime()
        };
    }

    // Tính thời gian giao hàng trung bình
    calculateAverageLeadTime() {
        const completedOrders = this.orders.filter(o => o.status === 'completed' && o.deliveredAt);
        
        if (completedOrders.length === 0) return 0;

        const totalLeadTime = completedOrders.reduce((sum, order) => {
            const leadTime = Math.ceil((new Date(order.deliveredAt) - new Date(order.createdAt)) / (1000 * 60 * 60 * 24));
            return sum + leadTime;
        }, 0);

        return (totalLeadTime / completedOrders.length).toFixed(1) + ' days';
    }

    // Phân tích chi phí
    analyzeCosts() {
        const totalPurchaseValue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = this.orders.length > 0 ? totalPurchaseValue / this.orders.length : 0;
        
        const costBySupplier = {};
        this.orders.forEach(order => {
            const supplier = this.suppliers.find(s => s.id === order.supplierId);
            const supplierName = supplier ? supplier.name : 'Unknown';
            costBySupplier[supplierName] = (costBySupplier[supplierName] || 0) + order.totalAmount;
        });

        return {
            totalPurchaseValue,
            averageOrderValue,
            costBySupplier,
            inventoryCarryingCost: this.calculateCarryingCost()
        };
    }

    // Tính chi phí lưu kho
    calculateCarryingCost() {
        const totalInventoryValue = this.inventory.reduce((sum, item) => {
            return sum + (item.currentStock * item.unitCost);
        }, 0);

        // Assume 25% annual carrying cost
        const annualCarryingCost = totalInventoryValue * 0.25;
        return {
            annual: annualCarryingCost,
            monthly: annualCarryingCost / 12,
            percentage: '25%'
        };
    }

    // Đánh giá rủi ro chuỗi cung ứng
    assessSupplyChainRisks() {
        const risks = [];

        // Single supplier dependency
        const supplierDependency = this.analyzeSingleSupplierDependency();
        if (supplierDependency.highRiskItems > 0) {
            risks.push({
                type: 'Supplier Dependency',
                severity: 'High',
                description: `${supplierDependency.highRiskItems} sản phẩm phụ thuộc vào 1 nhà cung cấp`,
                mitigation: 'Tìm nhà cung cấp thay thế'
            });
        }

        // Geographic concentration
        const geoRisk = this.analyzeGeographicRisk();
        if (geoRisk.concentration > 70) {
            risks.push({
                type: 'Geographic Concentration',
                severity: 'Medium',
                description: `${geoRisk.concentration}% nhà cung cấp tập trung tại 1 khu vực`,
                mitigation: 'Đa dạng hóa địa lý nhà cung cấp'
            });
        }

        // Quality risks
        const qualityRisk = this.suppliers.filter(s => s.rating < 6.0).length;
        if (qualityRisk > 0) {
            risks.push({
                type: 'Quality Risk',
                severity: 'Medium',
                description: `${qualityRisk} nhà cung cấp có rating thấp`,
                mitigation: 'Cải thiện hoặc thay thế nhà cung cấp'
            });
        }

        return {
            totalRisks: risks.length,
            riskLevel: this.calculateOverallRiskLevel(risks),
            risks,
            recommendations: this.generateRiskMitigationPlan(risks)
        };
    }

    // Phân tích phụ thuộc nhà cung cấp đơn lẻ
    analyzeSingleSupplierDependency() {
        const productSupplierMap = {};
        
        this.inventory.forEach(item => {
            if (item.supplier) {
                if (!productSupplierMap[item.productId]) {
                    productSupplierMap[item.productId] = [];
                }
                if (!productSupplierMap[item.productId].includes(item.supplier)) {
                    productSupplierMap[item.productId].push(item.supplier);
                }
            }
        });

        const singleSupplierProducts = Object.keys(productSupplierMap).filter(
            productId => productSupplierMap[productId].length === 1
        );

        return {
            totalProducts: Object.keys(productSupplierMap).length,
            singleSupplierProducts: singleSupplierProducts.length,
            highRiskItems: singleSupplierProducts.length
        };
    }

    // Phân tích rủi ro địa lý
    analyzeGeographicRisk() {
        const locationCount = {};
        this.suppliers.forEach(supplier => {
            const location = supplier.location || 'Unknown';
            locationCount[location] = (locationCount[location] || 0) + 1;
        });

        const maxConcentration = Math.max(...Object.values(locationCount));
        const concentration = (maxConcentration / this.suppliers.length * 100).toFixed(1);

        return {
            concentration: parseFloat(concentration),
            locations: locationCount
        };
    }

    // Tính mức độ rủi ro tổng thể
    calculateOverallRiskLevel(risks) {
        const highRisks = risks.filter(r => r.severity === 'High').length;
        const mediumRisks = risks.filter(r => r.severity === 'Medium').length;

        if (highRisks > 0) return 'High';
        if (mediumRisks > 2) return 'Medium';
        return 'Low';
    }

    // Tạo kế hoạch giảm thiểu rủi ro
    generateRiskMitigationPlan(risks) {
        const plan = [];

        risks.forEach(risk => {
            plan.push({
                risk: risk.type,
                action: risk.mitigation,
                priority: risk.severity,
                timeline: risk.severity === 'High' ? '1-2 months' : '3-6 months'
            });
        });

        return plan;
    }

    // Tạo báo cáo tổng quan
    generateSupplyChainReport() {
        const performance = this.analyzeSupplyChainPerformance();
        
        return {
            summary: {
                totalSuppliers: this.suppliers.length,
                totalInventoryItems: this.inventory.length,
                totalOrders: this.orders.length,
                overallHealth: this.calculateOverallHealth(performance)
            },
            performance,
            recommendations: this.generateRecommendations(performance),
            actionItems: this.generateActionItems(performance)
        };
    }

    // Tính sức khỏe tổng thể của chuỗi cung ứng
    calculateOverallHealth(performance) {
        let score = 0;
        let factors = 0;

        // Supplier performance
        if (performance.supplierPerformance.averageRating >= 7) score += 25;
        else if (performance.supplierPerformance.averageRating >= 5) score += 15;
        factors += 25;

        // Inventory health
        const stockHealth = parseFloat(performance.inventoryHealth.stockHealthScore);
        score += (stockHealth / 100) * 25;
        factors += 25;

        // Order fulfillment
        const fulfillmentRate = parseFloat(performance.orderFulfillment.fulfillmentRate);
        score += (fulfillmentRate / 100) * 25;
        factors += 25;

        // Risk level
        if (performance.riskAssessment.riskLevel === 'Low') score += 25;
        else if (performance.riskAssessment.riskLevel === 'Medium') score += 15;
        factors += 25;

        const healthScore = (score / factors) * 100;
        
        if (healthScore >= 80) return 'Excellent';
        if (healthScore >= 60) return 'Good';
        if (healthScore >= 40) return 'Fair';
        return 'Poor';
    }

    // Tạo khuyến nghị
    generateRecommendations(performance) {
        const recommendations = [];

        if (performance.supplierPerformance.averageRating < 7) {
            recommendations.push({
                category: 'Supplier Management',
                recommendation: 'Cải thiện chất lượng nhà cung cấp thông qua đào tạo và đánh giá',
                priority: 'High'
            });
        }

        if (performance.inventoryHealth.lowStockItems > 0) {
            recommendations.push({
                category: 'Inventory Management',
                recommendation: 'Thiết lập hệ thống cảnh báo tự động và tối ưu hóa điểm đặt hàng',
                priority: 'Medium'
            });
        }

        if (performance.riskAssessment.riskLevel === 'High') {
            recommendations.push({
                category: 'Risk Management',
                recommendation: 'Thực hiện kế hoạch giảm thiểu rủi ro ngay lập tức',
                priority: 'High'
            });
        }

        return recommendations;
    }

    // Tạo danh sách hành động
    generateActionItems(performance) {
        const actions = [];

        // Low stock alerts
        if (performance.inventoryHealth.lowStockItems > 0) {
            actions.push({
                action: `Đặt hàng cho ${performance.inventoryHealth.lowStockItems} sản phẩm sắp hết`,
                deadline: '3 days',
                responsible: 'Procurement Team'
            });
        }

        // Supplier evaluation
        const unratedSuppliers = this.suppliers.filter(s => !s.rating || s.rating === 0).length;
        if (unratedSuppliers > 0) {
            actions.push({
                action: `Đánh giá ${unratedSuppliers} nhà cung cấp chưa có rating`,
                deadline: '1 week',
                responsible: 'Supply Chain Manager'
            });
        }

        return actions;
    }
}

module.exports = SupplyChainManager;

// Demo code - only runs when file is executed directly
if (require.main === module) {
    const scm = new SupplyChainManager();
    
    const supplier = scm.addSupplier({
        name: 'ABC Materials Co.',
        category: 'Raw Materials',
        location: 'Ho Chi Minh City',
        contactInfo: { email: 'contact@abc.com', phone: '0901234567' },
        products: ['Steel', 'Aluminum'],
        certifications: ['ISO 9001', 'ISO 14001'],
        paymentTerms: 'Net 30',
        leadTime: 14
    });

    scm.evaluateSupplier(supplier.id, {
        onTimeDelivery: 8.5,
        qualityScore: 9.0,
        priceCompetitiveness: 7.5,
        reliability: 8.0
    });

    console.log('Supply Chain Report:');
    const report = scm.generateSupplyChainReport();
    console.log(JSON.stringify(report, null, 2));
}