let sortSelection="none",categorySelection="none";
let productsToDisplay={};
let productRoute='getProducts';

// NAVBAR

const barButton=document.querySelector('#bar-btn');
const navbarLargeScreen=document.querySelector('.navbar');
const navbarSmallScreen=document.querySelector('.navbar-small');
const closeBarButton=document.querySelector('#close-bar-btn');

barButton.addEventListener('click',(e)=>{   
    navbarLargeScreen.style.display="none";
    navbarSmallScreen.style.display="flex";
})

closeBarButton.addEventListener('click',(e)=>{   
    navbarLargeScreen.style.display="flex";
    navbarSmallScreen.style.display="none";
})



// Card Of Products

const readMore=document.querySelectorAll('.read-more');
const cardDesc=document.querySelectorAll('.product_desc');
const cardContainer =document.querySelector('#card-container');

for(let i =0;i<readMore.length;i++){
    readMore[i].addEventListener('click',(e)=>{
        if(e.target.textContent==="...Read More")
            e.target.textContent="...Read Less"
        else    
            e.target.textContent="...Read More"
        e.target.parentNode.classList.toggle('active');
    })
}

// SORT AND CATEGORIES BUTTON

const sortDropdown=document.querySelector('.sort-dropdown');
const categoryDropdown=document.querySelector('.category-dropdown');
const categoryButton=document.querySelector('#category-btn');
const sortButton=document.querySelector('#sort-btn');

sortButton.addEventListener('click',(e)=>{
    sortDropdown.style.display="block";
    sortButton.style.display="none";
    console.log(e);
});

categoryButton.addEventListener('click',(e)=>{
    categoryDropdown.style.display="block";
    categoryButton.style.display="none";
    console.log(e);
})

sortDropdown.addEventListener('click',(e)=>{
    sortDropdown.style.display="none";
    sortButton.style.display="block";
    sortSelection=e.target.textContent;
    productRoute=`sortBy${sortSelection}`;
    sortButton.textContent=`Sort(${sortSelection})`;
    callAPI();
})

categoryDropdown.addEventListener('click',(e)=>{
    categoryDropdown.style.display="none";
    categoryButton.style.display="block";
    categorySelection=e.target.textContent;
    productRoute=`categories`;
    categoryButton.textContent=`Categories(${categorySelection})`;
    callAPI();
})

const callAPI=async()=>{
    console.log(productRoute);
    try{
        let url=`http://localhost:3000/${productRoute}/${categorySelection}`;
        console.log(url);
        let demo=await fetch(url);
        let temp=await demo.json();
        productsToDisplay=temp.products;
        cardContainer.innerHTML="";
        updateProducts();
    }
    catch(e){console.error(e);};
}

const updateProducts=()=>{
    for(let i of productsToDisplay){
        cardContainer.innerHTML+=`<div class="card">
        <img src="${i.p_img}" alt="Product_Image">
        <h1 class="product_name"> ${i.p_name} </h1>
        <p class="product_desc">${i.p_desc}</p>
        <a class="read-more">...Read More</a>
        <div class="product_details">
            <span class="price">Rs. ${i.p_price}</span>
            <span class="product_id">ID :- ${i.p_id}</span>
        </div>
        <button class="btn">Request To Buy</button>
    </div>`;
    }
}

callAPI();
