const CLASSES = {
  showcase: 'js--showcase',
  block: 'js--showcase--block',
};

class OfferService {
  offers = [];

  async fetchOffers() {
    const response = await fetch('https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json').then((response) => response.json());

    this.offers = response.offers;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const offerService = new OfferService();
  const SELECTORS = {
    showcase: document.querySelector(`.${CLASSES.showcase}`),
    block: document.querySelectorAll(`.${CLASSES.block}`),
  };
  let interval;
  let activeIndex = 0;

  const setupInterval = () => {
    interval = setInterval(() => {
      SELECTORS.block[activeIndex].classList.remove('animated');
      activeIndex = SELECTORS.block.length - 1 === activeIndex ? 0 : activeIndex + 1;
      SELECTORS.block[activeIndex].classList.add('animated');
    }, 2000);
  }

  const createOffers = async () => {
    SELECTORS.block[activeIndex].classList.add('animated');


    await offerService.fetchOffers();
    SELECTORS.block.forEach((block, index) => {
      block.addEventListener('mouseover', () => {
        const previousAnimatedBlock = Array.from(SELECTORS.block).find((node) => node.classList.contains('animated'));
        previousAnimatedBlock.classList.remove('animated');
        block.classList.add('animated');
        clearInterval(interval);
      });
      block.addEventListener('mouseout', () => {
        activeIndex = index;
        setupInterval();
      });
    });
    setupInterval();
  };

  createOffers();
});
