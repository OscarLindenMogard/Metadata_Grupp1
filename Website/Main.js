async function start() {
    
    let Data = await fetch ('Dog.json')
    
    let Dog = await Data.json()

    let html = ''
    
    for (let Dogs of Dog) {
        html += `
        <section>
            <h2>${Dogs.name}</h2>
            <p>${Dogs.dep}</p>
            <img src = "Image/${Dogs.Image}">
        </section>`
    }

    document.body.innerHTML += html;
    
}

start()