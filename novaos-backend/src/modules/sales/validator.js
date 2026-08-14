// Simple validation helpers
exports.validateCustomer = (data) => {
  const errors = [];
  if (!data.name) errors.push('Name is required');
  if (!data.email) errors.push('Email is required');
  if (!data.phone) errors.push('Phone is required');
  return errors;
};

exports.validateQuotation = (data) => {
  const errors = [];
  if (!data.customerId) errors.push('Customer ID is required');
  if (!data.items || data.items.length === 0) errors.push('At least one item is required');
  data.items?.forEach((item, index) => {
    if (!item.name) errors.push(`Item ${index + 1}: Name is required`);
    if (!item.qty || item.qty < 1) errors.push(`Item ${index + 1}: Quantity must be at least 1`);
    if (!item.price || item.price < 0) errors.push(`Item ${index + 1}: Price must be valid`);
  });
  return errors;
};

exports.validateInvoice = (data) => {
  const errors = [];
  if (!data.quotationId) errors.push('Quotation ID is required');
  if (!data.dueDate) errors.push('Due date is required');
  return errors;
};