const productController = require("./productController");
const getProductController = require("./getProductController");
const categoryController = require("./categoryController");
const stockController = require("./stockControllers");
const getStockController = require("./getStockController");
const warehouseController = require("./warehouseController");
const getWarehouseController = require("./getWarehouseController");
const userController = require("./UserController");
const addressController = require("./AddressController");
<<<<<<< HEAD
const stockHistoryController = require("./stockHistoryController");
const stockMutationController = require("./stockMutationController");
const handleStockMutationController = require("./handleStockMutationController");
const getStockMutationController = require("./getStockMutationController");
=======
const stockHistoryControllers = require("./stockHistoryControllers");
const stockMutationControllers = require("./stockMutationController");
const cartControllers = require("./cartController");
const ordersController = require('./OrderController');
>>>>>>> develop

module.exports = {
	productController,
	getProductController,
	categoryController,
	stockController,
	getStockController,
	warehouseController,
	getWarehouseController,
	userController,
	addressController,
<<<<<<< HEAD
	stockHistoryController,
	stockMutationController,
	handleStockMutationController,
	getStockMutationController,
=======
	stockHistoryControllers,
	stockMutationControllers,
	cartControllers,
	ordersController
>>>>>>> develop
};
