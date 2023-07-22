let form = document.querySelector(".form")
let product = document.querySelector(".title")
let price = document.querySelector(".price")
let img_file = document.querySelector(".img_file")
let items = document.querySelector("#items")
let cartItem = document.querySelector("#cartItem")



document.addEventListener("DOMContentLoaded", getCardFormLocalStorage)
form.addEventListener("submit", addProduct)
items.addEventListener("click", addToCart)
cartItem.addEventListener("click", removeCart)


class ProductInfo {
    constructor(id, product_name, price, image) {
        this.id = id
        this.product_name = product_name
        this.price = price
        this.image = image
    }
}

class CartInfo {
    constructor(id, quantity, price, product_name, image) {
        this.id = id
        this.quantity = quantity
        this.price = price
        this.product_name = product_name
        this.image = image
    }
}

function addProduct(e) {
    let productValue = product.value;
    let priceValue = price.value;
    let fileValue = img_file.value;
    let id = 0; // id for product identify


    if (productValue === "" || priceValue === "" || fileValue === "") {
        alert("Empty Filed")
    } else {

        // check the id is already store in local host or not
        if (localStorage.getItem("card") === null) {
            id = 0
        } else {
            let card_item = JSON.parse(localStorage.getItem("card"))
            id = card_item.length

        }

        //div create
        let div = document.createElement("div")
        div.className = "col-6 my-2"

        let card = document.createElement("div")
        card.className = "card"

        // image create
        let image = document.createElement("img")
        image.setAttribute("alt", "Shopping item")
        image.setAttribute("style", "height:350px; width:350px")
        image.className = "img-fluid rounded-3"
        let reader = new FileReader();
        reader.onloadend = function() {
            image.src = reader.result;
            saveInfoInLocal(id++, productValue, priceValue, reader.result)
        }
        reader.readAsDataURL(img_file.files[0])

        card.appendChild(image)

        let card_body = document.createElement("div")
        card_body.className = "card-body"
        card_body.innerHTML = `
        <div class="d-flex justify-content-between">
        <h5 class="card-text">${product.value}</h5>
        <h6>${price.value} BDT</h6>
        </div>
            <input type="button" value="ADD TO CART" class="btn btn-primary btn-sm btnValue" id="c${id}">
        `
        card.appendChild(card_body)
        div.appendChild(card)
        items.appendChild(div)
    }

    // clear input innerText
    document.querySelector(".title").value = ""
    document.querySelector(".price").value = ""
    document.querySelector(".img_file").value = ""


}

//  save information in local storage 
function saveInfoInLocal(id, product_name, price, image) {
    let card = new ProductInfo(id, product_name, price, image)


    let card_item
    if (localStorage.getItem("card") === null) {
        card_item = []
    } else {
        card_item = JSON.parse(localStorage.getItem("card"))
    }
    card_item.push(card)
    localStorage.setItem("card", JSON.stringify(card_item))
}

function getCardFormLocalStorage(e) {


    if (localStorage.getItem("card") != null) {
        let card_item = JSON.parse(localStorage.getItem("card"))

        card_item.forEach(item => {

            //div create
            let div = document.createElement("div")
            div.className = "col-6 my-2"

            let card = document.createElement("div")
            card.className = "card"

            // image create
            let image = document.createElement("img")
            image.setAttribute("alt", "Shopping item")
            image.setAttribute("src", item.image)
            image.setAttribute("style", "height:350px; width:350px")
            image.className = "img-fluid rounded-3"

            card.appendChild(image)

            let card_body = document.createElement("div")
            card_body.className = "card-body"
            card_body.innerHTML = `
        <div class="d-flex justify-content-between">
        <h5 class="card-text">${item.product_name}</h5>
        <h6>${item.price} BDT</h6>
        </div>
        <button class="btn btn-sm btn-primary" id="c${item.id}">ADD TO CART</button>
   
    `
                // let btnCreate = document.createElement("button")
                // btnCreate.append(document.createTextNode("ADD TO CART"))
                // btnCreate.setAttribute("type", "button")
                //     // btnCreate.setAttribute("value", "ADD TO CART")
                // btnCreate.className = "btn btn-primary btn-sm btnValue"
                // card_body.appendChild(btnCreate)
            card.appendChild(card_body)
            div.appendChild(card)
            items.appendChild(div)

        })

        // let btn = document.querySelectorAll(".btnValue")
        // let btn2 = document.querySelector(".btnValue")
        // console.log(btn)
        // console.log(btn2)

        // btn2.addEventListener("click", addToCart)


    }


    if (localStorage.getItem("cart") != null) {
        let cart_item = JSON.parse(localStorage.getItem("cart"))

        cart_item.forEach(ele => {

            let div = document.createElement("div")
            div.className = "card mb-3"
            div.innerHTML = `

                <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div class="d-flex flex-row align-items-center">
                        <div>
                            <img src="${ele.image}"
                                class="img-fluid rounded-3" alt="Shopping item"
                                style="width: 65px;">
                        </div>
                        <div class="ms-3">
                            <h5>${ele.product_name}</h5>
                            <p class="small mb-0">Onyx Black</p>
                        </div>
                    </div>
                    <div class="d-flex flex-row align-items-center">
                        <div style="width: 50px;">
                            <h5 class="fw-normal mb-0">${ele.quantity}</h5>
                        </div>
                        <div style="width: 80px;">
                            <h5 class="mb-0">${ele.price} BDT  </h5>
                        </div>
                        <span class="icon" id=c${ele.id}> <i class="bi bi-trash"></i></span>
                    </div>
                </div>
            </div>

                `


            cartItem.appendChild(div)
        })

    }

}

function addToCart(e) {
    let id = (e.target.id).split("c")[1]
    let quantity = 1
    let card_item = JSON.parse(localStorage.getItem("card"))

    card_item.forEach(ele => {
        if (ele.id === Number(id)) {

            let found = false

            if (localStorage.getItem("cart") != null) {
                let cart_item = JSON.parse(localStorage.getItem("cart"))
                cart_item.forEach(ele => {
                    if (ele.id == id) {
                        found = true
                        ele.quantity += 1
                        quantity = ele.quantity
                        return
                    }
                })
                localStorage.setItem("cart", JSON.stringify(cart_item))


            }

            if (!found) {
                cartSaveLocalStorage(ele.id, quantity, ele.price, ele.product_name, ele.image)
                let div = document.createElement("div")
                div.className = "card mb-3"
                div.innerHTML = `
    
                    <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex flex-row align-items-center">
                            <div>
                                <img src="${ele.image}"
                                    class="img-fluid rounded-3" alt="Shopping item"
                                    style="width: 65px;">
                            </div>
                            <div class="ms-3">
                                <h5>${ele.product_name}</h5>
                                <p class="small mb-0">Onyx Black</p>
                            </div>
                        </div>
                        <div class="d-flex flex-row align-items-center">
                            <div style="width: 50px;">
                                <h5 class="fw-normal mb-0">${quantity}</h5>
                            </div>
                            <div style="width: 80px;">
                                <h5 class="mb-0">${ele.price} BDT  </h5>
                            </div>
                            <span class="icon" id=c${ele.id}> <i class="bi bi-trash"></i></span>
                        </div>
                    </div>
                </div>
    
                    `
                cartItem.appendChild(div)
            } else {
                window.location.reload();

            }
            return
        }

    })

}

function cartSaveLocalStorage(id, quantity, price, product_name, image) {
    let cart = new CartInfo(id, quantity, price, product_name, image)


    let cart_item
    if (localStorage.getItem("cart") === null) {
        cart_item = []
    } else {
        cart_item = JSON.parse(localStorage.getItem("cart"))
    }
    cart_item.push(cart)
    localStorage.setItem("cart", JSON.stringify(cart_item))
}


function removeCart(e) {

    let cartId = (e.target.parentElement.id).split("c")[1]
    let cart_item = JSON.parse(localStorage.getItem("cart"))
    console.log(cartId)
    cart_item.forEach((ele, index) => {

        if (ele.id == cartId) {
            console.log("ok")
            if (ele.quantity > 1) {
                ele.quantity -= 1
            } else {
                cart_item.splice(index, 1)
            }
            return
        }
    })
    localStorage.setItem("cart", JSON.stringify(cart_item))
    window.location.reload();


}