const CLASSES = {
  slider: 'js--slider--container',
};

class OfferService {
  offers = [];  
  
  async fetchOffers() {
    const response = await fetch('https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json').then((res) => res.json());

    this.offers = response.offers.filter((_, index) => index > 0&& index < 4);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const offerService = new OfferService();
  await offerService.fetchOffers();
  
  const SELECTORS = {
    slider: document.querySelector(`.${CLASSES.slider}`)
  };

  const renderSlider = () => {
    offerService.offers.forEach((offer) => {
      const currentSlide = document.createElement('div');
      currentSlide.classList.add('swiper-slide');
      const product = {
        image: document.createElement('img'),
        name: document.createElement('p'),
        price: document.createElement('span'),
        check: document.createElement('button'),
      };
      product.image.classList.add('swiper-slide-image');
      product.image.src = offer.imgURL;
      product.image.alt = offer.name;
      product.image.title = offer.name;

      product.name.classList.add('swiper-slide-name');
      product.name.textContent = offer.name;

      product.price.classList.add('swiper-slide-price');
      product.price.textContent = `${offer.price} ${offer.currency}`;

      product.check.classList.add('swiper-slide-button');
      product.check.textContent = 'Check';

      SELECTORS.slider.append(currentSlide);
      currentSlide.appendChild(product.image);
      currentSlide.appendChild(product.name);
      currentSlide.appendChild(product.price);
      currentSlide.appendChild(product.check);
    });
  };

  renderSlider();
});
