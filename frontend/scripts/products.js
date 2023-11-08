let productsToDisplay={};
let productRoute='getProducts';
const dropDownMenu=document.querySelector('.sort-items');
const sortButton=document.querySelector('#sortButton');
const closeButton=document.querySelector('#close-btn');
let flag=0;
const barButton=document.querySelector('#bar-btn');
const navbarLargeScreen=document.querySelector('.navbar');
const navbarSmallScreen=document.querySelector('.navbar-small');
const closeBarButton=document.querySelector('#close-bar-btn');

// NAVBAR

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
for(let i =0;i<readMore.length;i++){
    readMore[i].addEventListener('click',(e)=>{
        if(e.target.textContent==="...Read More")
            e.target.textContent="...Read Less"
        else    
            e.target.textContent="...Read More"
        e.target.parentNode.classList.toggle('active');
    })
}


// Sort Button

sortButton.addEventListener('click',(e)=>{
    dropDownMenu.style.display="block";
    sortButton.style.display="none";
    closeButton.style.display="block";       
})

closeButton.addEventListener('click',(e)=>{
    dropDownMenu.style.display="none";
    sortButton.style.display="block";
    closeButton.style.display="none";  
})

const cardContainer=document.querySelector('.container');
const sortChoice=document.querySelector('#sort');

sortChoice.addEventListener('click',(e)=>{
    const val=e.target.value;
    if(val == 'price')
        productRoute='sortByPrice';
    else if(val == 'date')
        productRoute='sortByDate';
    else
        productRoute='getProducts';
    cardContainer.innerHTML="";
    callAPI();
})

const callAPI=async()=>{
    console.log(productRoute);
    try{
        let demo=await fetch(`http://localhost:3000/${productRoute}`);
        let temp=await demo.json();
        productsToDisplay=temp.products;
        updateProducts();
    }
    catch(e){console.error(e);};
}

const updateProducts=()=>{
    for(let i of productsToDisplay){
        cardContainer.innerHTML+=`<div class="card">
        <img class="item-image" src="${i.p_img}" alt="Item Image">
        <div class="item-name">${i.p_name}</div>
        <div class="item-description">${i.p_desc}</div>
        <div class="item-price">Rs. ${i.p_price}</div>
        <div class="seller-name">Sold by: Swapnil Jha</div>
    </div>`;
    }
}

callAPI();

// Functional responsive javascript

//POPUP

/*const popup=document.querySelector('.popup');
const closeBtn=document.querySelector('.popup-closebtn')
const overlay=document.querySelector('.overlay');
const popupButton=document.querySelector('#popupButton');

popupButton.addEventListener('click',(e)=>{
    overlay.classList.add("active");
    popup.classList.add("active");
})

closeBtn.addEventListener('click',(e)=>{
    overlay.classList.remove("active");
    popup.classList.remove("active");
})

overlay.addEventListener('click',(e)=>{
    overlay.classList.remove("active");
    popup.classList.remove("active");
})*/
