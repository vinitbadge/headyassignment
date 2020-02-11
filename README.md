# headyassignment

#Api details -

User Authentication (with roles)

api route : /api/user-login
Implemented using JWT token
api returns token which is encoded by user id and user type ("Admin","Supervisor")
further this token is used as header ("authorization": token value) which bifucate roles
Add a category

api route : /api/create-category
header( Content-Type:application/json authorization: token)
Admin will be able to add root category and child category
Supervisor will able to add child category
Add products mapped to category or categories

api route : /api/create-product
header( Content-Type:application/json authorization: token)
only supervisor will able to add product
categories and products many to many relationships
Get all the categories with its child categories mapped to it

api route : /api/get-categories
header( Content-Type:application/json authorization: token)
both roles able to see categories
handled upto n level of categories
Get all the products by a category

api route : api/get-products/:category_id
header( Content-Type:application/json authorization: token)
both roles able to see products
Update product details (name, price, etc.)

api route : /api/update-product/5dd9106fda80485a67fa6bf3
header( Content-Type:application/json authorization: token)
only supervisor will able to update product