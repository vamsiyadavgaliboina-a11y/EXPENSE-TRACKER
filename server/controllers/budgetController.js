import Budget from '../models/Budget.js';

export const getBudgets = async (req, res, next) => {
  try {
    const { month, year, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { userId: req.user.userId };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    // Get total count
    const total = await Budget.countDocuments(filter);

    // Get budgets
    const budgets = await Budget.find(filter)
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      budgets,
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

export const createBudget = async (req, res, next) => {
  try {
    const { month, year, totalBudget, categoryBudgets } = req.body;

    // Validate required fields
    if (!month || !year || totalBudget === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if budget already exists for this month
    const existingBudget = await Budget.findOne({
      userId: req.user.userId,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this month' });
    }

    const budget = new Budget({
      userId: req.user.userId,
      month,
      year,
      totalBudget,
      categoryBudgets: categoryBudgets || {},
    });

    await budget.save();

    res.status(201).json({
      message: 'Budget created successfully',
      budget,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const { totalBudget, categoryBudgets } = req.body;

    let budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Update fields if provided
    if (totalBudget !== undefined) budget.totalBudget = totalBudget;
    if (categoryBudgets) {
      budget.categoryBudgets = {
        ...budget.categoryBudgets,
        ...categoryBudgets,
      };
    }

    budget = await budget.save();

    res.status(200).json({
      message: 'Budget updated successfully',
      budget,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json({
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
