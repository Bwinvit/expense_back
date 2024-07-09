import Transaction from "../../DB/Model/Transaction.js";
import Category from "../../DB/Model/Category.js";
import User from "../../DB/Model/User.js";

const createTransaction = async (req, res) => {
  try {
    const { categoryId, amount, description, date } = req.body;
    const userId = req.userId;

    const category = await Category.findOne({
      _id: categoryId,
    });

    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const newTransaction = new Transaction({
      userId: userId,
      category: categoryId,
      type: category.type,
      amount,
      description,
      date: date * 1000,
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  const { start, end, category } = req.query;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const filter = { userId: req.userId };

    if (!start && !end) {
      const today = new Date();
      filter.date = {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1
        ), // Includes today until tomorrow
      };
    } else {
      // Existing logic for processing start and end if provided
      if (start || end) {
        filter.date = {};
        if (start) filter.date.$gte = new Date(parseInt(start) * 1000);
        if (end) filter.date.$lte = new Date(parseInt(end) * 1000);
      }
    }

    if (category) {
      filter.category = { $in: category.split(",") };
    }

    console.log("🚀 ~ getTransactions ~ filter:", filter);

    const transactions = await Transaction.find(filter)
      .populate("category", "name")
      .populate("type", "name");

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
      .populate("category", "name")
      .populate("type", "name");
    if (!transaction || transaction.userId.toString() !== req.userId) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, amount, description, date } = req.body;

    const updateData = {};
    if (categoryId) updateData.category = categoryId;
    if (amount) updateData.amount = amount;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(parseInt(date) * 1000);
    if (categoryId) updateData.category = categoryId;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: updateData },
      { new: true }
    )
      .populate("category", "name")
      .populate("type", "name");

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearTransactionsByUserId = async (req, res) => {
  try {
    const result = await Transaction.deleteMany({ userId: req.userId });
    res.status(200).json({
      message: "Transactions cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const TransactionAction = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  //Admin route
  clearTransactionsByUserId,
};
