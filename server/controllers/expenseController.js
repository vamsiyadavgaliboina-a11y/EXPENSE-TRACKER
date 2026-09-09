import Expense from '../models/Expense.js';

export const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10, sort = '-date' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { userId: req.user.userId };
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Get total count
    const total = await Expense.countDocuments(filter);

    // Get expenses
    const expenses = await Expense.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, description, paymentMethod, date, notes } = req.body;

    // Validate required fields
    if (!title || amount === undefined || !category || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const expense = new Expense({
      userId: req.user.userId,
      title,
      amount,
      category,
      description,
      paymentMethod,
      date,
      notes,
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const { title, amount, category, description, paymentMethod, date, notes } = req.body;

    let expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Update fields if provided
    if (title) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (date) expense.date = date;
    if (notes !== undefined) expense.notes = notes;

    expense = await expense.save();

    res.status(200).json({
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
