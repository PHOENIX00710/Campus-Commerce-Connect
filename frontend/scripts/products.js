let productsToDisplay={};
let productRoute='getProducts';
const dropDownMenu=document.querySelector('#sort');
const sortButton=document.querySelector('#sortButton');
const closeButton=document.querySelector('#close-btn');
let flag=0;

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
