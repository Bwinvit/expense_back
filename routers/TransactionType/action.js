import TransactionType from "../../DB/Model/TransactionType.js";
import Category from "../../DB/Model/Category.js";
import _ from "lodash";

const createTransactionType = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newTransactionType = new TransactionType({
      name,
      description,
      userId: req.userId,
    });
    await newTransactionType.save();
    res.status(201).json(newTransactionType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionTypes = async (req, res) => {
  try {
    const userTransactionTypes = await TransactionType.find({
      userId: req.userId,
    });
    const basicTransactionTypes = await TransactionType.find({
      userId: { $exists: false },
    });

    const allTransactionTypes = _.concat(
      basicTransactionTypes,
      userTransactionTypes
    );

    res.status(200).json(allTransactionTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTransactionType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedTransactionType = await TransactionType.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { name, description },
      { new: true }
    );
    if (!updatedTransactionType) {
      return res.status(404).json({ error: "Transaction type not found" });
    }
    res.status(200).json(updatedTransactionType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransactionType = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the transaction type
    const deletedTransactionType = await TransactionType.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!deletedTransactionType) {
      return res.status(404).json({ error: "Transaction type not found" });
    }

    // Delete related categories
    await Category.deleteMany({ type: id });

    res
      .status(200)
      .json({
        message: "Transaction type and related categories deleted successfully",
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const TransactionTypeAction = {
  createTransactionType,
  getTransactionTypes,
  updateTransactionType,
  deleteTransactionType,
};
