const currentScroll = window.scrollY;
const getNavbarFixed = document.getElementById('fixed-navbar');



// Menu navbar fixed
// if (currentScroll > 800) {
//     getNavbarFixed.classList.add('fixed-top')
// }

// addEventListener('scroll', () => {
//     if (scrollY > 800) {
//         getNavbarFixed.classList.add('fixed-top')
//     } else if (scrollY < 10) {
//         getNavbarFixed.classList.remove('fixed-top')
//     }
// })



window.sr = ScrollReveal();

sr.reveal('.header-title', {
    delay: 375,
    duration: 1000,
    distance: '200px',
    origin: 'left'
});
sr.reveal('.header-p', {
    delay: 375,
    duration: 500,
});

sr.reveal('.header-btn', {
    delay: 375,
    duration: 500,
});

// welcome tab

sr.reveal('.welcome-content', {
    delay: 375,
    duration: 500,
});
sr.reveal('.welcome-img', {
    delay: 500,
    duration: 500,
});







/* mask cnpj */
var maskcnpj = document.getElementById('cnpj');
if (maskcnpj) {
    maskcnpj.addEventListener('input', (e) => {
        var x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
        e.target.value = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
    });
}


/*cookie*/

// const cookieContainer = document.querySelector('.cookie-container');
// const cookieBtn = document.querySelector('.cookie-btn');

// cookieBtn.addEventListener("click", () => {
//     cookieContainer.classList.remove("active");
//     localStorage.setItem("cookieBannerDisplayed", "true");
// });

// setTimeout(() => {
//     if (!localStorage.getItem("cookieBannerDisplayed")) {
//         cookieContainer.classList.add('active');
//     }
// }, 2000);



//Add Active class pagination


//Add active btn pagination

const currentLocation = location.href;
const menuItem = document.querySelectorAll('.pagination a');
const menuLength = menuItem.length;
for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
        menuItem[i].classList.add('paginationActive');
    }
}





$(document).ready(function () {
    $("#formname").on("change", "input:checkbox", function () {
        $("#formname").submit();
    });
});