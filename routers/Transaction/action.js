import Transaction from "../../DB/Model/Transaction.js";
import Category from "../../DB/Model/Category.js";
import TransactionType from "../../DB/Model/TransactionType.js";

const createTransaction = async (req, res) => {
  try {
    const { categoryId, amount, description } = req.body;
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
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
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
    const { categoryId, amount, description } = req.body;

    const category = await Category.findOne({
      _id: categoryId,
    });
    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { category: categoryId, type: category.type, amount, description },
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

export const TransactionAction = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
