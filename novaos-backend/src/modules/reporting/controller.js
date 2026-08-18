// src/modules/reporting/controller.js
const User = require('../auth/model');

// For now, we'll return aggregated dummy data
// Later, this will fetch from other modules' collections

exports.getSummary = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get company ID from user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Dummy data - will be replaced with real data from other modules
    const summary = {
      totalCustomers: 156,
      openConversations: 23,
      pendingTasks: 42,
      totalRevenue: 24500,
      completionRate: 78,
      recentActivity: {
        customers: [
          { id: 1, name: 'Acme Corp', email: 'contact@acme.com', date: '2024-01-15' },
          { id: 2, name: 'Globex Inc', email: 'info@globex.com', date: '2024-01-14' },
          { id: 3, name: 'Initech LLC', email: 'support@initech.com', date: '2024-01-13' },
        ],
        conversations: [
          { id: 1, customer: 'John Doe', lastMessage: 'Hi there!', status: 'open' },
          { id: 2, customer: 'Jane Smith', lastMessage: 'Thanks!', status: 'closed' },
        ],
        tasks: [
          { id: 1, title: 'Review Q4 proposals', priority: 'high', status: 'pending' },
          { id: 2, title: 'Update CRM', priority: 'medium', status: 'in-progress' },
        ],
      },
      metrics: {
        monthlySales: [
          { month: 'Jan', sales: 4000, orders: 240 },
          { month: 'Feb', sales: 3000, orders: 180 },
          { month: 'Mar', sales: 5000, orders: 320 },
          { month: 'Apr', sales: 4500, orders: 280 },
          { month: 'May', sales: 6000, orders: 380 },
          { month: 'Jun', sales: 5500, orders: 340 },
        ],
        taskDistribution: [
          { name: 'Completed', value: 45, color: '#22c55e' },
          { name: 'In Progress', value: 30, color: '#eab308' },
          { name: 'Pending', value: 25, color: '#ef4444' },
        ],
      },
      company: {
        id: user.companyId,
        name: 'Your Company',
        plan: 'Basic',
        memberCount: 1,
      },
    };

    res.json(summary);
  } catch (error) {
    console.error('❌ Summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const salesData = {
      totalRevenue: 24500,
      totalOrders: 189,
      averageOrderValue: 129.63,
      monthlyData: [
        { month: 'Jan', revenue: 4000, orders: 240 },
        { month: 'Feb', revenue: 3000, orders: 180 },
        { month: 'Mar', revenue: 5000, orders: 320 },
        { month: 'Apr', revenue: 4500, orders: 280 },
        { month: 'May', revenue: 6000, orders: 380 },
        { month: 'Jun', revenue: 5500, orders: 340 },
      ],
      topCustomers: [
        { name: 'Acme Corp', total: 8500 },
        { name: 'Globex Inc', total: 6200 },
        { name: 'Initech LLC', total: 4800 },
        { name: 'Hooli Corp', total: 3500 },
      ],
    };

    res.json(salesData);
  } catch (error) {
    console.error('❌ Sales report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductivityReport = async (req, res) => {
  try {
    const productivityData = {
      totalTasks: 42,
      completedTasks: 18,
      pendingTasks: 24,
      completionRate: 78,
      taskDistribution: [
        { name: 'Completed', value: 45, color: '#22c55e' },
        { name: 'In Progress', value: 30, color: '#eab308' },
        { name: 'Pending', value: 25, color: '#ef4444' },
      ],
      recentTasks: [
        { title: 'Review Q4 proposals', priority: 'high', status: 'pending', dueDate: '2024-12-15' },
        { title: 'Update CRM entries', priority: 'medium', status: 'in-progress', dueDate: '2024-12-20' },
        { title: 'Prepare monthly report', priority: 'low', status: 'done', dueDate: '2024-12-25' },
        { title: 'Client meeting preparation', priority: 'high', status: 'pending', dueDate: '2024-12-18' },
      ],
      meetings: [
        { title: 'Weekly Sprint Planning', date: '2024-12-11', participants: 5 },
        { title: 'Client Review Meeting', date: '2024-12-10', participants: 3 },
        { title: 'Product Demo', date: '2024-12-09', participants: 8 },
      ],
    };

    res.json(productivityData);
  } catch (error) {
    console.error('❌ Productivity report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCommunicationReport = async (req, res) => {
  try {
    const communicationData = {
      totalConversations: 23,
      openConversations: 15,
      closedConversations: 8,
      channels: [
        { name: 'Email', value: 18 },
        { name: 'WhatsApp', value: 5 },
      ],
      recentConversations: [
        { customer: 'John Doe', channel: 'email', lastMessage: 'Hi there!', status: 'open' },
        { customer: 'Jane Smith', channel: 'whatsapp', lastMessage: 'Thanks!', status: 'closed' },
        { customer: 'Bob Johnson', channel: 'email', lastMessage: 'When will it ship?', status: 'open' },
      ],
    };

    res.json(communicationData);
  } catch (error) {
    console.error('❌ Communication report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};