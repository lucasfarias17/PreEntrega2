const camisetas = [ {id: 9, nombre: "River Plate", liga: "Argentina", precio: 10000 },
                    { id: 3, nombre: "San Lorenzo", liga: "Argentina", precio: 4000 },
                    { id: 7, nombre: "Chelsea", liga: "Inglaterra", precio: 8000 },
                    { id: 22, nombre: "Barcelona", liga: "España", precio: 9200 },
                    { id: 6, nombre: "Racing", liga: "Argentina", precio: 5300 },
                    { id: 7, nombre: "Manchester", liga: "Inglaterra", precio: 7500 },
                    { id: 14, nombre: "Real Madrid", liga: "España", precio: 8700 },
                    { id: 10, nombre: "Inter Miami", liga: "MLS", precio: 10000 },
                    { id: 30, nombre: "Chacarita", liga: "Argentina", precio: 3500 }
]

let menu = prompt( `Bienvenido, ¿qué desea hacer?
    1 - Ver lista de camisetas
    2 - Filtrar por liga
    3 - Agregar producto al carrito por ID
    4 - Ver costo total del carrito
    5 - Finalizar compra
    0 - Salir ` )
    
let salida = " "
let carrito = []    //Declaro el array carrito vacio para luego agregar elementos con el método push


while (menu != 0) {
    switch (menu) {
        case "1":   //Utilizo el método forEach para listar los productos, utilizando la variable salida para poder mostrar los objetos del array mediante un alert.
            let salida = " "
            camisetas.forEach(camiseta => salida = salida + `Camiseta: ${camiseta.nombre}   precio: $${camiseta.precio}` + "\n")
            alert(salida)
            break
        case "2":   //Filtro la liga que busque el usuario usando el método filter. Usé el toLowerCase para no tener problemas si el usuario no escribe las mayúsculas
            let ligaBuscada = prompt("Ingrese la liga del equipo buscado").toLowerCase()
            if(ligaBuscada) {
                camisetasFiltradas = camisetas.filter(camiseta => camiseta.liga.toLowerCase() === ligaBuscada)
                if (camisetasFiltradas.length > 0) {     //Esto verifica que haya alguna camiseta de esa liga e indica cuáles son las encontradas
                    let mensaje = "Camiseta/s encontrada/s: \n"
                    camisetasFiltradas.forEach(camiseta => {mensaje = mensaje + `${camiseta.nombre}, Liga de ${camiseta.liga}.` + "\n"})
                    alert(mensaje)
                } else {    //Si no hay productos que pasen el filtro deseado, se arroja el siguiente alert
                    alert("No se encontraron camisetas de esa liga.")
                }
            }
            break
        case "3":   //Acá uso map para buscar el id y nombre de cada elemento, y está concatenado con un join para dar un salto de linea entre cada ID, mostrándose en un prompt
            let idCamisetas = camisetas.map(camiseta => camiseta.id + " " + camiseta.nombre).join("\n")
            let idAgregar = parseInt(prompt(`Ingrese el ID de la camiseta que desea agregar al carrito \n${idCamisetas}`))
            let camisetaDeseada = camisetas.find(camiseta => camiseta.id === idAgregar) //Busca el id ingresado por el usuario y usamos push para agregarlo al array vacio declarado antes
            if (camisetaDeseada) {
                carrito.push(camisetaDeseada)
                alert(`La camiseta ${camisetaDeseada.nombre} se agregó a su carrito`)
            } else {
                alert("No se encontró ninguna camiseta con ese ID.")
            }
            break
        case "4":   //Para mostrar el precio final se usa el método reduce sobre el array carrito
            let totalCarrito = carrito.reduce((total, camiseta) => total + camiseta.precio , 0)
            alert(`El costo total del carrito es de $${totalCarrito}`)
            break
        case "5":
            alert("Gracias por su compras! Vuelva prontos")
        default:
            break
    }
    menu = prompt( `Bienvenido, ¿qué desea hacer?
    1 - Ver lista de camisetas
    2 - Filtrar por liga
    3 - Agregar producto al carrito por ID
    4 - Ver costo total del carrito
    5 - Finalizar compra
    0 - Salir ` )
}
