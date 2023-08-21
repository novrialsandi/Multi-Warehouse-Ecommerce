const db = require("../models");
const Joi = require("joi");
const geolib = require("geolib");

const handleStockMutation = {
	handleMutation: async (req, res) => {
		const { status } = req.body;
		const { id } = req.params;
		const t = await db.sequelize.transaction();

		const schema = Joi.object({
			status: Joi.string().valid("APPROVED", "REJECTED").required(),
		});

		const validation = schema.validate({
			status,
		});

		if (validation.error) {
			return res
				.status(400)
				.send({ message: validation.error.details[0].message });
		}

		try {
			const pendingMutation = await db.stock_mutations.findOne({
				where: {
					id: id,
					status: "PENDING",
				},
				include: [
					{
						model: db.stocks,
						include: [{ model: db.products }],
					},
				],
			});
			if (!pendingMutation) {
				return res.status(404).send({
					message: "Pending mutation not found or already processed.",
				});
			}

			if (status === "APPROVED") {
				const existingStock = await db.stocks.findOne({
					where: {
						id: pendingMutation.stock_id,
						warehouse_id: pendingMutation.from_warehouse_id,
					},
				});

				if (!existingStock || existingStock.qty < pendingMutation.qty) {
					return res
						.status(404)
						.send({ message: "Insufficient stock from selected warehouse." });
				}

				await db.stocks.update(
					{
						qty: existingStock.qty - pendingMutation.qty,
					},
					{
						where: { id: existingStock.id },
						transaction: t,
					}
				);
				const destinationStock = await db.stocks.findOne({
					where: {
						product_id: pendingMutation.stock.product_id,
						warehouse_id: pendingMutation.to_warehouse_id,
					},
				});

				let destinationStockId = null;

				if (destinationStock) {
					destinationStockId = destinationStock.id;

					await db.stocks.update(
						{
							qty: destinationStock.qty + pendingMutation.qty,
						},
						{
							where: { id: destinationStock.id },
							transaction: t,
						}
					);
				} else {
					const newDestinationStock = await db.stocks.create(
						{
							product_id: pendingMutation.stock.product_id,
							warehouse_id: pendingMutation.to_warehouse_id,
							qty: pendingMutation.qty,
						},
						{
							transaction: t,
						}
					);
					destinationStockId = newDestinationStock.id;
				}

				await db.stock_mutations.update(
					{ status: "APPROVED" },
					{ where: { id: id }, transaction: t }
				);

				const destinationStockQty = destinationStock ? destinationStock.qty : 0;

				await db.stock_histories.create(
					{
						qty: pendingMutation.qty,
						status: "IN",
						reference: pendingMutation.mutation_code,
						stock_id: destinationStockId,
						stock_before: existingStock.dataValues.qty,
						stock_after: pendingMutation.qty + destinationStockQty,
					},
					{ transaction: t }
				);

				await db.stock_histories.create(
					{
						qty: -pendingMutation.qty,
						status: "OUT",
						reference: pendingMutation.mutation_code,
						stock_id: existingStock.dataValues.id,
						stock_before: existingStock.dataValues.qty,
						stock_after: existingStock.dataValues.qty - pendingMutation.qty,
					},
					{ transaction: t }
				);

				await t.commit();

				return res.status(200).send({ message: "Stock mutation confirmed." });
			} else if (status === "REJECTED") {
				await db.stock_mutations.update(
					{ status: "REJECTED" },
					{ where: { id: id }, transaction: t }
				);

				await t.commit();
				return res.status(200).send({ message: "Stock mutation rejected." });
			} else {
				return res.status(400).send({
					message: "Invalid status value. Expected 'confirmed' or 'rejected'.",
				});
			}
		} catch (err) {
			console.log(err);
			await t.rollback();
			res.status(500).send({ message: err.message });
		}
	},
	autoMutation: async (requestedWarehouse, qty) => {
		const t = await db.sequelize.transaction();

		try {
			const warehouses = await db.warehouses.findAll();

			const referenceWarehouse = requestedWarehouse;

			const otherWarehouses = warehouses.filter(
				(warehouse) => warehouse.id !== referenceWarehouse.id
			); // Remove the reference warehouse from the list

			const nearestWarehouse = otherWarehouses.reduce((nearest, warehouse) => {
				const distance = geolib.getDistance(
					{
						latitude: referenceWarehouse.lat,
						longitude: referenceWarehouse.lng,
					},
					{ latitude: warehouse.lat, longitude: warehouse.lng }
				);

				if (
					!nearest ||
					(distance < nearest.distance && warehouse.stock >= qty)
				) {
					return { warehouse, distance };
				}
				return nearest;
			}, null);

			if (nearestWarehouse) {
				// Deduct qty from nearest warehouse's stock
				if (qty <= nearestWarehouse.warehouse.stock) {
					nearestWarehouse.warehouse.stock -= qty;
					requestedWarehouse.stock += qty;

					// await db.stocks.update(
					// 	{ qty }, // qty?
					// 	{ where: { id: nearestWarehouse.warehouse.id }, transaction: t }
					// );

					// await db.stocks.update(
					// 	{ qty }, // qty?
					// 	{ where: { id: requestedWarehouse.id }, transaction: t }
					// );

					const mutation = await db.stock_mutations.create(
						{
							qty: qty,
							stock_id: requestedWarehouse.stock_id,
							to_warehouse_id: requestedWarehouse,
							from_warehouse_id: nearestWarehouse,
							status: "AUTO",
						},
						{ transaction: t }
					);

					// await db.stock_histories.create(
					// 	{
					// 		qty,
					// 		status: "IN",
					// 		reference: `Auto ${mutation.mutation_code}`,
					// 		stock_id,
					// 		stock_before,
					// 		stock_after,
					// 	},
					// 	{ transaction: t }
					// );

					// await db.stock_histories.create(
					// 	{
					// 		qty,
					// 		status: "OUT",
					// 		reference: `Auto ${mutation.mutation_code}`,
					// 		stock_id,
					// 		stock_before,
					// 		stock_after,
					// 	},
					// 	{ transaction: t }
					// );
				} else {
					console.log(
						`Insufficient stock in ${nearestWarehouse.warehouse.name}.`
					);
				}
			}
		} catch (err) {
			throw err;
		}
	},
};

module.exports = handleStockMutation;