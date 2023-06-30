const CLASSES = {
  timer: {
    days: 'js--days',
    hours: 'js--hours',
    minutes: 'js--minutes',
    seconds: 'js--seconds',
    reset: 'js--reset',
    counter: 'js--counter'
  }
}

const CONSTANTS = {
  secondsInMinute: 60,
  msInSecond: 1000,
  minutesInHour: 60,
  hoursInDay: 24,
  daysToCount: 7,
  msInDay: 86_400_000,
  timeToUpdate: 1000,
};

class TimerService {
  countdown = {};
  storageKeys = {
    difference: 'difference'
  }
  limit = null;
  startDate = null;
  finished = false;

  createTimer() {
    const storedLimit = localStorage.getItem(this.storageKeys.difference);
    let limit;

    if (!storedLimit) {
      limit = this.getTimeLimit();
      localStorage.setItem(this.storageKeys.difference, JSON.stringify(limit));
    } else {
      limit = new Date(JSON.parse(storedLimit));
    }

    this.limit = limit;
  }

  formatDate(miliseconds) {
    return Math.floor(miliseconds) < 10 ? `0${Math.floor(miliseconds)}` : `${Math.floor(miliseconds)}`;
  }

  getTimeLimit() {
    return new Date(new Date().getTime() + (CONSTANTS.msInDay * CONSTANTS.daysToCount))
  }

  resetTimer() {
    this.finished = false;
    localStorage.removeItem(this.storageKeys.difference);
    this.limit = this.getTimeLimit();
  }

  updateTimer() {
    const difference = this.limit.getTime() - new Date().getTime();
    if (difference <= CONSTANTS.msInSecond * 2) {
      this.finished = true;
      this.countdown = {
        days: this.formatDate(0),
        hours: this.formatDate(0),
        minutes: this.formatDate(0),
        seconds: this.formatDate(1),
      };
      return;
    }
    this.countdown = {
      days: this.formatDate(difference /
        (CONSTANTS.msInSecond
          * CONSTANTS.secondsInMinute
          * CONSTANTS.minutesInHour
          * CONSTANTS.hoursInDay)
      ),
      hours: this.formatDate(difference %
        (CONSTANTS.msInSecond
          * CONSTANTS.secondsInMinute
          * CONSTANTS.minutesInHour
          * CONSTANTS.hoursInDay
        ) / (CONSTANTS.msInSecond * CONSTANTS.secondsInMinute * CONSTANTS.minutesInHour)
      ),
      minutes: this.formatDate(difference %
        (CONSTANTS.msInSecond * CONSTANTS.secondsInMinute * CONSTANTS.minutesInHour)
        / (CONSTANTS.msInSecond * CONSTANTS.secondsInMinute)),
      seconds: this.formatDate(
        difference %
        (CONSTANTS.msInSecond * CONSTANTS.secondsInMinute) / CONSTANTS.msInSecond
      ),
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const SELECTORS = {
    timer: {
      days: document.querySelector(`.${CLASSES.timer.days}`),
      hours: document.querySelector(`.${CLASSES.timer.hours}`),
      minutes: document.querySelector(`.${CLASSES.timer.minutes}`),
      seconds: document.querySelector(`.${CLASSES.timer.seconds}`),
      reset: document.querySelector(`.${CLASSES.timer.reset}`),
      counter: document.querySelector(`.${CLASSES.timer.counter}`)
    },
  };
  const timerService = new TimerService();

  const updateTimer = () => {
    timerService.updateTimer();
    SELECTORS.timer.days.textContent = timerService.countdown.days;
    SELECTORS.timer.hours.textContent = timerService.countdown.hours;
    SELECTORS.timer.minutes.textContent = timerService.countdown.minutes;
    SELECTORS.timer.seconds.textContent = timerService.countdown.seconds;
  }

  const setupTimer = () => {
    SELECTORS.timer.counter.classList.remove('finished');
    timerService.createTimer();
    updateTimer();

    const interval = setInterval(() => {
      updateTimer();

      if (timerService.finished) {
        clearInterval(interval);
        SELECTORS.timer.counter.classList.add('finished') 
      }
    }, CONSTANTS.timeToUpdate)
  }

  const resetTimerListener = () => {
    SELECTORS.timer.reset.addEventListener('click', () => {
      timerService.resetTimer();
      setupTimer();
    });
  }

  setupTimer();
  resetTimerListener();
});
