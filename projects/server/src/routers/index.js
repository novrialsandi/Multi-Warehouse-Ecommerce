const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const stockRouter = require("./stockRouter");
const warehouseRouter = require("./warehouseRouter");
const userRouter = require("./UserRouter");
const addressRouter = require("./AddressRouter");
const cartRouter = require("./cartRouter");
const stockHistoryRouter = require("./stockHistoryRouter");
const stockMutationRouter = require("./stockMutationRouter");
const orderRouter = require('./OrderRouter');
const authRouter = require('./AuthRouter');
const insertAddressRouter = require('./InsertAddressRouter');

module.exports = {
	authRouter,
	productRouter,
	categoryRouter,
	stockRouter,
	warehouseRouter,
	userRouter,
	addressRouter,
	insertAddressRouter,
	stockHistoryRouter,
	stockMutationRouter,
	cartRouter,
	orderRouter
};
