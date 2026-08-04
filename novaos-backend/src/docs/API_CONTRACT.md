# NovaOS API Contract

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require JWT token in Authorization header:
`Authorization: Bearer <token>`

## API Prefixes (Team Distribution)

### Member 1 - Auth (Foundation)
- Prefix: `/auth`
- Routes:
  - POST `/auth/register` - Register new user with company
  - POST `/auth/login` - Login user
  - GET `/auth/me` - Get current user (Protected)

### Member 2 - Communication
- Prefix: `/communication`
- Routes:
  - GET `/communication/conversations` - List all conversations
  - GET `/communication/conversations/:id/messages` - Get messages by conversation
  - POST `/communication/send` - Send message

### Member 3 - Sales
- Prefix: `/sales`
- Routes:
  - GET `/sales/customers` - List customers
  - POST `/sales/customers` - Create customer
  - POST `/sales/quotations` - Create quotation
  - POST `/sales/invoices` - Create invoice
  - GET `/sales/invoices/:id/pdf` - Get invoice PDF

### Member 4 - Productivity
- Prefix: `/productivity`
- Routes:
  - GET `/productivity/tasks` - List tasks
  - POST `/productivity/tasks` - Create task
  - POST `/productivity/meetings/transcribe` - Transcribe meeting
  - POST `/productivity/documents/upload` - Upload document

### Member 5 - Reporting
- Prefix: `/reports`
- Routes:
  - GET `/reports/summary` - Get dashboard summary
  - GET `/reports/sales` - Get sales analytics
  - GET `/reports/productivity` - Get productivity reports

## Common Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}