import Category from "../../DB/Model/Category.js";
import TransactionType from "../../DB/Model/TransactionType.js";
import _ from "lodash";

const createCategory = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    const transactionType = await TransactionType.find({
      _id: type,
    });

    if (!transactionType) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    const newCategory = new Category({
      name,
      description,
      type,
      userId: req.userId,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.log("🚀 ~ createCategory ~ error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const userCategories = await Category.find({ userId: req.userId });
    const basicCategories = await Category.find({ userId: null });

    const allCategories = _.concat(basicCategories, userCategories);

    res.status(200).json(allCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { name, type, description },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const categoryAction = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
