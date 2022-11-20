import 'regenerator-runtime/runtime'

const serverurl = process.env.SERVER_API;
const sortProduct = document.querySelector("[data-js='sort']")
const cart = []

async function fetchProducts(endpoint){
  const response = await fetch(`${serverurl}${endpoint}`)
  const data = await response.json()
  renderProducts(data)
}

function renderCart(){
  if(cart.length <= 0) return

  const span = document.querySelector('.bag-amout')
  span.classList.remove('hidden')
  span.innerText = cart.length
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchProducts(`/products?_page=1`)
});


// async function filter(){
//   const response = await fetch(`${serverurl}/products?color=Cinza&size_like=M`)
//   const data = await response.json()
//   renderProducts(data)
// }

const formatePrice = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})


function renderProducts(products) {
  const productsList = products.reduce((accumulator, product) => {
    accumulator += `
    <div class="card">
      <div class="img">
        <img src="${product.image}" alt="">
      </div>
      <div class="card-body">
        <h2 class="title">${product.name}</h2>
        <strong class="card-amout">${formatePrice.format(product.price)}</strong>
        <span>até ${product.parcelamento[0]}x de ${formatePrice.format(product.parcelamento[1])}</span>
      </div>
      <button data-js="buy-product" data-id="${product.id}">comprar</button>
    </div>`

    return accumulator
  }, '')

  const section = document.querySelector('section')
  section.innerHTML = productsList

  const buttons = document.querySelectorAll(".card button")
  buttons.forEach(button =>{
    button.addEventListener("click", async () => {
      const id = button.getAttribute('data-id')
      const response = await fetch(`${serverurl}/products/${id}`)
      const data = await response.json()
      cart.push(data)
      renderCart()
    })
  })
}

document.querySelector('.load-more').addEventListener('click', async () =>{
  await fetchProducts(`/products?_page=2`)
  window.scroll(0, 0)
})

sortProduct.addEventListener('click', async () => {
  const optionValue = sortProduct.options[sortProduct.selectedIndex].value

  if(optionValue === '') return

  const response = await fetch(`${serverurl}/products`)
  const data = await response.json()

  if(optionValue === '1'){
    data.sort(function (a, b) {
      if (a.date > b.date) {
        return -1;
      }
      if (a.date < b.date) {
        return 1;
      }
      return 0;
    });
    renderProducts(data)
    return
  }

  if(optionValue === '2'){
    data.sort((a, b) => a.price - b.price)
    
    renderProducts(data)
    return
  }

  if(optionValue === '3'){
    data.sort(function (a, b) {
      if (a.price > b.price) {
        return -1;
      }
      if (a.price < b.price) {
        return 1;
      }
      return 0;
    });
    
    renderProducts(data)
    return
  }
  
})

