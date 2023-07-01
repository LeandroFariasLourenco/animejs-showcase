const CLASSES = {
  showcase: 'js--showcase',
  block: 'js--showcase--block',
};

class OfferService {
  offers = [];

  generateRandomNumber(max) {
    return Math.floor((Math.random() * max))
  }

  async fetchOffers() {
    const response = await fetch('https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json').then((response) => response.json());
    
    let randomNumbersList = [];
    Array.from({ length: 4 }, () => {
      let randomNumber = this.generateRandomNumber(response.offers.length);
      while (randomNumbersList.includes(randomNumber)) {
        randomNumber = this.generateRandomNumber(response.offers.length - 1);
      }
      randomNumbersList.push(randomNumber);
    })
    this.offers = randomNumbersList.map((number) => response.offers[number]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const offerService = new OfferService();
  const SELECTORS = {
    showcase: document.querySelector(`.${CLASSES.showcase}`),
    block: null,
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
    await offerService.fetchOffers();

    offerService.offers.forEach((offer) => {
      const container = document.createElement('div');
      container.classList.add('main-showcase-block', CLASSES.block);
      const block = {
        image: document.createElement('img'),
        price: document.createElement('span')
      };

      block.image.classList.add('main-showcase-block-image');
      block.image.src = offer.imgURL;
      block.image.alt = offer.name;
      block.image.title = offer.name;

      block.price.classList.add('main-showcase-block-price');
      block.price.textContent = `${offer.price} ${offer.currency}`
      
      container.appendChild(block.image);
      container.appendChild(block.price);

      SELECTORS.showcase.appendChild(container);
    });
    SELECTORS.block = document.querySelectorAll(`.${CLASSES.block}`);
    SELECTORS.block[activeIndex].classList.add('animated');

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
