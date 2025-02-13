"use strict";
(function () {
  window.onload = () => {
    // Show loading screen for 3 seconds
    setTimeout(() => {
      const loadingScreen = document.getElementById('loadingScreen');
      loadingScreen.classList.add('fade-out');
      
      // Remove loading screen from DOM after fade out
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }, 3000);

    function split(str) {
      let array = str.split(",");
      array[0] = parseFloat(array[0]);
      array[1] = parseFloat(array[1]);
      return array;
    }
    function animStart(evt) {
      let elem = evt.target;
      if (elem.classList && elem.classList.contains("active") == false) {
        elem.classList.add("active");
        let durations = split(
          window.getComputedStyle(elem).getPropertyValue("animation-duration")
        );
        let delays = split(
          window.getComputedStyle(elem).getPropertyValue("animation-delay")
        );

        let time = (delays[1] + durations[1]) * 1000;
        setTimeout(() => {
          animEnd(elem);
        }, time);
      }
    }
    function animEnd(elem) {
      elem.classList.remove("active");
      elem.offsetWidth;
    }
    function init() {
      const items = document.querySelectorAll("#gallery figure");
      const modal = document.getElementById('imageModal');
      const modalImg = document.getElementById('modalImage');

      items.forEach((item, index) => {
        //
        item.addEventListener("pointerenter", animStart);
        item.addEventListener("pointerdown", animStart);
        item.addEventListener("pointermove", animStart);
        //
        item.addEventListener('click', (e) => {
          const imgUrl = item.dataset.img;
          modalImg.src = imgUrl;
          modal.classList.add('active');
          e.stopPropagation();
        });

        let img = item.dataset.img;
        if (img) {
          var backgroundImage = window
            .getComputedStyle(item)
            .getPropertyValue("background-image");
          item.style.backgroundImage =
            "url( " + img + " )" + "," + backgroundImage;
        } else {
          item.style.backgroundBlendMode = "none";
          let e = new Event("pointerenter");
          item.dispatchEvent(e);
        }
      });

      // Close modal when clicking outside the image
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
    init();

    const gallery = document.getElementById('gallery');
    
    // Smooth scrolling behavior with mouse wheel
    gallery.addEventListener('wheel', (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY * 6;
      gallery.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    function createHearts() {
      const heartsContainer = document.createElement('div');
      heartsContainer.className = 'hearts-container';
      heartsContainer.style.position = 'fixed';
      heartsContainer.style.top = '0';
      heartsContainer.style.left = '0';
      heartsContainer.style.width = '100%';
      heartsContainer.style.height = '100%';
      heartsContainer.style.pointerEvents = 'none';
      heartsContainer.style.zIndex = '1';
      document.body.insertBefore(heartsContainer, document.body.firstChild);

      function addHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '♥';
        
        // Randomize heart sizes between 5px and 25px
        const size = Math.random() * 20 + 5;
        heart.style.fontSize = `${size}px`;
        
        // Random starting position
        heart.style.left = Math.random() * 100 + '%';
        
        // Random fall duration between 3 and 8 seconds
        const duration = Math.random() * 5 + 3;
        heart.style.animationDuration = `${duration}s`;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
          heart.remove();
        }, duration * 1000);
      }

      // Create initial hearts
      for(let i = 0; i < 30; i++) {
        setTimeout(addHeart, Math.random() * 3000);
      }

      // Continue adding hearts
      setInterval(addHeart, 100);
    }

    document.addEventListener('DOMContentLoaded', createHearts);

    function preloadImages() {
      const figures = document.querySelectorAll('#gallery figure');
      figures.forEach((figure, index) => {
        const imgUrl = `slike/${index + 1}.jpg`;
        figure.dataset.img = imgUrl;
        
        // Preload image
        const img = new Image();
        img.src = imgUrl;
      });
    }

    preloadImages();
  };
})();

function addHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    heart.innerText = '♡';
    
    heart.style.left = Math.random() * 100 + "vw";
    
    // Slower fall between 5 and 8 seconds
    heart.style.animationDuration = Math.random() * 3 + 5 + "s";
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

setInterval(addHeart, 300);
 
