document.querySelector('form>div input[type=submit]').addEventListener('click', (e)=> {
    e.preventDefault()
    const id = document.querySelector("form>div input[type=number]").value;
    const url = 'https://pokeapi.co/api/v2/pokemon/';

    fetch(url+id).then((res)=> {
        res.json().then((obj)=>{
            console.log(obj);

            const pokemon = {
                nome: obj.forms[0].name,
                imagem: obj.sprites.other["official-artwork"].front_default,
                habilidades: [],
                tipos: [],
                // teste: [],
                fraquezas: [],
                altura: obj.height,
                peso: obj.weight,
                stats: []

            }
            obj.abilities.forEach((habilidades) => {
                pokemon.habilidades.push(habilidades.ability.name);
            })
            obj.types.forEach((tipo)=> {
                pokemon.tipos.push(tipo.type);
            })

            pokemon.tipos.forEach((tipo)=> {
                fetch(tipo.url).then((res)=>{
                    res.json().then((obj)=> {
                        obj.damage_relations.double_damage_from.forEach((fraqueza)=>{
                            if((pokemon.fraquezas).includes(fraqueza.name)) {
                                console.log('fraqueza repetida: ' + fraqueza.name);
                            }
                            else {
                                pokemon.fraquezas.push(fraqueza.name);
                                let p = document.createElement('span');
                                p.innerText = capitalize(fraqueza.name) + '\n';
                                listaFraquezas.append(p);
                            }
                        })
                    })
                })
            })

            obj.stats.forEach((attribute)=> {
                pokemon.stats.push({name: attribute.stat.name,
                                    value: attribute.base_stat})
            })

            document.querySelector('#nome').innerHTML = capitalize(pokemon.nome);
            document.querySelector('#codeId').innerHTML = '#' + id.padStart(3, '0');

            let pokeImg = document.getElementById('pokeImg');
            pokeImg.style.display = 'unset';
            pokeImg.src = pokemon.imagem;
            
            let listaTipos = document.querySelector('#tipoPoke');
            listaTipos.innerHTML = '';
            let titleTipos = document.createElement('p');
            titleTipos.innerText = 'Tipos';
            listaTipos.append(titleTipos);
            pokemon.tipos.forEach((tipo)=>{
                let p = document.createElement('span');
                p.innerText = capitalize(tipo.name) + '\n';
                listaTipos.append(p);
            })

            let listaFraquezas = document.querySelector('#fraquezaPoke');
            listaFraquezas.innerHTML = '';
            let titleFraquezas = document.createElement('p');
            titleFraquezas.innerText = 'Fraquezas';
            listaFraquezas.append(titleFraquezas);
            // console.log(pokemon.fraquezas[1]);
            pokemon.fraquezas.forEach((fraqueza)=>{
                // let p = document.createElement('span');
                // p.innerText = capitalize(fraqueza.name) + '\n';
                // listaFraquezas.append(p);
            })

            let listaHabilidades = document.querySelector('#habilidades');
            listaHabilidades.innerHTML = '';
            let titleHabilidades = document.createElement('p');
            titleHabilidades.innerText = 'Habilidades';
            listaHabilidades.append(titleHabilidades);
            pokemon.habilidades.forEach((ability)=>{
                let p = document.createElement('span');
                p.innerText = capitalize(ability) + '\n';
                listaHabilidades.append(p);
            })

            document.querySelector('#altura').innerText = '\n' + ((pokemon.altura)/10) + 'm';
            document.querySelector('#peso').innerText = '\n' + ((pokemon.peso)/10) + 'kg';

            pokemon.stats.forEach((key)=>{
                // let progress = document.querySelector('.progressBar');
                let progressBar = document.getElementById(key.name);
                progressBar.innerHTML = '';
                for(var i = 0; i < 20; i++) {
                    let dot = document.createElement('div');
                    dot.classList += 'dot';
                    progressBar.append(dot);
                }
                let max = (key.name =='hp') ? ((key.value) * 2 + 204) : (((key.value) * 2 + 99) * 1.1);
                let percentage = ((key.value) * 100) / max;
                let blocksFill = parseInt(percentage / 5);
                for (var i = 0; i < blocksFill; i++) {
                    document.querySelector(`#${key.name} > div:nth-child(${i+1})`).classList += ' dotFill';
                }
            })
        })
    })

})

function capitalize(string) {
    const str = string;

    const arr = str.replaceAll('-', ' ').split(' ');

    for(var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const strResultado = arr.join(' ');
    return strResultado;
}