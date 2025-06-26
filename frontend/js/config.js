// API 配置
const API_BASE_URL = 'http://localhost:3000/api';

// API 端点
const API_ENDPOINTS = {
    books: {
        list: `${API_BASE_URL}/books`,
        detail: (id) => `${API_BASE_URL}/books/${id}`,
        create: `${API_BASE_URL}/books`,
        update: (id) => `${API_BASE_URL}/books/${id}`,
        delete: (id) => `${API_BASE_URL}/books/${id}`
    },
    borrow: {
        borrow: `${API_BASE_URL}/borrow/borrow`,
        return: (id) => `${API_BASE_URL}/borrow/return/${id}`,
        records: `${API_BASE_URL}/borrow/records`
    }
};

// 通用 AJAX 请求封装
function request(options) {
    const defaults = {
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        error: function(xhr, status, error) {
            console.error('请求失败:', error);
            layer.msg('请求失败: ' + (xhr.responseJSON?.msg || error), {icon: 2});
        }
    };
    
    // 合并选项
    const settings = $.extend({}, defaults, options);
    
    // 如果是 POST/PUT 请求且 data 是对象，转换为 JSON
    if ((settings.type === 'POST' || settings.type === 'PUT') && 
        settings.data && typeof settings.data === 'object') {
        settings.data = JSON.stringify(settings.data);
    }
    
    return $.ajax(settings);
}