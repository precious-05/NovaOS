const { Customer, Quotation, Invoice } = require('./model');

// =============================================
// ===== CUSTOMER CONTROLLERS =====
// =============================================

exports.getCustomers = async (req, res) => {
  try {
    console.log('👤 User in getCustomers:', req.user);
    const customers = await Customer.find({ companyId: req.user.companyId });
    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    console.log('👤 User in createCustomer:', req.user);
    console.log('📝 Request body:', req.body);
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }
    
    if (!req.user.companyId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User has no company assigned' 
      });
    }

    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and phone are required' 
      });
    }

    const customer = new Customer({
      ...req.body,
      companyId: req.user.companyId
    });
    
    await customer.save();
    
    res.status(201).json({ 
      success: true, 
      data: customer 
    });
    
  } catch (error) {
    console.error('❌ Error creating customer:', error.message);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Customer with this email already exists' 
      });
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create customer' 
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    console.log('✏️ Updating customer:', req.params.id);
    console.log('📝 Update data:', req.body);
    
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }
    
    console.log('✅ Customer updated:', customer);
    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('❌ Error updating customer:', error.message);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    console.log('🗑️ Deleting customer:', req.params.id);
    
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId
    });
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }
    
    console.log('✅ Customer deleted:', customer);
    res.json({ 
      success: true, 
      message: 'Customer deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting customer:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// =============================================
// ===== QUOTATION CONTROLLERS =====
// =============================================

exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find({ companyId: req.user.companyId })
      .populate('customerId', 'name email');
    res.json({ success: true, data: quotations });
  } catch (error) {
    console.error('❌ Error fetching quotations:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createQuotation = async (req, res) => {
  try {
    console.log('📄 Creating quotation:', req.body);
    
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one item is required' 
      });
    }
    
    const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    
    const quotation = new Quotation({
      ...req.body,
      total,
      companyId: req.user.companyId
    });
    
    await quotation.save();
    console.log('✅ Quotation created:', quotation);
    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    console.error('❌ Error creating quotation:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ ADDED: DELETE quotation
exports.deleteQuotation = async (req, res) => {
  try {
    console.log('🗑️ Deleting quotation:', req.params.id);
    
    const quotation = await Quotation.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId
    });
    
    if (!quotation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quotation not found' 
      });
    }
    
    console.log('✅ Quotation deleted:', quotation);
    res.json({ 
      success: true, 
      message: 'Quotation deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting quotation:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ✅ ADDED: UPDATE quotation
exports.updateQuotation = async (req, res) => {
  try {
    console.log('✏️ Updating quotation:', req.params.id);
    console.log('📝 Update data:', req.body);
    
    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    
    const quotation = await Quotation.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { ...req.body, total },
      { new: true, runValidators: true }
    );
    
    if (!quotation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quotation not found' 
      });
    }
    
    console.log('✅ Quotation updated:', quotation);
    res.json({ success: true, data: quotation });
  } catch (error) {
    console.error('❌ Error updating quotation:', error.message);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// =============================================
// ===== INVOICE CONTROLLERS =====
// =============================================

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ companyId: req.user.companyId })
      .populate('customerId', 'name email');
    res.json({ success: true, data: invoices });
  } catch (error) {
    console.error('❌ Error fetching invoices:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    console.log('💰 Creating invoice:', req.body);
    
    const { quotationId, dueDate } = req.body;
    
    if (!quotationId || !dueDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'quotationId and dueDate are required' 
      });
    }
    
    const quotation = await Quotation.findOne({
      _id: quotationId,
      companyId: req.user.companyId
    });
    
    if (!quotation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Quotation not found' 
      });
    }
    
    const invoice = new Invoice({
      companyId: req.user.companyId,
      customerId: quotation.customerId,
      quotationId: quotation._id,
      amount: quotation.total,
      dueDate: new Date(dueDate),
      paymentStatus: 'pending'
    });
    
    await invoice.save();
    console.log('✅ Invoice created:', invoice);
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error('❌ Error creating invoice:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateInvoiceStatus = async (req, res) => {
  try {
    console.log('🔄 Updating invoice status:', req.params.id, req.body);
    
    const { paymentStatus } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ 
        success: false, 
        message: 'paymentStatus is required' 
      });
    }
    
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { paymentStatus },
      { new: true }
    );
    
    if (!invoice) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invoice not found' 
      });
    }
    
    console.log('✅ Invoice status updated:', invoice);
    res.json({ success: true, data: invoice });
  } catch (error) {
    console.error('❌ Error updating invoice status:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};