import Bill from "../../DB/Model/Bill.js";
import Transaction from "../../DB/Model/Transaction.js";
import Category from "../../DB/Model/Category.js";

const createBill = async (req, res) => {
  const {
    categoryId,
    amount,
    description,
    dueDate,
    isRecurring,
    recurrencePeriod,
  } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const newBill = new Bill({
      userId,
      categoryId,
      amount,
      description,
      dueDate: new Date(parseInt(dueDate) * 1000),
      isRecurring,
      recurrencePeriod,
    });

    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBills = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const bills = await Bill.find({ userId });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBill = async (req, res) => {
  const { billId } = req.params;
  const {
    categoryId,
    amount,
    description,
    dueDate,
    isRecurring,
    recurrencePeriod,
  } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const updatedBill = await Bill.findOneAndUpdate(
      { _id: billId, userId },
      {
        categoryId,
        amount,
        description,
        dueDate,
        isRecurring,
        recurrencePeriod,
      },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ error: "Bill not found." });
    }

    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBill = async (req, res) => {
  const { billId } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const deletedBill = await Bill.findOneAndDelete({ _id: billId, userId });

    if (!deletedBill) {
      return res.status(404).json({ error: "Bill not found." });
    }

    res.status(200).json({ message: "Bill deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markBillAsPaid = async (req, res) => {
  const { billId } = req.params;
  const { paidAmount } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const bill = await Bill.findOneAndUpdate(
      { _id: billId, userId },
      { isPaid: true, paidAmount, paidDate: new Date() },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ error: "Bill not found." });
    }

    const category = await Category.findOne({
      _id: bill.categoryId,
    });

    const newTransaction = new Transaction({
      userId,
      category: bill.categoryId,
      type: category.type,
      amount: paidAmount,
      description: `${bill.description} (Paid): ${new Date()}`,
      date: new Date(),
    });

    await newTransaction.save();

    if (bill.isRecurring) {
      const currentDueDate = new Date(bill.dueDate);
      let newDueDate;

      switch (bill.recurrencePeriod) {
        case "daily":
          newDueDate = new Date(
            currentDueDate.setDate(currentDueDate.getDate() + 1)
          );
          break;
        case "weekly":
          newDueDate = new Date(
            currentDueDate.setDate(currentDueDate.getDate() + 7)
          );
          break;
        case "monthly":
          newDueDate = new Date(
            currentDueDate.setMonth(currentDueDate.getMonth() + 1)
          );
          break;
        case "yearly":
          newDueDate = new Date(
            currentDueDate.setFullYear(currentDueDate.getFullYear() + 1)
          );
          break;
        default:
          return res.status(400).json({ error: "Invalid recurrence period" });
      }

      bill.dueDate = newDueDate;
      bill.isPaid = false; // Reset the paid status for the next cycle
      await bill.save();
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearTransactionsByUserId = async (req, res) => {
  try {
    const result = await Bill.deleteMany({ userId: req.userId });
    res.status(200).json({
      message: "Bill cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const billAction = {
  createBill,
  getBills,
  updateBill,
  deleteBill,
  markBillAsPaid,

  //Admin Action
  clearTransactionsByUserId,
};
