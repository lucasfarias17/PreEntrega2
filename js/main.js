principal()
function principal() {
    const camisetasOriginal = [
        { id: 1, nombre: "River Plate", liga: "Liga Profesional Argentina", continente: "America", imagen: "riverplate.jfif", stock: 4, precio: 10000 },
        { id: 2, nombre: "San Lorenzo", liga: "Liga Profesional Argentina", continente: "America", imagen: "sanlorenzo.jfif", stock: 11, precio: 4000 },
        { id: 3, nombre: "Chelsea", liga: "Premier League", continente: "Europa", imagen: "chelsea.jfif", stock: 9, precio: 8000 },
        { id: 4, nombre: "Barcelona", liga: "La Liga", continente: "Europa", imagen: "barcelona.jfif", stock: 12, precio: 9200 },
        { id: 5, nombre: "Racing", liga: "Liga Profesional Argentina", continente: "America", imagen: "racing.jfif", stock: 15, precio: 5300 },
        { id: 6, nombre: "Milan", liga: "Serie A", continente: "Europa", imagen: "milan.jfif", stock: 5, precio: 6700 },
        { id: 12, nombre: "Argentina", liga: "Selecciones", continente: "Seleccion", imagen: "argentina.jfif", stock: 2, precio: 11500 },
        { id: 8, nombre: "Manchester United", liga: "Premier League", continente: "Europa", imagen: "munited.jfif", stock: 5, precio: 7500 },
        { id: 9, nombre: "Real Madrid", liga: "La Liga", continente: "Europa", imagen: "realmadrid.jfif", stock: 3, precio: 8700 },
        { id: 10, nombre: "Inter Miami", liga: "MLS", continente: "America", imagen: "intermiami.jfif", stock: 2, precio: 10000 },
        { id: 11, nombre: "Chacarita", liga: "B Nacional Argentina", continente: "America", imagen: "chacarita.jfif", stock: 15, precio: 3500 },
        { id: 13, nombre: "Inter de Milan", liga: "Serie A", continente: "Europa", imagen: "inter.jfif", stock: 8, precio: 6700 },
        { id: 14, nombre: "Atlanta", liga: "B Nacional Argentina", continente: "America", imagen: "atlanta.jfif", stock: 13, precio: 3500 },
        { id: 17, nombre: "Francia", liga: "Selecciones", continente: "Seleccion", imagen: "francia.jfif", stock: 6, precio: 11500 },
        { id: 15, nombre: "Liverpool", liga: "Premier League", continente: "Europa", imagen: "liverpool.jfif", stock: 7, precio: 8000 },
        { id: 16, nombre: "Atletico de Madrid", liga: "La Liga", continente: "Europa", imagen: "atleticomadrid.jfif", stock: 7, precio: 7500 },
        { id: 7, nombre: "Brasil", liga: "Selecciones", continente: "Seleccion", imagen: "brasil.jfif", stock: 10, precio: 11500 },
        { id: 18, nombre: "Arsenal", liga: "Premier League", continente: "Europa", imagen: "arsenal.jfif", stock: 6, precio: 7200 }
    ]

    let inputBuscador = document.getElementById("buscador")
    inputBuscador.addEventListener("input", () => filtrarCamisetas(camisetasOriginal, inputBuscador))

    let botonFiltros = document.getElementsByClassName("botonFiltro")
    for (const botonFiltro of botonFiltros) {
        botonFiltro.addEventListener("click", () => filtrarPorContinente(camisetasOriginal, botonFiltro.id))
    }

    let botonMasVendido = document.getElementById("masVendido")
    botonMasVendido.addEventListener("click", () => filtrarCamisetas(camisetasOriginal, null, "masVendido"))

    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", comprar)

    let mostrarCarrito = document.getElementById("verCarrito")
    mostrarCarrito.addEventListener("click", verCarrito)

    renderizarCarrito()
    renderizarTarjetas(camisetasOriginal)
}

function verCarrito() {
    document.getElementById("camisetas").classList.toggle("oculto")
    document.getElementById("contenedorCarrito").classList.toggle("oculto")
    
}

function comprar() {
    localStorage.removeItem("carrito")
    alert("Gracias por su compra!")
    renderizarCarrito()
}

function filtrarPorContinente(camisetas, continente) {
    let continentesFiltrados = camisetas.filter(camiseta =>
        camiseta.continente.toLowerCase() === continente.toLowerCase()
    )
    renderizarTarjetas(continentesFiltrados)
}

function filtrarCamisetas(camisetas, input, filtro) {
    let busqueda = input ? input.value.toLowerCase() : ""
    let camisetasFiltradas = ""
    if (filtro === "masVendido") {
        camisetasFiltradas = camisetas.filter(camiseta => camiseta.stock <= 5)
    } else {
        camisetasFiltradas = camisetas.filter(camiseta => camiseta.nombre.toLowerCase().includes(busqueda) || camiseta.liga.toLowerCase().includes(busqueda))
    }
    renderizarTarjetas(camisetasFiltradas)
}

function renderizarTarjetas(camisetas) {
    let contenedor = document.getElementById("camisetas")
    contenedor.innerHTML = ""
    camisetas.forEach(camiseta => {
        let tarjetaCamiseta = document.createElement("div")
        tarjetaCamiseta.classList.add("tarjetaCamiseta")
        tarjetaCamiseta.innerHTML = `
        <h3>${camiseta.nombre}</h3>
        <p>${camiseta.liga}</p>
        <img src=./images/${camiseta.imagen}>
        <p>$${camiseta.precio}</p>
        <button id="${camiseta.id}">Agregar al carrito</button>
        `
        contenedor.appendChild(tarjetaCamiseta)

        let botonCarrito = document.getElementById(camiseta.id)
        botonCarrito.addEventListener("click", (e) => agregarAlCarrito(camisetas, e))
    })
}

function agregarAlCarrito(camisetas, e) {
    let carrito = recuperarCarrito()
    let camisetaBuscada = camisetas.find(camiseta => camiseta.id === Number(e.target.id))
    let camisetaEnCarrito = carrito.find(camiseta => camiseta.id === camisetaBuscada.id)
    if (camisetaBuscada.stock > 0) {
        camisetaBuscada.stock--
        if (camisetaEnCarrito) {
            camisetaEnCarrito.unidades++
            camisetaEnCarrito.subtotal = camisetaEnCarrito.precioUnitario * camisetaEnCarrito.unidades
        } else {
            carrito.push({
                id: camisetaBuscada.id,
                nombre: camisetaBuscada.nombre,
                precioUnitario: camisetaBuscada.precio,
                subtotal: camisetaBuscada.precio,
                unidades: 1
            })
        }

    } else {
        alert("Stock agotado.")
    }
    localStorage.setItem("carrito", JSON.stringify(carrito))

    renderizarCarrito()
}


function renderizarCarrito() {
    let contenedor = document.getElementById("carrito")
    contenedor.innerHTML = ""
    let carrito = recuperarCarrito()
    let precioTotal = 0 
    carrito.forEach(camiseta => {
        let tarjetaCamiseta = document.createElement("div")
        tarjetaCamiseta.classList.add("tarjetaEnCarrito")
        tarjetaCamiseta.innerHTML = `
        <p>${camiseta.nombre}</p>
        <p>$${camiseta.precioUnitario}</p>
        <p>${camiseta.unidades} unidades</p>
        <p>$${camiseta.subtotal}</p>
    
        `
        contenedor.appendChild(tarjetaCamiseta)

        precioTotal += camiseta.precioUnitario + camiseta.unidades
    })

    let precioTotalTexto = document.createElement("p")
    precioTotalTexto.id = "precioTotal"
    precioTotalTexto.textContent = `
    Precio total: $${precioTotal}
    `

    let totalAnterior = document.getElementById("precioTotal")
    if (totalAnterior) {
        totalAnterior.remove()    
    }
    
    contenedorBotonComprar.appendChild(precioTotalTexto)
}

function calcularPrecioTotal() {
    let carrito = recuperarCarrito()
    let precioTotal = carrito.reduce((total, camiseta) => total + camiseta.subtotal, 0)
    return precioTotal 
}

function recuperarCarrito() {
    return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
}
