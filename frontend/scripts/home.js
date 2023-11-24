let sortSelection = "none", categorySelection = "none";
let productsToDisplay = {};
let productRoute = 'getProducts';

const cardContainer = document.querySelector('#card-container');

// SORT AND CATEGORIES BUTTON

const sortDropdown = document.querySelector('.sort-dropdown');
const categoryDropdown = document.querySelector('.category-dropdown');
const categoryButton = document.querySelector('#category-btn');
const sortButton = document.querySelector('#sort-btn');
const searchButton=document.querySelector('#search-btn');
const searchInput=document.querySelector('#search-input');

searchButton.addEventListener('click',async(e)=>{
    console.log(searchInput,searchInput.value);
    categorySelection=`${searchInput.value}`;
    productRoute='search';
    await callAPI();
})

sortButton.addEventListener('click', (e) => {
    sortDropdown.style.display = "block";
    sortButton.style.display = "none";
    console.log(e);
});

categoryButton.addEventListener('click', (e) => {
    categoryDropdown.style.display = "block";
    categoryButton.style.display = "none";
    console.log(e);
})

sortDropdown.addEventListener('click', async(e) => {
    sortDropdown.style.display = "none";
    sortButton.style.display = "block";
    sortSelection = e.target.textContent;
    productRoute = `sortBy${sortSelection}`;
    sortButton.textContent = `Sort(${sortSelection})`;
    await callAPI();
})

categoryDropdown.addEventListener('click', async(e) => {
    categoryDropdown.style.display = "none";
    categoryButton.style.display = "block";
    categorySelection = e.target.textContent;
    productRoute = `categories`;
    categoryButton.textContent = `Categories(${categorySelection})`;
    await callAPI();
})

async function callAPI(){
    try {
        let url = `http://localhost:3000/${productRoute}/${categorySelection}`;
        console.log(url);
        let demo = await fetch(url);
        let temp = await demo.json();
        productsToDisplay = temp.products;
        cardContainer.innerHTML = "";
        updateProducts();
        return Promise.resolve();
    }
    catch (e) { console.error(e); };
}

const updateProducts = () => {
    for (let i of productsToDisplay) {
        cardContainer.innerHTML += `<div class="card">
        <img src="${i.p_img}" alt="Product_Image">
        <h1 class="product_name"> ${i.p_name} </h1>
        <p class="product_desc">${i.p_desc}</p>
        <a class="read-more">...Read More</a>
        <div class="product_details">
            <span class="price">Rs. ${i.p_price}</span>
            <span class="product_id">ID :- ${i.p_id}</span>
        </div>
        <button class="req-btn">Request To Buy</button>
    </div>`;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        await callAPI();
        // NAVBAR

        const barButton = document.querySelector('#bar-btn');
        const navbarLargeScreen = document.querySelector('.navbar');
        const navbarSmallScreen = document.querySelector('.navbar-small');
        const closeBarButton = document.querySelector('#close-bar-btn');

        barButton.addEventListener('click', (e) => {
            navbarLargeScreen.style.display = "none";
            navbarSmallScreen.style.display = "flex";
        })

        closeBarButton.addEventListener('click', (e) => {
            navbarLargeScreen.style.display = "flex";
            navbarSmallScreen.style.display = "none";
        })

        // Card Of Products

        const readMore = document.querySelectorAll('.read-more');
        const cardDesc = document.querySelectorAll('.product_desc');

        for (let i = 0; i < readMore.length; i++) {
            readMore[i].addEventListener('click', (e) => {
                if (e.target.textContent === "...Read More")
                    e.target.textContent = "...Read Less"
                else
                    e.target.textContent = "...Read More"
                e.target.parentNode.classList.toggle('active');
            })
        }

        // Handle Requests

        const requestBtns = document.getElementsByClassName('req-btn');
        const makeRequests = Array.from(requestBtns);
        makeRequests.forEach(btn => { 
            btn.addEventListener('click', async(e) => {
                console.log(e.target);
                let prod_id_details=e.target.previousElementSibling.children[1].textContent;
                console.log(prod_id_details);
                let prod_id=prod_id_details.split(' ')[2];
                console.log(prod_id);
                let requestURL=`http://localhost:3000/request/${prod_id}`;
                try{
                    let demo = await fetch(requestURL);
                    let temp = await demo.json();
                    if(temp.success == true){
                        e.target.parentNode.innerHTML+='<p style="color:green;">Request has been made successfully!</p>';
                    }
                    else{
                        e.target.parentNode.innerHTML+='<p style="color:red;">Failed ing!</p>';
                    }
                } catch(e){console.log(e)};
            })
        })
    } catch(e){console.log(e);}
})
