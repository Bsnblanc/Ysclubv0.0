// 水平滚动图片增强效果
document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.image-scroll-container');
    const scrollTrack = document.querySelector('.image-scroll-track');
    
    if (scrollContainer && scrollTrack) {
        // 鼠标悬停时暂停滚动
        scrollContainer.addEventListener('mouseenter', () => {
            scrollTrack.style.animationPlayState = 'paused';
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            scrollTrack.style.animationPlayState = 'running';
        });
        
        // 可选：添加点击图片的交互效果
        const imageItems = document.querySelectorAll('.scroll-image-item');
        imageItems.forEach(item => {
            item.addEventListener('click', () => {
                const caption = item.querySelector('.image-caption h4').textContent;
                console.log(`点击了: ${caption}`);
                // 这里可以添加更多交互，比如打开模态框等
            });
        });
    }
});

const menuItem = document.querySelector('.nav__item--menu');
const menuLink = document.querySelector('.nav__link--menu');
const menuBackdrop = document.querySelector('.menu-backdrop');
const textMarquee = document.querySelector('.text-marquee');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (menuItem && menuLink) {
    const toggleDropdown = () => {
        const isOpen = menuItem.classList.toggle('is-open');
        menuLink.setAttribute('aria-expanded', String(isOpen));
        
        // 控制背景模糊效果和滚动条显示
        if (menuBackdrop) {
            if (isOpen) {
                menuBackdrop.classList.add('is-active');
            } else {
                menuBackdrop.classList.remove('is-active');
            }
        }
        
        if (textMarquee) {
            if (isOpen) {
                textMarquee.classList.add('is-visible');
            } else {
                textMarquee.classList.remove('is-visible');
            }
        }
    };

    menuLink.addEventListener('click', event => {
        event.preventDefault();
        toggleDropdown();
    });

    // 添加鼠标悬浮事件监听
    menuItem.addEventListener('mouseenter', () => {
        if (menuBackdrop) {
            menuBackdrop.classList.add('is-active');
        }
        if (textMarquee) {
            textMarquee.classList.add('is-visible');
        }
    });

    menuItem.addEventListener('mouseleave', () => {
        // 鼠标离开菜单区域时，总是移除模糊效果和滚动条
        // 无论菜单是否通过点击展开，只要鼠标离开就移除效果
        if (menuBackdrop) {
            menuBackdrop.classList.remove('is-active');
        }
        if (textMarquee) {
            textMarquee.classList.remove('is-visible');
        }
    });

    menuItem.querySelectorAll('.nav__dropdown .nav__link').forEach(link => {
        link.addEventListener('click', () => {
            menuItem.classList.remove('is-open');
            menuLink.setAttribute('aria-expanded', 'false');
            
            // 点击菜单项后不立即移除效果
            // 效果只会在mouseleave事件中移除
            // 这样确保鼠标还在菜单区域时效果不会消失
        });
    });

    window.addEventListener('resize', () => {
        menuItem.classList.remove('is-open');
        menuLink.setAttribute('aria-expanded', 'false');
        
        // 窗口大小改变时也移除背景模糊和滚动条
        if (menuBackdrop) {
            menuBackdrop.classList.remove('is-active');
        }
        if (textMarquee) {
            textMarquee.classList.remove('is-visible');
        }
    });
}

// 平滑地重置并重放页面动画
function replayPageAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    // 首先让所有元素平滑地渐隐
    revealElements.forEach(element => {
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateX(0px)'; // 重置到初始位置
    });
    
    // 等待渐隐完成后，重置状态并开始渐入动画
    setTimeout(() => {
        revealElements.forEach(element => {
            // 移除 is-visible 类但不触发过渡
            element.classList.remove('is-visible');
            element.style.transitionDelay = '';
            
            // 恢复原有的过渡效果
            element.style.transition = '';
            element.style.opacity = '';
            element.style.transform = '';
        });
        
        // 强制重新计算布局
        document.body.offsetHeight;
        
        // 开始重新播放动画
        setTimeout(() => {
            revealElements.forEach(element => {
                if (element.dataset.delay) {
                    element.style.transitionDelay = `${element.dataset.delay}s`;
                }
                
                // 添加延迟后再显示动画
                const delay = element.dataset.delay ? parseFloat(element.dataset.delay) * 1000 : 0;
                setTimeout(() => {
                    element.classList.add('is-visible');
                }, delay);
            });
        }, 100);
    }, 300); // 等待渐隐完成
}

// 品牌logo点击跳转到顶部并重放动画
const brandLink = document.querySelector('.brand');
if (brandLink) {
    brandLink.addEventListener('click', (event) => {
        event.preventDefault(); // 阻止默认锚点跳转
        
        // 开始滚动的同时开始渐隐动画
        replayPageAnimations();
        
        // 使用JavaScript实现平滑滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

const revealElements = document.querySelectorAll('[data-reveal]');

if (revealElements.length) {
    revealElements.forEach(element => {
        if (element.dataset.delay) {
            element.style.transitionDelay = `${element.dataset.delay}s`;
        }
    });

    if (prefersReducedMotion.matches) {
        revealElements.forEach(el => el.classList.add('is-visible'));
    } else {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -10%'
        });

        revealElements.forEach(el => observer.observe(el));
    }
}

// 背景图片滚动渐隐效果 - 只针对 intro-gap 区域
const introGap = document.querySelector('.intro-gap');
console.log('Intro gap element:', introGap); // 调试信息

if (introGap) {
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // 更明显的渐隐范围：从开始滚动到1个屏幕高度
        const fadeStart = 0;   // 立即开始渐隐
        const fadeEnd = windowHeight * 1.0; // 1个屏幕高度后完全隐藏
        
        let opacity = 1;
        
        if (scrollTop >= fadeStart && scrollTop <= fadeEnd) {
            // 在渐隐范围内，计算透明度
            opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
        } else if (scrollTop > fadeEnd) {
            // 超过渐隐范围，完全隐藏
            opacity = 0;
        }
        
        // 确保透明度在0-1范围内
        opacity = Math.max(0, Math.min(1, opacity));
        
        // 只对 intro-gap 区域应用透明度
        introGap.style.opacity = opacity;
        
        // 调试信息（可以在浏览器控制台查看）
        console.log(`滚动距离: ${scrollTop}px, 渐隐结束: ${fadeEnd}px, 透明度: ${opacity.toFixed(2)}`);
    };
    
    // 监听滚动事件，使用节流优化性能
    let ticking = false;
    const optimizedScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', optimizedScroll);
    
    // 初始化
    handleScroll();
}

