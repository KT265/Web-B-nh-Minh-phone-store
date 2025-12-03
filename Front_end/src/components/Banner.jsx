// import React, { useState, useEffect, useRef } from 'react';
// import styles from '../styles/Banner.module.css';

// // Import banners
// import banner1 from '../assets/images/Banner 3.png';
// import banner2 from '../assets/images/Banner 2.png';
// import banner3 from '../assets/images/Banner 5.png';
// import banner4 from '../assets/images/Banner 4.png';

// const Banner = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const sliderWrapperRef = useRef(null);
//   const autoSlideIntervalRef = useRef(null);

//   const slides = [
//     { image: banner1, alt: "SamSung Galaxy S25 Ultra", buttonText: "Xem Ngay" },
//     { image: banner2, alt: "Banner 2", buttonText: "Mua Ngay" },
//     { image: banner3, alt: "Honor Magic V5", buttonText: "Khám Phá" },
//     { image: banner4, alt: "Oppo Find X9", buttonText: "Đặt Hàng" }
//   ];

//   const totalSlides = slides.length;

//   // Auto slide functionality
//   const startAutoSlide = () => {
//     autoSlideIntervalRef.current = setInterval(() => {
//       setCurrentSlide(prev => (prev + 1) % totalSlides);
//     }, 4000);
//   };

//   const resetAutoSlide = () => {
//     if (autoSlideIntervalRef.current) {
//       clearInterval(autoSlideIntervalRef.current);
//     }
//     startAutoSlide();
//   };

//   useEffect(() => {
//     startAutoSlide();
//     return () => {
//       if (autoSlideIntervalRef.current) {
//         clearInterval(autoSlideIntervalRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (sliderWrapperRef.current) {
//       sliderWrapperRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
//     }
//   }, [currentSlide]);

//   const changeSlide = (direction) => {
//     setCurrentSlide(prev => {
//       let newSlide = prev + direction;
//       if (newSlide < 0) {
//         newSlide = totalSlides - 1;
//       } else if (newSlide >= totalSlides) {
//         newSlide = 0;
//       }
//       return newSlide;
//     });
//     resetAutoSlide();
//   };

//   const goToSlide = (slideIndex) => {
//     setCurrentSlide(slideIndex);
//     resetAutoSlide();
//   };

//   const handleMouseEnter = () => {
//     if (autoSlideIntervalRef.current) {
//       clearInterval(autoSlideIntervalRef.current);
//     }
//   };

//   const handleMouseLeave = () => {
//     startAutoSlide();
//   };

//   const handleSlideAction = (buttonText) => {
//     // Handle different button actions
//     switch(buttonText) {
//       case 'Xem Ngay':
//         alert('Chuyển đến trang chi tiết sản phẩm Samsung S25 Ultra');
//         break;
//       case 'Mua Ngay':
//         alert('Chuyển đến trang mua hàng');
//         break;
//       case 'Khám Phá':
//         alert('Khám phá Honor Magic V5');
//         break;
//       case 'Đặt Hàng':
//         alert('Đặt hàng Oppo Find X9');
//         break;
//       default:
//         alert('Chức năng đang được phát triển');
//     }
//   };

//   return (
//     <div className={styles.bannerContainer}>
//       <div className={styles.sliderContainer}>
//         <div 
//           className={styles.sliderWrapper} 
//           ref={sliderWrapperRef}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//         >
//           {slides.map((slide, index) => (
//             <div key={index} className={styles.slide}>
//               <img src={slide.image} alt={slide.alt} />
//               <div className={styles.slideContent}>
//                 <button 
//                   onClick={() => handleSlideAction(slide.buttonText)}
//                   className={styles.slideButton}
//                 >
//                   {slide.buttonText}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         {/* Navigation Buttons */}
//         <button 
//           className={`${styles.navButton} ${styles.prev}`} 
//           onClick={() => changeSlide(-1)}
//           aria-label="Previous slide"
//         >
//           &#8249;
//         </button>
//         <button 
//           className={`${styles.navButton} ${styles.next}`} 
//           onClick={() => changeSlide(1)}
//           aria-label="Next slide"
//         >
//           &#8250;
//         </button>
        
//         {/* Dots Navigation */}
//         <div className={styles.dotsContainer}>
//           {slides.map((_, index) => (
//             <div
//               key={index}
//               className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;



//new
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Banner.module.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderWrapperRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    { 
      id: 1,
      image: "/images/banner-3.png", 
      alt: "SamSung Galaxy S25 Ultra", 
      buttonText: "Xem Ngay",
      link: "/products" // Link đích đến
    },
    { 
      id: 2,
      image: "/images/banner-2.png", 
      alt: "Khuyến mãi", 
      buttonText: "Mua Ngay",
      link: "/products"
    },
    { 
      id: 3,
      image: "/images/banner-5.png", 
      alt: "Honor Magic V5", 
      buttonText: "Khám Phá",
      link: "/products"
    },
    { 
      id: 4,
      image: "/images/banner-4.png", 
      alt: "Oppo Find X9", 
      buttonText: "Đặt Hàng",
      link: "/products"
    }
  ];

  const totalSlides = slides.length;
  const startAutoSlide = () => {
    autoSlideIntervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 4000);
  };

  const resetAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (sliderWrapperRef.current) {
      sliderWrapperRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  const changeSlide = (direction) => {
    setCurrentSlide(prev => {
      let newSlide = prev + direction;
      if (newSlide < 0) {
        newSlide = totalSlides - 1;
      } else if (newSlide >= totalSlides) {
        newSlide = 0;
      }
      return newSlide;
    });
    resetAutoSlide();
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
    resetAutoSlide();
  };

  const handleMouseEnter = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    startAutoSlide();
  };

  const handleButtonClick = (link) => {
    navigate(link);
  };

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.sliderContainer}>
        <div 
          className={styles.sliderWrapper} 
          ref={sliderWrapperRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className={styles.slide}>
              <img src={slide.image} alt={slide.alt} />
              <div className={styles.slideContent}>
                <button 
                  onClick={() => handleButtonClick(slide.link)}
                  className={styles.slideButton}
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className={`${styles.navButton} ${styles.prev}`} 
          onClick={() => changeSlide(-1)}
        >
          &#8249;
        </button>
        <button 
          className={`${styles.navButton} ${styles.next}`} 
          onClick={() => changeSlide(1)}
        >
          &#8250;
        </button>
        
        <div className={styles.dotsContainer}>
          {slides.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;