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
// function verTotalCarrito(camiseta) {
//     let contenedorBotonComprar = document.getElementById("contenedorBotonComprar")
//     contenedorBotonComprar.innerHTML = `
//     <p>Precio final: ${camiseta.subtotal}</p>
//     `
// }


// let menu = prompt( `Bienvenido, ¿qué desea hacer?
//     1 - Ver lista de camisetas
//     2 - Filtrar por liga
//     3 - Agregar producto al carrito por ID
//     4 - Ver costo total del carrito
//     5 - Finalizar compra
//     0 - Salir ` )

// let salida = " "
// let carrito = []    //Declaro el array carrito vacio para luego agregar elementos con el método push


// while (menu != 0) {
//     switch (menu) {
//         case "1":   //Utilizo el método forEach para listar los productos, utilizando la variable salida para poder mostrar los objetos del array mediante un alert.
//             let salida = " "
//             camisetas.forEach(camiseta => salida = salida + `Camiseta: ${camiseta.nombre}   precio: $${camiseta.precio}` + "\n")
//             alert(salida)
//             break
//         case "2":   //Filtro la liga que busque el usuario usando el método filter. Usé el toLowerCase para no tener problemas si el usuario no escribe las mayúsculas
//             let ligaBuscada = prompt("Ingrese la liga del equipo buscado").toLowerCase()
//             if (ligaBuscada) {
//                 camisetasFiltradas = camisetas.filter(camiseta => camiseta.liga.toLowerCase() === ligaBuscada)
//                 if (camisetasFiltradas.length > 0) {     //Esto verifica que haya alguna camiseta de esa liga e indica cuáles son las encontradas
//                     let mensaje = "Camiseta/s encontrada/s: \n"
//                     camisetasFiltradas.forEach(camiseta => { mensaje = mensaje + `${camiseta.nombre}, Liga de ${camiseta.liga}.` + "\n" })
//                     alert(mensaje)
//                 } else {    //Si no hay productos que pasen el filtro deseado, se arroja el siguiente alert
//                     alert("No se encontraron camisetas de esa liga.")
//                 }
//             }
//             break
//         case "3":   //Acá uso map para buscar el id y nombre de cada elemento, y está concatenado con un join para dar un salto de linea entre cada ID, mostrándose en un prompt
//             let idCamisetas = camisetas.map(camiseta => camiseta.id + " " + camiseta.nombre).join("\n")
//             let idAgregar = parseInt(prompt(`Ingrese el ID de la camiseta que desea agregar al carrito \n${idCamisetas}`))
//             let camisetaDeseada = camisetas.find(camiseta => camiseta.id === idAgregar) //Busca el id ingresado por el usuario y usamos push para agregarlo al array vacio declarado antes
//             if (camisetaDeseada) {
//                 carrito.push(camisetaDeseada)
//                 alert(`La camiseta ${camisetaDeseada.nombre} se agregó a su carrito`)
//             } else {
//                 alert("No se encontró ninguna camiseta con ese ID.")
//             }
//             break
//         case "4":   //Para mostrar el precio final se usa el método reduce sobre el array carrito
//             let totalCarrito = carrito.reduce((total, camiseta) => total + camiseta.precio, 0)
//             alert(`El costo total del carrito es de $${totalCarrito}`)
//             break
//         case "5":
//             alert("Gracias por su compras! Vuelva prontos")
//         default:
//             break
//     }
//     menu = prompt(`Bienvenido, ¿qué desea hacer?
//     1 - Ver lista de camisetas
//     2 - Filtrar por liga
//     3 - Agregar producto al carrito por ID
//     4 - Ver costo total del carrito
//     5 - Finalizar compra
//     0 - Salir ` )
// }
