/* PUNTO 1 -------*/
let arrayFrutas = [
    {id:1,nombre:"anana",precio:3000,ruta_img:"./img/anana.jpg"},
    {id:2,nombre:"arandano",precio:5000,ruta_img:"./img/arandano.jpg"},
    {id:3,nombre:"banana",precio:1000,ruta_img:"./img/banana.jpg"},
    {id:4,nombre:"frambuesa",precio:4000,ruta_img:"./img/frambuesa.png"},
    {id:5,nombre:"frutilla",precio:3000,ruta_img:"./img/frutilla.jpg"},
    {id:6,nombre:"kiwi",precio:2000,ruta_img:"./img/kiwi.jpg"},
    {id:7,nombre:"mandarina",precio:800,ruta_img:"./img/mandarina.jpg"},
    {id:8,nombre:"manzana",precio:1500,ruta_img:"./img/manzana.jpg"},
    {id:9,nombre:"naranja",precio:9000,ruta_img:"./img/naranja.jpg"},
    {id:10,nombre:"pera",precio:2500,ruta_img:"./img/pera.jpg"},
    {id:11,nombre:"pomelo-amarillo",precio:2000,ruta_img:"./img/pomelo-amarillo.jpg"},
    {id:12,nombre:"pomelo-rojo",precio:2000,ruta_img:"./img/pomelo-rojo.jpg"},
    {id:13,nombre:"sandia",precio:2500,ruta_img:"./img/sandia.jpg"},
]

// VARIABLES PARA MANIPULAR (dom) - botones
let informacionAlumna = document.getElementById("informacionNav");  //contenedor de datos del alumno
let informacionProductos = document.getElementById("informacionProductos"); //div que contiene los productos y su descripcion (presentacion)
let filtroPorTexto = document.getElementById("inputTexto"); // input para filtrar por nombre
let listadoProdCarrito = document.getElementById("carrito"); //productos que van al carrito
let filtroPorNombreAlf = document.getElementById("botonOrdenarNombre"); //ordenar los prod alfabeticamente
let filtroPorPrecioMen = document.getElementById("botonOrdenarPrecio"); //ordenar por precio men a may
let vaciar = document.getElementById("botonVaciar"); //vaciar todo el carrito
let finalizar = document.getElementById("botonFinalizar"); //alert para finalizar compra

// VARIABLES INICIALIZADORAS (nec para funciones)
let cartaProductos = ""; //prod de pantalla principal
let cartaProductoCarrito = ""; //prod del carrito
let montoTotal = 0; //aca se acumula el monto total, cant * prod
let carrito = []; //array que contiene los elmentos que se agregan a carrito
let cantidadProducto = []; //array que contiene las cantidades x producto




/* PUNTO 2 -------*/
const alumno = 
    {
        dni: 46498499,
        nombre: "Candela",
        apellido: "Corral"
    }
/** 
 * Imprime los datos del alumno "{alunno}" tanto en consola (usando console.log()), como agregando al nav del
 * HTML
 */
function imprimirDatosAlumno(alumno){
    let datosAlumno = "";
    console.log(`Hola, mi nombre es ${alumno.nombre} ${alumno.apellido}`);
    datosAlumno += 
        `<nav>
            <p>${alumno.nombre} ${alumno.apellido}</p>
        </nav>`;
    informacionAlumna.innerHTML = datosAlumno;
}

/* PUNTO 3  -------
 * Para mostrar los productos: los agregarmos al html para que se muestren en pantalla, se recorre el array
 * {array} usando el metodo .forEach() y en cada iteracion agrega a la variable "carta" la descripccion del mismo
 * (nombre,precui,imagen y un boton para) para agregarlo al carrito
*/

function mostrarProductos(array){
    cartaProductos = ""; //para reiniciar
    array.forEach(producto => {
        cartaProductos += `
        <div class="card-producto">
            <img src="${producto.ruta_img}" alt="">
            <strong>${producto.nombre}</strong> 
            <p>$${producto.precio}</p>
            <button onclick="agregarACarrito(${producto.id})">Agregar al carrito</button>
        </div>
        `;
    });
    informacionProductos.innerHTML = cartaProductos;
}


/* PUNTO 4 -------
* Manejo del input dede js. Al agregarse (addEventListener) hace que se pueda interactuar. A medida
* que el usario vaya ingresando letras o palabras estas se almacenan en una variable: palabraABuscar;
* para que luego usando el metodo .filter() , filtre del array principal los elementos, cuyo nombre; aplicando tambien
* el metodo .toLowerCase() para que tome mayusculas y minusculas de igual manera; incluya (.includes()) los valores
* que se ingresan. En el mismo momento se actualizan los productos, llamando a la funcion
*/
filtroPorTexto.addEventListener("keyup", function(){
    let palabraABuscar = filtroPorTexto.value.toLowerCase(); //valores que se ingresan por el input
    let productoCoincidente = arrayFrutas.filter(p => p.nombre.toLowerCase().includes(palabraABuscar)); //filtra los que incluyan los valores
    mostrarProductos(productoCoincidente);
});


/* PUNTO 5 --------- 
* Ingresa por parametro el id del producto que el usuario seleccionó. Con el metodo .find() y guardando su resultado
* en una variable, busca la coincidencia del id, de un producto del array principal, con el id ingresado por parametro.
* Usando .findIndex() sobre el array que contiene los productos de carrito, devuelve el indice done se encuentra el producto con id{indice}
* por el simple hecho de que si encuentra concidencia, significa que ya se selecciono previamente el mismo producto,
* por lo que solo se actualzia la cantidad del mismo y no se vuelve a pushear en el carrito. En caso de no encontrar
* coincidencia, se pushea el producto al array carrito ,y al array de cantidades 1(al implementarlos en el mismo momento
* se tratan de igual manera y se puede acceder mediante el indice a la cantid y descripccion)
* se guarda usando localStorage y se actualiza la cantidad de productos
*/
function agregarACarrito(indice){
    let productoSeleccionado = arrayFrutas.find(p => p.id == indice);
    let indiceCantidad = carrito.findIndex(p => p.id == indice); //indice donde esta la cant del producto con id{indice}

    if(indiceCantidad === -1 ){ //osea que no encontro indice/no hay
        carrito.push(productoSeleccionado);
        cantidadProducto.push(1); //se pushean al mismo tiempo para coincidir los id
    }else{
        cantidadProducto[indiceCantidad] += 1; //solo suma en 1 la cantidad del producto
    }
    console.log(`Se agrego un producto al carrito: ${productoSeleccionado.nombre}`);
    mostrarCarrito();
    guardarLocalStorage();
    actualizaContadorProductos()
}

/** funcionalidades de carrito
 * utilizando el .forEach() itera sobre los elementos del array carrito, para ir agregandolo al HTML
 * ademas una variable que contiene el montoTotal se ira actualizando, este acumula el precio de producto * la cantidad
 * de dicho producto.
 * Se utiliza innerHTML para agregarlo y se guarda usando localStorage
 * Ademas se va modificando el montototal (usando .textContent) y se muestra por html
 */
function mostrarCarrito(){
    cartaProductoCarrito = "";
    montoTotal = 0;
    carrito.forEach((producto,indice) => {
        montoTotal += producto.precio * cantidadProducto[indice];
        cartaProductoCarrito += `
        <li class="bloque-item">
            <p class="nombre-item">${producto.nombre} - $${producto.precio} - x${cantidadProducto[indice]}</p>
            <button class="boton-eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>
        </li>
        `;
    });
    listadoProdCarrito.innerHTML = cartaProductoCarrito;
    guardarLocalStorage();
    document.getElementById("montoTotal").textContent = `Total: $${montoTotal}`;
}

/** funcionalidades de carrito
 * Ingresa por parametro el indice del producto que se seleccionó para eliminar. En el array que contiene las cantidades,
 * se accede al indice y se resta 1(simulando la cant de ese producto). Si esa ubicacion contiene un 0 o menos
 * se usa el metodo .splice() para reemplazar y sacarlo de los array; caso contario solo se resta 1 a cantidades
 * se guarda usando localStorage y se actualiza la cantidad de productos
 *  
 */
function eliminarProducto(indice){
    cantidadProducto[indice] -= 1;
    
    if(cantidadProducto[indice] <= 0){
        carrito.splice(indice,1);
        cantidadProducto.splice(indice,1); //parte del punto 7
    }
    mostrarCarrito();
    guardarLocalStorage();
    actualizaContadorProductos();
}


/* PUNTO 6 -------
* Se guarda de manera local el carrito y el array de cantidades
*/
function guardarLocalStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("cantidadProducto",JSON.stringify(cantidadProducto));
}

/**
 * Si se guardaron datos se cargarán en el array correspondiente al refrescarse o reiniciar la pog
 * en caso que no se haya guardado nada, es un array vacio.
 */
function cargarLocalStorage(){
    carrito = JSON.parse(localStorage.getItem(carrito)) || [];
    cantidadProducto = JSON.parse(localStorage.getItem(cantidadProducto)) || [];
}


/* PUNTO 7 -------
* Utilizando el metodo .reduce(), en el array que maneja las cantidades de productos, devuelve
* el numero de total de productos que se agregaron a carrito, se va actualizando y se modifica 
* el html
*/
function actualizaContadorProductos(){
    let contador = cantidadProducto.reduce((acumulador,p) => acumulador += p,0);
    document.getElementById("cantidad").textContent = `Carrito: ${contador} productos`; //almacenar la cant de prod
}


/* PUNTO 8 -------
*Se usa .slice() para hacer una copia y no modificar el array principal. Implementa el metodo .sort()
* para que compare los nombres y .toLowerCase() para que se tome mayusculas y minusculas por igual
*/
filtroPorNombreAlf.addEventListener("click",function(){
    let productosOrdenados = arrayFrutas.slice().sort((a,b) => 
        a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));
    mostrarProductos(productosOrdenados);
});

/**
 * De igual manera se implementa .slice() para hacer una copia y al metodo .sort() se le pasan 2 parametros
 * que seran dos productos del array para comparar su precio de menor a mayor
 */
filtroPorPrecioMen.addEventListener("click",function(){
    let productosOrdenadosPrecio = arrayFrutas.slice().sort( (a,b) => a.precio - b.precio);
    mostrarProductos(productosOrdenadosPrecio);
});


/** PUNTO 9 ------
 * Al clickea el boton se reiniciaran los valores de los arrays que contienen los elementos de arrito, cantidades
 * y el monto total a pagar. Se guarda implementando localStorage
 */
vaciar.addEventListener("click",function(){
    carrito = [];
    cantidadProducto = [];
    montoTotal = 0;
    guardarLocalStorage();
    mostrarCarrito();
});


/** extra
 * Al clicker este boton saltara un .alert() y mostrará el monto final a pagar
*/
finalizar.addEventListener("click",function(){
alert(`Su monto a pagar es de $${montoTotal}
¡Muchas gracias por su compra!`);
});


function init(){
    imprimirDatosAlumno(alumno);
    mostrarProductos(arrayFrutas);
    cargarLocalStorage();
}
init();