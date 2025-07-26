// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单切换
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 点击菜单项时关闭移动端菜单
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 模态框功能
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeBtns = document.querySelectorAll('.close');

    // 打开模态框
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // 关闭模态框
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // 点击模态框外部关闭
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });

    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .category-card, .tool-card, .project-card, .doc-card, .resource-category');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // 返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    document.body.appendChild(backToTopBtn);

    // 显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // 返回顶部功能
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 返回顶部按钮悬停效果
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    });

    // 工具提示
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
            transform: translateX(-50%);
        `;

        element.style.position = 'relative';
        element.appendChild(tooltip);

        element.addEventListener('mouseenter', function() {
            tooltip.style.opacity = '1';
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.marginBottom = '5px';
        });

        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
    });

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableElements = document.querySelectorAll('.feature-card, .category-card, .tool-card, .project-card, .doc-card');

            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    element.style.display = 'block';
                    element.parentElement.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
            });

            // 如果搜索框为空，显示所有元素
            if (searchTerm === '') {
                searchableElements.forEach(element => {
                    element.style.display = 'block';
                    element.parentElement.style.display = 'block';
                });
            }
        });
    }

    // 主题切换功能
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 复制到剪贴板功能
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-copy-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const text = targetElement.textContent || targetElement.value;
                navigator.clipboard.writeText(text).then(() => {
                    // 显示复制成功提示
                    const originalText = this.textContent;
                    this.textContent = '已复制!';
                    this.style.background = '#10b981';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '';
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            }
        });
    });

    // 标签页功能
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 添加活动状态
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // 进度条
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2563eb, #7c3aed);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // 打字机效果
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // 当元素进入视口时开始打字机效果
        const typewriterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    typewriterObserver.unobserve(entry.target);
                }
            });
        });

        typewriterObserver.observe(element);
    });

    // 数字计数动画
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2秒
                const step = target / (duration / 16); // 60fps
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);

                counterObserver.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 粒子背景效果（可选）
    function createParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        `;
        document.body.appendChild(canvas);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#2563eb';

            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // 如果用户偏好减少动画，则不创建粒子效果
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        createParticles();
    }

    console.log('AI教学资源整合平台已加载完成！');
});

// 项目详情展示函数
function showProjectDetails(projectType) {
    const projectData = {
        games: {
            title: '课程设计与游戏',
            description: 'AI辅助的课堂游戏设计，包括词汇游戏、语法练习等互动教学活动',
            features: [
                '互动词汇游戏设计',
                '语法练习活动模板',
                '课堂参与度提升工具',
                '游戏化学习评估'
            ],
            content: `
                <h3>核心功能</h3>
                <ul>
                    <li><strong>词汇游戏设计器</strong>：自动生成词汇配对、填空、猜词等游戏</li>
                    <li><strong>语法练习生成器</strong>：创建互动语法练习和测试</li>
                    <li><strong>课堂活动模板</strong>：提供多种课堂互动活动设计</li>
                    <li><strong>学习进度跟踪</strong>：记录学生参与度和学习效果</li>
                </ul>
                
                <h3>使用场景</h3>
                <p>适用于语言学习、数学练习、科学实验等多个学科的游戏化教学设计。</p>
                
                <h3>提示词示例</h3>
                <div class="code-block">
                    <p><strong>词汇游戏设计：</strong></p>
                    <p>"请为[主题]设计一个适合[年级]学生的词汇游戏，包含[词汇数量]个单词，游戏规则要简单易懂，能够提高学生的参与度和记忆效果。"</p>
                </div>
            `
        },
        academic: {
            title: '学术研究应用',
            description: '学术写作反馈系统、文献分析工具和研究方法指导',
            features: [
                '写作反馈系统',
                '文献分析工具',
                '研究方法指导',
                '学术规范检查'
            ],
            content: `
                <h3>核心功能</h3>
                <ul>
                    <li><strong>写作反馈系统</strong>：提供结构、语法、逻辑等多维度反馈</li>
                    <li><strong>文献分析工具</strong>：帮助分析文献质量和相关性</li>
                    <li><strong>研究方法指导</strong>：提供研究设计和方法选择建议</li>
                    <li><strong>引用格式检查</strong>：确保学术规范和引用准确性</li>
                </ul>
                
                <h3>适用对象</h3>
                <p>研究生、博士生、学者以及需要进行学术写作的教育工作者。</p>
                
                <h3>提示词示例</h3>
                <div class="code-block">
                    <p><strong>论文反馈：</strong></p>
                    <p>"请分析这篇[学科]领域的论文草稿，从论证逻辑、文献支撑、研究方法、结论有效性等方面提供详细反馈和改进建议。"</p>
                </div>
            `
        },
        sentiment: {
            title: '情感分析工具',
            description: '基于Python的文本情感分析工具，包含GUI界面和可视化功能',
            features: [
                'Python开发',
                'GUI界面',
                '数据可视化',
                '批量处理'
            ],
            content: `
                <h3>技术特性</h3>
                <ul>
                    <li><strong>多语言支持</strong>：支持中文、英文等多种语言的情感分析</li>
                    <li><strong>可视化界面</strong>：直观的图表展示分析结果</li>
                    <li><strong>批量处理</strong>：支持大量文本的批量情感分析</li>
                    <li><strong>导出功能</strong>：结果可导出为Excel、CSV等格式</li>
                </ul>
                
                <h3>应用场景</h3>
                <p>教学评价分析、学生反馈处理、社交媒体监控、市场调研等。</p>
                
                <h3>核心代码示例</h3>
                <div class="code-block">
                    <pre><code>import tkinter as tk
from textblob import TextBlob
import matplotlib.pyplot as plt

class SentimentAnalyzer:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("情感分析工具")
        self.setup_ui()
    
    def analyze_sentiment(self, text):
        blob = TextBlob(text)
        return blob.sentiment.polarity
    
    def setup_ui(self):
        # GUI界面设置
        pass</code></pre>
                </div>
            `
        }
    };
    
    const project = projectData[projectType];
    if (project) {
        showModal(project.title, project.content);
    }
}

// 手册在线阅读函数
function showHandbook() {
    const handbookContent = `
        <h2>AI教学资源整合手册</h2>
        
        <h3>第一章：平台概述</h3>
        <p>本平台是一个综合性的AI教学资源整合系统，旨在为教育工作者提供全面的AI辅助教学工具和资源。</p>
        
        <h3>第二章：核心功能</h3>
        <h4>2.1 提示词库</h4>
        <p>包含多个分类的AI提示词模板，涵盖学术写作、教学设计、课程规划等多个领域。用户可以：</p>
        <ul>
            <li>按分类浏览提示词</li>
            <li>搜索特定主题的提示词</li>
            <li>复制和自定义提示词</li>
            <li>查看使用示例和效果</li>
        </ul>
        
        <h4>2.2 AI工具链接</h4>
        <p>整合了主流的AI工具平台，包括：</p>
        <ul>
            <li>ChatGPT - 通用对话AI</li>
            <li>Claude - 高质量文本生成</li>
            <li>Gemini - Google AI助手</li>
            <li>文心一言 - 中文AI对话</li>
            <li>通义千问 - 阿里云AI</li>
        </ul>
        
        <h4>2.3 教学资源</h4>
        <p>提供丰富的教学素材，包括：</p>
        <ul>
            <li>教学图片库</li>
            <li>样本文本</li>
            <li>课程模板</li>
            <li>评估工具</li>
        </ul>
        
        <h3>第三章：使用指南</h3>
        <h4>3.1 快速开始</h4>
        <ol>
            <li>浏览平台主页，了解各功能模块</li>
            <li>访问提示词库，选择适合的提示词模板</li>
            <li>根据需要修改和定制提示词</li>
            <li>在AI工具中使用提示词</li>
            <li>下载和使用教学资源</li>
        </ol>
        
        <h4>3.2 最佳实践</h4>
        <ul>
            <li>根据具体教学目标选择合适的提示词</li>
            <li>结合多个AI工具获得最佳效果</li>
            <li>定期更新和优化提示词库</li>
            <li>收集学生反馈，持续改进教学方法</li>
        </ul>
        
        <h3>第四章：技术支持</h3>
        <p>如遇到技术问题，请参考以下解决方案：</p>
        <ul>
            <li>检查浏览器兼容性</li>
            <li>清除浏览器缓存</li>
            <li>确保网络连接稳定</li>
            <li>联系技术支持团队</li>
        </ul>
        
        <div class="handbook-footer">
            <p><strong>版本：</strong>v2.0</p>
            <p><strong>更新时间：</strong>2025.7.26</p>
            <p><strong>编制单位：</strong>SWUFE</p>
        </div>
    `;
    
    showModal('AI教学资源整合手册', handbookContent);
}

// 实用操作手册在线阅读函数
function showOperationManual() {
    const manualContent = `
        <h2>实用操作手册</h2>
        
        <h3>第一部分：平台基础操作</h3>
        
        <h4>1.1 网站导航</h4>
        <p>本平台采用响应式设计，支持桌面端和移动端访问。主要导航包括：</p>
        <ul>
            <li><strong>首页</strong>：平台概览和快速入口</li>
            <li><strong>提示词库</strong>：AI提示词模板集合</li>
            <li><strong>AI工具</strong>：主流AI平台链接</li>
            <li><strong>教学资源</strong>：图片、文档等教学素材</li>
            <li><strong>项目案例</strong>：实际应用案例展示</li>
            <li><strong>文档</strong>：使用指南和技术文档</li>
        </ul>
        
        <h4>1.2 搜索功能使用</h4>
        <ol>
            <li>在提示词库页面，使用顶部搜索框输入关键词</li>
            <li>支持模糊搜索，会匹配标题、描述和内容</li>
            <li>使用分类标签快速筛选特定类型的提示词</li>
            <li>点击"重置"按钮清除所有筛选条件</li>
        </ol>
        
        <h3>第二部分：提示词库操作指南</h3>
        
        <h4>2.1 浏览提示词</h4>
        <ul>
            <li>提示词按分类组织：学术写作、教学设计、课程规划等</li>
            <li>每个提示词卡片显示标题、分类、简要描述</li>
            <li>点击"查看详情"查看完整内容和使用说明</li>
        </ul>
        
        <h4>2.2 使用提示词</h4>
        <ol>
            <li><strong>复制提示词</strong>：点击"复制"按钮，内容自动复制到剪贴板</li>
            <li><strong>展开查看</strong>：点击"展开"查看完整提示词内容</li>
            <li><strong>直接使用</strong>：点击"使用"按钮获取使用建议</li>
            <li><strong>自定义修改</strong>：根据具体需求修改提示词参数</li>
        </ol>
        
        <h4>2.3 提示词定制技巧</h4>
        <ul>
            <li>替换方括号[]中的占位符为具体内容</li>
            <li>根据教学目标调整提示词的详细程度</li>
            <li>结合多个提示词创建复合任务</li>
            <li>保存常用的定制版本供重复使用</li>
        </ul>
        
        <h3>第三部分：AI工具使用指南</h3>
        
        <h4>3.1 工具选择建议</h4>
        <ul>
            <li><strong>ChatGPT</strong>：适合通用对话、创意写作、问题解答</li>
            <li><strong>Claude</strong>：擅长长文本处理、学术写作、逻辑分析</li>
            <li><strong>Gemini</strong>：Google生态集成，适合搜索相关任务</li>
            <li><strong>文心一言</strong>：中文理解优秀，适合中文教学内容</li>
            <li><strong>通义千问</strong>：阿里云AI，适合商业应用场景</li>
        </ul>
        
        <h4>3.2 最佳实践</h4>
        <ol>
            <li>明确任务目标，选择合适的AI工具</li>
            <li>使用结构化的提示词，提高输出质量</li>
            <li>分步骤处理复杂任务，避免一次性要求过多</li>
            <li>对AI输出进行人工审核和优化</li>
            <li>建立个人的提示词库和使用经验</li>
        </ol>
        
        <h3>第四部分：教学资源管理</h3>
        
        <h4>4.1 资源分类</h4>
        <ul>
            <li><strong>核心文档</strong>：教学大纲、课程标准等基础文件</li>
            <li><strong>操作手册</strong>：详细的使用说明和操作指南</li>
            <li><strong>AI工具链接</strong>：快速访问各种AI平台</li>
            <li><strong>教学图片库</strong>：按主题分类的教学图片素材</li>
        </ul>
        
        <h4>4.2 资源使用技巧</h4>
        <ol>
            <li>根据教学需要选择合适的图片素材</li>
            <li>结合文档模板快速创建教学内容</li>
            <li>利用样本文本进行写作教学和分析</li>
            <li>定期更新和补充教学资源库</li>
        </ol>
        
        <h3>第五部分：常见问题解决</h3>
        
        <h4>5.1 技术问题</h4>
        <ul>
            <li><strong>页面加载慢</strong>：检查网络连接，清除浏览器缓存</li>
            <li><strong>按钮无响应</strong>：刷新页面，确保JavaScript已启用</li>
            <li><strong>图片无法显示</strong>：检查图片文件是否存在，路径是否正确</li>
            <li><strong>复制功能失效</strong>：确保浏览器支持剪贴板API</li>
        </ul>
        
        <h4>5.2 使用问题</h4>
        <ul>
            <li><strong>找不到合适的提示词</strong>：使用搜索功能，或查看相关分类</li>
            <li><strong>AI输出质量不佳</strong>：优化提示词描述，增加具体要求</li>
            <li><strong>资源下载失败</strong>：检查文件权限，尝试右键另存为</li>
        </ul>
        
        <div class="handbook-footer">
            <p><strong>版本：</strong>v2.0</p>
            <p><strong>更新时间：</strong>2025.7.26</p>
            <p><strong>技术支持：</strong>SWUFE AI教学团队</p>
        </div>
    `;
    
    showModal('实用操作手册', manualContent);
}

// 项目说明在线阅读函数
function showProjectReadme() {
    const readmeContent = `
        <h2>AI教学资源整合平台 - 项目说明</h2>
        
        <h3>项目概述</h3>
        <p>AI教学资源整合平台是一个专为教育工作者设计的综合性AI辅助教学工具集合。本平台整合了多种AI工具、提示词模板、教学资源和实用案例，旨在帮助教师更好地利用人工智能技术提升教学效果。</p>
        
        <h3>核心特性</h3>
        <ul>
            <li><strong>丰富的提示词库</strong>：涵盖学术写作、教学设计、课程规划等多个领域</li>
            <li><strong>AI工具集成</strong>：一站式访问主流AI平台</li>
            <li><strong>教学资源管理</strong>：图片库、文档模板、样本文本等</li>
            <li><strong>项目案例展示</strong>：实际应用场景和解决方案</li>
            <li><strong>响应式设计</strong>：支持桌面端和移动端访问</li>
        </ul>
        
        <h3>技术架构</h3>
        
        <h4>前端技术</h4>
        <ul>
            <li><strong>HTML5</strong>：语义化标记，提供良好的结构</li>
            <li><strong>CSS3</strong>：现代化样式，响应式布局</li>
            <li><strong>JavaScript</strong>：交互功能，动态内容加载</li>
            <li><strong>Font Awesome</strong>：图标库，提升视觉效果</li>
        </ul>
        
        <h4>设计特点</h4>
        <ul>
            <li>采用现代化的卡片式布局</li>
            <li>渐变色彩搭配，提升视觉体验</li>
            <li>平滑动画效果，增强交互感</li>
            <li>移动端优先的响应式设计</li>
        </ul>
        
        <h3>功能模块</h3>
        
        <h4>1. 提示词库模块</h4>
        <ul>
            <li>分类管理：按教学场景分类组织</li>
            <li>搜索功能：支持关键词模糊搜索</li>
            <li>标签筛选：快速定位特定类型提示词</li>
            <li>一键复制：便捷的复制到剪贴板功能</li>
        </ul>
        
        <h4>2. AI工具模块</h4>
        <ul>
            <li>工具链接：直接访问各大AI平台</li>
            <li>使用指南：每个工具的特点和适用场景</li>
            <li>快速入口：一键跳转到目标平台</li>
        </ul>
        
        <h4>3. 教学资源模块</h4>
        <ul>
            <li>图片库：按主题分类的教学图片</li>
            <li>文档模板：常用的教学文档格式</li>
            <li>样本文本：用于教学分析的文本材料</li>
        </ul>
        
        <h4>4. 项目案例模块</h4>
        <ul>
            <li>游戏化教学：课堂游戏设计案例</li>
            <li>学术应用：学术写作和研究工具</li>
            <li>技术工具：情感分析等实用工具</li>
        </ul>
        
        <h3>使用场景</h3>
        
        <h4>教学准备</h4>
        <ul>
            <li>使用提示词生成课程大纲</li>
            <li>创建个性化的教学内容</li>
            <li>设计互动教学活动</li>
        </ul>
        
        <h4>课堂教学</h4>
        <ul>
            <li>实时生成教学案例</li>
            <li>回答学生疑问</li>
            <li>调整教学策略</li>
        </ul>
        
        <h4>作业批改</h4>
        <ul>
            <li>自动化作业评估</li>
            <li>提供个性化反馈</li>
            <li>识别学习难点</li>
        </ul>
        
        <h3>部署说明</h3>
        
        <h4>环境要求</h4>
        <ul>
            <li>现代浏览器（Chrome、Firefox、Safari、Edge）</li>
            <li>支持JavaScript和CSS3</li>
            <li>网络连接（访问外部AI平台）</li>
        </ul>
        
        <h4>本地部署</h4>
        <ol>
            <li>下载项目文件到本地目录</li>
            <li>启动本地HTTP服务器（如Python的http.server）</li>
            <li>在浏览器中访问localhost地址</li>
            <li>开始使用平台功能</li>
        </ol>
        
        <h3>更新日志</h3>
        
        <h4>v2.0 (2025.7.26)</h4>
        <ul>
            <li>新增项目案例详情展示功能</li>
            <li>添加在线文档阅读功能</li>
            <li>优化模态框显示效果</li>
            <li>改进响应式设计</li>
            <li>修复已知bug</li>
        </ul>
        
        <h4>v1.0 (2025.7.25)</h4>
        <ul>
            <li>初始版本发布</li>
            <li>基础功能实现</li>
            <li>提示词库和AI工具集成</li>
            <li>教学资源管理</li>
        </ul>
        
        <h3>贡献指南</h3>
        <p>欢迎教育工作者和技术开发者为本项目贡献内容：</p>
        <ul>
            <li>提交新的提示词模板</li>
            <li>分享教学案例和经验</li>
            <li>报告bug和提出改进建议</li>
            <li>参与功能开发和优化</li>
        </ul>
        
        <h3>许可证</h3>
        <p>本项目仅供教育教学使用，请遵守相关的使用条款和隐私政策。</p>
        
        <div class="handbook-footer">
            <p><strong>项目版本：</strong>v2.0</p>
            <p><strong>开发团队：</strong>SWUFE AI教学研究团队</p>
            <p><strong>联系方式：</strong>ai-teaching@swufe.edu.cn</p>
            <p><strong>项目地址：</strong>https://github.com/swufe/ai-teaching-platform</p>
        </div>
    `;
    
    showModal('项目说明文档', readmeContent);
}

// 通用模态框显示函数
function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <div class="modal-content-body">
            ${content}
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 关闭按钮事件
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
}

// 全局函数
function downloadFile(filename) {
    const link = document.createElement('a');
    link.href = filename;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function openInNewTab(url) {
    window.open(url, '_blank');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    switch (type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        case 'warning':
            notification.style.background = '#f59e0b';
            break;
        default:
            notification.style.background = '#2563eb';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 显示提示词详情
function showPromptDetails(promptType) {
    const prompts = {
        'writing': {
            title: '学术英语写作反馈助手',
            content: `你是一位专业的学术英语写作导师，具有丰富的英语教学和学术写作指导经验。你的任务是帮助学生提高他们的学术英语写作能力。

请按照以下步骤进行：
1. 仔细阅读学生提交的英语学术写作文本
2. 从语法、词汇、句式结构、逻辑连贯性、学术规范性等方面进行全面分析
3. 提供具体的修改建议和改进方案
4. 给出修改后的示例文本
5. 解释修改的原因和学术写作的相关规范`,
            category: '学术写作',
            tags: ['英语写作', '学术规范', '语法检查']
        },
        'analysis': {
            title: '数据分析助手',
            content: `你是一位经验丰富的数据分析专家，擅长处理各种类型的数据并提供深入的分析见解。

请协助进行以下数据分析任务：
1. 数据清洗和预处理
2. 探索性数据分析(EDA)
3. 统计分析和假设检验
4. 数据可视化建议
5. 结果解释和业务建议
6. 分析报告撰写

数据类型：[请指定]
分析目标：[请描述]
预期输出：[请说明]`,
            category: '数据分析',
            tags: ['统计分析', '数据可视化', '业务洞察']
        },
        'genre': {
            title: '教学内容创作助手',
            content: `你是一位创意教学内容开发专家，能够创建引人入胜且教育价值高的教学材料。

请帮我创建以下类型的教学材料：
1. 课程大纲和学习目标
2. 互动练习和活动设计
3. 案例研究和实例分析
4. 评估工具和测试题目
5. 多媒体教学资源
6. 学习指南和参考资料

教学主题：[请指定]
目标学生：[请描述]
教学时长：[请说明]
教学形式：[在线/面授/混合]`,
            category: '内容创作',
            tags: ['教学设计', '课程开发', '互动学习']
        }
    };

    const prompt = prompts[promptType];
    if (!prompt) {
        showNotification('未找到对应的提示词', 'error');
        return;
    }

    // 创建或获取模态框
    let modal = document.getElementById('promptModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'promptModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2 id="modalTitle">提示词详情</h2>
                <div id="modalContent"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // 添加关闭事件
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 设置模态框内容
    document.getElementById('modalTitle').textContent = prompt.title;
    document.getElementById('modalContent').innerHTML = `
        <div style="margin-bottom: 1rem;">
            <span style="background: #e5e7eb; color: #374151; padding: 4px 12px; border-radius: 12px; font-size: 0.875rem;">
                ${prompt.category}
            </span>
        </div>
        <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px; font-family: monospace; white-space: pre-wrap; line-height: 1.6; margin-bottom: 1rem;">
            ${prompt.content}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>标签：</strong>
            ${prompt.tags.map(tag => `<span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 8px; font-size: 0.75rem; margin-right: 0.5rem;">${tag}</span>`).join('')}
        </div>
        <div style="text-align: right;">
            <button class="btn btn-primary" onclick="copyPromptContent('${promptType}')" style="margin-right: 1rem;">
                <i class="fas fa-copy"></i> 复制提示词
            </button>
            <button class="btn btn-outline" onclick="document.getElementById('promptModal').style.display='none'; document.body.style.overflow='auto';">
                关闭
            </button>
        </div>
    `;

    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 复制提示词内容
function copyPromptContent(promptType) {
    const prompts = {
        'writing': `你是一位专业的学术英语写作导师，具有丰富的英语教学和学术写作指导经验。你的任务是帮助学生提高他们的学术英语写作能力。

请按照以下步骤进行：
1. 仔细阅读学生提交的英语学术写作文本
2. 从语法、词汇、句式结构、逻辑连贯性、学术规范性等方面进行全面分析
3. 提供具体的修改建议和改进方案
4. 给出修改后的示例文本
5. 解释修改的原因和学术写作的相关规范`,
        'analysis': `你是一位经验丰富的数据分析专家，擅长处理各种类型的数据并提供深入的分析见解。

请协助进行以下数据分析任务：
1. 数据清洗和预处理
2. 探索性数据分析(EDA)
3. 统计分析和假设检验
4. 数据可视化建议
5. 结果解释和业务建议
6. 分析报告撰写

数据类型：[请指定]
分析目标：[请描述]
预期输出：[请说明]`,
        'genre': `你是一位创意教学内容开发专家，能够创建引人入胜且教育价值高的教学材料。

请帮我创建以下类型的教学材料：
1. 课程大纲和学习目标
2. 互动练习和活动设计
3. 案例研究和实例分析
4. 评估工具和测试题目
5. 多媒体教学资源
6. 学习指南和参考资料

教学主题：[请指定]
目标学生：[请描述]
教学时长：[请说明]
教学形式：[在线/面授/混合]`
    };

    const content = prompts[promptType];
    if (content) {
        navigator.clipboard.writeText(content).then(() => {
            showNotification('提示词已复制到剪贴板', 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败，请手动选择文本', 'error');
        });
    }
}