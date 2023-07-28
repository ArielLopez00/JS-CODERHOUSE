let carrito = JSON.parse(localStorage.getItem("Jerseys")) ?? [];
const contenedorTarjetas = document.getElementById("productos-container");
const cartContainer = document.getElementById("cart-container");
const precioTotalElement = document.getElementById("precio-container");
let vaciarCarritoButton = document.getElementById("vaciar-carrito");
let finalizarCompraButton = document.getElementById("finalizar-compra");
let productos = [];

async function cargaInicial() {
  agregarProductosGuardados();
  await obtenerProductos();
  agregarProductosAHTML();
  calcularTotal();
  agregarEventoVaciarCarrito();
  agregarEventoFinalizarCompra();
}

async function obtenerProductos() {
  const productosDeBaseDeDatos = await await fetch(
    "../JSON/productos.json"
  ).then((res) => res.json());
  productos = productosDeBaseDeDatos;
}

function agregarProductosAHTML() {
  productos.forEach((producto) => {
    const nuevoProducto = document.createElement("div");
    nuevoProducto.classList = "tarjeta-producto";
    nuevoProducto.innerHTML = `
    <div class="card">
      <img src="./assets/img/${producto.id}.jpg">
      <h3>${producto.nombre}</h3>
      <b>$${producto.precio}</b>
      <p>${producto.description}</p>
      <button class="btn-add">Agregar al carrito</button>
    </div>
    `;
    contenedorTarjetas.appendChild(nuevoProducto);
    agregarEventoAgregarACarrito(nuevoProducto, producto);
  });
}

function agregarEventoAgregarACarrito(productoHTML, productoData) {
  const addButton = productoHTML.querySelector(".btn-add");
  addButton.addEventListener("click", () => {
    Swal.fire("Producto agregado con exito!", "", "success");
    const idx = guardarCarrito(productoData);
    agregarProductoModal(productoData, idx);
    calcularTotal();
  });
}

function guardarCarrito(productoData) {
  carrito.push(productoData);
  localStorage.setItem("Jerseys", JSON.stringify(carrito));
  return carrito.length - 1;
}

function calcularTotal() {
  let precioTotal = 0;
  carrito.forEach((producto) => {
    precioTotal += producto.precio;
  });
  precioTotalElement.textContent = `Precio final: $${precioTotal.toFixed(2)}`;
}

function agregarProductoModal(producto, idx) {
  const productDiv = document.createElement("div");
  productDiv.innerHTML = `
      <img class ="img-carrito"src="./assets/img/${producto.id}.jpg">
      <h3>${producto.nombre}</h3>
      <b>${producto.precio}</b>
      <p>${producto.description}</p>
      <button class="eliminar-producto">Eliminar producto</button>
      `;
  eliminarProducto(productDiv, idx);
  cartContainer.appendChild(productDiv);
}

function eliminarProducto(productoHTML, idx) {
  const eliminarProducto = productoHTML.querySelector(".eliminar-producto");
  eliminarProducto.addEventListener("click", () => {
    Swal.fire({
      title: "Está seguro de eliminar el producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, seguro",
      cancelButtonText: "No, no quiero",
    }).then((result) => {
      if (result.isConfirmed) {
        calcularTotal();
        carrito.splice(idx, 1);
        cartContainer.removeChild(productoHTML);
        calcularTotal();
        Swal.fire({
          title: "Producto Eliminado!",
          icon: "success",
          text: "El producto ha sido eliminado",
        });
        calcularTotal();
      }
    });
  });
}

function agregarEventoVaciarCarrito() {
  vaciarCarritoButton.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire("El carrito ya esta vacío!");
    } else {
      Swal.fire("Carrito vaciado!");
      carrito = [];
      cartContainer.innerHTML = ``;
      calcularTotal();
    }
  });
}

function agregarEventoFinalizarCompra() {
  finalizarCompraButton.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire("El carrito esta vacío!");
    } else {
      Swal.fire("Muchas gracias por su compra!", "", "success");
      carrito = [];
      cartContainer.innerHTML = ``;
      calcularTotal();
    }
  });
}

function agregarProductosGuardados() {
  carrito.forEach(agregarProductoModal);
}

cargaInicial();
