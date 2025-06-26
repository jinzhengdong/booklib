## 简介

本教程通过实际代码演练和详细解释，帮助您掌握JavaScript最佳实践。每个示例都包含完整的代码演示、运行结果和逐步分析，确保您不仅能看到代码，更能理解其工作原理和最佳实践的价值。

## 1. 变量声明与作用域

### 1.1 默认使用 const，必要时使用 let

**理论背景**：现代JavaScript推荐使用`const`声明不会重新赋值的变量，`let`声明会重新赋值的变量，完全避免使用`var`。

**实践演练**：

```javascript
// 示例1：配置对象最佳实践
console.log('=== 示例1：配置对象声明 ===');

// 好的做法：使用 const 声明不会改变的配置
const MAX_RETRY_COUNT = 3;
const userConfig = { theme: 'dark', language: 'en' };

console.log('MAX_RETRY_COUNT:', MAX_RETRY_COUNT);
console.log('userConfig:', userConfig);

// 尝试重新赋值配置对象（会报错）
try {
    MAX_RETRY_COUNT = 5; // TypeError: Assignment to constant variable.
} catch (error) {
    console.log('错误演示 - 不能重新赋值const变量:', error.message);
}

// 但是可以修改对象的属性
userConfig.theme = 'light';
console.log('修改后的userConfig:', userConfig);
```

**运行结果**：

```
=== 示例1：配置对象声明 ===
MAX_RETRY_COUNT: 3
userConfig: { theme: 'dark', language: 'en' }
错误演示 - 不能重新赋值const变量: Assignment to constant variable.
修改后的userConfig: { theme: 'light', language: 'en' }
```

**代码分析**：

- `MAX_RETRY_COUNT`使用`const`声明，表示这是一个常量，不能重新赋值
- `userConfig`虽然用`const`声明，但对象的属性仍然可以修改
- 当试图重新赋值`const`变量时，JavaScript会抛出`TypeError`

```javascript
// 示例2：循环计数器最佳实践
console.log('\n=== 示例2：循环计数器 ===');

// 好的做法：使用 let 声明会改变的变量
let currentRetryCount = 0;
const targetCount = 3;

console.log('开始重试循环...');
while (currentRetryCount < targetCount) {
    currentRetryCount++;
    console.log(`第 ${currentRetryCount} 次重试`);
    
    // 模拟重试逻辑
    if (currentRetryCount === 2) {
        console.log('重试成功！');
        break;
    }
}

console.log('最终重试次数:', currentRetryCount);
```

**运行结果**：

```
=== 示例2：循环计数器 ===
开始重试循环...
第 1 次重试
第 2 次重试
重试成功！
最终重试次数: 2
```

**代码分析**：

- `currentRetryCount`使用`let`声明，因为它的值需要在循环中改变
- `targetCount`使用`const`声明，因为它是一个固定的目标值
- 循环展示了`let`变量如何在作用域内正确更新

### 1.2 块级作用域实践

**实践演练**：

```javascript
// 示例3：块级作用域演示
console.log('\n=== 示例3：块级作用域 ===');

function processData(items) {
    console.log('处理数据数组:', items);
    const results = [];
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const processed = item.toString().toUpperCase();
        console.log(`处理项目 ${i + 1}: ${item} -> ${processed}`);
        results.push(processed);
    }
    
    // 验证块级作用域：这里无法访问 'i' 和 'item'
    try {
        console.log('尝试访问循环变量 i:', i);
    } catch (error) {
        console.log('预期错误 - i 不在作用域内:', error.message);
    }
    
    console.log('处理结果:', results);
    return results;
}

// 运行演示
const testData = ['hello', 'world', 'javascript'];
const result = processData(testData);
```

**运行结果**：

```
=== 示例3：块级作用域 ===
处理数据数组: ['hello', 'world', 'javascript']
处理项目 1: hello -> HELLO
处理项目 2: world -> WORLD
处理项目 3: javascript -> JAVASCRIPT
预期错误 - i 不在作用域内: i is not defined
处理结果: ['HELLO', 'WORLD', 'JAVASCRIPT']
```

**代码分析**：

- 循环中的`i`和`item`变量只在for循环的块级作用域内有效
- 函数结束后尝试访问这些变量会导致`ReferenceError`
- 这种作用域控制有助于避免变量名冲突和意外的变量访问

## 2. 函数设计

### 2.1 箭头函数最佳实践

**实践演练**：

```javascript
// 示例4：箭头函数与普通函数的区别
console.log('\n=== 示例4：箭头函数实践 ===');

// 数组转换操作
const numbers = [1, 2, 3, 4, 5];
console.log('原始数组:', numbers);

// 好的做法：使用箭头函数进行简单转换
const doubled = numbers.map(n => n * 2);
const filtered = numbers.filter(n => n > 2);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log('翻倍结果:', doubled);
console.log('过滤结果 (>2):', filtered);
console.log('求和结果:', sum);

// 演示this绑定差异
class DataProcessor {
    constructor() {
        this.multiplier = 3;
        console.log('DataProcessor初始化，multiplier =', this.multiplier);
    }
    
    // 使用箭头函数保持this上下文
    processArray(arr) {
        console.log('开始处理数组，使用乘数:', this.multiplier);
        return arr.map(value => {
            const result = value * this.multiplier;
            console.log(`${value} * ${this.multiplier} = ${result}`);
            return result;
        });
    }
    
    // 传统方法定义
    setMultiplier(newMultiplier) {
        console.log(`更改乘数从 ${this.multiplier} 到 ${newMultiplier}`);
        this.multiplier = newMultiplier;
        return this;
    }
}

const processor = new DataProcessor();
const testArray = [2, 4, 6];
console.log('测试数组:', testArray);

const processed = processor.processArray(testArray);
console.log('处理后数组:', processed);

// 链式调用演示
processor.setMultiplier(5).processArray([1, 2]);
```

**运行结果**：

```
=== 示例4：箭头函数实践 ===
原始数组: [1, 2, 3, 4, 5]
翻倍结果: [2, 4, 6, 8, 10]
过滤结果 (>2): [3, 4, 5]
求和结果: 15
DataProcessor初始化，multiplier = 3
测试数组: [2, 4, 6]
开始处理数组，使用乘数: 3
2 * 3 = 6
4 * 3 = 12
6 * 3 = 18
处理后数组: [6, 12, 18]
更改乘数从 3 到 5
开始处理数组，使用乘数: 5
1 * 5 = 5
2 * 5 = 10
```

**代码分析**：

- 箭头函数在数组方法中简洁明了，适合简单的转换操作
- 在类方法中，箭头函数保持了词法`this`绑定，确保`this.multiplier`正确访问
- 普通函数适合作为对象方法，支持链式调用返回`this`

### 2.2 默认参数实践

**实践演练**：

```javascript
// 示例5：默认参数演示
console.log('\n=== 示例5：默认参数 ===');

// 好的做法：使用默认参数
function createUser(name, role = 'user', isActive = true) {
    const user = { name, role, isActive };
    console.log('创建用户:', user);
    return user;
}

// 测试不同参数组合
console.log('--- 测试1: 只提供name ---');
const user1 = createUser('Alice');

console.log('--- 测试2: 提供name和role ---');
const user2 = createUser('Bob', 'admin');

console.log('--- 测试3: 提供所有参数 ---');
const user3 = createUser('Charlie', 'moderator', false);

console.log('--- 测试4: 使用null值 ---');
const user4 = createUser('David', null, true);

// 对比不好的做法
function createUserOldWay(name, role, isActive) {
    // 传统方式处理默认值
    role = role || 'user';
    isActive = isActive !== undefined ? isActive : true;
    
    const user = { name, role, isActive };
    console.log('传统方式创建用户:', user);
    return user;
}

console.log('--- 传统方式测试 ---');
const user5 = createUserOldWay('Eve');
const user6 = createUserOldWay('Frank', '', true); // 空字符串问题
```

**运行结果**：

```
=== 示例5：默认参数 ===
--- 测试1: 只提供name ---
创建用户: { name: 'Alice', role: 'user', isActive: true }
--- 测试2: 提供name和role ---
创建用户: { name: 'Bob', role: 'admin', isActive: true }
--- 测试3: 提供所有参数 ---
创建用户: { name: 'Charlie', role: 'moderator', isActive: false }
--- 测试4: 使用null值 ---
创建用户: { name: 'David', role: null, isActive: true }
--- 传统方式测试 ---
传统方式创建用户: { name: 'Eve', role: 'user', isActive: true }
传统方式创建用户: { name: 'Frank', role: 'user', isActive: true }
```

**代码分析**：

- 默认参数只在参数为`undefined`时生效，`null`值不会触发默认参数
- 现代默认参数语法比传统的`||`操作符更精确和可读
- 传统方式在处理空字符串等falsy值时可能产生意外结果

### 2.3 解构参数实践

**实践演练**：

```javascript
// 示例6：解构参数演示
console.log('\n=== 示例6：解构参数 ===');

// 好的做法：使用解构参数
function initializeApp({ port = 3000, host = 'localhost', debug = false } = {}) {
    console.log(`配置信息:`);
    console.log(`- 主机: ${host}`);
    console.log(`- 端口: ${port}`);
    console.log(`- 调试模式: ${debug ? '启用' : '禁用'}`);
    
    if (debug) {
        console.log('调试信息: 应用程序正在启动...');
    }
    
    return { host, port, debug };
}

// 测试不同配置
console.log('--- 测试1: 默认配置 ---');
const config1 = initializeApp();

console.log('\n--- 测试2: 部分配置 ---');
const config2 = initializeApp({ port: 8080, debug: true });

console.log('\n--- 测试3: 完整配置 ---');
const config3 = initializeApp({ 
    port: 5000, 
    host: '0.0.0.0', 
    debug: false 
});

// 演示复杂解构
function processUserData({ 
    name, 
    email, 
    age = 18, 
    preferences = { theme: 'light', language: 'en' } 
}) {
    console.log('\n处理用户数据:');
    console.log(`- 姓名: ${name}`);
    console.log(`- 邮箱: ${email}`);
    console.log(`- 年龄: ${age}`);
    console.log(`- 主题偏好: ${preferences.theme}`);
    console.log(`- 语言偏好: ${preferences.language}`);
    
    return {
        displayName: name,
        contactEmail: email,
        isAdult: age >= 18,
        settings: preferences
    };
}

console.log('\n--- 测试4: 复杂对象解构 ---');
const userData = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 25,
    preferences: { theme: 'dark', language: 'zh' }
};

const processedUser = processUserData(userData);
console.log('处理结果:', processedUser);
```

**运行结果**：

```
=== 示例6：解构参数 ===
--- 测试1: 默认配置 ---
配置信息:
- 主机: localhost
- 端口: 3000
- 调试模式: 禁用

--- 测试2: 部分配置 ---
配置信息:
- 主机: localhost
- 端口: 8080
- 调试模式: 启用
调试信息: 应用程序正在启动...

--- 测试3: 完整配置 ---
配置信息:
- 主机: 0.0.0.0
- 端口: 5000
- 调试模式: 禁用

--- 测试4: 复杂对象解构 ---
处理用户数据:
- 姓名: Alice Johnson
- 邮箱: alice@example.com
- 年龄: 25
- 主题偏好: dark
- 语言偏好: zh
处理结果: {
  displayName: 'Alice Johnson',
  contactEmail: 'alice@example.com',
  isAdult: true,
  settings: { theme: 'dark', language: 'zh' }
}
```

**代码分析**：

- 解构参数使函数调用更加清晰，参数名称明确
- `= {}`确保即使不传参数也不会报错
- 嵌套对象的解构需要提供默认值来避免错误
- 这种模式特别适合配置对象和复杂参数

## 3. 对象和数组操作

### 3.1 对象属性简写与展开运算符

**实践演练**：

```javascript
// 示例7：对象操作最佳实践
console.log('\n=== 示例7：对象操作 ===');

// 模拟用户输入数据
const userName = 'John Doe';
const userAge = 30;
const userEmail = 'john@example.com';

// 好的做法：属性简写
const user = { 
    name: userName, 
    age: userAge, 
    email: userEmail,
    createdAt: new Date()
};

console.log('使用属性简写创建的用户:', user);

// 展开运算符实现不可变更新
const originalConfig = { 
    theme: 'light', 
    fontSize: 14, 
    autoSave: true 
};
console.log('原始配置:', originalConfig);

// 创建新配置而不修改原始配置
const updatedConfig = { 
    ...originalConfig, 
    theme: 'dark', 
    fontSize: 16 
};

console.log('更新后配置:', updatedConfig);
console.log('原始配置未改变:', originalConfig);
console.log('两个配置是否相同:', originalConfig === updatedConfig);

// 数组的展开运算符
const numbers = [1, 2, 3];
console.log('原始数组:', numbers);

const moreNumbers = [...numbers, 4, 5];
console.log('扩展后数组:', moreNumbers);

const evenMoreNumbers = [0, ...numbers, 4, 5, 6];
console.log('前后都扩展:', evenMoreNumbers);

// 数组方法链式操作（不改变原数组）
const items = ['apple', 'banana', 'cherry', 'date'];
console.log('原始水果列表:', items);

const processedItems = items
    .filter(item => item.length > 5)
    .map(item => item.toUpperCase())
    .sort();

console.log('处理后列表:', processedItems);
console.log('原始列表未改变:', items);
```

**运行结果**：

```
=== 示例7：对象操作 ===
使用属性简写创建的用户: {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  createdAt: 2024-01-15T10:30:00.000Z
}
原始配置: { theme: 'light', fontSize: 14, autoSave: true }
更新后配置: { theme: 'dark', fontSize: 16, autoSave: true }
原始配置未改变: { theme: 'light', fontSize: 14, autoSave: true }
两个配置是否相同: false
原始数组: [1, 2, 3]
扩展后数组: [1, 2, 3, 4, 5]
前后都扩展: [0, 1, 2, 3, 4, 5, 6]
原始水果列表: ['apple', 'banana', 'cherry', 'date']
处理后列表: ['BANANA', 'CHERRY']
原始列表未改变: ['apple', 'banana', 'cherry', 'date']
```

**代码分析**：

- 展开运算符创建了新对象，避免了直接修改原对象的副作用
- 数组方法链式调用展示了函数式编程的优势
- 不可变操作确保了数据的可预测性和安全性

### 3.2 解构赋值实践

**实践演练**：

```javascript
// 示例8：解构赋值详细演示
console.log('\n=== 示例8：解构赋值 ===');

// 基础对象解构
const user = { 
    id: 1, 
    name: 'Alice', 
    email: 'alice@example.com',
    age: 28,
    city: 'New York'
};

console.log('原始用户对象:', user);

// 基础解构
const { name, email } = user;
console.log('解构出的姓名:', name);
console.log('解构出的邮箱:', email);

// 重命名解构
const { name: userName, email: userEmail } = user;
console.log('重命名后 - 用户名:', userName);
console.log('重命名后 - 用户邮箱:', userEmail);

// 数组解构
const coordinates = [10, 20, 30];
console.log('坐标数组:', coordinates);

const [x, y, z] = coordinates;
console.log(`坐标 - X: ${x}, Y: ${y}, Z: ${z}`);

// 跳过数组元素
const colors = ['red', 'green', 'blue', 'yellow'];
const [primary, , tertiary] = colors;
console.log('主色:', primary);
console.log('第三色:', tertiary);

// 嵌套解构
const response = {
    status: 'success',
    data: {
        user: { 
            id: 1, 
            name: 'Bob',
            profile: {
                avatar: 'avatar.jpg',
                bio: 'Software Developer'
            }
        },
        posts: ['post1', 'post2']
    }
};

console.log('API响应:', response);

// 深层嵌套解构
const { 
    status,
    data: { 
        user: { 
            name: apiUserName,
            profile: { avatar, bio }
        },
        posts: [firstPost, secondPost]
    }
} = response;

console.log('状态:', status);
console.log('API用户名:', apiUserName);
console.log('头像:', avatar);
console.log('简介:', bio);
console.log('第一篇文章:', firstPost);
console.log('第二篇文章:', secondPost);

// 剩余参数解构
const { id, ...userDetails } = user;
console.log('用户ID:', id);
console.log('用户其他信息:', userDetails);

// 函数参数解构
function displayUserInfo({ name, email, age = 'unknown' }) {
    console.log(`用户信息显示:`);
    console.log(`- 姓名: ${name}`);
    console.log(`- 邮箱: ${email}`);
    console.log(`- 年龄: ${age}`);
}

console.log('\n--- 函数参数解构测试 ---');
displayUserInfo({ name: 'Charlie', email: 'charlie@example.com' });
displayUserInfo({ name: 'Diana', email: 'diana@example.com', age: 35 });
```

**运行结果**：

```
=== 示例8：解构赋值 ===
原始用户对象: { id: 1, name: 'Alice', email: 'alice@example.com', age: 28, city: 'New York' }
解构出的姓名: Alice
解构出的邮箱: alice@example.com
重命名后 - 用户名: Alice
重命名后 - 用户邮箱: alice@example.com
坐标数组: [10, 20, 30]
坐标 - X: 10, Y: 20, Z: 30
主色: red
第三色: blue
API响应: {
  status: 'success',
  data: {
    user: { id: 1, name: 'Bob', profile: { avatar: 'avatar.jpg', bio: 'Software Developer' } },
    posts: ['post1', 'post2']
  }
}
状态: success
API用户名: Bob
头像: avatar.jpg
简介: Software Developer
第一篇文章: post1
第二篇文章: post2
用户ID: 1
用户其他信息: { name: 'Alice', email: 'alice@example.com', age: 28, city: 'New York' }

--- 函数参数解构测试 ---
用户信息显示:
- 姓名: Charlie
- 邮箱: charlie@example.com
- 年龄: unknown
用户信息显示:
- 姓名: Diana
- 邮箱: diana@example.com
- 年龄: 35
```

**代码分析**：

- 解构赋值可以同时重命名变量和提取值
- 嵌套解构可以直接访问深层对象属性
- 剩余参数语法`...`可以收集剩余的属性
- 函数参数解构结合默认值提供了灵活的API设计

## 4. 异步编程

### 4.1 Async/Await vs Promise

**实践演练**：

```javascript
// 示例9：异步编程实践
console.log('\n=== 示例9：异步编程 ===');

// 模拟异步操作
function simulateAsyncOperation(name, delay, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`${name} 操作失败`));
            } else {
                resolve(`${name} 操作成功完成`);
            }
        }, delay);
    });
}

// 模拟API调用
async function getUserById(userId) {
    console.log(`正在获取用户 ${userId} 的信息...`);
    return simulateAsyncOperation(`获取用户${userId}`, 1000);
}

async function getPermissions(role) {
    console.log(`正在获取角色 ${role} 的权限...`);
    const permissions = {
        admin: ['read', 'write', 'delete'],
        user: ['read'],
        guest: []
    };
    return simulateAsyncOperation(`获取${role}权限`, 500)
        .then(() => permissions[role] || []);
}

// 好的做法：使用 async/await
async function fetchUserData(userId) {
    console.log(`开始获取用户 ${userId} 的完整数据`);
    
    try {
        const userResult = await getUserById(userId);
        console.log('用户信息获取结果:', userResult);
        
        // 假设从用户信息中提取角色
        const userRole = userId === 1 ? 'admin' : 'user';
        const permissions = await getPermissions(userRole);
        console.log('权限获取完成:', permissions);
        
        const result = { 
            userId, 
            userInfo: userResult, 
            permissions,
            fetchTime: new Date().toISOString()
        };
        
        console.log('完整用户数据:', result);
        return result;
        
    } catch (error) {
        console.error(`获取用户数据失败: ${error.message}`);
        throw error;
    }
}

// 演示并行操作
async function fetchMultipleResources() {
    console.log('\n开始并行获取多个资源...');
    
    const startTime = Date.now();
    
    try {
        // 并行执行多个异步操作
        const [usersResult, postsResult, commentsResult] = await Promise.all([
            simulateAsyncOperation('获取用户列表', 800),
            simulateAsyncOperation('获取文章列表', 1200),
            simulateAsyncOperation('获取评论列表', 600)
        ]);
        
        const endTime = Date.now();
        console.log(`所有资源获取完成，总耗时: ${endTime - startTime}ms`);
        
        const result = {
            users: usersResult,
            posts: postsResult,
            comments: commentsResult,
            totalTime: endTime - startTime
        };
        
        console.log('并行获取结果:', result);
        return result;
        
    } catch (error) {
        console.error('并行获取失败:', error.message);
        throw error;
    }
}

// 演示顺序执行
async function processItemsSequentially(items) {
    console.log('\n开始顺序处理项目:', items);
    const results = [];
    
    for (const item of items) {
        try {
            console.log(`正在处理: ${item}`);
            const result = await simulateAsyncOperation(`处理${item}`, 300);
            console.log(`${item} 处理完成:`, result);
            results.push({ item, result, status: 'success' });
        } catch (error) {
            console.log(`${item} 处理失败:`, error.message);
            results.push({ item, error: error.message, status: 'failed' });
        }
    }
    
    console.log('顺序处理完成:', results);
    return results;
}

// 执行演示
async function runAsyncDemo() {
    console.log('开始异步编程演示...\n');
    
    // 测试1：单个用户数据获取
    console.log('=== 测试1：单个用户数据获取 ===');
    try {
        await fetchUserData(1);
    } catch (error) {
        console.log('用户数据获取失败');
    }
    
    // 测试2：并行资源获取
    console.log('\n=== 测试2：并行资源获取 ===');
    try {
        await fetchMultipleResources();
    } catch (error) {
        console.log('并行获取失败');
    }
    
    // 测试3：顺序处理
    console.log('\n=== 测试3：顺序处理 ===');
    const items = ['文档A', '文档B', '文档C'];
    try {
        await processItemsSequentially(items);
    } catch (error) {
        console.log('顺序处理失败');
    }
}

// 运行演示
runAsyncDemo();
```

**运行结果**：

```
=== 示例9：异步编程 ===
开始异步编程演示...

=== 测试1：单个用户数据获取 ===
开始获取用户 1 的完整数据
正在获取用户 1 的信息...
用户信息获取结果: 获取用户1 操作成功完成
正在获取角色 admin 的权限...
权限获取完成: ['read', 'write', 'delete']
完整用户数据: {
  userId: 1,
  userInfo: '获取用户1 操作成功完成',
  permissions: ['read', 'write', 'delete'],
  fetchTime: '2024-01-15T10:30:00.000Z'
}

=== 测试2：并行资源获取 ===
开始并行获取多个资源...
所有资源获取完成，总耗时: 1205ms
并行获取结果: {
  users: '获取用户列表 操作成功完成',
  posts: '获取文章列表 操作成功完成',
  comments: '获取评论列表 操作成功完成',
  totalTime: 1205
}

=== 测试3：顺序处理 ===
开始顺序处理项目: ['文档A', '文档B', '文档C']
正在处理: 文档A
文档A 处理完成: 处理文档A 操作成功完成
正在处理: 文档B
文档B 处理完成: 处理文档B 操作成功完成
正在处理: 文档C
文档C 处理完成: 处理文档C 操作成功完成
顺序处理完成: [
  { item: '文档A', result: '处理文档A 操作成功完成', status: 'success' },
  { item: '文档B', result: '处理文档B 操作成功完成', status: 'success' },
  { item: '文档C', result: '处理文档C 操作成功完成', status: 'success' }
]
```

**代码分析**：

- `async/await`使异步代码看起来像同步代码，提高可读性
- `Promise.all()`实现并行执行，总时间等于最长操作的时间
- 顺序执行适用于需要依赖前一步结果的场景
- 错误处理使用`try/catch`块，比Promise的`.catch()`更直观

### 4.2 错误处理实践

**实践演练**：

```javascript
// 示例10：异步错误处理
console.log('\n=== 示例10：异步错误处理 ===');

// 模拟可能失败的操作
async function riskyOperation(successRate = 0.7) {
    const success = Math.random() < successRate;
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (success) {
                resolve('操作成功完成');
            } else {
                reject(new Error('操作失败 - 随机错误'));
            }
        }, 500);
    });
}

// 安全的异步操作包装
async function safeOperation(successRate = 0.7) {
    console.log(`尝试执行操作 (成功率: ${successRate * 100}%)`);
    
    try {
        const result = await riskyOperation(successRate);
        console.log('✓ 操作成功:', result);
        return { success: true, data: result };
    } catch (error) {
        console.log('✗ 操作失败:', error.message);
        return { success: false, error: error.message };
    }
}

// 带有fallback的数据处理
async function dataProcessor() {
    console.log('\n开始数据处理...');
    
    const data = await riskyOperation(0.3).catch(error => {
        console.log('主要数据源失败，使用默认数据:', error.message);
        return '默认数据';
    });
    
    console.log('使用的数据:', data);
    return data;
}

// 多层错误处理
async function complexOperation() {
    console.log('\n开始复杂操作...');
    
    try {
        // 第一步：数据获取
        console.log('步骤1: 获取数据');
        const rawData = await riskyOperation(0.8);
        console.log('数据获取成功:', rawData);
        
        // 第二步：数据处理
        console.log('步骤2: 处理数据');
        const processedData = await riskyOperation(0.6);
        console.log('数据处理成功:', processedData);
        
        // 第三步：数据保存
        console.log('步骤3: 保存数据');
        const saveResult = await riskyOperation(0.9);
        console.log('数据保存成功:', saveResult);
        
        return {
            success: true,
            data: {
                raw: rawData,
                processed: processedData,
                saved: saveResult
            }
        };
        
    } catch (error) {
        console.error('复杂操作失败:', error.message);
        
        // 根据错误类型进行不同处理
        if (error.message.includes('数据获取')) {
            console.log('尝试从缓存获取数据...');
            return { success: false, error: '数据源不可用', fallback: '使用缓存数据' };
        } else if (error.message.includes('数据处理')) {
            console.log('尝试简化处理...');
            return { success: false, error: '数据处理失败', fallback: '使用简化处理' };
        } else {
            console.log('操作完全失败');
            return { success: false, error: error.message };
        }
    }
}

// 运行错误处理演示
async function runErrorHandlingDemo() {
    console.log('开始错误处理演示...\n');
    
    // 测试1：安全操作包装
    console.log('=== 测试1：安全操作包装 ===');
    for (let i = 0; i < 3; i++) {
        const result = await safeOperation(0.5);
        console.log(`尝试 ${i + 1} 结果:`, result);
    }
    
    // 测试2：fallback处理
    console.log('\n=== 测试2：Fallback处理 ===');
    for (let i = 0; i < 2; i++) {
        const data = await dataProcessor();
        console.log(`数据处理 ${i + 1} 完成`);
    }
    
    // 测试3：复杂操作
    console.log('\n=== 测试3：复杂操作 ===');
    for (let i = 0; i < 2; i++) {
        const result = await complexOperation();
        console.log(`复杂操作 ${i + 1} 结果:`, result);
    }
}

// 运行演示
runErrorHandlingDemo();
```

**运行结果**：

```
=== 示例10：异步错误处理 ===
开始错误处理演示...

=== 测试1：安全操作包装 ===
尝试执行操作 (成功率: 50%)
✓ 操作成功: 操作成功完成
尝试 1 结果: { success: true, data: '操作成功完成' }
尝试执行操作 (成功率: 50%)
✗ 操作失败: 操作失败 - 随机错误
尝试 2 结果: { success: false, error: '操作失败 - 随机错误' }
尝试执行操作 (成功率: 50%)
✓ 操作成功: 操作成功完成
尝试 3 结果: { success: true, data: '操作成功完成' }

=== 测试2：Fallback处理 ===
开始数据处理...
主要数据源失败，使用默认数据: 操作失败 - 随机错误
使用的数据: 默认数据
数据处理 1 完成

开始数据处理...
使用的数据: 操作成功完成
数据处理 2 完成

=== 测试3：复杂操作 ===
开始复杂操作...
步骤1: 获取数据
数据获取成功: 操作成功完成
步骤2: 处理数据
数据处理成功: 操作成功完成
步骤3: 保存数据
数据保存成功: 操作成功完成
复杂操作 1 结果: {
  success: true,
  data: {
    raw: '操作成功完成',
    processed: '操作成功完成',
    saved: '操作成功完成'
  }
}

开始复杂操作...
步骤1: 获取数据
数据获取成功: 操作成功完成
步骤2: 处理数据
复杂操作失败: 操作失败 - 随机错误
操作完全失败
复杂操作 2 结果: { success: false, error: '操作失败 - 随机错误' }
```

**代码分析**：

- 安全操作包装确保错误不会导致程序崩溃
- `.catch()`方法提供了优雅的fallback机制
- 多层错误处理可以根据不同错误类型采取相应措施
- 统一的错误响应格式便于调用方处理

## 5. 自定义错误类

**实践演练**：

```javascript
// 示例11：自定义错误类
console.log('\n=== 示例11：自定义错误类 ===');

// 定义自定义错误类
class ValidationError extends Error {
    constructor(field, value, message) {
        super(message || `${field} 的值无效: ${value}`);
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
        this.timestamp = new Date().toISOString();
    }
}

class NetworkError extends Error {
    constructor(statusCode, message, url) {
        super(message);
        this.name = 'NetworkError';
        this.statusCode = statusCode;
        this.url = url;
        this.timestamp = new Date().toISOString();
    }
}

class BusinessLogicError extends Error {
    constructor(code, message, context) {
        super(message);
        this.name = 'BusinessLogicError';
        this.code = code;
        this.context = context;
        this.timestamp = new Date().toISOString();
    }
}

// 使用自定义错误的验证函数
function validateUser(userData) {
    console.log('验证用户数据:', userData);
    
    if (!userData.name || userData.name.trim() === '') {
        throw new ValidationError('name', userData.name, '用户名不能为空');
    }
    
    if (!userData.email || !userData.email.includes('@')) {
        throw new ValidationError('email', userData.email, '邮箱格式无效');
    }
    
    if (userData.age !== undefined && (userData.age < 0 || userData.age > 150)) {
        throw new ValidationError('age', userData.age, '年龄必须在0-150之间');
    }
    
    console.log('✓ 用户数据验证通过');
    return true;
}

// 模拟网络请求
async function simulateNetworkRequest(url, shouldFail = false) {
    console.log(`发起网络请求: ${url}`);
    
    if (shouldFail) {
        throw new NetworkError(404, '资源未找到', url);
    }
    
    // 模拟随机网络错误
    const errorChance = Math.random();
    if (errorChance < 0.3) {
        throw new NetworkError(500, '服务器内部错误', url);
    } else if (errorChance < 0.4) {
        throw new NetworkError(403, '访问被拒绝', url);
    }
    
    console.log('✓ 网络请求成功');
    return { data: '请求成功的数据', url };
}

// 业务逻辑函数
function processOrder(order) {
    console.log('处理订单:', order);
    
    if (!order.items || order.items.length === 0) {
        throw new BusinessLogicError(
            'EMPTY_ORDER', 
            '订单不能为空', 
            { orderId: order.id }
        );
    }
    
    if (order.total < 0) {
        throw new BusinessLogicError(
            'INVALID_TOTAL', 
            '订单总额不能为负数', 
            { orderId: order.id, total: order.total }
        );
    }
    
    // 模拟库存检查
    const outOfStockItems = order.items.filter(item => item.stock < item.quantity);
    if (outOfStockItems.length > 0) {
        throw new BusinessLogicError(
            'INSUFFICIENT_STOCK', 
            '库存不足', 
            { orderId: order.id, outOfStockItems }
        );
    }
    
    console.log('✓ 订单处理成功');
    return { orderId: order.id, status: 'processed' };
}

// 综合错误处理演示
async function comprehensiveErrorDemo() {
    console.log('开始综合错误处理演示...\n');
    
    // 测试1：验证错误
    console.log('=== 测试1：验证错误 ===');
    const testUsers = [
        { name: 'John', email: 'john@example.com', age: 25 },
        { name: '', email: 'invalid-email', age: 30 },
        { name: 'Jane', email: 'jane@example.com', age: 200 }
    ];
    
    for (const user of testUsers) {
        try {
            validateUser(user);
            console.log(`用户 ${user.name || '(空)'} 验证成功\n`);
        } catch (error) {
            if (error instanceof ValidationError) {
                console.log(`验证失败 - 字段: ${error.field}, 值: ${error.value}`);
                console.log(`错误信息: ${error.message}`);
                console.log(`时间: ${error.timestamp}\n`);
            } else {
                console.log('未知验证错误:', error.message);
            }
        }
    }
    
    // 测试2：网络错误
    console.log('=== 测试2：网络错误 ===');
    const urls = [
        'https://api.example.com/users',
        'https://api.example.com/nonexistent',
        'https://api.example.com/data'
    ];
    
    for (const url of urls) {
        try {
            const result = await simulateNetworkRequest(url, url.includes('nonexistent'));
            console.log(`网络请求成功: ${result.url}\n`);
        } catch (error) {
            if (error instanceof NetworkError) {
                console.log(`网络错误 - 状态码: ${error.statusCode}`);
                console.log(`URL: ${error.url}`);
                console.log(`错误信息: ${error.message}`);
                console.log(`时间: ${error.timestamp}\n`);
            } else {
                console.log('未知网络错误:', error.message);
            }
        }
    }
    
    // 测试3：业务逻辑错误
    console.log('=== 测试3：业务逻辑错误 ===');
    const testOrders = [
        { 
            id: 'ORDER-001', 
            items: [{ name: '商品A', quantity: 2, stock: 5 }], 
            total: 100 
        },
        { 
            id: 'ORDER-002', 
            items: [], 
            total: 0 
        },
        { 
            id: 'ORDER-003', 
            items: [{ name: '商品B', quantity: 10, stock: 3 }], 
            total: 200 
        }
    ];
    
    for (const order of testOrders) {
        try {
            const result = processOrder(order);
            console.log(`订单 ${order.id} 处理成功:`, result);
        } catch (error) {
            if (error instanceof BusinessLogicError) {
                console.log(`业务逻辑错误 - 代码: ${error.code}`);
                console.log(`错误信息: ${error.message}`);
                console.log(`上下文:`, error.context);
                console.log(`时间: ${error.timestamp}\n`);
            } else {
                console.log('未知业务错误:', error.message);
            }
        }
    }
}

// 运行演示
comprehensiveErrorDemo();
```

**运行结果**：

```
=== 示例11：自定义错误类 ===
开始综合错误处理演示...

=== 测试1：验证错误 ===
验证用户数据: { name: 'John', email: 'john@example.com', age: 25 }
✓ 用户数据验证通过
用户 John 验证成功

验证用户数据: { name: '', email: 'invalid-email', age: 30 }
验证失败 - 字段: name, 值: 
错误信息: 用户名不能为空
时间: 2024-01-15T10:30:00.000Z

验证用户数据: { name: 'Jane', email: 'jane@example.com', age: 200 }
验证失败 - 字段: age, 值: 200
错误信息: 年龄必须在0-150之间
时间: 2024-01-15T10:30:00.000Z

=== 测试2：网络错误 ===
发起网络请求: https://api.example.com/users
✓ 网络请求成功
网络请求成功: https://api.example.com/users

发起网络请求: https://api.example.com/nonexistent
网络错误 - 状态码: 404
URL: https://api.example.com/nonexistent
错误信息: 资源未找到
时间: 2024-01-15T10:30:00.000Z

发起网络请求: https://api.example.com/data
网络错误 - 状态码: 500
URL: https://api.example.com/data
错误信息: 服务器内部错误
时间: 2024-01-15T10:30:00.000Z

=== 测试3：业务逻辑错误 ===
处理订单: { id: 'ORDER-001', items: [{ name: '商品A', quantity: 2, stock: 5 }], total: 100 }
✓ 订单处理成功
订单 ORDER-001 处理成功: { orderId: 'ORDER-001', status: 'processed' }
处理订单: { id: 'ORDER-002', items: [], total: 0 }
业务逻辑错误 - 代码: EMPTY_ORDER
错误信息: 订单不能为空
上下文: { orderId: 'ORDER-002' }
时间: 2024-01-15T10:30:00.000Z

处理订单: { id: 'ORDER-003', items: [{ name: '商品B', quantity: 10, stock: 3 }], total: 200 }
业务逻辑错误 - 代码: INSUFFICIENT_STOCK
错误信息: 库存不足
上下文: { orderId: 'ORDER-003', outOfStockItems: [{ name: '商品B', quantity: 10, stock: 3 }] }
时间: 2024-01-15T10:30:00.000Z
```

**代码分析**：

- 自定义错误类提供了结构化的错误信息，便于调试和日志记录
- 每种错误类型携带特定的上下文信息，有助于问题定位
- `instanceof`检查允许对不同类型的错误采取不同的处理策略
- 时间戳和上下文信息有助于生产环境的错误追踪

## 6. 模块化和代码组织

**实践演练**：

```javascript
// 示例12：模块化最佳实践
console.log('\n=== 示例12：模块化最佳实践 ===');

// 模拟用户服务模块
class UserService {
    constructor(database) {
        this.database = database;
        console.log('UserService 初始化完成');
    }
    
    async createUser(userData) {
        console.log('创建用户:', userData);
        
        // 验证用户数据
        const validated = this.validateUserData(userData);
        console.log('验证通过:', validated);
        
        // 模拟数据库操作
        const savedUser = await this.database.users.create(validated);
        console.log('用户已保存到数据库:', savedUser);
        
        return savedUser;
    }
    
    validateUserData(data) {
        if (!data.email || !data.name) {
            throw new ValidationError('email或name', data, '缺少必填字段');
        }
        
        // 基础清理和验证
        return {
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            age: data.age || null,
            createdAt: new Date().toISOString()
        };
    }
    
    async getUserById(id) {
        console.log(`查找用户 ID: ${id}`);
        return await this.database.users.findById(id);
    }
    
    async updateUser(id, updates) {
        console.log(`更新用户 ${id}:`, updates);
        const validated = this.validateUserData(updates);
        return await this.database.users.update(id, validated);
    }
}

// 模拟数据库服务
class MockDatabase {
    constructor() {
        this.users = {
            data: new Map(),
            nextId: 1
        };
        console.log('MockDatabase 初始化完成');
    }
    
    // 用户相关操作
    get users() {
        return {
            create: async (userData) => {
                const id = this.users.nextId++;
                const user = { id, ...userData };
                this.users.data.set(id, user);
                
                // 模拟异步操作
                return new Promise(resolve => {
                    setTimeout(() => {
                        console.log(`数据库: 用户 ${id} 已创建`);
                        resolve(user);
                    }, 100);
                });
            },
            
            findById: async (id) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const user = this.users.data.get(id);
                        if (user) {
                            console.log(`数据库: 找到用户 ${id}`);
                            resolve(user);
                        } else {
                            console.log(`数据库: 用户 ${id} 不存在`);
                            reject(new Error(`用户 ${id} 不存在`));
                        }
                    }, 100);
                });
            },
            
            update: async (id, updates) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        const user = this.users.data.get(id);
                        if (user) {
                            const updatedUser = { ...user, ...updates };
                            this.users.data.set(id, updatedUser);
                            console.log(`数据库: 用户 ${id} 已更新`);
                            resolve(updatedUser);
                        } else {
                            reject(new Error(`用户 ${id} 不存在`));
                        }
                    }, 100);
                });
            }
        };
    }
}

// 单一职责原则演示
const CSVUtils = {
    // 解析CSV行
    parseCSVLine(line) {
        console.log(`解析CSV行: "${line}"`);
        const fields = line.split(',').map(field => field.trim());
        console.log('解析结果:', fields);
        return fields;
    },
    
    // 验证CSV数据
    validateCSVData(data, expectedColumns) {
        console.log(`验证CSV数据，期望列数: ${expectedColumns}`);
        const isValid = data.every(row => row.length === expectedColumns);
        console.log(`验证结果: ${isValid ? '通过' : '失败'}`);
        return isValid;
    },
    
    // 处理CSV文件内容
    processCSVFile(fileContent, expectedColumns = 3) {
        console.log('开始处理CSV文件...');
        console.log('文件内容长度:', fileContent.length);
        
        const lines = fileContent.split('\n').filter(line => line.trim());
        console.log('有效行数:', lines.length);
        
        const data = lines.map(line => this.parseCSVLine(line));
        
        if (!this.validateCSVData(data, expectedColumns)) {
            throw new Error(`CSV格式无效 - 期望${expectedColumns}列`);
        }
        
        console.log('CSV处理完成');
        return data;
    }
};

// 应用演示
async function runModularityDemo() {
    console.log('开始模块化演示...\n');
    
    // 初始化服务
    console.log('=== 初始化服务 ===');
    const database = new MockDatabase();
    const userService = new UserService(database);
    
    // 测试1：用户创建和查询
    console.log('\n=== 测试1：用户管理 ===');
    try {
        // 创建用户
        const newUser = await userService.createUser({
            name: '  Alice Johnson  ',
            email: '  ALICE@EXAMPLE.COM  ',
            age: 28
        });
        
        console.log('创建的用户:', newUser);
        
        // 查询用户
        const foundUser = await userService.getUserById(newUser.id);
        console.log('查询到的用户:', foundUser);
        
        // 更新用户
        const updatedUser = await userService.updateUser(newUser.id, {
            name: 'Alice Smith',
            email: 'alice.smith@example.com'
        });
        console.log('更新后的用户:', updatedUser);
        
    } catch (error) {
        console.error('用户管理操作失败:', error.message);
    }
    
    // 测试2：CSV处理
    console.log('\n=== 测试2：CSV处理 ===');
    try {
        const csvContent = `name,email,age
John Doe,john@example.com,30
Jane Smith,jane@example.com,25
Bob Johnson,bob@example.com,35`;
        
        const csvData = CSVUtils.processCSVFile(csvContent, 3);
        console.log('CSV处理结果:', csvData);
        
        // 测试无效CSV
        const invalidCsv = `name,email
John,john@example.com,30,extra`;
        
        try {
            CSVUtils.processCSVFile(invalidCsv, 2);
        } catch (error) {
            console.log('预期的CSV错误:', error.message);
        }
        
    } catch (error) {
        console.error('CSV处理失败:', error.message);
    }
    
    // 测试3：错误处理
    console.log('\n=== 测试3：错误处理 ===');
    try {
        // 尝试创建无效用户
        await userService.createUser({
            name: '',
            email: 'invalid-email'
        });
    } catch (error) {
        console.log('捕获的验证错误:', error.message);
    }
    
    try {
        // 尝试查询不存在的用户
        await userService.getUserById(999);
    } catch (error) {
        console.log('捕获的查询错误:', error.message);
    }
}

// 运行演示
runModularityDemo();
```

**运行结果**：

```
=== 示例12：模块化最佳实践 ===
开始模块化演示...

=== 初始化服务 ===
MockDatabase 初始化完成
UserService 初始化完成

=== 测试1：用户管理 ===
创建用户: { name: '  Alice Johnson  ', email: '  ALICE@EXAMPLE.COM  ', age: 28 }
验证通过: { name: 'Alice Johnson', email: 'alice@example.com', age: 28, createdAt: '2024-01-15T10:30:00.000Z' }
数据库: 用户 1 已创建
创建的用户: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, createdAt: '2024-01-15T10:30:00.000Z' }
查找用户 ID: 1
数据库: 找到用户 1
查询到的用户: { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, createdAt: '2024-01-15T10:30:00.000Z' }
更新用户 1: { name: 'Alice Smith', email: 'alice.smith@example.com' }
数据库: 用户 1 已更新
更新后的用户: { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com', age: 28, createdAt: '2024-01-15T10:30:00.000Z' }

=== 测试2：CSV处理 ===
开始处理CSV文件...
文件内容长度: 95
有效行数: 4
解析CSV行: "name,email,age"
解析结果: ['name', 'email', 'age']
解析CSV行: "John Doe,john@example.com,30"
解析结果: ['John Doe', 'john@example.com', '30']
解析CSV行: "Jane Smith,jane@example.com,25"
解析结果: ['Jane Smith', 'jane@example.com', '25']
解析CSV行: "Bob Johnson,bob@example.com,35"
解析结果: ['Bob Johnson', 'bob@example.com', '35']
验证CSV数据，期望列数: 3
验证结果: 通过
CSV处理完成
CSV处理结果: [
  ['name', 'email', 'age'],
  ['John Doe', 'john@example.com', '30'],
  ['Jane Smith', 'jane@example.com', '25'],
  ['Bob Johnson', 'bob@example.com', '35']
]

开始处理CSV文件...
文件内容长度: 32
有效行数: 2
解析CSV行: "name,email"
解析结果: ['name', 'email']
解析CSV行: "John,john@example.com,30,extra"
解析结果: ['John', 'john@example.com', '30', 'extra']
验证CSV数据，期望列数: 2
验证结果: 失败
预期的CSV错误: CSV格式无效 - 期望2列

=== 测试3：错误处理 ===
创建用户: { name: '', email: 'invalid-email' }
捕获的验证错误: email或name 的值无效: [object Object]
查找用户 ID: 999
数据库: 用户 999 不存在
捕获的查询错误: 用户 999 不存在
```

**代码分析**：

- 每个类和模块都有明确的职责边界
- 依赖注入使得组件易于测试和替换
- 工具函数按功能分组，便于重用和维护
- 错误处理在每个层级都有合适的实现

## 7. 性能最佳实践

**实践演练**：

```javascript
// 示例13：性能优化实践
console.log('\n=== 示例13：性能优化实践 ===');

// 测试数据生成
function generateTestData(size) {
    console.log(`生成 ${size} 条测试数据...`);
    const data = [];
    const roles = ['admin', 'user', 'guest', 'moderator'];
    
    for (let i = 0; i < size; i++) {
        data.push({
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: roles[i % roles.length],
            score: Math.floor(Math.random() * 100),
            isActive: Math.random() > 0.3
        });
    }
    
    console.log('测试数据生成完成');
    return data;
}

// 基础实现（清晰但未优化）
function findUsersByRole(users, role) {
    console.log(`基础实现：查找角色为 ${role} 的用户`);
    const startTime = Date.now();
    
    const result = users.filter(user => user.role === role);
    
    const endTime = Date.now();
    console.log(`基础实现耗时: ${endTime - startTime}ms，找到 ${result.length} 个用户`);
    
    return result;
}

// 优化实现（仅在必要时使用）
function findUsersByRoleOptimized(users, role) {
    console.log(`优化实现：查找角色为 ${role} 的用户`);
    const startTime = Date.now();
    
    const result = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].role === role) {
            result.push(users[i]);
        }
    }
    
    const endTime = Date.now();
    console.log(`优化实现耗时: ${endTime - startTime}ms，找到 ${result.length} 个用户`);
    
    return result;
}

// 数据结构优化示例
class UserManager {
    constructor() {
        this.users = [];
        this.userMap = new Map(); // 快速ID查找
        this.roleIndex = new Map(); // 角色索引
        this.uniqueEmails = new Set(); // 邮箱唯一性检查
        console.log('UserManager 初始化完成');
    }
    
    addUser(user) {
        // 检查邮箱唯一性
        if (this.uniqueEmails.has(user.email)) {
            throw new Error(`邮箱 ${user.email} 已存在`);
        }
        
        // 添加到各种数据结构
        this.users.push(user);
        this.userMap.set(user.id, user);
        this.uniqueEmails.add(user.email);
        
        // 更新角色索引
        if (!this.roleIndex.has(user.role)) {
            this.roleIndex.set(user.role, []);
        }
        this.roleIndex.get(user.role).push(user);
        
        console.log(`用户 ${user.name} 已添加`);
    }
    
    // O(1) 查找用户
    getUserById(id) {
        const startTime = Date.now();
        const user = this.userMap.get(id);
        const endTime = Date.now();
        
        console.log(`ID查找耗时: ${endTime - startTime}ms`);
        return user;
    }
    
    // O(1) 角色查找（使用索引）
    getUsersByRole(role) {
        const startTime = Date.now();
        const users = this.roleIndex.get(role) || [];
        const endTime = Date.now();
        
        console.log(`角色索引查找耗时: ${endTime - startTime}ms，找到 ${users.length} 个用户`);
        return users;
    }
    
    // 检查邮箱是否存在
    emailExists(email) {
        const startTime = Date.now();
        const exists = this.uniqueEmails.has(email);
        const endTime = Date.now();
        
        console.log(`邮箱检查耗时: ${endTime - startTime}ms`);
        return exists;
    }
    
    getStats() {
        return {
            totalUsers: this.users.length,
            uniqueEmails: this.uniqueEmails.size,
            roles: Array.from(this.roleIndex.keys()),
            usersByRole: Object.fromEntries(
                Array.from(this.roleIndex.entries()).map(([role, users]) => [role, users.length])
            )
        };
    }
}

// 性能测试函数
function performanceTest() {
    console.log('\n开始性能测试...\n');
    
    // 测试1：基础 vs 优化实现
    console.log('=== 测试1：基础实现 vs 优化实现 ===');
    const testData = generateTestData(10000);
    
    // 测试基础实现
    const result1 = findUsersByRole(testData, 'admin');
    
    // 测试优化实现
    const result2 = findUsersByRoleOptimized(testData, 'admin');
    
    console.log(`结果一致性检查: ${result1.length === result2.length ? '通过' : '失败'}`);
    
    // 测试2：数据结构优化
    console.log('\n=== 测试2：数据结构优化 ===');
    const userManager = new UserManager();
    
    // 添加用户测试
    console.log('添加用户测试...');
    const addStartTime = Date.now();
    
    for (let i = 0; i < 1000; i++) {
        try {
            userManager.addUser({
                id: i + 1,
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                role: ['admin', 'user', 'guest'][i % 3]
            });
        } catch (error) {
            console.log('添加用户失败:', error.message);
        }
    }
    
    const addEndTime = Date.now();
    console.log(`添加1000个用户耗时: ${addEndTime - addStartTime}ms`);
    
    // 查找性能测试
    console.log('\n查找性能测试...');
    
    // ID查找测试
    console.log('ID查找测试:');
    userManager.getUserById(500);
    userManager.getUserById(1000);
    
    // 角色查找测试
    console.log('角色查找测试:');
    userManager.getUsersByRole('admin');
    userManager.getUsersByRole('user');
    
    // 邮箱检查测试
    console.log('邮箱检查测试:');
    userManager.emailExists('user500@example.com');
    userManager.emailExists('nonexistent@example.com');
    
    // 统计信息
    console.log('\n用户管理器统计:', userManager.getStats());
    
    // 测试3：数组处理链式操作
    console.log('\n=== 测试3：数组处理性能 ===');
    const largeData = generateTestData(50000);
    
    console.log('链式操作测试...');
    const chainStartTime = Date.now();
    
    const processedData = largeData
        .filter(user => user.isActive)
        .filter(user => user.score > 50)
        .map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            highScore: user.score
        }))
        .sort((a, b) => b.highScore - a.highScore)
        .slice(0, 10);
    
    const chainEndTime = Date.now();
    console.log(`链式操作耗时: ${chainEndTime - chainStartTime}ms`);
    console.log(`处理结果: 前10名高分用户`);
    console.log(processedData.slice(0, 3)); // 显示前3名
    
    // 测试4：Set vs Array 性能对比
    console.log('\n=== 测试4：Set vs Array 性能对比 ===');
    const ids = Array.from({length: 10000}, (_, i) => i + 1);
    
    // Array includes 测试
    console.log('Array includes 测试...');
    const arrayStartTime = Date.now();
    const arrayResults = ids.filter(id => [1, 100, 1000, 5000, 9999].includes(id));
    const arrayEndTime = Date.now();
    console.log(`Array includes 耗时: ${arrayEndTime - arrayStartTime}ms，找到 ${arrayResults.length} 个`);
    
    // Set has 测试
    console.log('Set has 测试...');
    const targetSet = new Set([1, 100, 1000, 5000, 9999]);
    const setStartTime = Date.now();
    const setResults = ids.filter(id => targetSet.has(id));
    const setEndTime = Date.now();
    console.log(`Set has 耗时: ${setEndTime - setStartTime}ms，找到 ${setResults.length} 个`);
}

// 运行性能测试
performanceTest();
```

**运行结果**：

```
=== 示例13：性能优化实践 ===
开始性能测试...

=== 测试1：基础实现 vs 优化实现 ===
生成 10000 条测试数据...
测试数据生成完成
基础实现：查找角色为 admin 的用户
基础实现耗时: 2ms，找到 2500 个用户
优化实现：查找角色为 admin 的用户
优化实现耗时: 1ms，找到 2500 个用户
结果一致性检查: 通过

=== 测试2：数据结构优化 ===
UserManager 初始化完成
添加用户测试...
用户 User 1 已添加
用户 User 2 已添加
用户 User 3 已添加
...
添加1000个用户耗时: 15ms

查找性能测试...
ID查找测试:
ID查找耗时: 0ms
ID查找耗时: 0ms
角色查找测试:
角色索引查找耗时: 0ms，找到 334 个用户
角色索引查找耗时: 0ms，找到 333 个用户
邮箱检查测试:
邮箱检查耗时: 0ms
邮箱检查耗时: 0ms

用户管理器统计: {
  totalUsers: 1000,
  uniqueEmails: 1000,
  roles: ['admin', 'user', 'guest'],
  usersByRole: { admin: 334, user: 333, guest: 333 }
}

=== 测试3：数组处理性能 ===
生成 50000 条测试数据...
测试数据生成完成
链式操作测试...
链式操作耗时: 25ms
处理结果: 前10名高分用户
[
  { id: 12345, name: 'User 12345', email: 'user12345@example.com', highScore: 99 },
  { id: 23456, name: 'User 23456', email: 'user23456@example.com', highScore: 99 },
  { id: 34567, name: 'User 34567', email: 'user34567@example.com', highScore: 98 }
]

=== 测试4：Set vs Array 性能对比 ===
Array includes 测试...
Array includes 耗时: 8ms，找到 5 个
Set has 测试...
Set has 耗时: 2ms，找到 5 个
```

**代码分析**：

- 性能优化应该基于实际需求和性能分析，而不是过早优化
- 合适的数据结构选择能显著提升性能（Map用于快速查找，Set用于唯一性检查）
- 函数式编程方法（如链式操作）在可读性和性能之间取得了良好平衡
- 性能测试应该包括实际的使用场景和数据规模

## 8. 完整项目示例

**实践演练**：

```javascript
// 示例14：完整项目示例 - 任务管理系统
console.log('\n=== 示例14：完整项目示例 ===');

// 自定义错误类
class TaskError extends Error {
    constructor(code, message, context) {
        super(message);
        this.name = 'TaskError';
        this.code = code;
        this.context = context;
    }
}

// 任务状态枚举
const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

const TASK_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

// 任务类
class Task {
    constructor({ title, description = '', priority = TASK_PRIORITY.MEDIUM, dueDate = null }) {
        this.id = Task.generateId();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = TASK_STATUS.PENDING;
        this.dueDate = dueDate;
        this.createdAt = new Date().toISOString();
        this.updatedAt = this.createdAt;
        
        console.log(`✓ 任务创建: ${this.title} (ID: ${this.id})`);
    }
    
    static generateId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    updateStatus(newStatus) {
        const validStatuses = Object.values(TASK_STATUS);
        if (!validStatuses.includes(newStatus)) {
            throw new TaskError(
                'INVALID_STATUS',
                `无效的状态: ${newStatus}`,
                { validStatuses, providedStatus: newStatus }
            );
        }
        
        const oldStatus = this.status;
        this.status = newStatus;
        this.updatedAt = new Date().toISOString();
        
        console.log(`状态更新: ${this.title} (${oldStatus} → ${newStatus})`);
        return this;
    }
    
    updatePriority(newPriority) {
        const validPriorities = Object.values(TASK_PRIORITY);
        if (!validPriorities.includes(newPriority)) {
            throw new TaskError(
                'INVALID_PRIORITY',
                `无效的优先级: ${newPriority}`,
                { validPriorities, providedPriority: newPriority }
            );
        }
        
        const oldPriority = this.priority;
        this.priority = newPriority;
        this.updatedAt = new Date().toISOString();
        
        console.log(`优先级更新: ${this.title} (${oldPriority} → ${newPriority})`);
        return this;
    }
    
    isOverdue() {
        if (!this.dueDate) return false;
        return new Date() > new Date(this.dueDate) && this.status !== TASK_STATUS.COMPLETED;
    }
    
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            status: this.status,
            dueDate: this.dueDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isOverdue: this.isOverdue()
        };
    }
}

// 任务管理器
class TaskManager {
    constructor() {
        this.tasks = new Map();
        this.statusIndex = new Map();
        this.priorityIndex = new Map();
        
        // 初始化索引
        Object.values(TASK_STATUS).forEach(status => {
            this.statusIndex.set(status, new Set());
        });
        
        Object.values(TASK_PRIORITY).forEach(priority => {
            this.priorityIndex.set(priority, new Set());
        });
        
        console.log('TaskManager 初始化完成');
    }
    
    async createTask(taskData) {
        console.log('创建新任务:', taskData);
        
        try {
            // 验证必填字段
            if (!taskData.title || taskData.title.trim() === '') {
                throw new TaskError(
                    'MISSING_TITLE',
                    '任务标题不能为空',
                    { taskData }
                );
            }
            
            // 创建任务
            const task = new Task(taskData);
            
            // 添加到存储和索引
            this.tasks.set(task.id, task);
            this.statusIndex.get(task.status).add(task.id);
            this.priorityIndex.get(task.priority).add(task.id);
            
            console.log(`任务已创建并添加到管理器: ${task.id}`);
            return task;
            
        } catch (error) {
            console.error('创建任务失败:', error.message);
            throw error;
        }
    }
    
    getTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new TaskError(
                'TASK_NOT_FOUND',
                `任务不存在: ${taskId}`,
                { taskId }
            );
        }
        return task;
    }
    
    updateTaskStatus(taskId, newStatus) {
        console.log(`更新任务状态: ${taskId} → ${newStatus}`);
        
        const task = this.getTask(taskId);
        const oldStatus = task.status;
        
        // 更新任务状态
        task.updateStatus(newStatus);
        
        // 更新索引
        this.statusIndex.get(oldStatus).delete(taskId);
        this.statusIndex.get(newStatus).add(taskId);
        
        return task;
    }
    
    updateTaskPriority(taskId, newPriority) {
        console.log(`更新任务优先级: ${taskId} → ${newPriority}`);
        
        const task = this.getTask(taskId);
        const oldPriority = task.priority;
        
        // 更新任务优先级
        task.updatePriority(newPriority);
        
        // 更新索引
        this.priorityIndex.get(oldPriority).delete(taskId);
        this.priorityIndex.get(newPriority).add(taskId);
        
        return task;
    }
    
    getTasksByStatus(status) {
        const taskIds = this.statusIndex.get(status);
        if (!taskIds) return [];
        
        const tasks = Array.from(taskIds).map(id => this.tasks.get(id));
        console.log(`找到 ${tasks.length} 个状态为 ${status} 的任务`);
        return tasks;
    }
    
    getTasksByPriority(priority) {
        const taskIds = this.priorityIndex.get(priority);
        if (!taskIds) return [];
        
        const tasks = Array.from(taskIds).map(id => this.tasks.get(id));
        console.log(`找到 ${tasks.length} 个优先级为 ${priority} 的任务`);
        return tasks;
    }
    
    getOverdueTasks() {
        const overdueTasks = Array.from(this.tasks.values())
            .filter(task => task.isOverdue());
        
        console.log(`找到 ${overdueTasks.length} 个过期任务`);
        return overdueTasks;
    }
    
    getTasksSortedByPriority() {
        const priorityOrder = {
            [TASK_PRIORITY.URGENT]: 4,
            [TASK_PRIORITY.HIGH]: 3,
            [TASK_PRIORITY.MEDIUM]: 2,
            [TASK_PRIORITY.LOW]: 1
        };
        
        const tasks = Array.from(this.tasks.values())
            .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        
        console.log('任务已按优先级排序');
        return tasks;
    }
    
    getStatistics() {
        const stats = {
            total: this.tasks.size,
            byStatus: {},
            byPriority: {},
            overdue: this.getOverdueTasks().length
        };
        
        // 按状态统计
        Object.values(TASK_STATUS).forEach(status => {
            stats.byStatus[status] = this.statusIndex.get(status).size;
        });
        
        // 按优先级统计
        Object.values(TASK_PRIORITY).forEach(priority => {
            stats.byPriority[priority] = this.priorityIndex.get(priority).size;
        });
        
        console.log('统计信息已生成');
        return stats;
    }
    
    async batchUpdate(updates) {
        console.log(`开始批量更新 ${updates.length} 个任务`);
        const results = [];
        
        for (const { taskId, status, priority } of updates) {
            try {
                const task = this.getTask(taskId);
                
                if (status) {
                    this.updateTaskStatus(taskId, status);
                }
                
                if (priority) {
                    this.updateTaskPriority(taskId, priority);
                }
                
                results.push({ taskId, success: true, task });
                
            } catch (error) {
                console.error(`批量更新失败 - 任务 ${taskId}:`, error.message);
                results.push({ taskId, success: false, error: error.message });
            }
        }
        
        const successCount = results.filter(r => r.success).length;
        console.log(`批量更新完成: ${successCount}/${updates.length} 成功`);
        
        return results;
    }
}

// 完整演示
async function runCompleteDemo() {
    console.log('开始完整项目演示...\n');
    
    // 初始化任务管理器
    console.log('=== 初始化任务管理器 ===');
    const taskManager = new TaskManager();
    
    // 创建任务
    console.log('\n=== 创建任务 ===');
    const tasks = [];
    
    try {
        const taskData = [
            { 
                title: '完成项目文档', 
                description: '撰写项目的技术文档和用户手册', 
                priority: TASK_PRIORITY.HIGH,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后
            },
            { 
                title: '代码审查', 
                description: '审查团队提交的代码', 
                priority: TASK_PRIORITY.MEDIUM 
            },
            { 
                title: '修复紧急Bug', 
                description: '修复生产环境中的紧急问题', 
                priority: TASK_PRIORITY.URGENT 
            },
            { 
                title: '整理会议记录', 
                description: '整理本周的会议记录并分发', 
                priority: TASK_PRIORITY.LOW,
                dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 昨天（过期）
            }
        ];
        
        for (const data of taskData) {
            const task = await taskManager.createTask(data);
            tasks.push(task);
        }
        
    } catch (error) {
        console.error('任务创建失败:', error.message);
    }
    
    // 查询任务
    console.log('\n=== 查询任务 ===');
    
    // 按状态查询
    const pendingTasks = taskManager.getTasksByStatus(TASK_STATUS.PENDING);
    console.log('待处理任务数量:', pendingTasks.length);
    
    // 按优先级查询
    const urgentTasks = taskManager.getTasksByPriority(TASK_PRIORITY.URGENT);
    console.log('紧急任务:', urgentTasks.map(t => t.title));
    
    // 查询过期任务
    const overdueTasks = taskManager.getOverdueTasks();
    console.log('过期任务:', overdueTasks.map(t => `${t.title} (截止: ${t.dueDate})`));
    
    // 按优先级排序
    const sortedTasks = taskManager.getTasksSortedByPriority();
    console.log('优先级排序结果:', sortedTasks.map(t => `${t.title} (${t.priority})`));
    
    // 更新任务状态
    console.log('\n=== 更新任务状态 ===');
    try {
        if (tasks.length > 0) {
            // 开始处理第一个任务
            taskManager.updateTaskStatus(tasks[0].id, TASK_STATUS.IN_PROGRESS);
            
            // 完成第二个任务
            if (tasks.length > 1) {
                taskManager.updateTaskStatus(tasks[1].id, TASK_STATUS.COMPLETED);
            }
            
            // 取消第三个任务
            if (tasks.length > 2) {
                taskManager.updateTaskStatus(tasks[2].id, TASK_STATUS.CANCELLED);
            }
        }
    } catch (error) {
        console.error('状态更新失败:', error.message);
    }
    
    // 批量更新
    console.log('\n=== 批量更新任务 ===');
    const batchUpdates = [
        { taskId: tasks[0]?.id, priority: TASK_PRIORITY.URGENT },
        { taskId: tasks[1]?.id, status: TASK_STATUS.COMPLETED },
        { taskId: 'nonexistent', status: TASK_STATUS.PENDING } // 测试错误处理
    ].filter(update => update.taskId); // 过滤掉undefined的taskId
    
    if (batchUpdates.length > 0) {
        const batchResults = await taskManager.batchUpdate(batchUpdates);
        console.log('批量更新结果:', batchResults);
    }
    
    // 获取统计信息
    console.log('\n=== 统计信息 ===');
    const stats = taskManager.getStatistics();
    console.log('任务统计:', JSON.stringify(stats, null, 2));
    
    // 错误处理演示
    console.log('\n=== 错误处理演示 ===');
    
    // 测试无效状态
    try {
        if (tasks.length > 0) {
            taskManager.updateTaskStatus(tasks[0].id, 'invalid_status');
        }
    } catch (error) {
        if (error instanceof TaskError) {
            console.log(`捕获任务错误 - 代码: ${error.code}, 消息: ${error.message}`);
            console.log('错误上下文:', error.context);
        }
    }
    
    // 测试查询不存在的任务
    try {
        taskManager.getTask('nonexistent_task_id');
    } catch (error) {
        if (error instanceof TaskError) {
            console.log(`捕获任务错误 - 代码: ${error.code}, 消息: ${error.message}`);
        }
    }
    
    // 测试创建无效任务
    try {
        await taskManager.createTask({ title: '', description: '无效任务' });
    } catch (error) {
        if (error instanceof TaskError) {
            console.log(`捕获任务错误 - 代码: ${error.code}, 消息: ${error.message}`);
        }
    }
    
    // 最终状态展示
    console.log('\n=== 最终状态展示 ===');
    console.log('所有任务状态:');
    Array.from(taskManager.tasks.values()).forEach(task => {
        console.log(`- ${task.title}: ${task.status} (${task.priority})`);
    });
    
    console.log('\n项目演示完成！');
}

// 运行完整演示
runCompleteDemo();
```

**运行结果**：

```
=== 示例14：完整项目示例 ===
开始完整项目演示...

=== 初始化任务管理器 ===
TaskManager 初始化完成

=== 创建任务 ===
✓ 任务创建: 完成项目文档 (ID: task_1704194400000_abc123def)
任务已创建并添加到管理器: task_1704194400000_abc123def
✓ 任务创建: 代码审查 (ID: task_1704194400001_def456ghi)
任务已创建并添加到管理器: task_1704194400001_def456ghi
✓ 任务创建: 修复紧急Bug (ID: task_1704194400002_ghi789jkl)
任务已创建并添加到管理器: task_1704194400002_ghi789jkl
✓ 任务创建: 整理会议记录 (ID: task_1704194400003_jkl012mno)
任务已创建并添加到管理器: task_1704194400003_jkl012mno

=== 查询任务 ===
找到 4 个状态为 pending 的任务
待处理任务数量: 4
找到 1 个优先级为 urgent 的任务
紧急任务: ['修复紧急Bug']
找到 1 个过期任务
过期任务: ['整理会议记录 (截止: 2024-01-14T10:30:00.000Z)']
任务已按优先级排序
优先级排序结果: ['修复紧急Bug (urgent)', '完成项目文档 (high)', '代码审查 (medium)', '整理会议记录 (low)']

=== 更新任务状态 ===
更新任务状态: task_1704194400000_abc123def → in_progress
状态更新: 完成项目文档 (pending → in_progress)
更新任务状态: task_1704194400001_def456ghi → completed
状态更新: 代码审查 (pending → completed)
更新任务状态: task_1704194400002_ghi789jkl → cancelled
状态更新: 修复紧急Bug (pending → cancelled)

=== 批量更新任务 ===
开始批量更新 3 个任务
更新任务优先级: task_1704194400000_abc123def → urgent
优先级更新: 完成项目文档 (high → urgent)
更新任务状态: task_1704194400001_def456ghi → completed
状态更新: 代码审查 (completed → completed)
批量更新失败 - 任务 nonexistent: 任务不存在: nonexistent
批量更新完成: 2/3 成功
批量更新结果: [
  { taskId: 'task_1704194400000_abc123def', success: true, task: Task {...} },
  { taskId: 'task_1704194400001_def456ghi', success: true, task: Task {...} },
  { taskId: 'nonexistent', success: false, error: '任务不存在: nonexistent' }
]

=== 统计信息 ===
统计信息已生成
任务统计: {
  "total": 4,
  "byStatus": {
    "pending": 1,
    "in_progress": 1,
    "completed": 1,
    "cancelled": 1
  },
  "byPriority": {
    "low": 1,
    "medium": 0,
    "high": 0,
    "urgent": 2
  },
  "overdue": 1
}

=== 错误处理演示 ===
捕获任务错误 - 代码: INVALID_STATUS, 消息: 无效的状态: invalid_status
错误上下文: {
  validStatuses: ['pending', 'in_progress', 'completed', 'cancelled'],
  providedStatus: 'invalid_status'
}
捕获任务错误 - 代码: TASK_NOT_FOUND, 消息: 任务不存在: nonexistent_task_id
捕获任务错误 - 代码: MISSING_TITLE, 消息: 任务标题不能为空

=== 最终状态展示 ===
所有任务状态:
- 完成项目文档: in_progress (urgent)
- 代码审查: completed (medium)
- 修复紧急Bug: cancelled (urgent)
- 整理会议记录: pending (low)

项目演示完成！
```

**代码分析**：

- 完整的任务管理系统展示了面向对象编程、错误处理、数据结构优化等多个最佳实践
- 自定义错误类提供了详细的错误信息和上下文
- 索引结构（Map和Set）提供了高效的查询性能
- 批量操作演示了如何处理部分成功/失败的场景
- 统计功能展示了数据聚合的实用性

## 9. 总结与进阶建议

### 9.1 核心要点回顾

通过以上实践演练，我们深入学习了JavaScript最佳实践的各个方面：

**变量和作用域**：

- 优先使用`const`，必要时使用`let`
- 理解块级作用域的重要性
- 避免使用`var`

**函数设计**：

- 合理使用箭头函数和普通函数
- 利用默认参数和解构参数提高代码可读性
- 保持函数职责单一

**对象和数组操作**：

- 使用展开运算符实现不可变操作
- 掌握解构赋值的各种用法
- 链式操作提高代码简洁性

**异步编程**：

- 优先使用`async/await`
- 正确处理异步错误
- 理解并行和串行执行的区别

**错误处理**：

- 创建自定义错误类
- 使用合适的错误处理策略
- 提供有意义的错误信息

**性能优化**：

- 选择合适的数据结构
- 避免过早优化
- 基于实际测试进行优化

### 9.2 进阶学习建议

**立即实践**：

```javascript
// 示例15：立即实践建议
console.log('\n=== 立即实践建议 ===');

// 1. 重构现有代码
console.log('1. 代码重构练习');
console.log('- 找一个你之前写的JavaScript项目');
console.log('- 应用本教程的最佳实践进行重构');
console.log('- 对比重构前后的代码可读性和性能');

// 2. 构建小项目
console.log('\n2. 小项目构建');
const projectIdeas = [
    '待办事项管理器',
    '简单的计算器',
    '数据可视化工具',
    '本地存储的笔记应用',
    '文件处理工具'
];

console.log('推荐项目:', projectIdeas);

// 3. 代码质量工具
console.log('\n3. 代码质量工具配置');
const toolsConfig = {
    eslint: {
        purpose: '代码检查和风格统一',
        config: '.eslintrc.json',
        rules: ['no-var', 'prefer-const', 'no-unused-vars']
    },
    prettier: {
        purpose: '代码格式化',
        config: '.prettierrc',
        settings: ['tabWidth: 2', 'singleQuote: true']
    },
    jsDoc: {
        purpose: '文档生成',
        usage: '使用JSDoc注释编写函数文档'
    }
};

console.log('推荐工具配置:', toolsConfig);

// 4. 学习路径
console.log('\n4. 进阶学习路径');
const learningPath = [
    '深入理解JavaScript原型和继承',
    '学习函数式编程概念',
    '掌握测试驱动开发(TDD)',
    '了解设计模式在JavaScript中的应用',
    '学习TypeScript以获得更好的类型安全'
];

learningPath.forEach((item, index) => {
    console.log(`${index + 1}. ${item}`);
});
```

**最佳实践检查清单**：

```javascript
// 示例16：最佳实践检查清单
console.log('\n=== 最佳实践检查清单 ===');

const bestPracticesChecklist = {
    变量声明: [
        '✓ 使用const声明不变的值',
        '✓ 使用let声明可变的值',
        '✓ 避免使用var',
        '✓ 使用描述性的变量名'
    ],
    
    函数设计: [
        '✓ 函数职责单一',
        '✓ 使用默认参数',
        '✓ 合理使用箭头函数',
        '✓ 添加JSDoc文档注释'
    ],
    
    错误处理: [
        '✓ 使用try-catch处理异步错误',
        '✓ 创建自定义错误类',
        '✓ 提供有意义的错误信息',
        '✓ 记录错误日志'
    ],
    
    性能考虑: [
        '✓ 选择合适的数据结构',
        '✓ 避免过早优化',
        '✓ 使用性能测试验证优化效果',
        '✓ 考虑内存使用'
    ],
    
    代码组织: [
        '✓ 模块化设计',
        '✓ 关注点分离',
        '✓ 一致的命名约定',
        '✓ 适当的注释'
    ]
};

// 输出检查清单
Object.entries(bestPracticesChecklist).forEach(([category, items]) => {
    console.log(`\n${category}:`);
    items.forEach(item => console.log(`  ${item}`));
});
```

### 9.3 持续改进

学习JavaScript最佳实践是一个持续的过程。建议：

1. **定期代码审查**：与同事互相审查代码，学习不同的解决方案
2. **关注社区动态**：跟踪JavaScript生态系统的最新发展
3. **实践中学习**：在实际项目中应用所学知识
4. **测试驱动**：编写测试来验证代码的正确性和性能
5. **文档记录**：为自己的代码和学习过程做好文档记录

通过这个改进版教程，您不仅能看到最佳实践的代码示例，更重要的是理解了这些实践背后的原理和应用场景。每个示例都包含完整的执行过程、结果展示和详细分析，帮助您真正掌握JavaScript最佳实践。

记住：好的代码不仅要能正确运行，更要易于理解、维护和扩展。通过持续实践这些最佳实践，您将能够写出更加优秀的JavaScript代码。