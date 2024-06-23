import mongoose from "mongoose";
import TransactionType from "../DB/Model/TransactionType.js";
import Category from "../DB/Model/Category.js";

const categoriesToSeed = [
  // Income Categories
  {
    name: "Salary",
    description: "Regular income from employment",
    type: "6676ec460f3e3dfaf4921712",
  },
  {
    name: "Freelance/Side Income",
    description: "Income from freelance work or side gigs",
    type: "6676ec460f3e3dfaf4921712",
  },
  {
    name: "Investments",
    description: "Earnings from investments (e.g., dividends, interest)",
    type: "6676ec460f3e3dfaf4921712",
  },
  {
    name: "Other Income",
    description: "Miscellaneous income (e.g., gifts, tax refunds)",
    type: "6676ec460f3e3dfaf4921712",
  },

  // Expense Categories
  {
    name: "Housing",
    description:
      "Rent/Mortgage, Utilities (Electricity, Water, Gas, Internet/Cable)",
    type: "6676ec470f3e3dfaf4921716",
  },
  {
    name: "Transportation",
    description: "Fuel, Public Transport, Car Payments, Car Insurance",
    type: "6676ec470f3e3dfaf4921716",
  },
  {
    name: "Food",
    description: "Groceries, Dining Out",
    type: "6676ec470f3e3dfaf4921716",
  },
  {
    name: "Insurance",
    description: "Health Insurance, Auto Insurance",
    type: "Expense",
  },
  {
    name: "Personal Care",
    description: "Clothing, Haircuts/Beauty Services",
    type: "6676ec470f3e3dfaf4921716",
  },
  {
    name: "Health & Wellness",
    description: "Medical Expenses, Prescriptions",
    type: "6676ec470f3e3dfaf4921716",
  },
  {
    name: "Debt Payments",
    description: "Credit Card Payments, Loan Repayments",
    type: "6676ec470f3e3dfaf4921716",
  },

  // Saving Categories
  {
    name: "Emergency Fund",
    description: "Savings for unexpected expenses",
    type: "6676ec470f3e3dfaf4921719",
  },
  {
    name: "Savings Account",
    description: "General savings",
    type: "6676ec470f3e3dfaf4921719",
  },
  {
    name: "Retirement Fund",
    description: "Contributions to retirement accounts (e.g., 401(k), IRA)",
    type: "6676ec470f3e3dfaf4921719",
  },
  {
    name: "Investments",
    description:
      "Money allocated to investments (e.g., stocks, bonds, real estate)",
    type: "6676ec470f3e3dfaf4921719",
  },
];

const seedCategories = async () => {
  try {
    for (const category of categoriesToSeed) {
      let transactionType;

      if (mongoose.Types.ObjectId.isValid(category.type)) {
        transactionType = await TransactionType.findById(category.type);
      } else {
        transactionType = await TransactionType.findOne({
          name: category.type,
        });
      }

      if (!transactionType) {
        console.error(`Transaction type ${category.type} not found.`);
        continue;
      }

      const existingCategory = await Category.findOne({ name: category.name });

      if (!existingCategory) {
        const migrationData = {
          name: category.name,
          description: category.description,
          type: transactionType._id,
          userId: null,
        };
        await new Category(migrationData).save();
      }
    }

    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    mongoose.connection.close();
  }
};

export default seedCategories;
