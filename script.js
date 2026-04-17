// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('#main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation (using Intersection Observer)
const revealElements = document.querySelectorAll(
    '.module-card, .bonus-card, .expert-text, .expert-image, .stat-item, .pricing-card, .faq-item'
);

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    revealObserver.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});
// FAQ Accordion logic
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrollValue = window.scrollY;
    const hero = document.querySelector('#hero');
    if (hero) {
        hero.style.backgroundPositionY = -(scrollValue * 0.5) + 'px';
    }
});
// Custom Cursor Move
const cursor = document.querySelector('#custom-cursor');
window.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Progress Bar update
window.addEventListener('scroll', () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    document.querySelector('#progress-bar').style.width = progress + '%';
});

// Magnetic Buttons effect (simplified)
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0, 0) scale(1)`;
    });
});
// script.js - Lógica de Integração Real (Stripe)

// 1. Inicialize o Stripe com sua Chave Pública (Encontrada no Dashboard do Stripe)
// Você deve substituir 'SUA_CHAVE_PUBLICA_AQUI' pela chave PK_... do cliente
// Stripe SDK não é mais necessário com o método de Payment Link direto

// Checkout Modal Logic
const modal = document.querySelector('#checkout-modal');
const closeModalBtn = document.querySelector('#close-modal');
const openModalBtns = document.querySelectorAll('a[href="#pricing"], .btn-primary, .btn-secondary');

const openModal = (e) => {
    const text = e.target.innerText.toLowerCase();
    if (text.includes('vaga') || text.includes('agora') || text.includes('começar') || text.includes('momento')) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

openModalBtns.forEach(btn => btn.addEventListener('click', openModal));

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Input Masking
const maskInput = (selector, maskFunc) => {
    const input = document.querySelector(selector);
    if (!input) return;
    input.addEventListener('input', (e) => {
        e.target.value = maskFunc(e.target.value);
    });
};

const masks = {
    cpf: (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1'),
    phone: (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1'),
    date: (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\/\d{4})\d+?$/, '$1')
};

maskInput('#cpf', masks.cpf);
maskInput('#phone', masks.phone);
maskInput('#birth-date', masks.date);

// Real Checkout Submission
document.querySelector('#enrollment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector('#submit-btn');
    const email = document.querySelector('#email').value;

    btn.innerText = 'REDIRECIONANDO...';
    btn.disabled = true;

    // Usando Payment Link para garantir 100% de estabilidade e contornar erros de integração
    const paymentLink = 'https://buy.stripe.com/14A9AUbPY95xcMheaI8g000';
    
    // Adiciona o e-mail do cliente ao link para facilitar o preenchimento no checkout do Stripe
    const finalUrl = `${paymentLink}?prefilled_email=${encodeURIComponent(email)}`;
    
    // Redireciona o usuário
    window.location.href = finalUrl;
});

// Carousel Logic
const track = document.querySelector('.carousel-track');
if (track) {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button--right');
    const prevButton = document.querySelector('.carousel-button--left');
    const dotsNav = document.querySelector('.carousel-indicators');
    const dots = Array.from(dotsNav.children);

    const updateCarousel = (index) => {
        const amountToMove = index * 100;
        track.style.transform = `translateX(-${amountToMove}%)`;
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('current-indicator'));
        dots[index].classList.add('current-indicator');
        
        // Update current slide class
        slides.forEach(slide => slide.classList.remove('current-slide'));
        slides[index].classList.add('current-slide');
    };

    let currentIndex = 0;

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(currentIndex);
    };

    // Autoplay
    let autoplayInterval = setInterval(nextSlide, 5000);

    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 5000);
    };

    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
            resetAutoplay();
        });
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        updateCarousel(currentIndex);
    });
}
