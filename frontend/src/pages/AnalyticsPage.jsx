import { useEffect, useState } from 'react';
import api from '../api/api';
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF6384'];

const AnalyticsPage = () => {
  const [monthlyOverview, setMonthlyOverview] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [incomeExpenseTrend, setIncomeExpenseTrend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthly, category, trend] = await Promise.all([
          api.get('/analytics/monthly-overview'),
          api.get('/analytics/category-breakdown'),
          api.get('/analytics/income-expense-trend')
        ]);

        // Flatten month/year _id for Recharts
        setMonthlyOverview(
          monthly.data.map((item) => ({
            monthYear: `${item._id.month}/${item._id.year}`,
            totalIncome: item.totalIncome,
            totalExpense: item.totalExpense
          }))
        );

        setCategoryBreakdown(category.data);

        setIncomeExpenseTrend(
          trend.data.map((item) => ({
            monthYear: `${item._id.month}/${item._id.year}`,
            income: item.income,
            expense: item.expense
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Analytics Dashboard</h1>

      {/* Category Pie Chart */}
      <div style={{ width: '500px', margin: '2rem auto' }}>
        <h2>Category-wise Expense</h2>
        <PieChart width={500} height={300}>
          <Pie
            data={categoryBreakdown}
            dataKey="total"
            nameKey="_id"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {categoryBreakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Monthly Line Chart */}
      <div style={{ width: '700px', margin: '2rem auto' }}>
        <h2>Monthly Income vs Expense</h2>
        <LineChart width={700} height={300} data={monthlyOverview}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalIncome" stroke="#00C49F" name="Income" />
          <Line type="monotone" dataKey="totalExpense" stroke="#FF6384" name="Expense" />
        </LineChart>
      </div>

      {/* Income vs Expense Bar Chart */}
      <div style={{ width: '700px', margin: '2rem auto' }}>
        <h2>Income vs Expense Trend (Last 12 months)</h2>
        <BarChart width={700} height={300} data={incomeExpenseTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#00C49F" name="Income" />
          <Bar dataKey="expense" fill="#FF6384" name="Expense" />
        </BarChart>
      </div>
    </div>
  );
};

export default AnalyticsPage;
