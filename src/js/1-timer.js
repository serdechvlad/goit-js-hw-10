import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Чекаємо, поки DOM повністю завантажиться
document.addEventListener('DOMContentLoaded', () => {
  const datetimePicker = document.getElementById('datetime-picker');
  const startButton = document.querySelector('[data-start]');
  const daysValue = document.querySelector('[data-days]');
  const hoursValue = document.querySelector('[data-hours]');
  const minutesValue = document.querySelector('[data-minutes]');
  const secondsValue = document.querySelector('[data-seconds]');

  let userSelectedDate = null;
  let countdownInterval = null;

  // Перевіряємо, чи елемент існує
  if (!datetimePicker) {
    console.error('Елемент #datetime-picker не знайдено в DOM.');
    return;
  }

  // Ініціалізація flatpickr
  flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      userSelectedDate = selectedDates[0];
      if (userSelectedDate < new Date()) {
        iziToast.error({
          title: 'Error',
          message: 'Please choose a date in the future',
        });
        startButton.disabled = true;
      } else {
        startButton.disabled = false;
      }
    },
  });

  // Обробник кнопки "Start"
  startButton.addEventListener('click', () => {
    startButton.disabled = true;
    datetimePicker.disabled = true;
    countdownInterval = setInterval(updateTimer, 1000);
  });

  // Функція для оновлення таймера
  function updateTimer() {
    const now = new Date();
    const timeDifference = userSelectedDate - now;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      daysValue.textContent = '00';
      hoursValue.textContent = '00';
      minutesValue.textContent = '00';
      secondsValue.textContent = '00';
      datetimePicker.disabled = false;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);

    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
  }

  // Функція для перетворення мілісекунд у дні, години, хвилини та секунди
  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  // Функція для додавання ведучого нуля
  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
});
