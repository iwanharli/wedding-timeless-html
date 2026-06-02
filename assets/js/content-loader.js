(function () {
  function lookup(data, path) {
    if (!path) return null;
    return path.split('.').reduce(function (obj, key) {
      return obj && obj[key] !== undefined ? obj[key] : null;
    }, data);
  }

  function setText(el, value) {
    if (value !== null && value !== undefined) {
      el.textContent = value;
    }
  }

  function setSrc(el, value) {
    if (value) {
      el.setAttribute('src', value);
    }
  }

  function setHref(el, value) {
    if (value) {
      el.setAttribute('href', value);
    }
  }

  function setBg(el, value) {
    if (value) {
      el.style.backgroundImage = 'url(' + value + ')';
      if (el.hasAttribute('data-dce-background-image-url')) {
        el.setAttribute('data-dce-background-image-url', value);
      }
      if (el.hasAttribute('data-dce-background-overlay-image-url')) {
        el.setAttribute('data-dce-background-overlay-image-url', value);
      }
    }
  }

  function applyBindings(data) {
    document.querySelectorAll('[data-text-key]').forEach(function (el) {
      var value = lookup(data, el.dataset.textKey);
      if (value !== null) {
        setText(el, value);
      }
    });

    document.querySelectorAll('[data-src-key]').forEach(function (el) {
      var value = lookup(data, el.dataset.srcKey);
      if (value !== null) {
        setSrc(el, value);
      }
    });

    document.querySelectorAll('[data-video-src-key]').forEach(function (el) {
      var value = lookup(data, el.dataset.videoSrcKey);
      if (value !== null) {
        setSrc(el, value);
      }
    });

    document.querySelectorAll('[data-audio-src-key]').forEach(function (el) {
      var value = lookup(data, el.dataset.audioSrcKey);
      if (value !== null) {
        setSrc(el, value);
      }
    });

    document.querySelectorAll('[data-href-key]').forEach(function (el) {
      var value = lookup(data, el.dataset.hrefKey);
      if (value !== null) {
        setHref(el, value);
      }
    });

    document.querySelectorAll('[data-bg-key]').forEach(function (el) {
      var value = lookup(data, el.dataset.bgKey);
      if (value !== null) {
        setBg(el, value);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetch('assets/data/content.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to load content.json: ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        applyBindings(data);
      })
      .catch(function (err) {
        console.warn('Content loader:', err);
      });
  });
})();
