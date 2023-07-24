const db = require("../models");
const axios = require("axios");
const Joi = require("joi");

const addressController = {
	getAllProvince: async (req, res) => {
		try {
			const result = await axios.get(
				"https://api.rajaongkir.com/starter/province",
				{
					headers: {
						key: process.env.RAJA_ONGKIR_API,
					},
				}
			);
			res.send(result.data.rajaongkir.results);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
	getAllCity: async (req, res) => {
		try {
			const result = await axios.get(
				"https://api.rajaongkir.com/starter/city",
				{
					headers: {
						key: process.env.RAJA_ONGKIR_API,
					},
				}
			);
			res.send(result.data.rajaongkir.results);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
	insertAddress: async (req, res) => {
		const t = await db.sequelize.transaction();
		// const addressSchema = Joi.object({
		// 	address: Joi.string().required(),
		// 	province: Joi.string().required(),
		// 	city: Joi.string().required(),
		// 	district: Joi.string().required(),
		// });
		// const { error, value } = addressSchema.validate(req.body);
		// if (error) {
		// 	return res.status(400).send({ message: error.details[0].message });
		// }
		try {
			const { address, district, city, province } = req.body;
			// Check if a warehouse with the same warehouse_name already exists
			const existingAddress = await db.addresses.findOne({
				where: { address },
			});

			if (existingAddress) {
				throw new Error("Address with this name already exists.");
			}

			const response = await axios.get(
				"https://api.opencagedata.com/geocode/v1/json",
				{
					params: {
						q: `${address}, ${district}, ${province}, ${city}`,
						countrycode: "id",
						limit: 1,
						key: process.env.GEOCODE_API_KEY,
					},
				}
			);

			const { lat, lng } = response.data.results[0].geometry;

			// Create a new warehouse record with the retrieved latitude and longitude
			const addresses = await db.addresses.create(
				{
					address,
					province,
					city,
					district,
					latitude: lat,
					longitude: lng,
				},
				{ transaction: t }
			);
			await t.commit();
			res.send({message: "Address added"});
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
	editAddress: async (req, res) => {
		const { address, province, city, district } = req.body;
		const { id } = req.params;
		const t = await db.sequelize.transaction();

		const schema = Joi.object({
			address: Joi.string().required(),
			province: Joi.string().required(),
			city: Joi.string().required(),
			district: Joi.string().required(),
		});

		const validation = schema.validate({
			address,
			province,
			city,
			district,
		});

		if (validation.error) {
			return res
				.status(400)
				.send({ message: validation.error.details[0].message });
		}

		try {
			const existingAddress = await db.addresses.findOne({
				where: { address },
			});

			if (existingAddress && existingAddress.id !== id) {
				return res
					.status(400)
					.send({ message: "Address name already exists." });
			}

			const response = await axios.get(
				"https://api.opencagedata.com/geocode/v1/json",
				{
					params: {
						q: `${address}, ${district}, ${province}, ${city}`,
						countrycode: "id",
						limit: 1,
						key: process.env.GEOCODE_API_KEY,
					},
				}
			);

			const { lat, lng } = response.data.results[0].geometry;

			await db.addresses.update(
				{
					address,
					province,
					city,
					district,
					latitude: lat,
					longitude: lng,
				},
				{ where: { id }, returning: true, transaction: t }
			);

			await t.commit();
			res.status(200).send({ message: "Address updated successfully." });
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},

	deleteAddress: async (req, res) => {
		const { id } = req.params;
		const t = await db.sequelize.transaction();

		try {
			const address = await db.addresses.findOne({ where: { id } });
			if (!address) {
				return res.status(404).send({ message: "Address not found." });
			}

			await db.addresses.destroy({
				where: { id: id },
				transaction: t,
			});

			await t.commit();
			res.send({ message: "Address deleted successfully." });
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
};
module.exports = addressController;
