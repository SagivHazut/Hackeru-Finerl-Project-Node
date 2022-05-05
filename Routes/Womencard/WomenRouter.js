const { WomenCard } = require("./cardModel");
const express = require("express");
const auth = require("../../middlewares/authorization");
const router = express.Router();
const chalk = require("chalk");
const res = require("express/lib/response");
const { generateBizNum } = require("./services/generateBizNum");
const { validateCard } = require("./cardValidation");

/********** סעיף 7 **********/
router.get("/allWomenCards", async (req, res) => {
  try {
    const womenCards = await WomenCard.find();
    console.log(womenCards);
    return res.send(womenCards);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 8 **********/
/********** params **********/
router.get("/womenCard/:id", async (req, res) => {
  try {
    const womenCardID = req.params.id;
    const womenCard = await WomenCard.findOne({ _id: womenCardID });
    //const _id = req.params.id;
    //const card = await Card.findOne({ _id });
    return res.send(womenCard);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 8 **********/
/********* qparams **********/
//http://localhost:8181/api/cards/card?id=12312323
router.get("/womenCard", async (req, res) => {
  try {
    const womenCardID = req.query.id;
    const womenCard = await WomenCard.findOne({ _id: womenCardID });
    //const _id = req.params.id;
    //const card = await Card.findOne({ _id });
    return res.send(womenCard);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** סעיף 9 **********/
router.get("/my-womenCard", auth, (req, res) => {
  let user = req.user;
  if (!user.biz) return res.status(403).json("Un authorize user!");

  WomenCard.find({ userID: user._id })
    .then((womenCards) => res.json(womenCards))
    .catch((error) => res.status(500).send(error.message));
});

/********** סעיף 10 **********/
router.post("/", auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non biz user attempted to create a card!")
      );
      return res.status(403).json("Un authorize user!");
    }

    let womenCard = req.body;
    const { error } = validateCard(womenCard);
    if (error) {
      console.log(chalk.redBright(error.details[0].message));
      return res.status(400).send(error.details[0].message);
    }

    const bizNumber = await generateBizNum();

    womenCard = {
      name: womenCard.name,
      description: womenCard.description,
      phone: womenCard.phone,
      image: womenCard.image
        ? womenCard.image
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      userID: user._id,
      bizNumber,
    };

    womenCard = new WomenCard(womenCard);
    await womenCard.save();
    return res.send(womenCard);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});
/********** edit card **********/
router.put("/:id", auth, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non-business user attempted to create a card!")
      );
      return res.status(403).json("You are not authorize to edit card!");
    }

    let womenCard = req.body;
    const { error } = validateCard(womenCard);
    if (error) {
      const errorMessage = error.details[0].message;
      console.log(errorMessage);
      return res.status(400).send(errorMessage);
    }

    const filter = {
      _id: req.params.id,
      userID: user._id,
    };

    womenCard = await WomenCard.findOneAndUpdate(filter, womenCard);
    if (!womenCard) {
      console.log(chalk.redBright("No card with this ID in the database!"));
      return res.status(404).send("No card with this ID in the database!");
    }
    womenCard = await WomenCard.findById(womenCard._id);
    return res.send(womenCard);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

/********** delete card **********/
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non-business user attempted to create a card!")
      );
      return res.status(403).json("You are not authorize to edit card!");
    }
    const womenCardID = req.params.id;
    let womenCard = await WomenCard.findById(womenCardID);

    if (!user.admin || womenCard.userID === user._id) {
      womenCard = await WomenCard.findOneAndRemove({ _id: womenCardID });
      return res.send(womenCard);
    }
    console.log(chalk.redBright("Un authorized user!"));
    return res.status(403).send("You are noe authorize to delete cards");
  } catch (error) {
    console.log(chalk.redBright("Could not delete card:", error.message));
    return res.status(500).send(error.message);
  }
});

//////////////
router.patch("/:id", auth, async (req, res) => {
  try {
    let user = req.user;
    if (!user.biz) {
      console.log(
        chalk.redBright("A non-business user attempted to create a card!")
      );
      return res.status(403).json("You are not authorize to edit card!");
    }

    let womenCard = req.body;
    const { error } = validateCard(womenCard);
    if (error) {
      const errorMessage = error.details[0].message;
      console.log(errorMessage);
      return res.status(400).send(errorMessage);
    }

    const filter = {
      _id: req.params.id,
      userID: user._id,
    };

    womenCard = await WomenCard.findOneAndUpdate(filter, womenCard);
    if (!womenCard) {
      console.log(chalk.redBright("No card with this ID in the database!"));
      return res.status(404).send("No card with this ID in the database!");
    }
    womenCard = await WomenCard.findById(womenCard._id);
    return res.send(womenCard);
  } catch (error) {
    console.log(chalk.redBright(error.message));
    return res.status(500).send(error.message);
  }
});

module.exports = router;
