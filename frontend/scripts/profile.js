let homeRoute;
let result = {};
let url;
let mainContainer;
let profileButton;
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

async function renderProfile() {
    console.log(url);
    await callAPI();
    console.log(result);
    let temp = result.userDetails;
    mainContainer.innerHTML = `<section id="illustration">
        <img src="https://media.licdn.com/dms/image/D5612AQHpsBBYCaroBw/article-cover_image-shrink_600_2000/0/1681260452220?e=1706140800&v=beta&t=KWWjx-GqK3KzvoO2nnx3AK2YgDChjUIPHp-lbLu875Q">
        </section>
        <section id="details">
        <h1>${temp.f_name} ${temp.l_name}</h1>
        <h3>${temp.email}</h3>
        <h3>${temp.phone_number}</h3>
        <h5>No. Of Products Bought: ${temp.products_bought}</h5>
        <h5>No. Of Products On Sale: ${temp.products_onSale}</h5>
        <h5>No. Of Products Sold: ${temp.products_sold}</h5>
        </section>`
};

async function renderMyOrders() {
    await callAPI();
    let temp = result.products;
    mainContainer.innerHTML = `<section id="order-history-container" style="flex-direction: column; gap: 1.2rem;">
        <h1 style="color: rgb(146, 148, 150);font-size: 2.1rem; margin-top: 1.8rem;">Order History</h1>
        <table id="order-history">
            <tr id="heading-row">
                <th class="heading">Product Name</th>
                <th class="heading">Seller Name</th>
                <th class="heading">Buyer Email</th>
                <th class="heading">Product ID</th>
                <th class="heading">Date Of Purchase</th>
            </tr>
            </table>
            </section>`;

    let orderHistory = document.querySelector('#order-history');

    for (i of temp) {
        const expandedDate = i.bought_date;
        console.log(expandedDate);
        const just_date = expandedDate.toString().split('T')[0];
        console.log(just_date);
        orderHistory.innerHTML += `<tr>
            <td class="table-data">${i.p_name}</td>
            <td class="table-data">${i.seller_fname} ${i.seller_lname}</td>
            <td class="table-data">${i.seller_email}</td>
            <td class="table-data">${i.p_id}</td>
            <td class="table-data">${just_date}</td>
        </tr>`
    }
};

async function renderMyProducts() {
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
    let temp = result.requests;
    mainContainer.innerHTML = `
        <section id="requests-container" style="flex-direction: column; gap: 1.2rem;">
        <h1 style="color: rgb(146, 148, 150);font-size: 2.1rem;">Requests!</h1>
        <table id="requests">
        <tr id="heading-row">
            <th class="heading">Buyer Name</th>
            <th class="heading">Product Name</th>
            <th class="heading">Buyer Email</th>
            <th class="heading">Buyer Phone No:</th>
            <th class="heading">Status</th>
         </tr>
        </table>
        </section>`

    const requestsTable = document.querySelector('#requests');

    for (i of temp) {
        requestsTable.innerHTML += `<tr>
            <td class="table-data" data-buyer-id="${i.buyer_id}">${i.buyer_fname} ${i.buyer_lname}</td>
            <td class="table-data">${i.p_name}</td>
            <td class="table-data">${i.buyer_email}</td>
            <td class="table-data">${i.buyer_phoneNumber}</td>
            <td class="table-data"><button name="status" class="btn" data-product-id="${i.p_id}">Confirm</button></td>
            </tr>`
    }
}

async function initialize() {
    //Routing buttons
    homeRoute = 'getProfile';
    mainContainer = document.querySelector('#main');
    profileButton = document.querySelector('#profile');
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
        profileButton.addEventListener('click', async (e) => {
            e.preventDefault();
            homeRoute = "getProfile";
            await renderProfile();
        });

        myOrders.addEventListener('click', async (e) => {
            e.preventDefault();
            homeRoute = "myOrders";
            await renderMyOrders();
        });

        myProducts.addEventListener('click', async (e) => {
            e.preventDefault();
            homeRoute = "myProducts";
            await renderMyProducts();

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

            // Handle Delete Requests

            let cardContainer = document.querySelector('#card-container');

            cardContainer.addEventListener('click',async(e)=>{
                let event=e.target;
                if(event.textContent === 'Delete'){
                    console.log(event.parentNode.parentNode.parentNode.dataset.productId);
                    let productID=event.parentNode.parentNode.parentNode.dataset.productId;
                    let reqUrl=`http://localhost:3000/delete/${productID}`;
                    let temp2=await fetch(reqUrl);
                    let rawData2=await temp2.json();
                    console.log(rawData2);
                    if(rawData2.success == true){
                        alert('Item has been Deleted!');
                    }
                    else{

                        alert('Error in deleting Item!');
                    }
                }
                homeRoute = "myProducts";
                await renderMyProducts();
            });
        });

        //Notifications Page 

        notifications.addEventListener('click', async (e) => {
            e.preventDefault();
            homeRoute = "notifications";
            await renderNotifications();

            // Handle Notifications

            const requestsTable = document.querySelector('#requests');

            requestsTable.addEventListener('click',async(e)=>{
                let event=e.target;
                if(event.textContent == "Confirm"){
                    console.log(event,event.dataset.productId);
                    console.log(event.parentNode.parentNode.children[0].dataset.buyerId);
                    let buyerID=event.parentNode.parentNode.children[0].dataset.buyerId
                    let productId=event.dataset.productId;
                    let requestUrl=`http://localhost:3000/requestConfirmed/${productId}/${buyerID}`
                    try{
                        window.location.href=requestUrl;
                    } catch(e){console.log(e)};
                }
                homeRoute = "notifications";
                await renderNotifications();
            })
        });
    } catch (e) { console.log(e) };
}

document.addEventListener('DOMContentLoaded', async () => {
    await initialize();
    await renderProfile();
});
