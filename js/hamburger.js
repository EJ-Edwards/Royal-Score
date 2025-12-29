document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (hamburger && mobileMenu) {
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (mobileMenu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (mobileMenu.classList.contains('open') && 
          !mobileMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on menu links
    const menuLinks = mobileMenu.querySelectorAll('a, button');
    menuLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', function () {
      if (window.innerWidth > 700 && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});