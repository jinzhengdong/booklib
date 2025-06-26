// 等待 DOM 和 Layui 加载完成
$(document).ready(function() {
    layui.use(['element', 'table', 'form', 'laydate', 'layer'], function() {
        const element = layui.element;
        const table = layui.table;
        const form = layui.form;
        const laydate = layui.laydate;
        const layer = layui.layer;
        
        // 页面路由管理
        const pageManager = {
            currentPage: null,
            
            // 加载页面
            loadPage: function(pageName, title) {
                const tplId = `#${pageName}-tpl`;
                const content = $(tplId).html();
                
                if (!content) {
                    layer.msg('页面模板不存在', {icon: 2});
                    return;
                }
                
                // 检查是否已存在该标签页
                let tabExist = false;
                $('.layui-tab-title li').each(function() {
                    if ($(this).attr('lay-id') === pageName) {
                        tabExist = true;
                        element.tabChange('mainTab', pageName);
                        return false;
                    }
                });
                
                if (!tabExist) {
                    // 新增标签页
                    element.tabAdd('mainTab', {
                        title: title,
                        content: content,
                        id: pageName
                    });
                    element.tabChange('mainTab', pageName);
                }
                
                this.currentPage = pageName;
                
                // 初始化页面
                this.initPage(pageName);
            },
            
            // 初始化页面
            initPage: function(pageName) {
                switch(pageName) {
                    case 'book-list':
                        this.initBookList();
                        break;
                    case 'book-add':
                        this.initBookAdd();
                        break;
                    case 'borrow-list':
                        this.initBorrowList();
                        break;
                    case 'borrow-add':
                        this.initBorrowAdd();
                        break;
                }
            },
            
            // 初始化图书列表
            initBookList: function() {
                // 渲染表格
                table.render({
                    elem: '#bookTable',
                    url: API_ENDPOINTS.books.list,
                    method: 'GET',
                    page: true,
                    cols: [[
                        {field: 'id', title: 'ID', width: 80, sort: true},
                        {field: 'isbn', title: 'ISBN', width: 150},
                        {field: 'title', title: '书名', minWidth: 200},
                        {field: 'author', title: '作者', width: 150},
                        {field: 'publisher', title: '出版社', width: 150},
                        {field: 'category', title: '分类', width: 100},
                        {field: 'status', title: '状态', width: 100, templet: function(d) {
                            return d.status === 'available' ? 
                                '<span class="layui-badge layui-bg-green">可借</span>' : 
                                '<span class="layui-badge">已借出</span>';
                        }},
                        {title: '操作', width: 180, align: 'center', toolbar: '#bookToolbar'}
                    ]],
                    parseData: function(res) {
                        return {
                            code: res.code,
                            msg: res.msg,
                            count: res.count,
                            data: res.data
                        };
                    }
                });
                
                // 搜索功能
                $('#searchBtn').off('click').on('click', function() {
                    const search = $('#searchInput').val();
                    table.reload('bookTable', {
                        where: { search: search },
                        page: { curr: 1 }
                    });
                });
                
                // 重置功能
                $('#resetBtn').off('click').on('click', function() {
                    $('#searchInput').val('');
                    table.reload('bookTable', {
                        where: { search: '' },
                        page: { curr: 1 }
                    });
                });
                
                // 监听工具条事件
                table.on('tool(bookTable)', function(obj) {
                    const data = obj.data;
                    
                    if (obj.event === 'edit') {
                        // 编辑图书
                        layer.open({
                            type: 1,
                            title: '编辑图书',
                            area: ['500px', '450px'],
                            content: $('#book-edit-form').html(),
                            success: function(layero, index) {
                                // 填充表单数据
                                form.val('editBookForm', data);
                                form.render();
                                
                                // 日期选择器
                                laydate.render({
                                    elem: '#editPublishDate'
                                });
                                
                                // 监听提交
                                form.on('submit(editBookSubmit)', function(formData) {
                                    request({
                                        url: API_ENDPOINTS.books.update(data.id),
                                        type: 'PUT',
                                        data: formData.field,
                                        success: function(res) {
                                            if (res.code === 0) {
                                                layer.msg('更新成功', {icon: 1});
                                                layer.close(index);
                                                table.reload('bookTable');
                                            }
                                        }
                                    });
                                    return false;
                                });
                            }
                        });
                    } else if (obj.event === 'delete') {
                        // 删除图书
                        layer.confirm('确定删除这本图书吗？', function(index) {
                            request({
                                url: API_ENDPOINTS.books.delete(data.id),
                                type: 'DELETE',
                                success: function(res) {
                                    if (res.code === 0) {
                                        layer.msg('删除成功', {icon: 1});
                                        obj.del();
                                    }
                                }
                            });
                            layer.close(index);
                        });
                    }
                });
            },
            
            // 初始化添加图书
            initBookAdd: function() {
                // 日期选择器
                laydate.render({
                    elem: '#publishDate'
                });
                
                // 重新渲染表单
                form.render();
                
                // 监听提交
                form.on('submit(bookSubmit)', function(data) {
                    request({
                        url: API_ENDPOINTS.books.create,
                        type: 'POST',
                        data: data.field,
                        success: function(res) {
                            if (res.code === 0) {
                                layer.msg('添加成功', {icon: 1});
                                // 重置表单
                                $('#bookForm')[0].reset();
                                form.render();
                            }
                        }
                    });
                    return false;
                });
            },
            
            // 初始化借阅列表
            initBorrowList: function() {
                table.render({
                    elem: '#borrowTable',
                    url: API_ENDPOINTS.borrow.records,
                    method: 'GET',
                    page: true,
                    cols: [[
                        {field: 'id', title: 'ID', width: 80},
                        {field: 'title', title: '书名', minWidth: 200},
                        {field: 'borrower_name', title: '借阅人', width: 120},
                        {field: 'borrower_phone', title: '联系电话', width: 150},
                        {field: 'borrow_date', title: '借阅日期', width: 120},
                        {field: 'return_date', title: '归还日期', width: 120},
                        {field: 'status', title: '状态', width: 100, templet: function(d) {
                            return d.status === 'borrowing' ? 
                                '<span class="layui-badge">借阅中</span>' : 
                                '<span class="layui-badge layui-bg-green">已归还</span>';
                        }},
                        {title: '操作', width: 120, align: 'center', templet: function(d) {
                            return d.status === 'borrowing' ? 
                                '<button class="layui-btn layui-btn-sm" onclick="returnBook(' + d.id + ')">归还</button>' : 
                                '-';
                        }}
                    ]],
                    parseData: function(res) {
                        return {
                            code: res.code,
                            msg: res.msg,
                            count: res.count,
                            data: res.data
                        };
                    }
                });
                
                // 状态筛选功能
                $('#filterBtn').off('click').on('click', function() {
                    const status = $('#statusFilter').val();
                    table.reload('borrowTable', {
                        where: { status: status },
                        page: { curr: 1 }
                    });
                });
                
                // 重新渲染表单
                form.render();
            },
            
            // 初始化借阅添加
            initBorrowAdd: function() {
                // 重新渲染表单
                form.render();
                
                // 监听提交
                form.on('submit(borrowSubmit)', function(data) {
                    request({
                        url: API_ENDPOINTS.borrow.borrow,
                        type: 'POST',
                        data: data.field,
                        success: function(res) {
                            if (res.code === 0) {
                                layer.msg('借阅成功', {icon: 1});
                                // 重置表单
                                $('#borrowForm')[0].reset();
                                form.render();
                            }
                        }
                    });
                    return false;
                });
            }
        };
        
        // 归还图书函数（全局）
        window.returnBook = function(id) {
            layer.confirm('确定归还这本图书吗？', function(index) {
                request({
                    url: API_ENDPOINTS.borrow.return(id),
                    type: 'PUT',
                    success: function(res) {
                        if (res.code === 0) {
                            layer.msg('归还成功', {icon: 1});
                            table.reload('borrowTable');
                        }
                    }
                });
                layer.close(index);
            });
        };
        
        // 监听导航点击
        element.on('nav(test)', function(elem) {
            const page = $(elem).attr('data-page');
            const title = $(elem).text();
            
            if (page) {
                pageManager.loadPage(page, title);
            }
        });
        
        // 工具条模板
        const toolbarTpl = `
            <script type="text/html" id="bookToolbar">
                <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
                <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete">删除</a>
            </script>
        `;
        $('body').append(toolbarTpl);
        
        // 编辑表单模板
        const editFormTpl = `
            <script type="text/html" id="book-edit-form">
                <form class="layui-form" lay-filter="editBookForm" style="padding: 20px;">
                    <div class="layui-form-item">
                        <label class="layui-form-label">书名</label>
                        <div class="layui-input-block">
                            <input type="text" name="title" required lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">作者</label>
                        <div class="layui-input-block">
                            <input type="text" name="author" required lay-verify="required" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">出版社</label>
                        <div class="layui-input-block">
                            <input type="text" name="publisher" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">出版日期</label>
                        <div class="layui-input-block">
                            <input type="text" name="publish_date" id="editPublishDate" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">分类</label>
                        <div class="layui-input-block">
                            <select name="category">
                                <option value="">请选择分类</option>
                                <option value="编程">编程</option>
                                <option value="文学">文学</option>
                                <option value="历史">历史</option>
                                <option value="科学">科学</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-input-block">
                            <button class="layui-btn" lay-submit lay-filter="editBookSubmit">提交</button>
                        </div>
                    </div>
                </form>
            </script>
        `;
        $('body').append(editFormTpl);
    });
});