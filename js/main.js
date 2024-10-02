const urlParams = new URLSearchParams(window.location.search);

const container = document.querySelector('.container');
const woodLogo = document.querySelector('.wood__logo');

if(urlParams.get('logo') !== null) {
    container.classList.add('hidden');
    woodLogo.classList.remove('hidden');
}