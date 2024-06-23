import TransactionType from "../DB/Model/TransactionType.js";

const basicTransactionTypes = [
  { name: "Income", description: "Income transactions" },
  { name: "Expense", description: "Expense transactions" },
  { name: "Saving", description: "Saving transactions" },
];

const seedTransactionTypes = async () => {
  try {
    for (const type of basicTransactionTypes) {
      const existingType = await TransactionType.findOne({ name: type.name });
      if (!existingType) {
        await new TransactionType(type).save();
      }
    }
  } catch (error) {
    console.error("Error seeding transaction types:", error);
  }
};

export default seedTransactionTypes;
