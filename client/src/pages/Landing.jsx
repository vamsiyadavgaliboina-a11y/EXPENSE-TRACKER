import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  Brain,
  BarChart3,
  Bell,
  Shield,
  ArrowRight,
  Zap,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Landing = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Smart Expense Tracking',
      description: 'Track all your expenses with ease and get detailed insights into your spending patterns.',
    },
    {
      icon: Target,
      title: 'Budget Management',
      description: 'Set monthly budgets and category-wise limits to keep your spending in check.',
    },
    {
      icon: Brain,
      title: 'AI Spending Insights',
      description: 'Get personalized financial insights powered by advanced AI analysis.',
    },
    {
      icon: BarChart3,
      title: 'Interactive Analytics',
      description: 'Visualize your financial data with beautiful charts and interactive dashboards.',
    },
    {
      icon: Zap,
      title: 'Budget Forecasting',
      description: 'Get predictions on your monthly spending based on your current trends.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Receive timely alerts when you are approaching or exceeding your budget limits.',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Add Your Transactions',
      description: 'Record all your income and expenses with categories and notes.',
    },
    {
      number: 2,
      title: 'Set Your Budget',
      description: 'Create monthly budgets and set category-wise spending limits.',
    },
    {
      number: 3,
      title: 'Understand Your Spending',
      description: 'View detailed analytics, charts, and trends of your financial activity.',
    },
    {
      number: 4,
      title: 'Get AI Insights',
      description: 'Receive personalized recommendations to improve your financial habits.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Expense Tracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your Student Finances
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Track expenses, manage budgets, forecast your spending, and understand your financial habits with AI-powered insights.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Start Tracking
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        {/* Hero Image/Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center text-gray-400">
            <BarChart3 size={64} />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Powerful Features for Smart Money Management
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-8"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          AI-Powered Financial Insights
        </h2>
        <div className="max-w-2xl mx-auto card p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="flex items-start gap-4">
            <Brain className="text-primary flex-shrink-0" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sample AI Insight
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                "Your food spending has increased this month. You have spent ₹4,500 on food, which represents approximately 38% of your total expenses."
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-primary">
                💡 Suggestion: Try setting a weekly food budget to keep your monthly spending on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Your Financial Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students taking control of their finances
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Expense Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

// Import Target icon which was missing
import { Target } from 'lucide-react';
