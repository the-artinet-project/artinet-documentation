document.addEventListener('DOMContentLoaded', function() {

  const content = document.querySelector('.md-content');
  if (content) {
    content.style.opacity = '0';
    content.style.transition = 'opacity 0.8s ease-in-out';
    
    setTimeout(() => {
      content.style.opacity = '1';
    }, 100);
  }
  

  const navItems = document.querySelectorAll('.md-nav__item');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      const link = this.querySelector('.md-nav__link');
      if (link && !link.classList.contains('md-nav__link--active')) {
        link.style.transition = 'transform 0.3s ease, color 0.3s ease';
        link.style.transform = 'translateX(3px)';
      }
    });
    
    item.addEventListener('mouseleave', function() {
      const link = this.querySelector('.md-nav__link');
      if (link && !link.classList.contains('md-nav__link--active')) {
        link.style.transform = 'translateX(0)';
      }
    });
  });
  

  const codeBlocks = document.querySelectorAll('pre code');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  codeBlocks.forEach(block => {
    block.style.opacity = '0';
    block.style.transform = 'translateY(20px)';
    observer.observe(block);
  });
  

  const header = document.querySelector('.md-header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }
  

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  const headingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        

        headingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  
  headings.forEach(heading => {
    heading.style.opacity = '0';
    heading.style.transform = 'translateX(-15px)';
    headingObserver.observe(heading);
  });
  

  const mainHeading = document.querySelector('h1');
  if (mainHeading && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html'))) {
    const originalText = mainHeading.textContent;
    mainHeading.textContent = '';
    mainHeading.style.opacity = '1';
    mainHeading.style.transform = 'translateX(0)';
    
    let charIndex = 0;
    
    function typeEffect() {
      if (charIndex < originalText.length) {
        mainHeading.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 50);
      }
    }
    
    setTimeout(typeEffect, 300);
  }
  
  const buttons = document.querySelectorAll('.md-button');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
  });
});