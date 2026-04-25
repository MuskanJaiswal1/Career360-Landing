document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.querySelector('.navbar');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Close mobile menu after clicking a link
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    });
  });

  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      if (this.classList.contains('open-apply-modal')) return;
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Load modal fragment (HTML + CSS + JS) from modal.html and bind handlers.
  const scheduleAutoOpenModal = () => {
    setTimeout(() => {
      const modalTrigger =
        document.querySelector('.open-apply-modal[data-course="General Application"]') ||
        document.querySelector('.open-apply-modal');

      if (modalTrigger) {
        modalTrigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      }
    }, 3000);
  };

  const loadModalFragment = async () => {
    try {
      const response = await fetch('modal.html');
      if (!response.ok) {
        return;
      }

      const modalMarkup = await response.text();
      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(modalMarkup, 'text/html');

      const modalRoot = parsedDoc.querySelector('#applyModal');
      if (modalRoot && !document.getElementById('applyModal')) {
        document.body.appendChild(modalRoot);
      }

      parsedDoc.querySelectorAll('style').forEach((styleNode, index) => {
        const styleId = styleNode.id || `modal-style-${index}`;
        if (document.getElementById(styleId)) return;
        const injectedStyle = document.createElement('style');
        injectedStyle.id = styleId;
        injectedStyle.textContent = styleNode.textContent;
        document.head.appendChild(injectedStyle);
      });

      parsedDoc.querySelectorAll('script').forEach((scriptNode, index) => {
        const scriptId = scriptNode.id || `modal-script-${index}`;
        if (document.getElementById(scriptId)) return;
        const injectedScript = document.createElement('script');
        injectedScript.id = scriptId;
        injectedScript.textContent = scriptNode.textContent;
        document.body.appendChild(injectedScript);
      });

      if (typeof window.bindCareerModal === 'function') {
        window.bindCareerModal();
        scheduleAutoOpenModal();
      }
    } catch (error) {
      // Silently ignore modal loading failures for static fallback.
    }
  };

  loadModalFragment();

  // Active navigation highlight while scrolling
  const sections = document.querySelectorAll('section');
  const navLinkItems = document.querySelectorAll('.nav-links li a');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    }

    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const sectionId = href.substring(1);
      if (sectionId === current) {
        link.classList.add('active');
      }
    });
  });

  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }

  // FAQ accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      if (!faqItem) return;

      const isOpen = faqItem.classList.contains('open');
      faqQuestions.forEach((itemQuestion) => {
        const item = itemQuestion.closest('.faq-item');
        if (item) {
          item.classList.remove('open');
        }
        itemQuestion.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        faqItem.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
});