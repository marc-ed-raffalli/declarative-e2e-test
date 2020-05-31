/**
 * Copyright © 2020 Marc Ed. Raffalli
 * https://marc-ed-raffalli.github.io/
 *
 * See LICENCE file
 */
(function () {

  const
    view = {
      get themeSwitch() {
        return document.querySelector('.navbar .theme-switch');
      }
    };

  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

  function onDOMContentLoaded() {
    view.themeSwitch.addEventListener('click', (e) => {
      e.target.classList.toggle('active');

      const value = e.target.value;

      if (!value) {
        return;
      }

      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(value === 'light' ? 'light-theme' : 'dark-theme');
    });
  }

}());
