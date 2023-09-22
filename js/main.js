function principal(camisetasBD) {
    const camisetasOriginal = camisetasBD
    
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

    Swal.fire({
        title: '¡Compra realizada!',
        text: 'Gracias por elegirnos',
        icon: 'success',
        // timer: 3000,
        confirmButtonColor: '#ff0000b3'
      })

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
        lanzarTostada("Camiseta agregada a su carrito con éxito")
        if (camisetaEnCarrito) {
            camisetaEnCarrito.unidades++
            camisetaEnCarrito.subtotal = camisetaEnCarrito.precioUnitario * camisetaEnCarrito.unidades
        } else {
            carrito.push({
                id: camisetaBuscada.id,
                imagen: camisetaBuscada.imagen,
                nombre: camisetaBuscada.nombre,
                precioUnitario: camisetaBuscada.precio,
                subtotal: camisetaBuscada.precio,
                unidades: 1
            })
        }

    } else {
        lanzarTostada("Lo sentimos, en este momento no hay stock de este producto.")
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))

    if (carrito.length > 0) {
        let headerCarrito = document.getElementById("headerCarrito")
        let columnasHeader = "<p>Camiseta</p><p>Club</p><p>Precio</p><p>Unidades</p><p>Subtotal</p>"
        headerCarrito.innerHTML = columnasHeader

        let botonComprar = document.getElementById("botonComprar")
        if (botonComprar.classList.contains("oculto")) {
            botonComprar.classList.remove("oculto")
        }
    } else {
        let headerCarrito = document.getElementById("headerCarrito")
        headerCarrito.innerHTML = ""
        let botonComprar = document.getElementById("botonComprar")

        if (!botonComprar.classList.contains("oculto")) {
            botonComprar.classList.add("oculto")
        }


    }

    renderizarCarrito()
}


function renderizarCarrito() {
    let contenedor = document.getElementById("carrito")
    contenedor.innerHTML = ""
    let carrito = recuperarCarrito()
    let headerCarrito = document.getElementById("headerCarrito")

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>Su carrito está vacío</p>"
        contenedor.classList.add("carritoVacio")
        headerCarrito.innerHTML = ""
        let precioTotal = document.getElementById("precioTotal")
        if (precioTotal) {
            precioTotal.remove()
        }
        let botonComprar = document.getElementById("botonComprar")
        if (botonComprar) {
            botonComprar.classList.add("oculto")
        }
    } else {
        let precioTotal = 0
        carrito.forEach(camiseta => {
            let tarjetaCamiseta = document.createElement("div")
            tarjetaCamiseta.classList.add("tarjetaEnCarrito")
            tarjetaCamiseta.innerHTML = `
            <img src=./images/${camiseta.imagen}>
            <p>${camiseta.nombre}</p>
            <p>$${camiseta.precioUnitario}</p>
            <p>${camiseta.unidades}</p>
            <p>$${camiseta.subtotal}</p>
            `
            contenedor.appendChild(tarjetaCamiseta)

            precioTotal += camiseta.precioUnitario * camiseta.unidades
        })
        
        let precioTotalTexto = document.createElement("p")
        precioTotalTexto.id = "precioTotal"
        precioTotalTexto.innerHTML = `
        <p>Precio total: $${precioTotal}</p>
        `
        
        let totalAnterior = document.getElementById("precioTotal")
        if (totalAnterior) {
            totalAnterior.remove()
        }
        
        contenedorBotonComprar.appendChild(precioTotalTexto)
    }
}

function calcularPrecioTotal() {
    let carrito = recuperarCarrito()
    let precioTotal = carrito.reduce((total, camiseta) => total + camiseta.subtotal, 0)
    return precioTotal
}

function recuperarCarrito() {
    return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
}

function lanzarTostada(text) {
    Toastify({
        text,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: "#ff0000b3",
            color: "#faebd7"
        },
        onClick: function () { }
    }).showToast()
}
fetch('./array/data.json')
    .then(respuesta => respuesta.json())
    .then(camisetas => principal(camisetas))
    .catch(error => console.log(error))
