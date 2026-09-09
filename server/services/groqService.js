import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Intelligent rule-based fallback for spending insights
function generateRuleBasedSpendingInsights(financialData = {}) {
  const {
    monthlyIncome = 0,
    monthlyBudget = 0,
    currentSpending = 0,
    categoryBreakdown = [],
    budgetUsage = 0,
  } = financialData;

  const sortedCategories = [...categoryBreakdown].sort((a, b) => b.amount - a.amount);
  const topCategory = sortedCategories[0];
  const secondCategory = sortedCategories[1];

  let summary = '';
  if (currentSpending === 0) {
    summary = `You have not recorded any expenses yet this month. With an income of ₹${monthlyIncome.toLocaleString()}, you have a solid starting point to budget intentionally.`;
  } else if (budgetUsage > 100) {
    summary = `You have spent ₹${currentSpending.toLocaleString()} this month, exceeding your ₹${monthlyBudget.toLocaleString()} budget by ${(budgetUsage - 100).toFixed(0)}%. Focus strictly on essential expenses for the rest of the month.`;
  } else if (budgetUsage > 80) {
    summary = `You have spent ₹${currentSpending.toLocaleString()} (${Math.round(budgetUsage)}% of your ₹${monthlyBudget.toLocaleString()} budget). You are nearing your budget limit with ₹${Math.max(0, monthlyBudget - currentSpending).toLocaleString()} remaining.`;
  } else {
    summary = `You have spent ₹${currentSpending.toLocaleString()} (${Math.round(budgetUsage)}% of your ₹${monthlyBudget.toLocaleString()} budget). Your spending pace is healthy with ₹${Math.max(0, monthlyBudget - currentSpending).toLocaleString()} remaining.`;
  }

  const trends = [];
  if (topCategory && currentSpending > 0) {
    const topPct = Math.round((topCategory.amount / currentSpending) * 100);
    trends.push(`${topCategory.category} is your highest expense category at ₹${topCategory.amount.toLocaleString()} (${topPct}% of your total spending).`);
  }
  if (secondCategory && currentSpending > 0) {
    const secondPct = Math.round((secondCategory.amount / currentSpending) * 100);
    trends.push(`${secondCategory.category} is your second highest expense at ₹${secondCategory.amount.toLocaleString()} (${secondPct}% of your total spending).`);
  }
  if (monthlyIncome > 0) {
    const incomeUsed = Math.round((currentSpending / monthlyIncome) * 100);
    trends.push(`You have utilized approximately ${incomeUsed}% of your total monthly income.`);
  }

  const warnings = [];
  if (budgetUsage > 100) {
    warnings.push(`Budget limit exceeded by ₹${(currentSpending - monthlyBudget).toLocaleString()}. Pause any non-critical expenses.`);
  } else if (budgetUsage > 90) {
    warnings.push(`You have reached ${Math.round(budgetUsage)}% of your total budget. Immediate spending caution is recommended.`);
  }
  if (topCategory && currentSpending > 0 && (topCategory.amount / currentSpending) > 0.35) {
    warnings.push(`Over ${(topCategory.amount / currentSpending * 100).toFixed(0)}% of your expenses are concentrated in ${topCategory.category}.`);
  }
  if (monthlyIncome > 0 && currentSpending > monthlyIncome) {
    warnings.push(`Current spending exceeds your monthly income by ₹${(currentSpending - monthlyIncome).toLocaleString()}.`);
  }

  const recommendations = [];
  if (budgetUsage > 90) {
    recommendations.push('Freeze discretionary spending (entertainment, shopping, dining out) for the remainder of the month.');
  }
  if (topCategory) {
    if (topCategory.category === 'Food') {
      recommendations.push('Prepare meals or snacks at home rather than ordering takeout to significantly reduce food costs.');
    } else if (topCategory.category === 'Transportation') {
      recommendations.push('Look into student travel passes, carpooling, or transit discounts to lower commute expenses.');
    } else if (topCategory.category === 'Shopping') {
      recommendations.push('Apply the 24-hour rule before buying non-essential items to curb impulse purchases.');
    } else if (topCategory.category === 'Bills') {
      recommendations.push('Review recurring subscriptions and cancel any services you do not actively use every week.');
    } else {
      recommendations.push(`Set a strict weekly limit for ${topCategory.category} to keep it under control.`);
    }
  }
  recommendations.push('Track small cash and UPI transactions daily so they do not add up unnoticed.');
  if (monthlyBudget > currentSpending) {
    recommendations.push(`Keep daily spending below ₹${Math.max(0, Math.round((monthlyBudget - currentSpending) / 10)).toLocaleString()} to preserve your remaining budget.`);
  } else {
    recommendations.push('Allocate any upcoming funds directly toward rebuilding an emergency buffer.');
  }

  return {
    summary,
    trends: trends.length > 0 ? trends : ['No spending trends detected yet. Add more expenses to see detailed trends.'],
    warnings,
    forecast: budgetUsage > 100
      ? 'Current pace indicates your monthly outflow will remain above your target unless spending is curtailed.'
      : 'Maintaining this spending discipline will help you finish the month within your financial limits.',
    recommendations,
  };
}

// Intelligent rule-based fallback for forecast insights
function generateRuleBasedForecastInsights(forecastData = {}) {
  const {
    currentSpending = 0,
    projectedSpending = 0,
    budget = 0,
    daysElapsed = 1,
    daysInMonth = 30,
    averageDailySpending = 0,
    status = 'on-track',
  } = forecastData;

  const daysRemaining = Math.max(0, daysInMonth - daysElapsed);
  const remainingBudget = Math.max(0, budget - currentSpending);
  const recommendedDaily = daysRemaining > 0 ? Math.round(remainingBudget / daysRemaining) : 0;

  let forecastStatus = status;
  let analysis = '';
  const actions = [];

  if (projectedSpending > budget * 1.1 || currentSpending > budget) {
    forecastStatus = 'exceeding';
    analysis = `Based on spending of ₹${currentSpending.toLocaleString()} over ${daysElapsed} day(s) (averaging ₹${Math.round(averageDailySpending).toLocaleString()}/day), projected month-end expenditure is ₹${Math.round(projectedSpending).toLocaleString()}, which exceeds your budget of ₹${budget.toLocaleString()}.`;
    actions.push(`Restrict daily spending to ₹${recommendedDaily.toLocaleString()} or less for the remaining ${daysRemaining} day(s).`);
    actions.push('Pause optional entertainment, discretionary shopping, and non-essential dining.');
    actions.push('Review upcoming planned expenses and prioritize only critical needs.');
  } else if (projectedSpending > budget * 0.9) {
    forecastStatus = 'at-risk';
    analysis = `Your projected spending of ₹${Math.round(projectedSpending).toLocaleString()} is nearing your ₹${budget.toLocaleString()} budget limit. Moderate spending adjustments will prevent exceeding your target.`;
    actions.push(`Aim to keep daily spending below ₹${recommendedDaily.toLocaleString()} for the remaining ${daysRemaining} day(s).`);
    actions.push('Review recurring subscriptions and minimize discretionary purchases.');
    actions.push('Monitor daily outlays closely to ensure you stay within your planned limit.');
  } else {
    forecastStatus = 'on-track';
    analysis = `You are on track! Projected month-end spending of ₹${Math.round(projectedSpending).toLocaleString()} is comfortably within your ₹${budget.toLocaleString()} budget. You have ₹${remainingBudget.toLocaleString()} available for the rest of the month.`;
    actions.push(`Maintain your current daily spending pace (approx ₹${Math.round(averageDailySpending).toLocaleString()}/day).`);
    actions.push('Consider moving any surplus budget at month-end into an emergency fund.');
    actions.push('Continue logging daily transactions to maintain accurate financial awareness.');
  }

  return {
    forecastStatus,
    analysis,
    actions,
  };
}

export const groqService = {
  async getInsights(financialData) {
    const apiKey = process.env.GROQ_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your_groq_api_key_here';

    if (!isApiKeyConfigured) {
      console.log('ℹ️ Groq API key not configured, using smart rule-based spending insights.');
      return generateRuleBasedSpendingInsights(financialData);
    }

    try {
      const prompt = `You are a financial education assistant designed for students. Analyze the following financial data and provide practical, realistic, and student-friendly insights.

IMPORTANT: 
- Do not provide professional financial advice
- Do not invent transaction data
- Only use the information provided
- Keep recommendations realistic for a student
- Be encouraging and supportive

Financial Data:
${JSON.stringify(financialData, null, 2)}

Please provide your analysis in the following JSON format:
{
  "summary": "A brief overview of their spending habits (2-3 sentences)",
  "trends": ["trend1", "trend2", "trend3"],
  "warnings": ["warning1", "warning2"],
  "forecast": "Your interpretation of the spending forecast (2-3 sentences)",
  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4"]
}`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful financial education assistant for students. Always respond in valid JSON format only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      let content = response.data.choices[0]?.message?.content || '{}';
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = jsonMatch[0];
        }
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse AI response, using rule-based fallback:', parseError);
        return generateRuleBasedSpendingInsights(financialData);
      }
    } catch (error) {
      console.warn('Groq API Error, falling back to rule-based insights:', error.response?.data || error.message);
      return generateRuleBasedSpendingInsights(financialData);
    }
  },

  async getForecastInsights(financialData) {
    const apiKey = process.env.GROQ_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your_groq_api_key_here';

    if (!isApiKeyConfigured) {
      console.log('ℹ️ Groq API key not configured, using smart rule-based forecast insights.');
      return generateRuleBasedForecastInsights(financialData);
    }

    try {
      const prompt = `You are a financial education assistant. Based on this spending forecast data, provide insights in student-friendly language.

Financial & Forecast Data:
${JSON.stringify(financialData, null, 2)}

Provide response in JSON format:
{
  "forecastStatus": "on-track | at-risk | exceeding",
  "analysis": "Clear explanation of what the forecast means (2-3 sentences)",
  "actions": ["action1", "action2", "action3"]
}`;

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful financial education assistant. Always respond in valid JSON format only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      let content = response.data.choices[0]?.message?.content || '{}';
      
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          content = jsonMatch[0];
        }
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse AI response, using rule-based fallback:', parseError);
        return generateRuleBasedForecastInsights(financialData);
      }
    } catch (error) {
      console.warn('Groq API Error, falling back to rule-based forecast insights:', error.response?.data || error.message);
      return generateRuleBasedForecastInsights(financialData);
    }
  },

  async chat(messages = [], userContext = null) {
    const apiKey = process.env.GROQ_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your_groq_api_key_here';
    const lastUserMessage = [...messages].reverse().find((message) => (
      message.role === 'user' || message.sender === 'user'
    ));
    const userQuestion = lastUserMessage?.content || lastUserMessage?.text || '';

    if (!isApiKeyConfigured) {
      const reply = generateRuleBasedChatResponse(userQuestion, userContext);
      return { reply, source: 'rule-based' };
    }

    try {
      const systemPrompt = `You are Spidy, a friendly, supportive, and knowledgeable AI financial assistant embedded inside the Expense Tracker web application for students.
Your job is to interact with visitors and students, answering any question clearly and accurately. Prioritize questions about:
1. Using the application (expenses, budgets, forecasting, AI insights, analytics, dark mode, settings)
2. Personal finance for students (saving money, budgeting rules like 50/30/20, cutting food/transit costs, student discounts)
3. Financial queries in general
4. General knowledge and everyday questions, even when they are unrelated to finance

Rules:
- Answer the user's exact question directly in the first sentence. Do not begin by restating the question, describing what you can do, or telling the user how to ask.
- Infer the user's intent from their wording and conversation history. Only ask a clarifying question when the request is genuinely impossible to answer without more information.
- If the question is about this app, give the exact page, control, or steps needed to complete the task.
- Be warm, encouraging, and concise.
- Use formatting (bullet points, bold text, emojis) to make reading pleasant.
- Do not provide formal legal/licensed financial advice.
- Keep answers realistic and actionable for a college/university student.
${userContext ? `User Context: ${JSON.stringify(userContext)}` : ''}`;

      const groqMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-6).map(m => ({
          role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
          content: m.text || m.content || '',
        })),
      ];

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 600,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const reply = response.data.choices[0]?.message?.content?.trim() || generateRuleBasedChatResponse(userQuestion, userContext);
      return { reply, source: 'ai' };
    } catch (error) {
      console.warn('Groq Chat Error, falling back to rule-based assistant:', error.message);
      const reply = generateRuleBasedChatResponse(userQuestion, userContext);
      return { reply, source: 'rule-based' };
    }
  },
};

// Rule-based conversational assistant for chatbot
function generateRuleBasedChatResponse(userMessage = '', userContext = null) {
  const query = userMessage.toLowerCase().trim();

  // Personalized stats query if user is logged in
  if (userContext && (query.includes('my spend') || query.includes('my expense') || query.includes('how much have i spent') || query.includes('my budget') || query.includes('my balance'))) {
    const currency = userContext.currency || '₹';
    const spent = userContext.monthlyExpenses !== undefined ? `${currency} ${userContext.monthlyExpenses.toLocaleString()}` : 'no recorded amount';
    const budget = userContext.monthlyBudget ? `${currency} ${userContext.monthlyBudget.toLocaleString()}` : 'no budget set';
    const balance = userContext.balance !== undefined ? `${currency} ${userContext.balance.toLocaleString()}` : 'N/A';
    
    return `Here is a quick look at your finances this month:\n\n• **Spent so far:** ${spent}\n• **Monthly Budget:** ${budget}\n• **Overall Balance:** ${balance}\n\nWould you like some recommendations on managing your remaining budget?`;
  }

  // Greetings
  if (/^(hi|hello|hey|greetings|hola|good\s*(morning|afternoon|evening)|yo)\b/i.test(query)) {
    return "Hi there! 👋 I'm **Spidy**, your student financial assistant. How can I help you today? You can ask me how to use Expense Tracker, get student money-saving tips, or understand your budgets!";
  }

  // Who are you / Identity
  if (query.includes('who are you') || query.includes('your name') || query.includes('what are you') || query.includes('what can you do')) {
    return "I'm **Spidy** 🤖, an AI assistant built into Expense Tracker to help students manage their money wisely!\n\nHere's what I can do:\n• **Guide you** through adding expenses, setting budgets, and checking forecasts\n• **Explain financial features** like the 50/30/20 rule and spending analytics\n• **Provide practical tips** for saving money on food, books, and transit\n• **Answer any questions** about our website and features!";
  }

  // Adding expenses
  if (query.includes('add expense') || query.includes('new expense') || query.includes('how to add') || query.includes('record expense') || query.includes('enter expense')) {
    return "To record an expense:\n1. Click **Expenses** in the sidebar (or '+ Add Expense' on the Dashboard).\n2. Fill in the **Title** (e.g. *Textbooks*, *Lunch*), **Amount**, and **Category**.\n3. Choose your **Payment Method** (UPI, Cash, Card, Bank Transfer) and date.\n4. Click **Add Expense** to save!\n\nYour dashboard and analytics will instantly update!";
  }

  // Edit or Delete expenses
  if (query.includes('delete expense') || query.includes('edit expense') || query.includes('remove expense') || query.includes('update expense')) {
    return "To edit or delete an expense:\n• Go to the **Expenses** page from the sidebar.\n• In the expenses table, locate the transaction.\n• Click the ✏️ **Edit** icon to adjust details, or the 🗑️ **Trash** icon to delete it.";
  }

  // Budgeting & How budget works
  if (query.includes('budget') && (query.includes('how') || query.includes('create') || query.includes('set') || query.includes('work') || query.includes('limit'))) {
    return "Here's how **Budgets** work:\n1. Go to the **Budget** page and click **Create Budget**.\n2. Choose your **Month**, **Year**, and total budget amount.\n3. On your **Dashboard**, watch the **Budget Used** progress bar.\n4. You will receive helpful alerts when you reach **90%** or exceed **100%** of your limit!";
  }

  // Budget Forecasting
  if (query.includes('forecast') || query.includes('predict') || query.includes('projection') || query.includes('projected')) {
    return "**Budget Forecasting** predicts where your finances will stand at the end of the month!\n\n• It calculates your daily average: `Spent so far ÷ Days elapsed`.\n• It projects total month-end spending: `Daily Average × Total days in month`.\n• It tells you if you are **On Track**, **At Risk**, or **Exceeding** your budget, plus category-level projections!";
  }

  // AI Insights
  if (query.includes('ai') || query.includes('insight') || query.includes('spending analysis') || query.includes('recommendation')) {
    return "The **AI Insights** page gives you two deep-dive tools:\n\n1. **Spending Analysis:** Identifies your top spending categories, flags overspending, and offers student-friendly saving tips.\n2. **Forecast Analysis:** Analyzes your projected pace and suggests exact daily spending caps to keep you under budget!";
  }

  // Saving tips for students
  if (query.includes('save') || query.includes('saving') || query.includes('student tip') || query.includes('cut cost') || query.includes('frugal')) {
    return "Here are 5 proven money-saving tips for students:\n\n1. **Use the 50/30/20 Rule:** 50% for essentials (rent, food), 30% for fun, 20% for savings.\n2. **Meal Prep:** Cook in batches—eating out or food delivery is often a student's largest budget leak.\n3. **Student Discounts:** Always ask if student discounts apply for public transit, software (GitHub Student Pack, Spotify, Notion), and shopping.\n4. **Audit Subscriptions:** Cancel unused streaming subscriptions or share family plans with roommates.\n5. **Track Daily:** Log every small expense—small daily purchases add up fast!";
  }

  // Common personal-finance questions
  if (query.includes('50/30/20') || query.includes('50 30 20') || query.includes('budget rule')) {
    return "The **50/30/20 rule** is a simple starting point for planning your take-home income:\n\n• **50% needs:** rent, groceries, transport, bills, and education.\n• **30% wants:** entertainment, eating out, and non-essential shopping.\n• **20% goals:** savings, emergencies, or paying down debt.\n\nIf your income is tight, cover needs first and use smaller percentages for wants and savings. The goal is consistency, not perfection.";
  }

  if (query.includes('emergency fund') || query.includes('rainy day') || query.includes('emergency savings')) {
    return "An **emergency fund** protects you from unexpected costs such as medical bills, repairs, or a sudden loss of income. Start with a small target like one month's essential expenses, then work toward three months.\n\nSet an automatic transfer after each payday and keep the money somewhere accessible but separate from your daily spending account.";
  }

  if (query.includes('invest') || query.includes('stock') || query.includes('mutual fund') || query.includes('crypto')) {
    return "Before investing, make sure your essential bills are covered, high-interest debt is under control, and you have some emergency savings. For a beginner, learn about diversified, low-cost investments and invest only money you can leave untouched for several years.\n\nInvesting involves risk, so avoid promises of guaranteed returns and research fees, taxes, and local rules before making a decision.";
  }

  if (query.includes('debt') || query.includes('loan') || query.includes('credit card')) {
    return "For debt, list each balance, interest rate, minimum payment, and due date. Keep making every minimum payment, then direct extra money toward either the **highest interest rate** first (saves the most) or the **smallest balance** first (quick motivation).\n\nAvoid taking on new high-interest debt while paying it down, and contact the lender early if a payment may be missed.";
  }

  // Other application workflows
  if (query.includes('income') || query.includes('salary') || query.includes('earning')) {
    return "You can record money coming in from the **Income** page. Add the source, amount, date, and any notes, then save it to include that income in your dashboard balance and financial overview.";
  }

  if (query.includes('notification') || query.includes('alert') || query.includes('reminder')) {
    return "The **Notifications** page collects budget alerts and account updates. Check it when you see the notification indicator, and review your budget progress if you receive a high-spending or limit warning.";
  }

  if (query.includes('profile') || query.includes('account') || query.includes('password') || query.includes('settings')) {
    return "Open **Profile** or **Settings** from the navigation to update your personal details, currency, password, theme, and other account preferences. Changes are saved when you submit the form.";
  }

  // Categories & Payment Methods
  if (query.includes('categor') || query.includes('payment') || query.includes('upi') || query.includes('cash') || query.includes('card')) {
    return "Expense Tracker supports:\n\n• **10 Categories:** Food, Transportation, Education, Shopping, Entertainment, Bills, Health, Travel, Accommodation, and Other.\n• **5 Payment Methods:** Cash, Card, UPI, Bank Transfer, and Other.\n\nYou can filter and view visual breakdowns for each in the **Analytics** page!";
  }

  // Dark mode
  if (query.includes('dark mode') || query.includes('night mode') || query.includes('theme') || query.includes('light mode')) {
    return "You can toggle **Dark Mode** anytime!\n\n• Click the **Sun / Moon** icon in the top navigation bar, or\n• Go to **Settings** and toggle the Dark Mode switch. Your preference is automatically saved!";
  }

  // Analytics
  if (query.includes('analytic') || query.includes('chart') || query.includes('graph') || query.includes('trend')) {
    return "On the **Analytics** page, you can see:\n\n• **12-Month Spending Trend:** An interactive line chart tracking your monthly spend.\n• **Category Distribution:** A colorful pie chart showing the percentage breakdown of your expenses.\n• **Detailed Breakdown:** Itemized amounts and percentages for each category!";
  }

  // Free / Pricing / Security
  if (query.includes('free') || query.includes('price') || query.includes('cost') || query.includes('paid') || query.includes('safe') || query.includes('secure')) {
    return "Expense Tracker is **100% free and open**! There are no hidden fees or paywalls. Your account is secured with password hashing (bcrypt) and protected with JWT token authentication.";
  }

  // Thank you
  if (/^(thank|thanks|thx|appreciate)\b/i.test(query)) {
    return "You're very welcome! I'm always here to help you stay on top of your money. Let me know if you have any other questions! 😊";
  }

  // Goodbye
  if (/^(bye|goodbye|cya|see you|adios)\b/i.test(query)) {
    return "Goodbye! Have a great day and happy budgeting! 👋";
  }

  // Avoid sending users back to a category menu when the fallback cannot identify the topic.
  const shortQuestion = userMessage.trim().replace(/[?.!]+$/, '');
  if (shortQuestion) {
    return `I cannot give a reliable answer to **${shortQuestion.slice(0, 120)}** yet because this assistant is running without its AI answer service. Please check that the server has a valid Groq API key, then try the question again.`;
  }

  return "Ask me about an expense, budget, income, forecast, saving money, debt, or any Expense Tracker feature.";
}

