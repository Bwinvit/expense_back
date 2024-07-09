import Transaction from "../../DB/Model/Transaction.js";
import User from "../../DB/Model/User.js";

const getExpenseBreakDown = async (req, res) => {
  const userId = req.userId;
  let { start, end } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!start || !end) {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      start = Math.floor(firstDayOfMonth.getTime() / 1000);
      end = Math.floor(lastDayOfMonth.getTime() / 1000);
    }

    const startDate = new Date(parseInt(start) * 1000);
    const endDate = new Date(parseInt(end) * 1000);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid timestamp format." });
    }

    const transactions = await Transaction.find({
      userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    return res.json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while fetching the expense breakdown.",
    });
  }
};

export const chartAction = {
  getExpenseBreakDown,
};
