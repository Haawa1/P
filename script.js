// Global Variables
let currentUser = null;
let userBalance = 0;
let chargingApps = [];
let currentEditingApp = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    setupEventListeners();
    checkAuthState();
});

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login/Register Forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('show-register').addEventListener('click', showRegisterPage);
    document.getElementById('show-login').addEventListener('click', showLoginPage);
    
    // Dashboard
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Navigation
    setupNavigationListeners();
    
    // Forms
    setupFormListeners();
    
    // Modals
    setupModalListeners();
}

// Navigation Listeners
function setupNavigationListeners() {
    // Section cards navigation
    document.querySelectorAll('.section-card[data-page]').forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn[data-back]').forEach(btn => {
        btn.addEventListener('click', function() {
            const backPage = this.getAttribute('data-back');
            navigateToPage(backPage);
        });
    });
}

// Form Listeners
function setupFormListeners() {
    // Transfer form
    document.getElementById('transfer-form').addEventListener('submit', handleMoneyTransfer);
    document.getElementById('transfer-amount').addEventListener('input', updateTransferSummary);
    
    // Withdrawal form
    document.getElementById('withdrawal-form').addEventListener('submit', handleMoneyWithdrawal);
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', selectPaymentMethod);
    });
    
    // Charging form
    document.getElementById('charging-form').addEventListener('submit', handleAppCharging);
    
    // Admin forms
    document.getElementById('add-app-btn').addEventListener('click', showAddAppModal);
    document.getElementById('app-form').addEventListener('submit', handleAppSubmit);
}

// Modal Listeners
function setupModalListeners() {
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    });
}

// Authentication Functions
function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        userBalance = parseFloat(localStorage.getItem('userBalance') || '100.00');
        showDashboard();
    } else {
        showLoginPage();
    }
}

function handleLogin(e) {
    e.preventDefault();
    showLoading(true);
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulate authentication delay
    setTimeout(() => {
        // Check admin credentials
        if (email === 'java88449@gmail.com' && password === '221369') {
            currentUser = {
                email: email,
                name: 'المسؤول',
                isAdmin: true
            };
            userBalance = 'unlimited';
        } else {
            // For demo purposes, accept any other credentials
            currentUser = {
                email: email,
                name: email.split('@')[0],
                isAdmin: false
            };
            userBalance = parseFloat(localStorage.getItem('userBalance_' + email) || '100.00');
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('userBalance', userBalance.toString());
        
        showLoading(false);
        showToast('تم تسجيل الدخول بنجاح!', 'success');
        showDashboard();
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    showLoading(true);
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Simulate registration delay
    setTimeout(() => {
        currentUser = {
            email: email,
            name: name,
            isAdmin: false
        };
        userBalance = 100.00; // Starting balance
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('userBalance', userBalance.toString());
        localStorage.setItem('userBalance_' + email, userBalance.toString());
        
        showLoading(false);
        showToast('تم إنشاء الحساب بنجاح!', 'success');
        showDashboard();
    }, 1000);
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userBalance');
    currentUser = null;
    userBalance = 0;
    showLoginPage();
    showToast('تم تسجيل الخروج بنجاح!', 'success');
}

// Page Navigation
function navigateToPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load page-specific content
        switch(pageName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'design-center':
                loadDesignCenter();
                break;
            case 'money-transfer':
                loadMoneyTransfer();
                break;
            case 'money-withdrawal':
                loadMoneyWithdrawal();
                break;
            case 'charging-center':
                loadChargingCenter();
                break;
            case 'admin-panel':
                if (currentUser && currentUser.isAdmin) {
                    loadAdminPanel();
                } else {
                    showToast('غير مصرح لك بالوصول لهذه الصفحة', 'error');
                    navigateToPage('dashboard');
                }
                break;
        }
    }
}

function showLoginPage() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('login-page').classList.add('active');
}

function showRegisterPage() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('register-page').classList.add('active');
}

function showDashboard() {
    navigateToPage('dashboard');
}

// Page Loading Functions
function loadDashboard() {
    // Update user balance display
    const balanceElement = document.getElementById('user-balance');
    if (typeof userBalance === 'string') {
        balanceElement.textContent = '∞';
    } else {
        balanceElement.textContent = '$' + userBalance.toFixed(2);
    }
    
    // Show admin access if user is admin
    const adminAccess = document.getElementById('admin-access');
    if (currentUser && currentUser.isAdmin) {
        adminAccess.classList.remove('hidden');
    } else {
        adminAccess.classList.add('hidden');
    }
}

function loadDesignCenter() {
    const categoriesContainer = document.getElementById('design-categories');
    const categories = [
        { id: 'banners', title: 'مركز البنرات', icon: 'image' },
        { id: 'celebrity-gifts', title: 'هدايا المشاهير', icon: 'gift' },
        { id: 'svga-gifts', title: 'هدايا SVGA', icon: 'gem' },
        { id: 'svga-frames', title: 'إطارات SVGA', icon: 'square' },
        { id: 'room-backgrounds', title: 'خلفيات روم', icon: 'wallpaper' },
        { id: 'promo-videos', title: 'فيديو ترويجي', icon: 'video' },
        { id: 'shipping-schedule', title: 'جدول الشحن', icon: 'table' },
        { id: 'animated-images', title: 'صور متحركة', icon: 'film' }
    ];
    
    categoriesContainer.innerHTML = categories.map(category => `
        <div class="category-card" onclick="showToast('قريباً سيتم إضافة محتوى هذا القسم', 'info')">
            <div class="category-icon">
                <i data-lucide="${category.icon}"></i>
            </div>
            <h4>${category.title}</h4>
        </div>
    `).join('');
    
    initializeLucideIcons();
}

function loadMoneyTransfer() {
    // Update available balance
    const balanceElement = document.getElementById('user-balance');
    if (typeof userBalance === 'string') {
        balanceElement.textContent = '∞';
    } else {
        balanceElement.textContent = '$' + userBalance.toFixed(2);
    }
}

function loadMoneyWithdrawal() {
    // Update available balance
    const balanceElement = document.getElementById('available-balance');
    if (typeof userBalance === 'string') {
        balanceElement.textContent = 'الرصيد المتاح: ∞';
    } else {
        balanceElement.textContent = 'الرصيد المتاح: $' + userBalance.toFixed(2);
    }
}

function loadChargingCenter() {
    const appsContainer = document.getElementById('charging-apps');
    
    // Load apps from localStorage or use default
    chargingApps = JSON.parse(localStorage.getItem('chargingApps') || '[]');
    
    if (chargingApps.length === 0) {
        // Default apps for demo
        chargingApps = [
            {
                id: '1',
                name: 'PUBG Mobile',
                image: 'https://via.placeholder.com/100x100/4CAF50/white?text=PUBG',
                diamondAmount: 1000,
                price: 9.99
            },
            {
                id: '2',
                name: 'Free Fire',
                image: 'https://via.placeholder.com/100x100/FF5722/white?text=FF',
                diamondAmount: 500,
                price: 4.99
            }
        ];
        localStorage.setItem('chargingApps', JSON.stringify(chargingApps));
    }
    
    appsContainer.innerHTML = chargingApps.map(app => `
        <div class="app-card" onclick="showChargingModal('${app.id}')">
            <img src="${app.image}" alt="${app.name}" class="app-image">
            <h4>${app.name}</h4>
            <div class="app-details">
                <div class="diamond-info">
                    <i data-lucide="gem"></i>
                    <span>${app.diamondAmount} ألماس</span>
                </div>
                <div class="price-info">$${app.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
    
    initializeLucideIcons();
}

function loadAdminPanel() {
    const adminAppsContainer = document.getElementById('admin-apps');
    
    adminAppsContainer.innerHTML = chargingApps.map(app => `
        <div class="admin-card">
            <div class="admin-app-header">
                <img src="${app.image}" alt="${app.name}" class="app-image">
                <div class="admin-app-info">
                    <h4>${app.name}</h4>
                    <p>${app.diamondAmount} ألماس</p>
                </div>
            </div>
            <div class="admin-app-price">$${app.price.toFixed(2)}</div>
            <div class="admin-actions">
                <button class="edit-btn" onclick="editApp('${app.id}')">
                    <i data-lucide="edit"></i>
                    تعديل
                </button>
                <button class="delete-btn" onclick="deleteApp('${app.id}')">
                    <i data-lucide="trash-2"></i>
                    حذف
                </button>
            </div>
        </div>
    `).join('');
    
    initializeLucideIcons();
}

// Form Handlers
function handleMoneyTransfer(e) {
    e.preventDefault();
    
    const recipientEmail = document.getElementById('recipient-email').value;
    const recipientName = document.getElementById('recipient-name').value;
    const purpose = document.getElementById('transfer-purpose').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    
    if (recipientEmail === currentUser.email) {
        showToast('لا يمكنك تحويل الأموال لنفسك', 'error');
        return;
    }
    
    const fee = amount * 0.1;
    const totalAmount = amount + fee;
    
    if (typeof userBalance === 'number' && userBalance < totalAmount) {
        showToast(`رصيدك غير كافٍ. المبلغ المطلوب: $${totalAmount.toFixed(2)}`, 'error');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        // Deduct amount from user balance
        if (typeof userBalance === 'number') {
            userBalance -= totalAmount;
            localStorage.setItem('userBalance', userBalance.toString());
        }
        
        // Save transfer record
        const transfers = JSON.parse(localStorage.getItem('transfers') || '[]');
        transfers.push({
            id: Date.now(),
            senderEmail: currentUser.email,
            recipientEmail: recipientEmail,
            recipientName: recipientName,
            amount: amount,
            fee: fee,
            totalAmount: totalAmount,
            purpose: purpose,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('transfers', JSON.stringify(transfers));
        
        showLoading(false);
        showToast(`تم تحويل $${amount.toFixed(2)} بنجاح إلى ${recipientName}`, 'success');
        
        // Reset form
        document.getElementById('transfer-form').reset();
        document.getElementById('transfer-summary').classList.add('hidden');
        
        // Update balance display
        loadDashboard();
    }, 1500);
}

function handleMoneyWithdrawal(e) {
    e.preventDefault();
    
    const name = document.getElementById('withdrawal-name').value;
    const email = document.getElementById('withdrawal-email').value;
    const whatsapp = document.getElementById('withdrawal-whatsapp').value;
    const amount = parseFloat(document.getElementById('withdrawal-amount').value);
    const country = document.getElementById('withdrawal-country').value;
    
    const selectedPaymentMethod = document.querySelector('.payment-method.active');
    if (!selectedPaymentMethod) {
        showToast('يرجى اختيار طريقة الدفع', 'error');
        return;
    }
    
    const paymentMethod = selectedPaymentMethod.getAttribute('data-method');
    let paymentDetails = '';
    
    if (paymentMethod === 'visa') {
        paymentDetails = document.getElementById('visa-id').value;
        if (!paymentDetails) {
            showToast('يرجى إدخال ID الفيزا', 'error');
            return;
        }
    } else if (paymentMethod === 'wallet') {
        paymentDetails = document.getElementById('wallet-number').value;
        if (!paymentDetails) {
            showToast('يرجى إدخال رقم المحفظة الإلكترونية', 'error');
            return;
        }
    }
    
    if (typeof userBalance === 'number' && userBalance < amount) {
        showToast(`رصيدك غير كافٍ. الرصيد المتاح: $${userBalance.toFixed(2)}`, 'error');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        // Deduct amount from user balance
        if (typeof userBalance === 'number') {
            userBalance -= amount;
            localStorage.setItem('userBalance', userBalance.toString());
        }
        
        // Save withdrawal record
        const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
        withdrawals.push({
            id: Date.now(),
            userEmail: currentUser.email,
            name: name,
            email: email,
            whatsapp: whatsapp,
            amount: amount,
            paymentMethod: paymentMethod,
            paymentDetails: paymentDetails,
            country: country,
            status: 'pending',
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
        
        showLoading(false);
        showToast('تم تقديم طلب السحب بنجاح!', 'success');
        
        setTimeout(() => {
            showToast('سيتم تحويل الأموال إلى حسابك البنكي من ساعة واحدة حتى 72 ساعة. يرجى تفقد حسابك.', 'info');
        }, 2000);
        
        // Reset form
        document.getElementById('withdrawal-form').reset();
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('active');
        });
        document.getElementById('wallet-number-group').classList.add('hidden');
        document.getElementById('visa-id-group').classList.add('hidden');
        
        // Update balance display
        loadDashboard();
    }, 1500);
}

function handleAppCharging(e) {
    e.preventDefault();
    
    const appId = document.getElementById('charging-modal').getAttribute('data-app-id');
    const app = chargingApps.find(a => a.id === appId);
    const userGameId = document.getElementById('charging-user-id').value;
    
    if (!app || !userGameId.trim()) {
        showToast('يرجى إدخال ID المستخدم', 'error');
        return;
    }
    
    if (typeof userBalance === 'number' && userBalance < app.price) {
        showToast(`رصيدك غير كافٍ. المبلغ المطلوب: $${app.price.toFixed(2)}`, 'error');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        // Deduct amount from user balance
        if (typeof userBalance === 'number') {
            userBalance -= app.price;
            localStorage.setItem('userBalance', userBalance.toString());
        }
        
        // Save charging record
        const chargingRequests = JSON.parse(localStorage.getItem('chargingRequests') || '[]');
        chargingRequests.push({
            id: Date.now(),
            userEmail: currentUser.email,
            appName: app.name,
            userGameId: userGameId.trim(),
            diamondAmount: app.diamondAmount,
            price: app.price,
            status: 'pending',
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('chargingRequests', JSON.stringify(chargingRequests));
        
        showLoading(false);
        showToast(`تم طلب شحن ${app.diamondAmount} ألماس في ${app.name} بنجاح!`, 'success');
        
        closeModal();
        
        // Update balance display
        loadDashboard();
    }, 1500);
}

// Admin Functions
function showAddAppModal() {
    currentEditingApp = null;
    document.getElementById('app-modal-title').textContent = 'إضافة تطبيق جديد';
    document.getElementById('app-submit-text').textContent = 'إضافة التطبيق';
    document.getElementById('app-form').reset();
    document.getElementById('app-modal').classList.remove('hidden');
}

function editApp(appId) {
    const app = chargingApps.find(a => a.id === appId);
    if (!app) return;
    
    currentEditingApp = appId;
    document.getElementById('app-modal-title').textContent = 'تعديل التطبيق';
    document.getElementById('app-submit-text').textContent = 'حفظ التغييرات';
    
    document.getElementById('app-name').value = app.name;
    document.getElementById('app-image').value = app.image;
    document.getElementById('app-diamonds').value = app.diamondAmount;
    document.getElementById('app-price').value = app.price;
    
    document.getElementById('app-modal').classList.remove('hidden');
}

function deleteApp(appId) {
    const app = chargingApps.find(a => a.id === appId);
    if (!app) return;
    
    if (confirm(`هل أنت متأكد من حذف تطبيق "${app.name}"؟`)) {
        chargingApps = chargingApps.filter(a => a.id !== appId);
        localStorage.setItem('chargingApps', JSON.stringify(chargingApps));
        loadAdminPanel();
        showToast('تم حذف التطبيق بنجاح!', 'success');
    }
}

function handleAppSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('app-name').value;
    const image = document.getElementById('app-image').value;
    const diamonds = parseInt(document.getElementById('app-diamonds').value);
    const price = parseFloat(document.getElementById('app-price').value);
    
    if (currentEditingApp) {
        // Edit existing app
        const appIndex = chargingApps.findIndex(a => a.id === currentEditingApp);
        if (appIndex !== -1) {
            chargingApps[appIndex] = {
                ...chargingApps[appIndex],
                name: name,
                image: image,
                diamondAmount: diamonds,
                price: price
            };
            showToast('تم تحديث التطبيق بنجاح!', 'success');
        }
    } else {
        // Add new app
        const newApp = {
            id: Date.now().toString(),
            name: name,
            image: image,
            diamondAmount: diamonds,
            price: price
        };
        chargingApps.push(newApp);
        showToast('تم إضافة التطبيق بنجاح!', 'success');
    }
    
    localStorage.setItem('chargingApps', JSON.stringify(chargingApps));
    closeModal();
    loadAdminPanel();
}

// Helper Functions
function updateTransferSummary() {
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    const summaryDiv = document.getElementById('transfer-summary');
    
    if (amount && amount > 0) {
        const fee = amount * 0.1;
        const total = amount + fee;
        
        document.getElementById('base-amount').textContent = '$' + amount.toFixed(2);
        document.getElementById('transfer-fee').textContent = '$' + fee.toFixed(2);
        document.getElementById('total-amount').textContent = '$' + total.toFixed(2);
        
        summaryDiv.classList.remove('hidden');
    } else {
        summaryDiv.classList.add('hidden');
    }
}

function selectPaymentMethod(e) {
    // Remove active class from all methods
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    // Add active class to clicked method
    e.currentTarget.classList.add('active');
    
    const method = e.currentTarget.getAttribute('data-method');
    
    // Show/hide relevant input fields
    if (method === 'visa') {
        document.getElementById('visa-id-group').classList.remove('hidden');
        document.getElementById('wallet-number-group').classList.add('hidden');
        document.getElementById('visa-id').required = true;
        document.getElementById('wallet-number').required = false;
    } else if (method === 'wallet') {
        document.getElementById('wallet-number-group').classList.remove('hidden');
        document.getElementById('visa-id-group').classList.add('hidden');
        document.getElementById('wallet-number').required = true;
        document.getElementById('visa-id').required = false;
    }
}

function showChargingModal(appId) {
    const app = chargingApps.find(a => a.id === appId);
    if (!app) return;
    
    document.getElementById('charging-modal').setAttribute('data-app-id', appId);
    document.getElementById('charging-app-name').textContent = 'شحن ' + app.name;
    document.getElementById('charging-app-image').src = app.image;
    document.getElementById('charging-diamond-amount').textContent = app.diamondAmount;
    document.getElementById('charging-price').textContent = '$' + app.price.toFixed(2);
    document.getElementById('charging-id-label').textContent = 'ID المستخدم في ' + app.name + ' *';
    document.getElementById('charging-user-id').placeholder = 'أدخل ID المستخدم في ' + app.name;
    document.getElementById('charging-user-id').value = '';
    
    document.getElementById('charging-modal').classList.remove('hidden');
    initializeLucideIcons();
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    
    // Remove existing type classes
    toast.classList.remove('error', 'success', 'info');
    
    // Add new type class
    if (type === 'error') {
        toast.classList.add('error');
    } else if (type === 'success') {
        toast.classList.add('success');
    }
    
    // Show toast
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 4000);
}

