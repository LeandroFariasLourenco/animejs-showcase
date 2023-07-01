const CLASSES = {
  swiper: {
    class: 'js--swiper',
    wrapper: 'js--swiper--wrapper',
  }
};

class OfferService {
  offers = [];

  generateRandomNumber(max) {
    return Math.floor((Math.random() * max))
  }

  async fetchOffers() {
    const response = await fetch('https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json').then((res) => res.json());

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

document.addEventListener('DOMContentLoaded', async () => {
  const offerService = new OfferService();
  await offerService.fetchOffers();

  const SELECTORS = {
    swiper: {
      class: document.querySelector(`.${CLASSES.swiper.class}`),
      wrapper: document.querySelector(`.${CLASSES.swiper.wrapper}`)
    }
  };

  const renderSlider = () => {
    offerService.offers.forEach((offer) => {
      const currentSlide = document.createElement('div');
      currentSlide.classList.add('carousel-slide', 'swiper-slide');
      const product = {
        image: {
          container: document.createElement('div'),
          thumb: document.createElement('img'),
        },
        name: document.createElement('p'),
        price: document.createElement('span'),
        check: document.createElement('button'),
      };
      product.image.container.classList.add('carousel-slide-image-container');
      product.image.thumb.classList.add('carousel-slide-image');
      product.image.thumb.src = offer.imgURL;
      product.image.thumb.alt = offer.name;
      product.image.thumb.title = offer.name;

      product.name.classList.add('carousel-slide-name');
      product.name.textContent = offer.name;

      product.price.classList.add('carousel-slide-price');
      product.price.textContent = `${offer.price} ${offer.currency}`;

      product.check.classList.add('carousel-slide-button');
      product.check.textContent = 'Check';

      SELECTORS.swiper.wrapper.append(currentSlide);
      currentSlide.appendChild(product.image.container);
      product.image.container.appendChild(product.image.thumb);
      currentSlide.appendChild(product.name);
      currentSlide.appendChild(product.price);
      currentSlide.appendChild(product.check);
    });

    new Swiper(`.${CLASSES.swiper.class}`, {
      loop: true,
      grabCursor: true,
    });
  };

  renderSlider();
});
