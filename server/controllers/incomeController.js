import Income from '../models/Income.js';

export const getIncome = async (req, res, next) => {
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
    const total = await Income.countDocuments(filter);

    // Get income records
    const income = await Income.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      income,
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

export const createIncome = async (req, res, next) => {
  try {
    const { source, amount, category, description, date } = req.body;

    // Validate required fields
    if (!source || amount === undefined || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const income = new Income({
      userId: req.user.userId,
      source,
      amount,
      category,
      description,
      date,
    });

    await income.save();

    res.status(201).json({
      message: 'Income created successfully',
      income,
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomeById = async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    res.status(200).json({ income });
  } catch (error) {
    next(error);
  }
};

export const updateIncome = async (req, res, next) => {
  try {
    const { source, amount, category, description, date } = req.body;

    let income = await Income.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    // Update fields if provided
    if (source) income.source = source;
    if (amount !== undefined) income.amount = amount;
    if (category) income.category = category;
    if (description !== undefined) income.description = description;
    if (date) income.date = date;

    income = await income.save();

    res.status(200).json({
      message: 'Income updated successfully',
      income,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    res.status(200).json({
      message: 'Income deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
