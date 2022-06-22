const cep = document.querySelector('#cep');


const showData = (result) => {
    for (const campos in result) {
        if (document.querySelector("#" + campos)) {
            document.querySelector("#" + campos).value = result[campos];
        }

    }
}

if (cep) {
    cep.addEventListener("blur", (e) => {

        let search = cep.value.replace("-", "");
        const options = {
            method: 'GET',
            mode: 'cors',
            cache: 'default'
        }

        fetch(`https://viacep.com.br/ws/${cep.value}/json/`, options)
            .then((res) => {
                res.json()
                    .then(data => {
                        showData(data);
                    })
                    .catch(err => {
                        if (err) {
                            console.log('Erro no showData:  ' + err)
                        }
                    });
            })
            .then(err => {
                if (err) {
                    console.log('Deu error: ' + err);
                }
            })
    })
}
