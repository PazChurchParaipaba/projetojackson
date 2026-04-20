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
    '.module-card, .bonus-card, .expert-text, .expert-image, .stat-item, .pricing-card, .faq-item, .quote-card, .reveal'
);

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before it enters fully
});

revealElements.forEach(el => {
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
let currentProduct = {
    title: 'Curso Não é Só Namoro',
    price: '97,50',
    stripeLink: 'https://buy.stripe.com/14A9AUbPY95xcMheaI8g000',
    type: 'course'
};

const modal = document.querySelector('#checkout-modal');
const closeModalBtn = document.querySelector('#close-modal');
const openModalBtns = document.querySelectorAll('a[href="#pricing"], .btn-primary, .btn-secondary');

const openModal = (e) => {
    const text = e.target.innerText.toLowerCase();
    if (text.includes('vaga') || text.includes('agora') || text.includes('começar') || text.includes('momento') || e.target.classList.contains('buy-ebook-btn')) {
        e.preventDefault();
        
        // Update product data if it's an ebook
        if(e.target.hasAttribute('data-ebook')) {
            const ebookData = JSON.parse(e.target.getAttribute('data-ebook'));
            currentProduct = {
                title: ebookData.title,
                price: ebookData.price,
                stripeLink: ebookData.stripeLink,
                type: 'ebook'
            };
        } else {
            // Reset to Course
            currentProduct = {
                title: 'Curso Não é Só Namoro',
                price: '97,50',
                stripeLink: 'https://buy.stripe.com/14A9AUbPY95xcMheaI8g000',
                type: 'course'
            };
        }
        
        // Update PIX Modal Info
        const pixValueEl = document.querySelector('.pix-value strong');
        if(pixValueEl) pixValueEl.innerText = `R$ ${currentProduct.price}`;
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

// Payment Method Selection Logic
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', () => {
        // Toggle Active Class
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Toggle Views
        const method = option.getAttribute('data-method');
        const stripeInfo = document.querySelector('#stripe-info');
        const pixArea = document.querySelector('#pix-area');
        const submitBtn = document.querySelector('#submit-btn');

        if (method === 'pix') {
            stripeInfo.classList.add('hidden');
            pixArea.classList.remove('hidden');
            submitBtn.innerText = 'ENVIAR COMPROVANTE (WHATSAPP)';
        } else {
            stripeInfo.classList.remove('hidden');
            pixArea.classList.add('hidden');
            submitBtn.innerText = 'FINALIZAR PEDIDO';
        }
    });
});

// Copy Pix Function (Copies only numbers for bank app compatibility)
window.copyPix = () => {
    const pixKeyFormatted = document.querySelector('#pix-key').innerText;
    const pixKeyRaw = pixKeyFormatted.replace(/\D/g, ''); // Remove ( ) - e espaços
    
    navigator.clipboard.writeText(pixKeyRaw).then(() => {
        const btn = document.querySelector('.copy-pix');
        const originalText = btn.innerText;
        btn.innerText = 'COPIADO!';
        btn.style.background = '#25D366';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
        }, 2000);
    });
};

// Real Checkout Submission
document.querySelector('#enrollment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector('#submit-btn');
    const name = document.querySelector('#full-name').value;
    const email = document.querySelector('#email').value;
    const method = document.querySelector('.payment-option.active').getAttribute('data-method');

    if (method === 'card') {
        btn.innerText = 'REDIRECIONANDO...';
        btn.disabled = true;
        const paymentLink = currentProduct.stripeLink;
        const finalUrl = `${paymentLink}?prefilled_email=${encodeURIComponent(email)}`;
        window.location.href = finalUrl;
    } else {
        // Pix Flow (WhatsApp)
        let productText = currentProduct.type === 'ebook' ? `o E-book ${currentProduct.title}` : `o curso Não é Só Namoro`;
        const message = `Olá! Acabei de fazer o Pix de R$ ${currentProduct.price} para ${productText}. Segue o comprovante em nome de ${name} (${email}).`;
        const waNumber = '5585992872157';
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in new tab
        window.open(waUrl, '_blank');
        
        // Redirect to success page after a small delay
        setTimeout(() => {
            window.location.href = 'sucesso.html';
        }, 1000);
    }
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

// 3D Tilt Effect for Cards
const tiltCards = document.querySelectorAll('.quote-card, .module-card, .bonus-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
});


// Hero Image Parallax (Mouse Move)
const heroSection = document.querySelector('#hero');
const heroImageAsset = document.querySelector('.hero-image-asset-large');

if (heroSection && heroImageAsset) {
    heroSection.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;
        heroImageAsset.style.transform = `perspective(1000px) rotateY(${-10 + x}deg) rotateX(${y}deg) translateZ(50px)`;
    });
    
    heroSection.addEventListener('mouseleave', () => {
        heroImageAsset.style.transform = `perspective(1000px) rotateY(-10deg) rotateX(0deg) translateZ(0)`;
    });
}

// Typewriter Effect
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
    const words = ["Propósito", "Direção", "Maturidade", "Futuro"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    const type = () => {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            typewriterElement.innerText = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 100;
        } else {
            typewriterElement.innerText = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 200;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    };

    setTimeout(type, 1000);

}

// Supabase Initialization
const supabaseUrl = 'https://csxitgraaawziaflveol.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeGl0Z3JhYWF3emlhZmx2ZW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTE5NzksImV4cCI6MjA4Njc2Nzk3OX0.sqcgO8gZZ7UPotWOnlQ8FQWhkxKnx_hsh7pRsCi1s2g';
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

// Render E-books on the Storefront
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('public-ebooks-container');
    if(container && supabaseClient) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Carregando materiais...</p>';
        
        try {
            const { data: ebooks, error } = await supabaseClient
                .from('ebooks')
                .select('*')
                .order('created_at', { ascending: false });
                
            if(error || !ebooks || ebooks.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">Nenhum material disponível no momento. Novidades em breve!</p>';
                return;
            }

            let html = '';
            ebooks.forEach(eb => {
                const ebookDataForModal = {
                    title: eb.title,
                    price: eb.price,
                    stripeLink: eb.stripe_link
                };
                html += `
                    <div class="ebook-card">
                        <img src="${eb.image_url}" alt="${eb.title}" class="ebook-cover" onerror="this.src='alianca.png'">
                        <div class="ebook-info">
                            <h3>${eb.title}</h3>
                            <p>${eb.description}</p>
                            <div class="ebook-price">R$ ${eb.price}</div>
                            <button class="btn-primary buy-ebook-btn" style="width:100%; text-align:center;" data-ebook='${JSON.stringify(ebookDataForModal).replace(/'/g, "&apos;")}'>COMPRAR E-BOOK</button>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;

            // Re-attach modal listener for new buttons
            document.querySelectorAll('.buy-ebook-btn').forEach(btn => {
                btn.addEventListener('click', openModal);
            });
        } catch(e) {
            container.innerHTML = '<p style="color:red; text-align:center; grid-column: 1/-1;">Erro de conexão ao carregar e-books.</p>';
        }
    }
});
