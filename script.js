// ========================================
// ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ========================================

let currentLanguage = 'ru';

// Инициализация языка
function initLanguage() {
    const savedLang = localStorage.getItem('language') || 'ru';
    switchLanguage(savedLang);
}

// Переключение языка
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Обновляем активную кнопку языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем все элементы с переводами
    document.querySelectorAll('[data-lang-ru]').forEach(element => {
        const translation = element.dataset[`lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`];
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Обновляем HTML lang атрибут
    document.documentElement.lang = lang;
}

// ========================================
// НАВИГАЦИЯ
// ========================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Плавная прокрутка к секциям
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 150; // Учитываем высоту навигации
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Обновляем активную ссылку
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Подсветка активной секции при прокрутке
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// ФИЛЬТРАЦИЯ КАРТОЧЕК
// ========================================

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Фильтруем карточки
            cards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('filtered-out');
                    card.style.animation = 'fadeIn 0.6s ease-out';
                } else {
                    card.classList.add('filtered-out');
                }
            });
        });
    });
}

// ========================================
// КНОПКИ СКАЧИВАНИЯ
// ========================================

function initDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = button.closest('.card, .presentation-card');
            const title = card ? card.querySelector('.card-title, .presentation-title').textContent : 'Документ';
            
            // Показываем уведомление
            showNotification(`Подготовка к загрузке: ${title}`);
            
            // Здесь можно добавить реальную логику скачивания файлов
            // Например, fetch запрос к API для получения файла
        });
    });
}

// ========================================
// КНОПКИ "ПОДРОБНЕЕ"
// ========================================

function initDetailsButtons() {
    const detailButtons = document.querySelectorAll('.btn-outline');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = button.closest('.recommendation-card');
            const title = card ? card.querySelector('.recommendation-title').textContent : '';
            
            // Показываем модальное окно с подробной информацией
            showModal(title, card);
        });
    });
}

// ========================================
// УВЕДОМЛЕНИЯ
// ========================================

function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    // Добавляем стили для уведомления
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.dataset.notification = 'true';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// МОДАЛЬНОЕ ОКНО
// ========================================

function showModal(title, card) {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const recommendationList = card.querySelector('.recommendation-list');
    const items = Array.from(recommendationList.querySelectorAll('li'))
        .map(li => `<li>${li.textContent}</li>`)
        .join('');
    
    const modalContent = {
        ru: {
            close: 'Закрыть',
            details: 'Подробная информация',
            content: 'Здесь будет представлена расширенная информация по данной теме. В полной версии проекта здесь могут быть детальные рекомендации, методические материалы, ссылки на дополнительные ресурсы и практические советы для родителей.'
        },
        kz: {
            close: 'Жабу',
            details: 'Толық ақпарат',
            content: 'Мұнда осы тақырып бойынша кеңейтілген ақпарат берілетін болады. Жобаның толық нұсқасында мұнда егжей-тегжейлі ұсыныстар, әдістемелік материалдар, қосымша ресурстарға сілтемелер және ата-аналарға арналған практикалық кеңестер болуы мүмкін.'
        },
        en: {
            close: 'Close',
            details: 'Detailed Information',
            content: 'Extended information on this topic will be presented here. In the full version of the project, there may be detailed recommendations, methodological materials, links to additional resources and practical advice for parents.'
        }
    };
    
    const lang = currentLanguage;
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <h4>${modalContent[lang].details}</h4>
                <ul class="modal-list">${items}</ul>
                <p>${modalContent[lang].content}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-primary close-modal">${modalContent[lang].close}</button>
            </div>
        </div>
    `;
    
    // Добавляем стили для модального окна
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
            animation: slideUp 0.3s ease-out;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
            color: #1a5490;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: #6b7280;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .modal-close:hover {
            background: #f3f4f6;
            color: #1f2937;
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .modal-body h4 {
            font-size: 1.2rem;
            margin-bottom: 15px;
            color: #1f2937;
        }
        
        .modal-body p {
            color: #4b5563;
            line-height: 1.7;
            margin-top: 20px;
        }
        
        .modal-list {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }
        
        .modal-list li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
            color: #4b5563;
        }
        
        .modal-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #00a651;
            font-weight: bold;
            font-size: 1.2rem;
        }
        
        .modal-footer {
            padding: 20px 25px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
        }
        
        .modal-footer .btn-primary {
            width: auto;
            min-width: 120px;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('style[data-modal]')) {
        style.dataset.modal = 'true';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Закрытие модального окна
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
}

// ========================================
// АНИМАЦИЯ ПРИ ПРОКРУТКЕ
// ========================================

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Наблюдаем за всеми карточками
    document.querySelectorAll('.card, .presentation-card, .recommendation-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

// ========================================
// СЧЕТЧИК СТАТИСТИКИ
// ========================================

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateCounter = (element, target) => {
        const duration = 2000;
        const steps = 60;
        const stepValue = target / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += stepValue;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, duration / steps);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
            }
        });
    }, {
        threshold: 0.5
    });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

// ========================================
// ИНИЦИАЛИЗАЦИЯ
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все компоненты
    initLanguage();
    initNavigation();
    initFilters();
    initDownloadButtons();
    initDetailsButtons();
    initScrollAnimations();
    initStatsCounter();
    
    // Обработчики переключения языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });
    
    // Плавная прокрутка вверх при загрузке
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// ОБРАБОТКА ОШИБОК
// ========================================

window.addEventListener('error', (e) => {
    console.error('Ошибка на странице:', e.message);
});

// ========================================
// ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ
// ========================================

// Debounce функция для оптимизации событий прокрутки
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Оптимизируем обработчик прокрутки
window.addEventListener('scroll', debounce(() => {
    // Дополнительная логика при прокрутке
}, 100));
