// Variables Globales
var orden = [];
const platos = [
    {id:1,nombre: 'Pollo Asado', precio: 1000, cantidad: 1, img: "https://i.blogs.es/579bad/pollo-de-jordi-cruz/650_1200.jpg"},
    {id:2,nombre: 'Papas Fritas', precio: 350, cantidad: 1, img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9VFkFMwtRDPd49pWDcXIyK-KFklZ79y7UtA&usqp=CAU"},
    {id:3,nombre: 'Carne Asada', precio: 1200,cantidad: 1, img: "https://www.afuegolento.com/img_db/timthumb.php?src=img_db/old/usuario-afl-577a9493a6e6e.jpg&w=800&z=1" },
    {id:4,nombre: 'Ensalada Rusa', precio: 350,cantidad: 1, img:"https://simplementerecetas.com/wp-content/uploads/2020/08/Ensalada-Rusa-750x450.jpg"},
];

//Elementos 
const divDeComidas = document.getElementById('comidas');
const divDeOrdenes = document.getElementById('ordenes_agregadas');
const totalDeComida = document.getElementById('precio_total');
const propinaSugerida = document.getElementById('propina_sugerida');
const divDePlatos = document.getElementById('platos');
const buttonLimpiar = document.getElementById('boton_limpiar');
const buttonFin = document.getElementById('fin_orden');

buttonLimpiar.addEventListener('click',(e) => {
    cleanOrder()
    funcionesDePantalla.mostrarEnPantalla(propinaSugerida)(obtener10(sumarTotalDeComida(orden)));
    Swal.fire({
        icon: 'info',
        title: 'Tu orden esta limpia',
        text: 'Puedes comenzar tu nuevo',
      })
})


buttonFin.addEventListener('click', (e) => {
    var total = sumarTotalDeComida(orden)
    if (total === 0) {
        Swal.fire(
            '¡Tu orden no tiene nada!',
            'Por favor selecciona tus platos.',
            'info'
          )
    }else{
        var prop = obtener10(total)
        Swal.fire({
            title: '¿Seguro que quieres finalizar tu orden?',
            text: "El total del pedido es: $" + total + 
            "\n" +  "La propina sugerida es de: $" + prop,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2ed234',
            cancelButtonColor: 'hsl(0, 93%, 34%)',
            confirmButtonText: 'Confirmar'
          }).then((result) => {
            if (result.value) {
                cleanOrder()
                funcionesDePantalla.mostrarEnPantalla(propinaSugerida)(obtener10(sumarTotalDeComida(orden)));
                Swal.fire(
                  '¡Tu orden fue comnifrmada!',
                  'Gracias por tu pedido.',
                  'success'
                )
              }
          }
          )
    }
})
//Funciones de la Pantalla
const funcionesDePantalla = (function(){
    const transformarAEtiquetas = (objeto) =>` 
        <div className="carta_de_comida">
            <div className="cabeza_de_carta">
             <h3>${objeto.nombre}</h3>
             <img class="fotito_plato" src=${objeto.img}></img>
            </div>
            <div className="pie_de_carta"><h3> $${objeto.precio} 
            </h3></div>
            <button id="agregar_a_orden">Agregar</button>\
            <hr>
        </div>
        `;        
     const mostrarEnPantalla = (div)=>(string)=>{
         div.innerHTML="";
         div.innerHTML= string;
     };


     const reducirEtiquetas = (acc,item)=>`${acc+item}`;


     const modificarArray=(fn)=> (div)=> (array)=>{
         if(array.length ===0)return
         const stringDeEtiquetas = array.map(fn).reduce(reducirEtiquetas)
         mostrarEnPantalla(div)(stringDeEtiquetas)
     }
     const transformarAEtiquetasDeOrden = (objeto)=>`
            <div className="carta_de_ordenes" id= "plato">
              <h3>${objeto.nombre}  $ ${objeto.precio} x ${objeto.cantidad} </h3>
            </div>`;
    const modificarArrayDePlatos = modificarArray(transformarAEtiquetas)
    const modificarArrayDeOrdenes = modificarArray(transformarAEtiquetasDeOrden)


    return {
        modificarArrayDeOrdenes,
        modificarArrayDePlatos,
        mostrarEnPantalla,
    }
    
})();



// calculo de propina

const agregarAOrden = (item)=>(array)=>{
    if (!existInArray(item)) {
        array.push(item);
    }
};
const encontrarPlato=(nombre)=>
platos.find(item=>item.nombre===nombre);


const sumarTotalDeComida=(array)=>
array.reduce((acc,item)=>acc+parseInt(item.precio * item.cantidad),0);


function cleanOrder() {
    orden = []
    limpiarCantidad()
    var element = document.getElementById("ordenes_agregadas");
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
    funcionesDePantalla.mostrarEnPantalla(totalDeComida)(sumarTotalDeComida(orden));
}

const obtenerPropina=(porcentaje)=>(valor)=>(valor*porcentaje/100);
const obtener10=obtenerPropina(10);
const obtener20=obtenerPropina(20);
const obtener45=obtenerPropina(45);




const manejarElClick=(e)=>{
    if(e.target.id === "agregar_a_orden"){
        const nombreDelPlato=
       e.target.parentElement.childNodes[1].childNodes[1].innerText;
       agregarAOrden(encontrarPlato(nombreDelPlato))(orden);
       funcionesDePantalla.modificarArrayDeOrdenes(divDeOrdenes)(orden);
       funcionesDePantalla.mostrarEnPantalla(totalDeComida)("$"+ sumarTotalDeComida(orden));
       funcionesDePantalla.mostrarEnPantalla(propinaSugerida)("$"+ obtener10(sumarTotalDeComida(orden)));
    }
};
divDePlatos.onclick=manejarElClick;
funcionesDePantalla.modificarArrayDePlatos(divDeComidas)(platos);

function existInArray(item) {
    for (var i = 0; i < orden.length; i++) {
        if (item.id === orden[i].id) {
            orden[i].cantidad = orden[i].cantidad + 1
            return true
        }
     }
     return false
}

function limpiarCantidad() {
    orden = []
    for (var i = 0; i < platos.length; i++) {
        platos[i].cantidad = 1
     }
}


// css con jquery
$('body').css('background-image', 'url(images/cartares.jpg)');
$('#agregar_a_orden').css('background-color', 'hsl(0, 93%, 34%)');
$('#boton-click').css('background-color', 'hsl(0, 93%, 34%)');

