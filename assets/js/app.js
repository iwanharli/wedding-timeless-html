/* app.js — inline scripts extracted from index.html */

/* ── Lightbox Gallery ── */
// Custom Lightbox Gallery yang bisa digeser kanan-kiri - untuk struktur HTML baru
document.addEventListener('DOMContentLoaded', function() {
  // Cari semua elemen gambar dalam struktur Swiper yang baru
  const galleryImages = document.querySelectorAll('.gal-swiper .swiper-slide:not(.swiper-slide-duplicate) .gal-img-wrap img');
  const imageList = Array.from(galleryImages).map(img => {
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || ''
    };
  });

  // Buat elemen-elemen lightbox
  const lightboxHTML = `
    <div id="custom-lightbox" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 9999; opacity: 0; transition: opacity 0.3s;">
      <div class="lightbox-content" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 95%; max-height: 95%;">
        <img id="lightbox-img" src="" alt="" style="width: 100%; max-height: 90vh; display: block; margin: 0 auto; object-fit: contain;">
        <div class="lightbox-caption" style="color: white; text-align: center; padding: 10px; font-family: Arial; margin-top: 10px;"></div>
      </div>
      <button id="lightbox-prev" style="position: absolute; top: 50%; left: 20px; transform: translateY(-50%); background: none; border: none; color: white; font-size: 30px; cursor: pointer; padding: 20px;">❮</button>
      <button id="lightbox-next" style="position: absolute; top: 50%; right: 20px; transform: translateY(-50%); background: none; border: none; color: white; font-size: 30px; cursor: pointer; padding: 20px;">❯</button>
      <button id="lightbox-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; color: white; font-size: 30px; cursor: pointer;">✕</button>
      <div id="lightbox-counter" style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; color: white; font-family: Arial;"></div>
    </div>
  `;

  // Tambahkan HTML lightbox ke body jika belum ada
  if (!document.getElementById('custom-lightbox')) {
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  // Dapatkan elemen-elemen yang diperlukan
  const lightbox = document.getElementById('custom-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const closeBtn = document.getElementById('lightbox-close');
  const counter = document.getElementById('lightbox-counter');

  let currentIndex = 0;

  // Fungsi untuk membuka lightbox
  function openLightbox(index) {
    currentIndex = index;
    const image = imageList[currentIndex];

    // Gunakan URL gambar asli, tetapi coba dapatkan versi yang lebih besar jika tersedia
    let largeImageSrc = image.src;
    // Cek apakah ini adalah thumbnail dan bisa diganti dengan versi lebih besar
    if (largeImageSrc.includes('-scaled.') || largeImageSrc.includes('-300x') || largeImageSrc.includes('-150x')) {
      // Coba gunakan versi gambar yang lebih besar jika tersedia
      largeImageSrc = largeImageSrc.replace(/-\d+x\d+(?=\.\w+$)/, '').replace('-scaled', '');
    }

    lightboxImg.src = largeImageSrc;
    lightboxImg.alt = image.alt;
    counter.textContent = `${currentIndex + 1} / ${imageList.length}`;

    // Cek apakah device mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Untuk mobile, atur ukuran gambar untuk mengisi layar dengan lebih baik
      lightboxImg.style.width = '100%';
      lightboxImg.style.height = 'auto';
      lightboxImg.style.maxWidth = '100vw';
    }

    lightbox.style.display = 'block';
    setTimeout(() => {
      lightbox.style.opacity = '1';
    }, 10);

    // Disable scroll pada body
    document.body.style.overflow = 'hidden';
  }

  // Fungsi untuk menutup lightbox
  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
    }, 300);

    // Enable scroll pada body
    document.body.style.overflow = '';
  }

  // Fungsi untuk navigasi ke gambar sebelumnya
  function prevImage() {
    currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    const image = imageList[currentIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    counter.textContent = `${currentIndex + 1} / ${imageList.length}`;
  }

  // Fungsi untuk navigasi ke gambar berikutnya
  function nextImage() {
    currentIndex = (currentIndex + 1) % imageList.length;
    const image = imageList[currentIndex];
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
    counter.textContent = `${currentIndex + 1} / ${imageList.length}`;
  }

  // Tambahkan event listener untuk elemen gambar
  galleryImages.forEach((img, index) => {
    // Pastikan gambar dan parent wrappernya dapat diklik
    img.style.cursor = 'pointer';
    const parentWrapper = img.closest('.gal-img-wrap');
    if (parentWrapper) {
      parentWrapper.style.cursor = 'pointer';

      // Tambahkan event listener ke parent wrapper
      parentWrapper.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(index);
        return false;
      });
    }

    // Tambahkan juga event listener langsung ke gambar
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(index);
      return false;
    });
  });

  // Tambahkan event listener untuk tombol-tombol
  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);
  closeBtn.addEventListener('click', closeLightbox);

  // Tambahkan event listener untuk menutup dengan tombol Escape
  document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'block') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    }
  });

  // Tambahkan event listener untuk menutup dengan klik di luar gambar
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Tambahkan dukungan untuk swipe pada perangkat sentuh
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe ke kiri -> next image
      nextImage();
    } else if (touchEndX > touchStartX + 50) {
      // Swipe ke kanan -> previous image
      prevImage();
    }
  }

  // Fungsi untuk menjalankan script saat halaman sudah dimuat sepenuhnya
  function initLightbox() {
  }

  // Jalankan inisialisasi
  initLightbox();
});

// Fungsi untuk memastikan bahwa script berjalan meskipun DOMContentLoaded telah terjadi
(function() {
  if (document.readyState === 'loading') {
    // Dokumen masih dimuat, gunakan event listener
  } else {
    // DOMContentLoaded sudah terjadi

    // Secara manual memicu kode yang ada dalam event listener DOMContentLoaded
    const scriptEvent = new Event('load-lightbox');
    document.dispatchEvent(scriptEvent);

    // Pastikan lightbox diinisialisasi
    setTimeout(function() {
      const galleryImages = document.querySelectorAll('.gal-swiper .swiper-slide:not(.swiper-slide-duplicate) .gal-img-wrap img');
      if (galleryImages.length > 0 && !document.getElementById('custom-lightbox')) {
        // Memicu kembali eksekusi script
        const retryEvent = new Event('load-lightbox');
        document.dispatchEvent(retryEvent);
      }
    }, 1000);
  }
})();

/* ── Audio Toggle ── */
document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.getElementById('song');
    const unmuteIcon  = document.getElementById('unmute-sound');
    const muteIcon    = document.getElementById('mute-sound');

    if (!audioElement || !unmuteIcon || !muteIcon) return;

    function toggleAudio() {
        if (audioElement.paused) {
            audioElement.play();
            unmuteIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            audioElement.pause();
            unmuteIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }
    }

    unmuteIcon.addEventListener('click', toggleAudio);
    muteIcon.addEventListener('click', toggleAudio);
    audioElement.addEventListener('play',  () => { unmuteIcon.style.display = 'none';  muteIcon.style.display = 'block'; });
    audioElement.addEventListener('pause', () => { unmuteIcon.style.display = 'block'; muteIcon.style.display = 'none'; });
});

/* ── Font Size Clamp ── */
document.addEventListener('DOMContentLoaded', function () {
    const widgets = document.querySelectorAll('[style*="font-size"]'); // Seleksi elemen dengan inline style font-size

    widgets.forEach((widget) => {
        const fontSizeStyle = widget.style.fontSize; // Ambil nilai font-size
        const fontSizeValue = parseFloat(fontSizeStyle); // Ambil angka dari font-size
        const fontUnit = fontSizeStyle.replace(fontSizeValue, '').trim(); // Ambil unit (px/rem/em)

        if (fontUnit === 'px' || fontUnit === 'rem' || fontUnit === 'em') {
            widget.style.fontSize = `clamp(${fontSizeValue / 2}${fontUnit}, ${fontSizeValue}px, ${
                fontSizeValue * 1.5
            }${fontUnit})`; // Terapkan clamp
        }
    });
});

/* ── AOS Init ── */
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
    offset: 0
});

/* ── URL Param → Form Name ── */
document.addEventListener("DOMContentLoaded", function () {
    // Ambil parameter dari URL
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("to");

    if (nameParam) {
      // Decode dan set langsung ke input
      const decodedName = decodeURIComponent(nameParam);
      const input = document.getElementById("form-field-name");
      input.value = decodedName;
    }
  });

/* ── Cover Open – Video Play & Scroll Show ── */
document.addEventListener('DOMContentLoaded', function () {
    var tombolBuka = document.getElementById('tombol-buka');
    if (!tombolBuka) return;

    tombolBuka.addEventListener('click', function () {
        var video = document.querySelector('#video-bg-player, .video-bg-hosted');
        if (video && video.paused) { video.play(); }

        var scrollItem = document.querySelector('.scroll');
        if (scrollItem) { scrollItem.style.display = 'block'; }
    });
});

/* ── RSVP Form – Link & Guest Count ── */
//ambil link
  window.addEventListener('DOMContentLoaded', function() {
    var linkField = document.getElementById('form-field-link_undangan');
    if (linkField) {
        linkField.value = window.location.href;
    }
});

//jumlah max
  // Ambil parameter dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const maxValue = urlParams.get('max');

  // Cari input field berdasarkan ID
  const inputField = document.getElementById('form-field-field_b0d08a4');

  // Jika parameter max ditemukan, atur nilai maksimum
  if (maxValue && inputField) {
    inputField.max = maxValue;
  }

  //label maxValue
document.addEventListener("DOMContentLoaded", function () {
    const numberField = document.getElementById("form-field-field_b0d08a4");
    const maxGuests = numberField.getAttribute("max");
    const label = document.querySelector('label[for="form-field-field_b0d08a4"]');
    if (label && maxGuests) {
        label.textContent = `No of Guest (Max ${maxGuests})`;
    }
});

//TOMBOL + dan - -------------------------
document.addEventListener('DOMContentLoaded', () => {
  const inputField = document.querySelector('#form-field-field_b0d08a4');

  if (inputField) {
    // Bungkus input field dengan wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'number-input-wrapper';
    inputField.parentNode.insertBefore(wrapper, inputField);
    wrapper.appendChild(inputField);

    // Tambahkan teks "-" di dalam field di sebelah kiri
    const decrementText = document.createElement('span');
    decrementText.textContent = '-';
    decrementText.className = 'decrement-text';
    wrapper.appendChild(decrementText);

    // Tambahkan teks "+" di dalam field di sebelah kanan
    const incrementText = document.createElement('span');
    incrementText.textContent = '+';
    incrementText.className = 'increment-text';
    wrapper.appendChild(incrementText);

    // Tambahkan fungsionalitas untuk teks
    decrementText.addEventListener('click', () => {
      let value = parseInt(inputField.value, 10);
      if (!isNaN(value) && value > 1) { // Minimum nilai adalah 1
        inputField.value = value - 1;
      }
    });

    incrementText.addEventListener('click', () => {
      let value = parseInt(inputField.value, 10);
      let max = parseInt(inputField.max, 10); // Ambil nilai maksimum dari atribut max
      if (!isNaN(value) && (!max || value < max)) { // Cek jika tidak melebihi max
        inputField.value = value + 1;
      }
    });
  }
});

/* ── RSVP Form Handlers ── */
document.addEventListener('DOMContentLoaded', () => {
  // Check if the device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    const textarea = document.getElementById('form-field-comment');
    const hiddenFields = document.querySelectorAll('.field-hidden');

    // Validate elements exist
    if (!textarea || hiddenFields.length === 0) {
      return;
    }

    // Function to handle focus on mobile devices
    const handleMobileFocus = () => {
      hiddenFields.forEach(field => {
        field.style.display = 'none';
      });
    };

    // Function to handle blur on mobile devices
    const handleMobileBlur = () => {
      hiddenFields.forEach(field => {
        field.style.display = 'block';
      });
    };

    // Add events for focus and blur only on mobile
    textarea.addEventListener('focus', handleMobileFocus);
    textarea.addEventListener('blur', handleMobileBlur);
  }
});

/* ── Comment Pagination ── */
document.addEventListener("DOMContentLoaded", function () {
    const itemsPerPage = 4; // Jumlah item per halaman
    const navContainer = document.getElementById("komentar-navigation");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    let currentPage = 1;

    // Fungsi untuk memperbarui pagination dan menampilkan halaman yang benar
    function updateComments() {
        const items = document.querySelectorAll(".komentar-item");

        if (items.length === 0) {
            navContainer.style.display = "none"; // Sembunyikan navigasi jika tidak ada komentar
            return;
        }

        if (items.length <= itemsPerPage) {
            navContainer.style.display = "none"; // Sembunyikan navigasi jika kurang dari atau sama dengan 4 item
        } else {
            navContainer.style.display = "block"; // Tampilkan navigasi jika lebih dari 4 item
        }

        // Reset ke halaman pertama untuk memastikan tampilan yang benar
        currentPage = 1;
        showPage(currentPage);
    }

    // Fungsi untuk menampilkan halaman tertentu dari komentar
    function showPage(page) {
        const items = document.querySelectorAll(".komentar-item");
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Sembunyikan semua item terlebih dahulu
        items.forEach((item) => {
            item.classList.remove("show");
        });

        // Tampilkan item yang relevan
        for (let i = start; i < end; i++) {
            const item = items[i];
            if (item) {
                item.classList.add("show");
            }
        }

        // Atur tinggi kontainer sesuai konten
        const container = document.getElementById("komentar-container");
        container.style.height = "auto"; // Kembalikan tinggi ke otomatis untuk menyesuaikan konten

        // Perbarui status tombol
        prevBtn.style.display = page === 1 ? "none" : "inline-block"; // Sembunyikan prev-btn jika di halaman pertama
        nextBtn.style.display = end >= items.length ? "none" : "inline-block"; // Sembunyikan next-btn jika di halaman terakhir
    }

    // Event listener untuk tombol navigasi
    prevBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    nextBtn.addEventListener("click", function () {
        const items = document.querySelectorAll(".komentar-item");
        if (currentPage * itemsPerPage < items.length) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Inisialisasi halaman pertama dan perbarui navigasi
    updateComments();

    // Setup MutationObserver untuk mendeteksi perubahan di komentar-container
    const komentarContainer = document.getElementById("komentar-container");

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "childList") {
                // Memperbarui komentar dan pagination setiap kali item ditambahkan atau dihapus
                updateComments();
            }
        });
    });

    // Konfigurasi observer untuk memantau penambahan/penyisihan child node di dalam container
    const config = { childList: true, subtree: true };
    observer.observe(komentarContainer, config);
});

/* ── Download Selebaran ── */
document.addEventListener('DOMContentLoaded', function () {
    var downloadBtn = document.getElementById('downloadBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function () {
        var section = document.querySelector('.selebaran');
        if (!section) return;
        downloadBtn.style.display = 'none';

        var images = section.querySelectorAll('img.imaged');
        var promises = [];
        images.forEach(function (img) {
            if (!img.complete) {
                promises.push(new Promise(function (resolve) {
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = img.src;
                }));
            }
            img.style.objectFit = 'cover';
        });

        section.querySelectorAll('*').forEach(function (el) {
            el.childNodes.forEach(function (node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.nodeValue = node.nodeValue.replace(/&amp;/g, '&');
                }
            });
        });

        Promise.all(promises).then(function () {
            html2canvas(section, { scale: 3 }).then(function (canvas) {
                var link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = '.png';
                link.click();
                downloadBtn.style.display = 'block';
            });
        });
    });
});

/* ── MDW Side Menu ── */
if(!MDWNonce108){
var MDWNonce108 = true
var $ = jQuery
$(document).ready(function(){

function getCSS(el, property){
    return getComputedStyle(el.get(0)).getPropertyValue(property)
}

function setCSS(el, property, value){
    el.each(function(i){
        el.get(i).style.setProperty(property, value)
    })
}

function setSmallState($this){
    var button = $this.find('.mdw-side-menu-button'),
        mainMenu = $this.find('.mdw-side-menu'),
        buttonRight = (parseFloat(getCSS(button, 'right')) - parseFloat(getCSS(mainMenu, 'right'))) + 'px',
            buttonTop = (parseFloat(getCSS(button, 'top')) - parseFloat(getCSS(mainMenu, 'top'))) + 'px',
        buttonHeight = button.height(),
        buttonWidth = button.width()

    setCSS($this, '--button-right', buttonRight)
    setCSS($this, '--button-top', buttonTop)
    setCSS($this, '--button-height', buttonHeight + 'px')
    setCSS($this, '--button-width', buttonWidth + 'px')

    $this.find('.mdw-side-menu .nav-list').each(function(i){
        var paddingBottom = getCSS($(this).find('.nav-item').eq(0), 'padding-bottom')
        setCSS($(this).find('.nav-item'), '--padding-top', paddingBottom)
    })
}

$(window).on('load resize', function(){
$('.mdw-side-menu-area').each(function(){
    setSmallState($(this))
})
})

$('.mdw-side-menu-area').each(function(){

    var $this = $(this)
    setSmallState($this)
    setTimeout(function(){
        $this.addClass('anim')
    },100)

    $(this).find('.mdw-side-menu .nav-item').each(function(i){
        setCSS($(this), '--index', i)
        var icon = $(this).find('.nav-icon')
        if(icon.length && !icon.find('i').length){
            icon.append('<i aria-hidden="true" class="fas fa-arrow-right"></i>')
        }
    })
})

$('.mdw-side-menu-button .nav-btn').each(function(){
    var wrapper = $(this).find('.nav-btn-content'),
    text = $(this).find('.nav-btn-text')
    text.clone().appendTo(wrapper)
})

var clickLock = false

$('.mdw-side-menu-button').on('click', function(){
    if(clickLock) return
    var $this = $(this),
        menu = $this.closest('.mdw-side-menu-area'),
        button = $this.find('.nav-btn')
        clickLock = true
    if(menu.hasClass('open')){
        button.eq(1).removeClass('open')
        menu.removeClass('open-arrow')
        setTimeout(function(){ menu.removeClass('open-instant') },300)
        setTimeout(function(){ menu.removeClass('open') },500)
        setTimeout(function(){ button.eq(0).removeClass('open') },750)
    }else{
        button.eq(0).addClass('open')
        setTimeout(function(){ menu.addClass('open open-instant open-arrow') },500)
        setTimeout(function(){ button.eq(1).addClass('open') },750)
    }
    setTimeout(function(){ clickLock = false },750)
})

$('.mdw-side-menu-button a').on('click', function(e){
    e.preventDefault()
})

$('body').on('click', function(e){
    $('.mdw-side-menu-area').each(function(){
        if($(this).hasClass('open-instant') && !$(e.target).closest('.mdw-side-menu').length && !$(e.target).closest('.mdw-side-menu-button').length){
            $(this).find('.mdw-side-menu-button').trigger('click')
        }
    })
})

$(window).on('scroll', function(){
    $('.mdw-hide-on-scroll').each(function(){
        var offset = isNaN(parseFloat(getCSS($(this), '--hide-on-scroll-amount'))) ? parseFloat(getCSS($(this), '--hide-on-scroll-amount')) : 100
        if(getCSS($(this), '--hide-on-scroll').trim() == 'true'){
            if($(window).scrollTop() > offset){
                $(this).addClass('hide')
            }else{
                $(this).removeClass('hide')
            }
        }
    })
})
})
}

/* ── Empty Icon List Cleanup ── */
document.addEventListener("DOMContentLoaded", function () {
    const listItems = document.querySelectorAll(".nav-item");

    listItems.forEach(item => {
        const textElement = item.querySelector(".nav-text");
        if (textElement && textElement.textContent.trim() === "") {
            item.remove(); // Menghapus elemen <li> jika teks kosong
        }
    });
});

/////
// Mendapatkan semua elemen <li> dalam daftar
const listItems = document.querySelectorAll('.nav-item');

// Menambahkan kelas "mdw-side-menu-button" ke setiap <li>
listItems.forEach(item => {
  item.classList.add('mdw-side-menu-button');
});

/* ── Empty List Cleanup ── */
document.addEventListener('DOMContentLoaded', () => {
  const navSound = document.querySelector('.navsound');
  const sideMenuArea = document.querySelector('.mdw-side-menu-area');

  if (sideMenuArea && navSound) {
    const updateNavSoundVisibility = () => {
      const isOpen = sideMenuArea.classList.contains('open') &&
                     sideMenuArea.classList.contains('open-instant') &&
                     sideMenuArea.classList.contains('open-arrow');
      navSound.classList.toggle('show', isOpen);
    };

    // Jalankan saat pertama kali
    updateNavSoundVisibility();

    // Observer untuk memantau perubahan class pada sideMenuArea
    const observer = new MutationObserver(() => {
      updateNavSoundVisibility();
    });

    // Inisiasi observer
    observer.observe(sideMenuArea, { attributes: true, attributeFilter: ['class'] });

    // Pastikan observer dihentikan jika tidak diperlukan lagi
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
    });
  }
});

///////////////////
// Event listener untuk tombol dengan class "mdw-side-menu-button"
document.querySelectorAll('.mdw-side-menu-button').forEach(button => {
    button.addEventListener('click', () => {
        // Nonaktifkan scroll snap sementara
        document.documentElement.style.scrollSnapType = "none";

        // Aktifkan kembali setelah 2 detik (atau sesuai kebutuhan)
        setTimeout(() => {
            document.documentElement.style.scrollSnapType = "y mandatory";
        }, 2000); // Waktu dalam milidetik
    });
});

/* ── AOS Re-Animate ── */
const aosAnimation = document.querySelectorAll('[data-aos]');
let observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      entry.target.classList.add('aos-animate');
    } else {
      entry.target.classList.remove('aos-animate');
    }
  });
});
aosAnimation.forEach(aosObject => {
  observer.observe(aosObject);
});

/* ── Section Lock/Unlock ── */
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
};

var isSectionLocked = true; // Menyimpan status kunci tampilan section

// Menambahkan variabel untuk audio
const bgAudio = document.body.contains(document.getElementById('song')) ? document.getElementById('song') : false;
const bgVideo = document.body.contains(document.getElementById('video')) ? document.getElementById('video') : false;

// Mengunci tampilan section pertama saat halaman dimuat
window.addEventListener('DOMContentLoaded', function() {
    lockSection();
});

// Fungsi untuk mengunci tampilan section
function lockSection() {
    if (isSectionLocked) {
        disableScrolling();
        document.body.style.position = "fixed";
        document.body.style.overflowY = "scroll";
        document.body.style.height = "100vh";
        // Desktop: right panel 700px (left panel fixed via CSS)
        // Mobile: full width
        var isDesktop = window.innerWidth > 800;
        document.getElementById("section-cover").style.width = isDesktop ? "700px" : "100vw";
        document.body.classList.remove("opened");
    }
}

// Fungsi untuk membuka tampilan section
function unlockSection() {
    enableScrolling();
    document.body.style.position = "";
    document.body.style.overflowY = "";
    document.getElementById("section-cover").style.width = "";
    document.body.classList.add("opened");
}

// Menambahkan event listener untuk perubahan visibility
document.addEventListener('visibilitychange', handleVisibilityChange);

function handleVisibilityChange() {
    if (document.hidden) {
        // Halaman tidak terlihat, jeda audio
        pauseAudio();
    } else {
        // Halaman terlihat kembali, lanjutkan pemutaran audio jika diperlukan
        playAudio();
    }
}

document.getElementById("tombol-buka").onclick = function() {
    // Menonaktifkan scroll snap sementara
    document.documentElement.style.scrollSnapType = "none";

    // Hapus section dengan animasi
    const sectionToRemove = document.getElementById("hapus-section");
    if (sectionToRemove) {
        sectionToRemove.classList.add("fade-out");
        setTimeout(() => {
            sectionToRemove.remove();
            AOS.refresh();
        }, 500); // Waktu sesuai dengan durasi animasi
    }

    // Buka tampilan section dan mainkan audio
    unlockSection();
    playAudio();

    // Scroll ke posisi paling atas (section "pertama" adalah section pertama)
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Mengaktifkan kembali scroll snap setelah scroll selesai
    setTimeout(() => {
        document.documentElement.style.scrollSnapType = "y mandatory";
        AOS.refresh();
    }, 600); // Durasi dapat disesuaikan sesuai kecepatan scroll
};

function disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function() {
        window.scrollTo(x, y);
    };
}

function enableScrolling() {
    window.onscroll = null;
}

// Fungsi untuk memutar audio
function playAudio() {
    if (bgAudio) {
        bgAudio.play();
    }
}

// Fungsi untuk menjeda audio
function pauseAudio() {
    if (bgAudio) {
        bgAudio.pause();
    }
}

/* ── Section-Song Scroll (1) ── */
const el = document.querySelector('.section-song');
const SHOW_AT = 200;

if (el) {
  let ticking = false;

  const update = () => {
    const shouldShow = window.scrollY >= SHOW_AT;
    el.classList.toggle('is-visible', shouldShow);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  // Set kondisi awal saat halaman pertama kali dibuka
  update();

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Hidden Elements Reveal ── */
document.addEventListener("DOMContentLoaded", function() {
    // Seleksi semua elemen yang ingin disembunyikan
    var elements = document.querySelectorAll(".hidden");

    // Tambahkan delay untuk menghindari glitch
    setTimeout(function() {
        elements.forEach(function(element) {
            // Menghapus class 'hidden' dan menambahkan class 'visible'
            element.classList.remove("hidden");
            element.classList.add("visible");
        });
    }, 100); // Delay singkat, sesuaikan jika diperlukan
});

/* ── Preloader ── */
document.addEventListener("DOMContentLoaded", function() {
  const progressPercentage = document.getElementById("progress-percentage");
  const preloader = document.getElementById("preloader");

  let width = 0;
  const interval = setInterval(function() {
    if (width >= 100) {
      clearInterval(interval);

      setTimeout(function() {
        preloader.classList.add("hide");
        setTimeout(function() {
          if (preloader && preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 1000);
      }, 200);
    } else {
      width += 5;
      if (width > 100) width = 100;
      progressPercentage.textContent = width;
    }
  }, 20);
});

/* ── Audio Player ── */
document.addEventListener('DOMContentLoaded', function() {

  const player = new Audio();
  player.preload = 'none';
  player.loop = true;
  player.id = 'music';

  let lastUrl = null;
  let intervalListener = null;
  let allowAutoResume = false; // gesture user
  let autoPaused = false;

  const videoIframe = document.querySelector('#gallery-video');

  // ========================
  // PLAY FULL AUDIO
  // ========================
  function playFullAudio(url) {
    if (!url) return;

    if (url !== lastUrl) {
      player.src = url;
      lastUrl = url;
    }

    if (intervalListener) {
      player.removeEventListener('timeupdate', intervalListener);
      intervalListener = null;
    }

    return player.play()
      .then(() => {
        togglePlayPauseButtons(true);
        autoPaused = false;
      })
      .catch(err => {
        togglePlayPauseButtons(false);
      });
  }

  // ========================
  // PLAY AUDIO WITH START/END
  // ========================
  function playUrl(url, startTime, endTime) {
    if (!url) return;

    allowAutoResume = true; // user action → boleh autoplay iPhone

    if (url !== lastUrl) {
      player.src = url;
      lastUrl = url;
    }

    if (intervalListener) {
      player.removeEventListener('timeupdate', intervalListener);
      intervalListener = null;
    }

    player.currentTime = startTime;

    if (endTime && endTime > 0) {
      intervalListener = function() {
        if (player.currentTime >= endTime) {
          player.currentTime = startTime;
        }
      };
      player.addEventListener('timeupdate', intervalListener);
    }

    return player.play()
      .then(() => {
        togglePlayPauseButtons(true);
        autoPaused = false;
      })
      .catch(err => {
        togglePlayPauseButtons(false);
      });
  }

  // ========================
  // SMART PAUSE
  // ========================
  function smartPause() {
    if (!player.paused && player.currentTime > 0) {
      player.pause();
      autoPaused = true;
    }
    togglePlayPauseButtons(false);
  }

  // ========================
  // SMART RESUME
  // ========================
  function smartResume() {
    if (!allowAutoResume) return; // hanya gesture user yang boleh auto resume

    player.play()
      .then(() => {
        togglePlayPauseButtons(true);
        autoPaused = false;
      })
      .catch(err => {
        togglePlayPauseButtons(false);
      });
  }

  // ========================
  // TOGGLE PLAY/PAUSE BUTTONS
  // ========================
  function togglePlayPauseButtons(isPlaying) {
    const playButton = document.querySelector('.play-music');
    const offButton = document.querySelector('.off-music');

    if (isPlaying) {
      if (playButton) playButton.style.display = 'none';
      if (offButton) offButton.style.display = 'inline';
    } else {
      if (playButton) playButton.style.display = 'inline';
      if (offButton) offButton.style.display = 'none';
    }
  }

  // ========================
  // LOAD MP3 SAAT PAGE OPEN
  // ========================
  window.addEventListener('load', () => {
    const mp3Container = document.querySelector('.link-mp3 .audio-url > p');
    const url = mp3Container ? mp3Container.textContent.trim() : null;

    if (url) playFullAudio(url);
    else togglePlayPauseButtons(false);
  });

  // ========================
  // HANDLE KLIK USER
  // ========================
  document.addEventListener('click', (e) => {

    const playWrap = e.target.closest('.play-music');
    if (playWrap) {
      e.preventDefault();

      allowAutoResume = true; // klik user → boleh autoplay
      const mp3Container = document.querySelector('.link-mp3 .audio-url > p');
      const url = mp3Container ? mp3Container.textContent.trim() : null;

      playFullAudio(url);
      return;
    }

    const offBtn = e.target.closest('.off-music');
    if (offBtn) {
      e.preventDefault();
      player.pause();
      autoPaused = false;
      togglePlayPauseButtons(false);
      return;
    }

    const tombolBuka = e.target.closest('#tombol-buka');
    if (tombolBuka) {
      e.preventDefault();

      allowAutoResume = true; // gesture user

      const mp3Container = document.querySelector('.link-mp3 .audio-url > p');
      const url = mp3Container ? mp3Container.textContent.trim() : null;

      playUrl(url, 0, 0);
    }
  });

  // ========================
  // VISIBILITY & FOCUS
  // ========================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) smartPause();
    else smartResume();
  });

  window.addEventListener('blur', smartPause);
  window.addEventListener('focus', smartResume);
  window.addEventListener('pagehide', smartPause);

  // ========================
  // YOUTUBE API
  // ========================
  if (videoIframe) {

    let src = videoIframe.getAttribute('src');
    if (src && !src.includes('enablejsapi=1')) {
      src += (src.includes('?') ? '&' : '?') + 'enablejsapi=1';
      videoIframe.setAttribute('src', src);
    }

    window.addEventListener('message', function(event) {

      if (!event.origin.includes('youtube')) return;

      let data;
      try { data = JSON.parse(event.data); } catch(e) { return; }

      if (data.event === 'onStateChange') {
        if (data.info === 1) {
          // VIDEO PLAY → pause musik
          smartPause();
        } else if (data.info === 2 || data.info === 0) {
          // VIDEO PAUSE / END → MP3 HARUS PLAY
          const mp3Container = document.querySelector('.link-mp3 .audio-url > p');
          const url = mp3Container ? mp3Container.textContent.trim() : null;

          if (url) {
            playFullAudio(url);
          }
        }
      }
    });
  }

});

/* ── Section-Song Visibility ── */
document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.section-song');
  const SHOW_AFTER = 200;

  if (!el) {
    return;
      }

  const update = () => {
    el.classList.toggle('is-visible', window.scrollY > SHOW_AFTER);
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // set kondisi awal
});

/* ── bgAudio Visibility Handlers ── */

const pauseAudioOnVideoPlay = () => {
  if (bgVideo) {
    bgVideo.addEventListener('play', () => {
      pauseAudio();
    });
  }
}

const resumeAudioOnVideoPause = () => {
  if (bgVideo) {
    bgVideo.addEventListener('pause', () => {
      playAudio();
    });
  }
}

document.addEventListener("visibilitychange", event => {
  if (document.visibilityState === "visible") {
    playAudio();
    resumeAudioOnVideoPause();
  } else {
    pauseAudio();
    pauseAudioOnVideoPlay();
  }
})

/* ── Refresh Komentar ── */
jQuery(document).ready(function ($) {
    // Pantau tombol send-comment dan update tampilan komentar setelah submit
    var sendButton = document.getElementById('send-comment');
    if (!sendButton) return;

    var observer = new MutationObserver(function (mutationsList) {
        mutationsList.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                if (!sendButton.disabled) {
                    setTimeout(function () {
                        // Tampilkan pesan sederhana (static site - tidak ada refresh dari server)
                        var container = document.getElementById('komentar-container');
                        if (container && container.textContent.trim() === 'Your wishes will be shown here.') {
                            container.innerHTML = '<p style="color:white">Terima kasih atas ucapan & doanya!</p>';
                        }
                    }, 1000);
                }
            }
        });
    });

    observer.observe(sendButton, { attributes: true });
});


/* ── Countdown Timer (Section 7) ── */
document.addEventListener('DOMContentLoaded', function () {
    var targetTs = 1729310400 * 1000; // same timestamp as original data-date

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        var diff = targetTs - Date.now();
        var d = document.querySelector('.cd-days');
        var h = document.querySelector('.cd-hours');
        var m = document.querySelector('.cd-minutes');
        var s = document.querySelector('.cd-seconds');
        if (!d) return;

        if (diff <= 0) {
            d.textContent = h.textContent = m.textContent = s.textContent = '00';
            return;
        }
        d.textContent = pad(Math.floor(diff / 86400000));
        h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
        m.textContent = pad(Math.floor((diff % 3600000) / 60000));
        s.textContent = pad(Math.floor((diff % 60000) / 1000));
    }

    tick();
    setInterval(tick, 1000);
});
