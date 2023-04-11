const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2003",
  database: "restaurant_delivery",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// set up routes
app.get("/", (req, res) => {
  res.render("home");
});

// Route to get all delivery drivers
app.get("/drivers", (req, res) => {
  connection.query("SELECT * FROM DeliveryDriver", (error, results) => {
    if (error) throw error;
    res.render("drivers", { drivers: results });
  });
});

// Route to add a new delivery driver
app.post("/drivers", (req, res) => {
  const { driverName, vehicleType, contactInformation, driverRating } =
    req.body;
  const sql = `INSERT INTO DeliveryDriver (DriverName, VehicleType, ContactInformation, DriverRating)
               VALUES (?, ?, ?, ?)`;
  connection.query(
    sql,
    [driverName, vehicleType, contactInformation, driverRating],
    (error, results) => {
      if (error) throw error;
      res.redirect("/drivers");
    }
  );
});

// Route to edit an existing delivery driver
app.post("/drivers/:id/edit", (req, res) => {
  const driverId = req.params.id;
  const { driverName, vehicleType, contactInformation, driverRating } =
    req.body;
  const sql = `UPDATE DeliveryDriver SET DriverName = ?, VehicleType = ?, ContactInformation = ?, DriverRating = ?
               WHERE DeliveryDriverId = ?`;
  connection.query(
    sql,
    [driverName, vehicleType, contactInformation, driverRating, driverId],
    (error, results) => {
      if (error) throw error;
      res.redirect("/drivers");
    }
  );
});

// Route to delete an existing delivery driver
app.post("/drivers/:id/delete", (req, res) => {
  const driverId = req.params.id;
  const sql = `DELETE FROM DeliveryDriver WHERE DeliveryDriverId = ?`;
  connection.query(sql, [driverId], (error, results) => {
    if (error) throw error;
    res.redirect("/drivers");
  });
});

// Route to get all customers
app.get("/customers", (req, res) => {
  connection.query("SELECT * FROM Customer", (error, results) => {
    if (error) throw error;
    res.render("customers", { customers: results });
  });
});

// Route to add a new customer
app.post("/customers", (req, res) => {
  const { name, contactInformation, paymentMethod } = req.body;
  const sql = `INSERT INTO Customer (Name, ContactInformation, PaymentMethod)
               VALUES (?, ?, ?)`;
  connection.query(
    sql,
    [name, contactInformation, paymentMethod],
    (error, results) => {
      if (error) throw error;
      res.redirect("/customers");
    }
  );
});

// Route to edit an existing customer
app.post("/customers/:id/edit", (req, res) => {
  const customerId = req.params.id;
  const { name, contactInformation, paymentMethod } = req.body;
  const sql = `UPDATE Customer SET Name = ?, ContactInformation = ?, PaymentMethod = ? WHERE CustomerId = ?`;
  connection.query(
    sql,
    [name, contactInformation, paymentMethod, customerId],
    (error, results) => {
      if (error) throw error;
      res.redirect("/customers");
    }
  );
});

// Route to delete an existing customer
app.post("/customers/:id/delete", (req, res) => {
  const customerId = req.params.id;
  const sql = `DELETE FROM Customer WHERE CustomerId = ?`;
  connection.query(sql, [customerId], (error, results) => {
    if (error) throw error;
    res.redirect("/customers");
  });
});

// Route to get all restaurants
app.get("/restaurants", (req, res) => {
  connection.query("SELECT * FROM Restaurant", (error, results) => {
    if (error) throw error;
    res.render("restaurants", { restaurants: results });
  });
});

// Route to add a new restaurant
app.post("/restaurants", (req, res) => {
  const { name, location, hoursOfOperation, isOpen } = req.body;
  const sql = `INSERT INTO Restaurant (Name, Location, HoursOfOperation, IsOpen) VALUES (?, ?, ?, ?)`;
  connection.query(
    sql,
    [name, location, hoursOfOperation, isOpen],
    (error, results) => {
      if (error) throw error;
      res.redirect("/restaurants");
    }
  );
});

// Route to edit an existing restaurant
app.post("/restaurants/:id/edit", (req, res) => {
  const restaurantId = req.params.id;
  const { name, location, hoursOfOperation, isOpen } = req.body;
  const sql = `UPDATE Restaurant SET Name = ?, Location = ?, HoursOfOperation = ?, IsOpen = ? WHERE RestaurantId = ?`;
  connection.query(
    sql,
    [name, location, hoursOfOperation, isOpen, restaurantId],
    (error, results) => {
      if (error) throw error;
      res.redirect("/restaurants");
    }
  );
});

// Route to delete an existing restaurant
app.post("/restaurants/:id/delete", (req, res) => {
  const restaurantId = req.params.id;
  const sql = `DELETE FROM Restaurant WHERE RestaurantId = ?`;
  connection.query(sql, [restaurantId], (error, results) => {
    if (error) throw error;
    res.redirect("/restaurants");
  });
});

// Route to get all menu items
app.get("/menuItems", (req, res) => {
  connection.query("SELECT * FROM MenuItem", (error, results) => {
    if (error) throw error;
    res.render("menuItems", { menuItems: results });
  });
});

// Route to add a new menu item
app.post("/menuItems", (req, res) => {
  const { restaurantId, category, name, description, price, available } =
    req.body;
  const sql = `INSERT INTO MenuItem (RestaurantId, Category, Name, Description, Price, Available) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(
    sql,
    [restaurantId, category, name, description, price, available],
    (error, results) => {
      if (error) throw error;
      res.redirect("/menuItems");
    }
  );
});

// Route to edit an existing menu item
app.post("/menuItems/:id/edit", (req, res) => {
  const menuItemId = req.params.id;
  const { restaurantId, category, name, description, price, available } =
    req.body;
  const sql = `UPDATE MenuItem SET RestaurantId = ?, Category = ?, Name = ?, Description = ?, Price = ?, Available = ? WHERE MenuItemId = ?`;
  connection.query(
    sql,
    [restaurantId, category, name, description, price, available, menuItemId],
    (error, results) => {
      if (error) throw error;
      res.redirect("/menuItems");
    }
  );
});

// Route to get menu for a restaurant
app.get("/restaurants/:id/menu", (req, res) => {
  const restaurantId = req.params.id;
  const sql = `SELECT * FROM MenuItem WHERE RestaurantId = ?`;
  connection.query(sql, [restaurantId], (error, results) => {
    if (error) throw error;
    res.render("menu", { menuItems: results });
  });
});

// Route to delete an existing menu item
app.post("/menuItems/:id/delete", (req, res) => {
  const menuItemId = req.params.id;
  const sql = `DELETE FROM MenuItem WHERE MenuItemId = ?`;
  connection.query(sql, [menuItemId], (error, results) => {
    if (error) throw error;
    res.redirect("/menuItems");
  });
});

// Route to get all reviews
app.get("/reviews", (req, res) => {
  connection.query("SELECT * FROM Review", (error, results) => {
    if (error) throw error;
    res.render("reviews", { reviews: results });
  });
});

// Route to add a new review
app.post("/reviews", (req, res) => {
  const { restaurantId, customerId, reviewText, rating } = req.body;
  const sql = `INSERT INTO Review (RestaurantId, CustomerId, ReviewText, Rating) VALUES (?, ?, ?, ?)`;
  connection.query(
    sql,
    [restaurantId, customerId, reviewText, rating],
    (error, results) => {
      if (error) throw error;
      res.redirect("/reviews");
    }
  );
});

// Route to edit an existing review
app.post("/reviews/:id/edit", (req, res) => {
  const reviewId = req.params.id;
  const { restaurantId, customerId, reviewText, rating } = req.body;
  const sql = `UPDATE Review SET RestaurantId = ?, CustomerId = ?, ReviewText = ?, Rating = ? WHERE ReviewId = ?`;
  connection.query(
    sql,
    [restaurantId, customerId, reviewText, rating, reviewId],
    (error, results) => {
      if (error) throw error;
      res.redirect("/reviews");
    }
  );
});

// Route to delete an existing review
app.post("/reviews/:id/delete", (req, res) => {
  const reviewId = req.params.id;
  const sql = `DELETE FROM Review WHERE ReviewId = ?`;
  connection.query(sql, [reviewId], (error, results) => {
    if (error) throw error;
    res.redirect("/reviews");
  });
});

// Route to get all orders
app.get("/orders", (req, res) => {
  connection.query("SELECT * FROM Order", (error, results) => {
    if (error) throw error;
    res.render("orders", { orders: results });
  });
});

// Route to add a new order
app.post("/orders", (req, res) => {
  const {
    customerId,
    orderDate,
    deliveryAddress,
    deliveryStatus,
    totalPrice,
    paymentMethod,
    deliveryDate,
    deliveryDriverId,
  } = req.body;
  const sql = `INSERT INTO Order (CustomerId, OrderDate, DeliveryAddress, DeliveryStatus, TotalPrice, PaymentMethod, DeliveryDate, DeliveryDriverId)    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(
    sql,
    [
      customerId,
      orderDate,
      deliveryAddress,
      deliveryStatus,
      totalPrice,
      paymentMethod,
      deliveryDate,
      deliveryDriverId,
    ],
    (error, results) => {
      if (error) throw error;
      res.redirect("/orders");
    }
  );
});

// Route to edit an existing order
app.post("/orders/:id/edit", (req, res) => {
  const orderId = req.params.id;
  const {
    customerId,
    orderDate,
    deliveryAddress,
    deliveryStatus,
    totalPrice,
    paymentMethod,
    deliveryDate,
    deliveryDriverId,
  } = req.body;
  const sql = `UPDATE Order SET CustomerId = ?, OrderDate = ?, DeliveryAddress = ?, DeliveryStatus = ?, TotalPrice = ?, PaymentMethod = ?, DeliveryDate = ?, DeliveryDriverId = ? WHERE OrderId = ?`;
  connection.query(
    sql,
    [
      customerId,
      orderDate,
      deliveryAddress,
      deliveryStatus,
      totalPrice,
      paymentMethod,
      deliveryDate,
      deliveryDriverId,
      orderId,
    ],
    (error, results) => {
      if (error) throw error;
      res.redirect("/orders");
    }
  );
});

// Route to delete an existing order
app.post("/orders/:id/delete", (req, res) => {
  const orderId = req.params.id;
  const sql = `DELETE FROM Order WHERE OrderId = ?`;
  connection.query(sql, [orderId], (error, results) => {
    if (error) throw error;
    res.redirect("/orders");
  });
});

// Route to get all order menu items
app.get("/orderMenuItems", (req, res) => {
  connection.query("SELECT * FROM OrderMenuItem", (error, results) => {
    if (error) throw error;
    res.render("orderMenuItems", { orderMenuItems: results });
  });
});

// Route to add a new order menu item
app.post("/orderMenuItems", (req, res) => {
  const { orderId, menuItemId, quantity } = req.body;
  const sql = `INSERT INTO OrderMenuItem (OrderId, MenuItemId, Quantity) VALUES (?, ?, ?)`;
  connection.query(sql, [orderId, menuItemId, quantity], (error, results) => {
    if (error) throw error;
    res.redirect("/orderMenuItems");
  });
});

// Route to edit an existing order menu item
app.post("/orderMenuItems/:orderId/:menuItemId/edit", (req, res) => {
  const orderId = req.params.orderId;
  const menuItemId = req.params.menuItemId;
  const { quantity } = req.body;
  const sql = `UPDATE OrderMenuItem SET Quantity = ? WHERE OrderId = ? AND MenuItemId = ?`;
  connection.query(sql, [quantity, orderId, menuItemId], (error, results) => {
    if (error) throw error;
    res.redirect("/orderMenuItems");
  });
});

// Route to delete an existing order menu item
app.post("/orderMenuItems/:orderId/:menuItemId/delete", (req, res) => {
  const orderId = req.params.orderId;
  const menuItemId = req.params.menuItemId;
  const sql = `DELETE FROM OrderMenuItem WHERE OrderId = ? AND MenuItemId = ?`;
  connection.query(sql, [orderId, menuItemId], (error, results) => {
    if (error) throw error;
    res.redirect("/orderMenuItems");
  });
});

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
