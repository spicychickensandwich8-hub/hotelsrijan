document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. Header Scroll Style Toggle
  // ==========================================================================
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const spySections = document.querySelectorAll('section[id], header[id]');
  
  const handleScroll = () => {
    // 1. Header background styling
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    // 2. Back to top button visibility
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }

    // 3. Scroll Spy Navigation Highlight
    let currentSectionId = 'home';
    const scrollPos = window.scrollY + 120; // offset for sticky navigation header
    
    spySections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check immediately on load

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 2. Mobile Navigation Hamburger Menu
  // ==========================================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  };
  
  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  };
  
  hamburger.addEventListener('click', toggleMobileMenu);
  
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu if user clicks outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 3. Dark/Light Theme Toggle
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('theme-icon-moon');
  const sunIcon = document.getElementById('theme-icon-sun');
  const htmlTag = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  const setTheme = (theme) => {
    htmlTag.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  };

  setTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // ==========================================================================
  // 4. Room Filtering Functionality
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const roomCards = document.querySelectorAll('.room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter cards
      roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          // Force a reflow to trigger CSS animations if any
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // Wait for transition out
        }
      });
    });
  });

  // (Booking form and autofill triggers removed - booking redirected directly to Hotels.com page)

  // ==========================================================================
  // 7. Testimonials Carousel / Auto-slider
  // ==========================================================================
  const slides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (n) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, 6000);
  };

  const resetSlideShow = () => {
    clearInterval(slideInterval);
    startSlideShow();
  };

  // Click on dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      showSlide(idx);
      resetSlideShow();
    });
  });

  // Initialize
  if (slides.length > 0) {
    startSlideShow();
  }

  // ==========================================================================
  // 8. Room Details Dialog / Popup Modal (Hotels.com style)
  // ==========================================================================
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const counterEl = document.getElementById('lightbox-counter');

  // Modal elements for text/amenities
  const modalTitle = document.getElementById('modal-room-title');
  const modalSize = document.getElementById('modal-room-size');
  const modalSleeps = document.getElementById('modal-room-sleeps');
  const modalBed = document.getElementById('modal-room-bed');
  const modalWifi = document.getElementById('modal-room-wifi');
  const modalDesc = document.getElementById('modal-room-desc');
  const modalAmenitiesGrid = document.getElementById('modal-amenities-grid');

  // Room details database (including dimension, sleep limits, and bed configs)
  const roomDetails = {
    'deluxe': {
      title: 'Deluxe Double Room',
      size: '250 sq ft',
      sleeps: 'Sleeps 2 guests',
      bed: '1 Double Bed',
      wifi: 'Free Wi-Fi',
      desc: 'This room type covers approximately 250 sq ft of space, designed to sleep up to 2 guests. It features 1 Double Bed and offers free Wi-Fi. Offering premium comfort and traditional style, it represents the ideal peaceful sanctuary in Vrindavan.',
      photos: [
        'images/room1.jpg',
        'images/room5.jpg',
        'images/room11.jpg',
        'images/room12.jpg',
        'images/bathroom1.jpg',
        'images/bathroom5.jpg'
      ],
      amenities: [
        'Air Conditioning (climate control)',
        'Attached Bathroom with geyser',
        'Hot & Cold running water',
        'LED TV with cable channels',
        'Electric Kettle (Tea/Coffee maker)',
        'Free high-speed Wi-Fi',
        'Desk and comfortable chair',
        'Daily housekeeping & room service'
      ]
    },
    'super-deluxe': {
      title: 'Superior Room',
      size: '160 sq ft',
      sleeps: 'Sleeps 2 guests',
      bed: '1 Double Bed',
      wifi: 'Free Wi-Fi',
      desc: 'A slightly more compact option encompassing 160 sq ft, tailored for up to 2 guests. It is configured with 1 Double Bed and includes free Wi-Fi. Designed to maximize functional space and comfort for pilgrims.',
      photos: [
        'images/room3.png',
        'images/room4.jpg',
        'images/room6.png',
        'images/room8.jpg'
      ],
      amenities: [
        'Air Conditioning (climate control)',
        'Attached Bathroom with geyser',
        'Fresh towels & basic toiletries',
        'LED TV with satellite channels',
        'Electric Kettle (Tea/Coffee maker)',
        'Free high-speed Wi-Fi',
        'Compact seating & table',
        'Room service & daily housekeeping'
      ]
    },
    'suite': {
      title: 'Family Suite',
      size: '260 sq ft',
      sleeps: 'Sleeps up to 4 guests',
      bed: '2 Double Beds',
      wifi: 'Free Wi-Fi',
      desc: 'The largest variant listed at 260 sq ft, designed to sleep a family or group of up to 4 guests. It offers a 1-bedroom setup furnished with 2 Double Beds and free Wi-Fi. Featuring a spacious layout with extra clearance space.',
      photos: [
        'images/room9.png',
        'images/room10.jpg',
        'images/room2.png',
        'images/room13.jpg'
      ],
      amenities: [
        'Air Conditioning (climate control)',
        '2 Double Beds with premium linens',
        'Spacious Attached Bathroom with Geyser',
        'Organic toiletries & fresh towels',
        'Flat screen LED TV',
        'Electric Kettle with supplies',
        'Free high-speed Wi-Fi',
        'Sofa lounge seating & coffee table',
        'Daily housekeeping & room service'
      ]
    }
  };

  let activeGallery = [];
  let currentGalleryIndex = 0;

  const updateLightboxImage = () => {
    if (activeGallery.length > 0) {
      lightboxImg.style.opacity = '0';
      lightboxImg.style.transform = 'scale(0.98)';
      
      setTimeout(() => {
        lightboxImg.src = activeGallery[currentGalleryIndex];
        lightboxImg.alt = `Photo Preview ${currentGalleryIndex + 1}`;
        if (counterEl) {
          counterEl.textContent = `${currentGalleryIndex + 1} / ${activeGallery.length}`;
        }
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      }, 150);
    }
  };

  const toggleArrows = () => {
    const showArrows = activeGallery.length > 1;
    if (prevBtn) prevBtn.style.display = showArrows ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = showArrows ? 'flex' : 'none';
    if (counterEl) counterEl.style.display = showArrows ? 'block' : 'none';
  };

  const openGallery = (category, isRoomCard = true) => {
    const isRoom = roomDetails[category];
    const modalBody = document.querySelector('.modal-body');

    if (isRoom && isRoomCard) {
      // Load room specific data
      const data = roomDetails[category];
      activeGallery = data.photos;
      
      // Populate text details
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalSize) modalSize.textContent = data.size;
      if (modalSleeps) modalSleeps.textContent = data.sleeps;
      if (modalBed) modalBed.textContent = data.bed;
      if (modalWifi) modalWifi.textContent = data.wifi;
      if (modalDesc) modalDesc.textContent = data.desc;
      
      // Populate amenities list
      if (modalAmenitiesGrid) {
        modalAmenitiesGrid.innerHTML = '';
        data.amenities.forEach(am => {
          const item = document.createElement('div');
          item.className = 'modal-amenity-item';
          item.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; color: var(--accent);">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${am}</span>
          `;
          modalAmenitiesGrid.appendChild(item);
        });
      }
      if (modalBody) modalBody.style.display = 'block';
    } else {
      // From standard photo gallery (just show image slideshow, hide details panel)
      activeGallery = Array.isArray(category) ? category : [category];
      if (modalBody) modalBody.style.display = 'none';
    }

    currentGalleryIndex = 0;
    if (activeGallery.length > 0) {
      updateLightboxImage();
      toggleArrows();
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock body scrolling
    }
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Unlock body scrolling
  };

  // Wire Room Card Photos buttons
  const viewGalleryBtns = document.querySelectorAll('.view-gallery-btn');
  viewGalleryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-room-gallery');
      openGallery(cat, true);
    });
  });

  // Wire Room Card images
  const roomImages = document.querySelectorAll('.room-img');
  roomImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      const card = img.closest('.room-card');
      if (card) {
        const cat = card.getAttribute('data-category');
        openGallery(cat, true);
      }
    });
  });

  // Wire standard Photo Gallery grid images to work as a slideshow of visible photos
  const galleryImages = document.querySelectorAll('.gallery-img');
  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      // Find all currently visible cards in gallery
      const visibleCards = Array.from(document.querySelectorAll('.gallery-item-card'))
        .filter(card => card.style.display !== 'none');
      
      const visibleSources = visibleCards.map(card => card.querySelector('.gallery-img').getAttribute('src'));
      const activeIdx = visibleSources.indexOf(img.getAttribute('src'));
      
      openGallery(visibleSources, false);
      currentGalleryIndex = activeIdx !== -1 ? activeIdx : 0;
      updateLightboxImage();
    });
  });

  // Prev / Next button actions
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + activeGallery.length) % activeGallery.length;
      updateLightboxImage();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % activeGallery.length;
      updateLightboxImage();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        currentGalleryIndex = (currentGalleryIndex - 1 + activeGallery.length) % activeGallery.length;
        updateLightboxImage();
      } else if (e.key === 'ArrowRight') {
        currentGalleryIndex = (currentGalleryIndex + 1) % activeGallery.length;
        updateLightboxImage();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    }
  });

  // ==========================================================================
  // 9. Scroll Fade-in IntersectionObserver
  // ==========================================================================
  const fadeSections = document.querySelectorAll('.fade-in-section');
  
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% visible
      rootMargin: '0px 0px -50px 0px' // Slightly offset triggers
    });

    fadeSections.forEach(section => {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback: make all sections visible if observer is not supported
    fadeSections.forEach(section => {
      section.classList.add('is-visible');
    });
  }
});
