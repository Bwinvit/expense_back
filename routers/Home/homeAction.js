import Transaction from "../../DB/Model/Transaction.js";
import _ from "lodash";

const getMonthlySum = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const transactions = await Transaction.find({
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("type category");
    const groupedTransactions = _.groupBy(
      transactions,
      (transaction) => transaction.type.name
    );
    const totalsByTypeArray = _.map(
      groupedTransactions,
      (transactions, type) => ({
        transactionType: type,
        amount: _.sumBy(transactions, "amount"),
      })
    );

    res.status(200).json({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      totalsByType: totalsByTypeArray,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const homeAction = {
  getMonthlySum,
};
