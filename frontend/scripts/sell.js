const categoryDropdown=document.querySelector('.category-dropdown');
const categoryButton=document.querySelector('#category-btn');

categoryButton.addEventListener('click',(e)=>{
    categoryDropdown.style.display="block";
    categoryButton.style.display="none";
    console.log(e);
})
/*
categoryDropdown.addEventListener('click',(e)=>{
    categoryDropdown.style.display="none";
    categoryButton.style.display="block";
    categorySelection=e.target.textContent;
    categoryButton.textContent=`${categorySelection}`;
})*/