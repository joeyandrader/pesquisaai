//Dashboard
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});


const currentLocation = location.href;
const menuItem = document.querySelectorAll('.nav a');
const menuLength = menuItem.length;
for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
        menuItem[i].classList.add('active');
    }
}



// Preview image

function readImage() {
    if (this.files && this.files[0]) {
        var file = new FileReader();
        file.onload = function (e) {
            document.getElementById("previewImage").src = e.target.result;
        };
        file.readAsDataURL(this.files[0]);
    }
}
document.getElementById("image").addEventListener("change", readImage, false);