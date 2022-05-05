const { WomenCard } = require("../cardModel");
const lodash = require("lodash");

async function generateBizNum() {
  while (true) {
    //הלולאה תמשיך לרוץ עד שלא מצאנו קארד
    const randomNum = lodash.random(1000000, 9999999);
    const womenCard = await WomenCard.findOne({ bizNumber: randomNum });
    if (!womenCard) return String(randomNum);
  }
}
exports.generateBizNum = generateBizNum;
