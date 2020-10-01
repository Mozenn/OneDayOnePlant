const Plant = require("../models/plant");
const User = require("../models/user");
const logger = require("../utils/logger");

module.exports = {
  getPlant: (req, res, next) => {
    const plantId = req.params.plantId;

    Plant.findById(plantId)
      .then((plant) => {
        if (!plant) {
          const error = new Error("Could not find plant");
          error.statusCode = 404;
          throw error;
        }

        res.status(200).json({ plant });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
  getPlants: (req, res, next) => {
    Plant.find()
      .then((plants) => {
        res.status(200).json({ plants });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  },
  getPlantsPage: (req, res, next) => {
    const page = req.query.page || 1;
    const plantPerPage = 5;

    Plant.find()
      .countDocuments()
      .then((num) => {
        Plant.find()
          .skip((page - 1) * plantPerPage)
          .limit(plantPerPage)
          .then((plants) => {
            res.status(200).json({ plants, num });
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          });
      });
  },
  drawPlant: (req, res, next) => {
    const userId = req.userId;

    User.findById(userId)
      .populate("plants")
      .then((user) => {
        if (!user) {
          const error = new Error("Could not find user");
          error.statusCode = 401;
          throw error;
        }

        const dayInMillisecs = 86400000;

        if (dayInMillisecs - (new Date() - user.lastDrawDate) > 0) {
          const error = new Error("Can't draw a new plant yet");
          error.statusCode = 403;
          throw error;
        }

        const ownedPlants = user.plants;

        Plant.find()
          .then(async (plants) => {
            const validPlants = plants.filter((plant) => {
              return !ownedPlants.some(
                (ownedPlant) =>
                  ownedPlant._id.toString() === plant._id.toString()
              );
            });

            const index = Math.floor(Math.random() * validPlants.length);

            const drawedPlant = validPlants[index];

            user.lastDrawDate = new Date();
            user.lastDrawPlant = drawedPlant._id;
            user.plants.push(drawedPlant);
            user.score += 1;

            await user.save();

            res.status(200).json({ drawedPlant });
          })
          .catch((err) => {
            logger.error(err);
            const error = new Error("Can't fetch plants");
            error.statusCode = 500;
            throw error;
          });
      })
      .catch((err) => {
        let error = err;
        if (!err.statusCode) {
          error = new Error("Can't find user");
          error.statusCode = 500;
        }

        next(error);
      });
  },
};
