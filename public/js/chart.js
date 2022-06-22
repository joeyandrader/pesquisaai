const ctx = document.getElementById('myChart');

//Get number count Stats
const countProduct = document.getElementById('countProduct').innerText;
const countProductApproved = document.getElementById('countProductApproved').innerText;
const countProductPending = document.getElementById('countProductPending').innerText;
const countProductRefused = document.getElementById('countProductRefused').innerText;

const myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [
            'Produtos',
            'Aprovados',
            'Pendentes',
            'Recusados'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [countProduct, countProductApproved, countProductPending, countProductRefused],
            backgroundColor: [
                'rgb(105, 89, 205)',
                'rgb(144, 238, 144)',
                'rgb(218, 165, 32)',
                'rgb(139, 0, 0)',
            ],
            hoverOffset: 4
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});