const express = require("express");
const bodyParser = require("body-parser");
const Dishes = require("../model/dishes");
const { verifyUser, verifyAdmin } = require("../auth");
const { corsWithOptions, cors } = require("./CORS");
const dishRouter = express.Router();
/**LIST
  check admin user delete dishes
  check admin user post dishes
  check admin user put dish
  check admin user delete dish
 * check admin user get users
  check admin user delete comments
  verify the author put comment
  verify the author delete comment
 */
dishRouter.use(bodyParser.json());

dishRouter
  .route("/")
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    // get all the dishes no need to signup
    Dishes.find(req.query)
      .populate("comments.author")
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    /**
     * add dish to dishes collection need to be logged in
     */
    Dishes.create(req.body)
      .then((dish) => {
        res.statusCode = 200;
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .put(corsWithOptions, verifyUser, (req, res, next) => {
    /**
     * not allowed
     */
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    /**
     * delete all dish need to be log
     */
    Dishes.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => next(err));
  });
dishRouter
  .route("/:dishId")
  .options(corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors, (req, res, next) => {
    /**
     * get dish
     */
    Dishes.findById(req.params.dishId)
      .populate("comments.author")
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .post(corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put(corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    /**
     * update dish
     */
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      { $set: req.body },
      { new: true }
    )
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  })
  .delete(corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(dish);
      })
      .catch((err) => next(err));
  });

module.exports = dishRouter;
