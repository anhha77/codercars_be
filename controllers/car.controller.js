const mongoose = require("mongoose");
const Car = require("../models/Car");
const { sendResponse } = require("../helpers/utils");
const carController = {};

carController.createCar = async (req, res, next) => {
  const { make, model, release_date, transmission_type, price, size, style } =
    req.body;

  try {
    const created = await Car.create({
      make: make,
      model: model,
      release_date: release_date,
      transmission_type: transmission_type,
      price: price,
      size: size,
      style: style,
    });
    sendResponse(
      res,
      200,
      true,
      { car: created, message: "Create Car Successfully" },
      null
    );
  } catch (err) {
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  const { page, searchQuery } = req.query;
  // console.log(searchQuery);
  try {
    const allCars = await Car.find({
      isDeleted: false,
      make: { $regex: searchQuery, $options: "i" },
    });
    const cars = await Car.find({
      isDeleted: false,
      make: { $regex: searchQuery, $options: "i" },
    })
      .sort({ _id: 1 })
      .skip(page * 10)
      .limit(10);

    sendResponse(
      res,
      200,
      true,
      {
        cars: cars,
        page: page,
        total: Math.ceil(allCars.length / 10),
        message: "Get Car List Successfully!",
      },
      null
    );
  } catch (err) {
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  const { id } = req.params;
  const { make, model, release_date, transmission_type, price, size, style } =
    req.body;
  try {
    const carUpdate = await Car.findByIdAndUpdate(
      id,
      {
        make: make,
        model: model,
        release_date: release_date,
        transmission_type: transmission_type,
        price: price,
        size: size,
        style: style,
      },
      { new: true }
    );
    sendResponse(
      res,
      200,
      true,
      {
        car: carUpdate,
        message: "Update Car Successfully",
      },
      null
    );
  } catch (err) {
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  const { id } = req.params;
  try {
    const carDelete = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    sendResponse(
      res,
      200,
      true,
      { car: carDelete, message: "Delete Car Successfully" },
      null
    );
  } catch (err) {
    next(err);
  }
};

module.exports = carController;
