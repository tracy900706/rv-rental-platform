/**
 * 房车租赁平台主JavaScript文件
 * 包含通用的功能函数
 */

// 格式化价格显示，例如：¥123.45
function formatPrice(price) {
    return '¥' + parseFloat(price).toFixed(2);
}

// 格式化日期，例如：2023-05-20
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 计算两个日期之间的天数
function daysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// 根据评分生成星星HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // 添加实心星星
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // 添加半星
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // 添加空心星星
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// 显示加载中动画
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="flex justify-center items-center p-4"><div class="loader"></div></div>';
    }
}

// 隐藏加载动画并显示内容
function hideLoading(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    } text-white`;
    
    // 设置内容
    toast.innerHTML = `
        <div class="flex items-center">
            <i class="mr-2 ${
                type === 'success' ? 'fas fa-check-circle' : 
                type === 'error' ? 'fas fa-exclamation-circle' : 
                type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'
            }"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 3秒后移除
    setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500);
    }, 3000);
}

// 验证手机号
function validatePhone(phone) {
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
}

// 验证身份证
function validateIdCard(idCard) {
    const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return regex.test(idCard);
}

// 模拟API请求
function mockApiRequest(endpoint, data = {}, delay = 500) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 'success',
                data: data
            });
        }, delay);
    });
}

// 计算租车价格
function calculateRentalPrice(basePrice, days, isWeekend, isMember, promotionDiscount) {
    // 基础价格
    let totalPrice = basePrice * days;
    
    // 长租折扣
    let longRentalDiscount = 1; // 无折扣
    if (days >= 30) {
        longRentalDiscount = 0.8; // 30天以上8折
    } else if (days >= 15) {
        longRentalDiscount = 0.9; // 15天以上9折
    } else if (days >= 7) {
        longRentalDiscount = 0.95; // 7天以上9.5折
    }
    
    // 应用长租折扣
    totalPrice = totalPrice * longRentalDiscount;
    
    // 会员折扣
    let memberDiscount = 1; // 无折扣
    if (isMember === 'gold') {
        memberDiscount = 0.75; // 金卡会员7.5折
    } else if (isMember === 'silver') {
        memberDiscount = 0.8; // 银卡会员8折
    }
    
    // 比较会员折扣和促销折扣，选择较低的
    const finalDiscount = Math.min(memberDiscount, promotionDiscount || 1);
    
    // 应用最终折扣
    totalPrice = totalPrice * finalDiscount;
    
    return totalPrice;
} 