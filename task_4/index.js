const CLASSES = {
  city: 'js--slide--city',
  country: 'js--slide--country',
  pricing: 'js--slide--value',
  priceSymbol: 'js--slide-symbol',
  priceContainer: 'js--price--container',
  slide: {
    indicators: 'js--slide--indicators',
    backgrounds: 'js--slide--backgrounds'
  },
  active: {
    class: 'active',
    slide: 'js--active--slide',
    indicator: 'js--active--indicator',
  },
};

class OfferService {
  offers = [];

  async fetchOffers() {
    const response = await fetch('https://rekrutacja.webdeveloper.rtbhouse.net/files/banner_vip.json').then((res) => res.json());

    this.offers = response.offers;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  let SELECTORS = {};

  const querySelectors = () => {
    SELECTORS = {
      city: document.querySelector(`.${CLASSES.city}`),
      country: document.querySelector(`.${CLASSES.country}`),
      pricing: document.querySelector(`.${CLASSES.pricing}`),
      priceSymbol: document.querySelector(`.${CLASSES.priceSymbol}`),
      priceContainer: document.querySelector(`.${CLASSES.priceContainer}`),
      slide: {
        indicators: document.querySelector(`.${CLASSES.slide.indicators}`),
        backgrounds: document.querySelector(`.${CLASSES.slide.backgrounds}`)
      },
      active: {
        slide: document.querySelector(`.${CLASSES.active.slide}`),
        indicator: document.querySelector(`.${CLASSES.active.indicator}`),
      },
    };
  }

  querySelectors();
  const offerService = new OfferService();
  await offerService.fetchOffers();
  let currentSlide = 0;

  const createSlider = () => {
    offerService.offers.forEach((offer, index) => {
      const backgroundImage = document.createElement('img');
      backgroundImage.src = offer.imgURL;
      backgroundImage.alt = offer.city;
      backgroundImage.title = offer.city;
      backgroundImage.style.zIndex = index + 1;
      backgroundImage.classList.add('slide-background');

      SELECTORS.slide.backgrounds.appendChild(backgroundImage);

      const slideIndicator = document.createElement('div');
      slideIndicator.classList.add('slide-indicators-block');
      SELECTORS.slide.indicators.appendChild(slideIndicator);

      if (index === 0) {
        backgroundImage.classList.add(CLASSES.active.class, CLASSES.active.slide);
        bindSlideOfferInfo(offer);
        slideIndicator.classList.add(CLASSES.active.class, CLASSES.active.indicator);
      }
    });
  };

  const toggleAnimationState = (state) => {
    if (state === 'remove') {
      SELECTORS.priceSymbol.style.animationDelay = '1s';
      SELECTORS.country.style.animationDelay = '1s';
      SELECTORS.pricing.style.animationDelay = '1s';
      SELECTORS.city.style.animationDelay = '1s';
      SELECTORS.priceContainer.style.animationDelay = '1s';
    }

    SELECTORS.priceSymbol.classList[state]('closing');
    SELECTORS.country.classList[state]('closing');
    SELECTORS.pricing.classList[state]('closing');
    SELECTORS.city.classList[state]('closing');
    SELECTORS.priceContainer.classList[state]('closing');
  }

  const bindSlideOfferInfo = (offer, restartAnimation = false) => {
    SELECTORS.city.setAttribute('data-label', offer.city);
    
    SELECTORS.country.setAttribute('data-label', offer.country);
    SELECTORS.pricing.textContent = offer.price;
    SELECTORS.priceSymbol.textContent = offer.currency;
    
    if (restartAnimation) {
      toggleAnimationState('remove');
    }

    const nextSlide = SELECTORS.active.slide?.nextSibling;
    if (nextSlide) {
      SELECTORS.active.slide.classList.add('previous');
      SELECTORS.active.slide.classList.remove(CLASSES.active.slide, CLASSES.active.class);
      nextSlide.classList.add(CLASSES.active.slide, CLASSES.active.class);
    }

    const nextIndicator = SELECTORS.active.indicator?.nextSibling;
    if (nextIndicator) {
      SELECTORS.active.indicator.classList.remove(CLASSES.active.indicator, CLASSES.active.class);
      nextIndicator.classList.add(CLASSES.active.indicator, CLASSES.active.class);
    }
    querySelectors();
  }

  const nextSlideImage = () => {
    currentSlide++;
    bindSlideOfferInfo(offerService.offers[currentSlide], true);
  };

  const isLastSlide = () => currentSlide === offerService.offers.length - 1;

  const setupInitialTimer = () => {
    const initialSlideTimer = {
      info: 5000,
      image: 6000,
    };
    setTimeout(() => {
      toggleAnimationState('add');
    }, initialSlideTimer.info);
    setTimeout(() => {
      nextSlideImage();
    }, initialSlideTimer.image);
  };

  const setupDefaultTimer = () => {
    const defaultSlideTimer = {
      info: 4000,
      image: 5000,
    };
    const closeSlideInfoInterval = setInterval(() => {
      toggleAnimationState('add');
      if (isLastSlide()) {
        clearInterval(closeSlideInfoInterval);
      }
    }, defaultSlideTimer.info);

    const closeSlideAnimationTimer = slideTimer + 2000;
    const changeBackgroundInterval = setInterval(() => {
      nextSlideImage();

      if (isLastSlide()) {
        clearInterval(changeBackgroundInterval, true);
      }
    }, defaultSlideTimer.image);
  };

  createSlider();
  setupInitialTimer();
});
