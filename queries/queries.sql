SELECT p_id
FROM products
WHERE upload_date >= ALL (SELECT MAX(upload_date) FROM products);



SELECT distinct f_name,l_name,email,phone_number,(select count(p_id) from products where buyer_id='ID292') as products_bought,(select count(p_id) from products where seller_id='ID292' and buyer_id is null) as products_onSale,(select count(p_id) from products where seller_id='ID292' and buyer_id is not null) as products_sold
FROM users,products 
WHERE users.username=products.seller_id and users.username='ID292';



SELECT A.admin_id, MIN(F.feed_id) AS min_feed_id, COUNT(F.feed_id) AS feedback_count
FROM admins A
JOIN feedback F ON A.admin_id = F.admin_id
GROUP BY A.admin_id
ORDER BY feedback_count
LIMIT 1;

SELECT u.f_name as buyer_fname,u.l_name as buyer_lname,u.email as buyer_email, u.phone_number as buyer_phoneNumber, p.p_name as p_name
from products as p, requests as r, users as u 
where r.p_id=p.p_id and r.buyer_id=u.username and p.seller_id='ID292';

SELECT distinct f1.feed_id,f1.feed_desc,f1.p_id,f1.user_id as buyer_id, p1.seller_id
FROM feedback f1 join products p1 on p1.p_id=f1.p_id;


DELIMITER //
CREATE OR REPLACE TRIGGER removeRequests
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.buyer_id is not null THEN
        DELETE FROM requests WHERE requests.p_id = NEW.p_id;
    END IF;
END;
//
DELIMITER ;

update products set buyer_id='ID006',bought_date='2023-23-11' where p_id='P1006';

DELIMITER //
CREATE PROCEDURE updateProductPricesWithDiscount(IN discountPercent DECIMAL(5,2), IN thresholdAmount INT(11))
BEGIN
    -- Update prices for products with p_price > 5000
    UPDATE products
    SET p_price = p_price * (1 - discountPercent)
    WHERE p_price > thresholdAmount;
END;
//
DELIMITER ;



DELIMITER //
CREATE PROCEDURE updateProductPricesWithDiscount(IN discountPercent DECIMAL(5,2), IN thresholdAmount INT(11))
BEGIN
    -- Update prices for products with p_price > 5000
    UPDATE products
    SET p_price = p_price/(1 - discountPercent)
    WHERE p_price > thresholdAmount;
END;
//
DELIMITER ;

create table feedback(
	feed_id varchar(20) primary key,
  	feed_status int,
    feed_date date,
    feed_desc varchar(500),
    p_id varchar(20),
    user_id varchar(30),
    admin_id int,
    FOREIGN KEY (p_id) REFERENCES products(p_id) on DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(username) on DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id) on DELETE CASCADE
);

create table products(
	p_id varchar(20) primary key,
  	p_name varchar(30),
    p_desc varchar(500),
    p_img varchar(500),
    p_price int,
    p_category varchar(40),
    onsale_date date,
	bought_date date,
    seller_id varchar(30),
    buyer_id varchar(30),
    FOREIGN KEY (seller_id) REFERENCES users(username) on DELETE CASCADE
);

create table requests(
	buyer_id varchar(30),
    p_id varchar(20),
    status int,
    primary key(buyer_id,p_id),
    FOREIGN KEY (p_id) REFERENCES products(p_id) ON DELETE CASCADE
)