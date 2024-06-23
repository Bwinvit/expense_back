import Quote from "../../DB/Model/Quote.js";

const createQuote = async (req, res) => {
  try {
    const { quote, author } = req.body;
    const newQuote = new Quote({ quote, author });
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (error) {
    console.error("Error creating quote:", error);
    res.status(500).json({ error: "Failed to create quote" });
  }
};

const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateQuote = async (req, res) => {
  try {
    const { id } = req.query;
    const { quote, author } = req.body;
    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { quote, author },
      { new: true }
    );
    if (!updatedQuote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    res.status(200).json(updatedQuote);
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ error: "Failed to update quote" });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedQuote = await Quote.findByIdAndDelete(id);
    if (!deletedQuote) {
      return res.status(404).json({ error: "Quote not found" });
    }
    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    res.status(500).json({ error: "Failed to delete quote" });
  }
};

export const NAQAction = {
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
};
