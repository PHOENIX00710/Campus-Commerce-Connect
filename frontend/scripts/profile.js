//Routing buttons
let homeRoute = 'profile';
let result = {};

const mainContainer = document.querySelector('#main');
const profileButton = document.querySelector('#profile');
const myOrders = document.querySelector('#my-orders');
const myProducts = document.querySelector('#my-products');
const notifications = document.querySelector('#notifications');

profileButton.addEventListener('click', (e) => {
    e.preventDefault();
    homeRoute = "getProfile";
    renderProfile();
});

myOrders.addEventListener('click', (e) => {
    e.preventDefault();
    homeRoute = "myOrders";
    renderMyOrders();
});

myProducts.addEventListener('click', (e) => {
    e.preventDefault();
    homeRoute = "myProducts";
    renderMyProducts();
});

notifications.addEventListener('click', (e) => {
    e.preventDefault();
    homeRoute = "notifications";
    renderNotifications();
});

async function callAPI() {
    try {
        const url=`http://localhost:3000/${homeRoute}`;
        console.log(url);
        const rawData=await fetch(url);
        result= await rawData.json();
        mainContainer.innerHTML = "";
        return;
    }
    catch (ex) { console.log(ex) };
};

async function renderProfile() {
    await callAPI();
    let temp = result.userDetails;
    mainContainer.innerHTML = `<section id="illustration">
    <img src="./undraw_performance_overview_re_mqrq.svg" alt="illustration">
    </section>
    <section id="details">
    <h1>${temp.f_name} ${temp.l_name}</h1>
    <h3>${temp.email}</h3>
    <h3>${temp.phone_number}</h3>
    <h5>No. Of Products Bought: 10</h5>
    <h5>No. Of Products On Sale: ${temp.products_sold}</h5>
    </section>`
};

async function renderMyOrders() {
    await callAPI();
    let temp = result.products;
    for (let i=0;i<6;i++) {
        mainContainer.innerHTML += `<section id="illustration">
        <img src="https://www.intmath.com/blog/wp-content/uploads/2022/02/online_tutoring.png>
        </section>
        <section id="details">
        <h1>Name</h1>
        <h3>Email</h3>
        <h3>Phone Number</h3>
        <h5>No. Of Products Bought: 10</h5>
        <h5>No. Of Products On Sale: 12</h5>
        </section>`
    }
};

async function renderMyProducts() {
    await callAPI();
    console.log(result);
    let temp = result.products;
    mainContainer.innerHTML=`<section id="card-container"></section>`;

    let cardContainer=document.querySelector('#card-container');
    for (i of temp) {
        cardContainer.innerHTML += `<div class="card">
        <img src="${i.p_img}">
        <div style="display: flex; justify-content: space-between;">
            <span><h1 class="product_name"> ${i.p_name} </h1></span>
            <span><h1 class="product_name"> ${i.p_category} </h1></span>
        </div>
        <p class="product_desc">${i.p_desc}</p>
        <a class="read-more">...Read More</a>
        <div class="product_details">
            <span class="price">Rs. ${i.p_price}</span>
            <span class="product_id">ID :- ${i.p_id}</span>
        </div>
        <div id="update-buttons" style="display: flex; justify-content: space-between;">
            <span><button class="btn">Edit</button></span>
            <span><button class="btn">Delete</button></span>
        </div>
        </div>`;
    }
};

async function renderNotifications() {
    await callAPI();
    let temp = result.products;
    mainContainer.innerHTML =`<h1 style="color: rgb(146, 148, 150);font-size: 2.1rem; margin-top: 1.8rem;">Requests!</h1>
    <section id="requests-container">
    <table id="requests">
    <tr id="heading-row">
        <th class="heading">Buyer Name</th>
        <th class="heading">Product ID</th>
        <th class="heading">Buyer Email</th>
        <th class="heading">Buyer Phone No:</th>
        <th class="heading">Status</th>
     </tr>
    </table>
    </section>`

    const requestsTable=document.querySelector('#requests');

    for (let i=0;i<6;i++) {
        requestsTable.innerHTML += `<tr>
        <td class="table-data">Swapnil Jha</td>
        <td class="table-data">23</td>
        <td class="table-data">swapnil.jha@gmail.com</td>
        <td class="table-data">684898435</td>
        <td class="table-data"><button name="status" class="btn">Confirm</button></td>
        </tr>`
    }
}

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

renderNotifications();