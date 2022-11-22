import 'regenerator-runtime/runtime'

const serverurl = process.env.SERVER_API;
const sortProduct = document.querySelector("[data-js='sort']")
const section = document.querySelector('section')
const filter = document.querySelector('.filter')
const inputs = document.querySelectorAll('.filter input')
const btnFilter = document.querySelector('.btn-filter')
const btnClose = document.querySelector('.close')
const accordions = document.querySelectorAll(".dropdown")
const accordion = document.querySelector(".accordion")
const cart = []

const range = {
  range1: 'price_gte=0&price_lte=50',
  range2: 'price_gte=51&price_lte=150',
  range3: 'price_gte=151&price_lte=300',
  range4: 'price_gte=301&price_lte=500',
  range5: 'price_gte=0&price_lte=999999999',
}

async function fetchProducts(endpoint){
  const response = await fetch(`${serverurl}${endpoint}`)
  const data = await response.json()
  data.length > 0 ? renderProducts(data) : notFound()
}

function renderCart(){
  if(cart.length <= 0) return

  const span = document.querySelector('.bag-amout')
  span.classList.remove('hidden')
  span.innerText = cart.length
}

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(`/products?_page=1`)
});

function notFound() {
  section.innerHTML = `
    <div class="notfound">
    <span>X</span>
      <h3> Nenhum produto encontrado!!</h3>
    </div>
  `
}

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

  section.innerHTML = `
    <div class="main-contet">
      ${productsList}
    </div>`

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

document.querySelector('.load-more').addEventListener('click', () => {
  fetchProducts(`/products?_page=2`)
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

inputs.forEach(input => {
  input.addEventListener('change', () => {
    let endpoint = ''

    inputs.forEach(inputItem => {
      if(inputItem.type === 'radio'){
        inputItem.checked ? endpoint += `&${range[inputItem.value]}` : ''
      }else {
        inputItem.checked ? endpoint += `&${inputItem.name}=${inputItem.value}` : ''
      }
    })

    fetchProducts(`/products?${endpoint.replace('&','')}`)
  })
})

accordions.forEach(acc => {
  acc.addEventListener('click', () => {
    const submenuItems = acc.nextElementSibling
    if (submenuItems.style.maxHeight) {
      submenuItems.style.maxHeight = null
      submenuItems.style.paddingBottom = 0
    } else {
      submenuItems.style.maxHeight = `${submenuItems.scrollHeight + 10}px`
      submenuItems.style.paddingBottom = 16 + "px"
    }
  })
})

accordion.addEventListener('click', () => {
  const submenuItems = accordion.nextElementSibling
  submenuItems.style.maxHeight = `${submenuItems.scrollHeight + 10}px`
  submenuItems.style.paddingBottom = 16 + "px"
  accordion.style.display = 'none'
})

btnFilter.addEventListener('click', () => {
  filter.classList.add('active')
})


btnClose.addEventListener('click', () => {
  hiddenFilter()
})

function hiddenFilter(){
  filter.classList.remove('active')
}

