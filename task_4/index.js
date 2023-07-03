const CLASSES = {
  main: 'js-main',
  slide: {
    backgrounds: 'js-backgrounds',
  },
  footer: {
    value: 'js-footer-value',
    symbol: 'js-footer-symbol',
    price: 'js-footer-price',
    class: 'js-footer',
    indicators: 'js-footer-indicators',
    button: 'js-footer-button',
    country: { title: 'js-footer-country-title', container: 'js-footer-country' },
    city: { title: 'js-footer-city-title', container: 'js-footer-city' },
    bar: 'js-footer-bar',
  },
  animations: {
    yellowBackground: 'js-yellow-background',
    logo: 'js-logo',
  },
};

class BannerService {
  banners = [];

  async fetchBanners() {
    const response = await fetch('https://rekrutacja.webdeveloper.rtbhouse.net/files/banner_vip.json').then((res) => res.json());

    this.banners = response.offers;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const SELECTORS = {
    slide: {
      backgrounds: document.querySelector(`.${CLASSES.slide.backgrounds}`),
    },
    animations: {
      yellowBackground: document.querySelector(`.${CLASSES.animations.yellowBackground}`),
      logo: document.querySelector(`.${CLASSES.animations.logo}`),
    },
    main: document.querySelector(`.${CLASSES.main}`),
    footer: {
      country: {
        title: document.querySelector(`.${CLASSES.footer.country.title}`),
        container: document.querySelector(`.${CLASSES.footer.country.container}`)
      },
      city: {
        title: document.querySelector(`.${CLASSES.footer.city.title}`),
        container: document.querySelector(`.${CLASSES.footer.city.container}`)
      },
      value: document.querySelector(`.${CLASSES.footer.value}`),
      symbol: document.querySelector(`.${CLASSES.footer.symbol}`),
      price: document.querySelector(`.${CLASSES.footer.price}`),
      class: document.querySelector(`.${CLASSES.footer.class}`),
      indicators: document.querySelector(`.${CLASSES.footer.indicators}`),
      button: document.querySelector(`.${CLASSES.footer.button}`),
      bar: document.querySelector(`.${CLASSES.footer.bar}`)
    },
  };
  const bannerService = new BannerService();

  let activeBanner;
  const createBanners = async () => {
    await bannerService.fetchBanners();

    bannerService.banners.forEach((offer) => {
      const image = document.createElement('img');
      image.src = offer.imgURL;
      image.title = offer.country;
      image.alt = offer.country;
      image.classList.add('slide-background', 'swiper-slide');

      const indicator = document.createElement('div');
      indicator.classList.add('slide-indicators-block');
      const indicatorBackground = document.createElement('div');
      indicatorBackground.classList.add('slide-indicators-block-background');
      indicator.appendChild(indicatorBackground);

      SELECTORS.footer.indicators.appendChild(indicator);
      SELECTORS.slide.backgrounds.appendChild(image);
    });

    setActiveBanner(bannerService.banners[0], 0);
    setupInitialAnimation();
  };

  const setActiveBanner = (banner, index) => {
    activeBanner = index;
    SELECTORS.footer.city.title.textContent = banner.city;
    SELECTORS.footer.country.title.textContent = banner.country;
    SELECTORS.footer.value.textContent = banner.price;
    SELECTORS.footer.symbol.textContent = banner.currency;
    const indicator = SELECTORS.footer.indicators.children[activeBanner].firstChild;
    const background = SELECTORS.slide.backgrounds.children[activeBanner];

    anime({
      targets: indicator,
      scaleX: { value: [0, 1], duration: 1000 }
    });

    if (index !== 0) {
      anime.timeline({
        targets: background,
        easing: 'spring(0, 100, 100, 10)',
        left: { value: [300, 0], duration: 400 }
      })
        .add({
          targets: getIndicator(activeBanner),
          translateX: { value: [-50, 0], duration: 350 },
          scaleX: { value: 1, duration: 0 },
        })
        .add({
          targets: getIndicator(activeBanner - 1),
          translateX: { value: [0, 50], duration: 350 },
        }, '-=250')
    }
  }

  const setupInfoAnimation = () => {
    const isFirstBanner = activeBanner === 0;
    const timeline = anime.timeline({ easing: 'easeInOutSine' })
      .add({
        targets: SELECTORS.footer.country.container,
        scaleX: { value: [0, 1], duration: 350 }
      });
    if (!isFirstBanner) {
      initBannerAnimation(activeBanner);
    }
    timeline.add({
      targets: SELECTORS.footer.city.container,
      scaleX: { value: [0, 1], duration: 350 }
    })
      .add({
        targets: SELECTORS.footer.country.title,
        translateY: { value: [50, 0], duration: 200 }
      }, '-=200');

    if (isFirstBanner) {
      timeline.add({
        targets: SELECTORS.footer.button,
        translateX: { value: [300, 0], duration: 300 },
      }, '-=300');
    }
    timeline.add({
      targets: SELECTORS.footer.price,
      translateY: { value: [200, 0], duration: 350 }
    }, '-=300');

    if (isFirstBanner) {
      timeline.add({
        targets: SELECTORS.footer.bar,
        scaleX: { value: [0, 1], duration: 300 }
      }, '-=400');
    }
    timeline.add({
      targets: SELECTORS.footer.city.title,
      translateY: { value: [50, 0], duration: 200 }
    });
  }

  const getIndicator = (index) => {
    return SELECTORS.footer.indicators.children[index].children[0];
  }

  const setupExitAnimation = () => {
    anime.timeline({ easing: 'easeInOutSine' })
      .add({
        targets: SELECTORS.footer.country.title,
        translateY: { value: [0, -50], duration: 200 }
      })
      .add({
        targets: SELECTORS.footer.city.title,
        translateY: { value: [0, -50], duration: 200 }
      })
      .add({
        targets: SELECTORS.footer.price,
        translateY: { value: [0, -50], duration: 200 }
      }, '-=200')
      .add({
        targets: SELECTORS.footer.country.container,
        scaleX: { value: [1, 0], duration: 350 }
      }, '-=200')
      .add({
        targets: SELECTORS.footer.city.container,
        scaleX: { value: [1, 0], duration: 350 },
        complete: () => {
          setActiveBanner(bannerService.banners[activeBanner + 1], activeBanner + 1);
          setupInfoAnimation();
        }
      }, '-=100')
  };

  const initBannerAnimation = (bannerIndex) => {
    const images = SELECTORS.slide.backgrounds.querySelectorAll('img');
    anime({
      targets: images[bannerIndex],
      scale: { value: [1, 1.50], duration: 10000 },
      easing: 'linear',
    });
  }

  const setupInitialAnimation = () => {
    const timeline = anime.timeline({ easing: 'easeInOutSine' })
      .add({
        targets: SELECTORS.animations.yellowBackground,
        translateY: { value: [600, 0], duration: 500, delay: 300 },
      })
      .add({
        targets: SELECTORS.animations.logo,
        translateX: { value: [-300, 30], duration: 400 },
        translateY: { value: 300, duration: 0 },
      })
      .add({
        targets: SELECTORS.animations.logo,
        duration: 400,
        delay: 300,
        translateY: 0,
      })
      .add({ targets: SELECTORS.slide.backgrounds, opacity: { value: 1, duration: 100 } })
      .add({
        targets: SELECTORS.animations.yellowBackground,
        translateY: { value: [0, -600], duration: 400 },
      });
    initBannerAnimation(activeBanner);
    timeline.add({
      targets: SELECTORS.footer.class,
      translateY: { value: [600, 0], duration: 300 },
      complete: () => {
        setupInfoAnimation();
      }
    });
  }

  const endAnimation = () => {
    anime({
      targets: SELECTORS.main,
      opacity: { value: [1, 0], duration: 1000 },
    });
  }

  createBanners();
  const timeout = setTimeout(() => {
    setupExitAnimation();
    clearTimeout(timeout);

    const interval = setInterval(() => {
      if (activeBanner === bannerService.banners.length - 1) {
        clearInterval(interval);
        endAnimation();
        return;
      }

      setupExitAnimation();
    }, 4000);
  }, 5000);
});
