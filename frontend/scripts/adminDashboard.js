let homeRoute;
let result = {};
let url;
let mainContainer;
let discountButton;
let myOrders;
let myProducts;
let notifications;

async function callAPI() {
    try {
        url = `http://localhost:3000/${homeRoute}`;
        const rawData = await fetch(url);
        result = await rawData.json();
        mainContainer.innerHTML = "";
        return Promise.resolve();
    }
    catch (ex) { console.log(ex) };
};

async function renderDiscount() {
    await callAPI();
    let temp = result.products;
    mainContainer.innerHTML = "";
};

async function renderUsers() {
    await callAPI();
    let temp = result.users;
    mainContainer.innerHTML = `<section id="users-container" style="flex-direction: column; gap: 1.2rem;">
    <h1 style="color: rgb(146, 148, 150);font-size: 2.1rem;">Existing Users</h1>
    <table id="users">
    <tr id="heading-row">
        <th class="heading">User Name</th>
        <th class="heading">User ID</th>
        <th class="heading">User Email</th>
        <th class="heading">User Phone No:</th>
        <th class="heading">Status</th>
     </tr>
    </table>
    </section>`;

    const usersTable = document.querySelector('#users');

    for (i of temp) {
        usersTable.innerHTML += `<tr>
            <td class="table-data">${i.f_name} ${i.l_name}</td>
            <td class="table-data">${i.username}</td>
            <td class="table-data">${i.email}</td>
            <td class="table-data">${i.phone_number}</td>
            <td class="table-data"><button name="status" class="btn" data-user-id="${i.username}">Remove</button></td>
            </tr>`
    }
};

async function renderProducts() {
    await callAPI();
    let temp = result.products;
    mainContainer.innerHTML = `<section id="card-container"></section>`;

    let cardContainer = document.querySelector('#card-container');
    for (i of temp) {
        cardContainer.innerHTML += `<div class="card"  data-product-id="${i.p_id}">
            <img src="${i.p_img}">
            <div>
                <h1 class="product_name"> ${i.p_name} </h1>
            </div>
            <p class="product_desc">${i.p_desc}</p>
            <a class="read-more">...Read More</a>
            <div class="product_details">
                <span class="price">Rs. ${i.p_price}</span>
                <span class="product_id">${i.p_category}</span>
            </div>
            <div id="update-buttons" style="display: flex; justify-content: space-between;">
                <span><button class="btn edit-btn">Edit</button></span>
                <span><button class="btn del-btn">Delete</button></span>
            </div>
            </div>`;
    }
};

async function renderNotifications() {
    await callAPI();
    console.log(result);
    let temp = result.feedbacks;
    mainContainer.innerHTML = `
        <section id="requests-container" style="flex-direction: column; gap: 1.2rem;">
        <h1 style="color: rgb(146, 148, 150);font-size: 2.1rem;">Feedback</h1>
        <table id="requests">
        <tr id="heading-row">
            <th class="heading">Buyer ID</th>
            <th class="heading">Product ID</th>
            <th class="heading">Seller ID</th>
            <th class="heading">Date</th>
            <th class="heading">Description</th>
            <th class="heading">Status</th>
         </tr>
        </table>
        </section>`

    const requestsTable = document.querySelector('#requests');

    for (i of temp) {
        let expandedDate=i.feed_date;
        let date=expandedDate.toString().split('T')[0];
        requestsTable.innerHTML += `<tr>
            <td class="table-data">${i.buyer_id}</td>
            <td class="table-data">${i.p_id}</td>
            <td class="table-data">${i.seller_id}</td>
            <td class="table-data">${date}</td>
            <td class="table-data">${i.feed_desc}</td>
            <td class="table-data"><button name="status" class="btn" data-feed-id="${i.feed_id}">Confirm</button></td>
            </tr>`
    }
}

async function initialize() {
    //Routing buttons
    homeRoute = 'users';
    mainContainer = document.querySelector('#main');
    myOrders = document.querySelector('#my-orders');
    myProducts = document.querySelector('#my-products');
    notifications = document.querySelector('#notifications');
    try {
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

        // Handle different renders
        
        myOrders.addEventListener('click', async (e) => {
            e.preventDefault();
            homeRoute = "users";
            await renderUsers();

            // Handle Delete Users Request
            const usersList=document.querySelector('#users');
            usersList.addEventListener('click',async(e)=>{
                let event=e.target;
                if(event.textContent == "Remove"){
                    console.log(event.dataset.userId);
                    let userID=event.dataset.userId;
                    let reqUrl=`http://localhost:3000/deleteUser/${userID}`;
                    let temp2=await fetch(reqUrl);
                    let rawData2= temp2.json();
                    if(rawData2.success == true)
                        alert('User has been Deleted!!');
                    else
                        alert('User has been Deleted!!');
                }
            })
        });

        myProducts.addEventListener('click', async (e) => {
            e.preventDefault();
            homeRoute = "getProducts";
            await renderProducts();

            // Handle Edit Requests

            const requestBtns = document.getElementsByClassName('edit-btn');
            const makeRequests = Array.from(requestBtns);
            makeRequests.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    let prod_id = e.target.closest('.card').dataset.productId;
                    console.log(prod_id);
                    try {
                        window.location.href=`http://localhost:3000/edit/${prod_id}`;
                    } catch (e) { console.log(e) };
                })
            });

            const cardContainer = document.querySelector('#card-container');

            cardContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('read-more')) {
                    const card = e.target.closest('.card');
                    const productDesc = card.querySelector('.product_desc');

                    productDesc.classList.toggle('active');
                }
            });
        });

        notifications.addEventListener('click', async (e) => {
            e.preventDefault();
            homeRoute = "feedbacks";
            await renderNotifications();
        });
    } catch (e) { console.log(e) };
}

document.addEventListener('DOMContentLoaded', async () => {
    await initialize();
    await renderUsers();
});
