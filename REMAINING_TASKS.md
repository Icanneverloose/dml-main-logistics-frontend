# Remaining Tasks & Fixes for DML Logistics Admin Dashboard

## ✅ Completed
- Admin dashboard UI with new design
- Shipment registration form
- Shipment management with search/filter/sort
- Status update system with timeline
- Customer management (frontend)
- Analytics dashboard with charts
- Tracking functionality connected
- Toast notification system created
- Confirm modal component created

## 🔧 Remaining Frontend Fixes

### 1. Replace Alert/Confirm with Toast & Modal
- [ ] Replace all `alert()` calls with `toast.success()`, `toast.error()`, etc.
- [ ] Replace `window.confirm()` with `ConfirmModal` component
- Files to update:
  - `src/pages/admin/shipments/page.tsx` (5 alerts, 1 confirm)
  - `src/pages/admin/register-shipment/page.tsx` (3 alerts)
  - `src/pages/admin/shipments/components/StatusUpdateModal.tsx` (3 alerts)
  - `src/pages/admin/receipts/page.tsx` (5 alerts)
  - `src/pages/admin/settings/page.tsx` (1 alert)
  - `src/pages/admin/content/page.tsx` (4 alerts)

### 2. API Endpoints to Add
Add these methods to `src/lib/api.ts`:
- [ ] `deleteShipment(trackingNumber: string)`
- [ ] `generatePDF(trackingNumber: string)`
- [ ] `emailPDF(trackingNumber: string, email: string)`
- [ ] `getAdminUsers()`
- [ ] `createAdminUser(userData)`
- [ ] `updateAdminUser(id, userData)`
- [ ] `deleteAdminUser(id)`
- [ ] `getSystemLogs(filters?)`
- [ ] `saveSettings(settings)`

## 🔌 Backend Endpoints Needed

### Required Endpoints:

1. **Shipment Management:**
   - `DELETE /api/shipments/{trackingNumber}` - Delete shipment
   - `GET /api/shipments/{trackingNumber}/pdf` - Generate/download PDF
   - `POST /api/shipments/{trackingNumber}/email-pdf` - Email PDF to customer

2. **User Management:**
   - `GET /api/admin/users` - Get all admin users
   - `POST /api/admin/users` - Create new admin user
   - `PUT /api/admin/users/{id}` - Update admin user
   - `DELETE /api/admin/users/{id}` - Delete admin user

3. **System Logs:**
   - `GET /api/admin/logs` - Get activity logs (with filters: type, date range, user)

4. **Settings:**
   - `GET /api/admin/settings` - Get current settings
   - `POST /api/admin/settings` - Save settings

## 📝 Mock Data to Replace

1. **User Management** (`src/pages/admin/users/page.tsx`)
   - Currently uses mock data
   - Needs API integration with `getAdminUsers()`

2. **System Logs** (`src/pages/admin/logs/page.tsx`)
   - Currently uses mock data
   - Needs API integration with `getSystemLogs()`

3. **Settings** (`src/pages/admin/settings/page.tsx`)
   - Currently just shows alert on save
   - Needs API integration with `saveSettings()`

## 🎨 UI/UX Improvements (Optional)

1. **Loading States:**
   - Better skeleton loaders
   - Progressive loading for large data sets

2. **Error Boundaries:**
   - Add React Error Boundaries for better error handling

3. **Form Validation:**
   - Better client-side validation messages
   - Real-time validation feedback

4. **Accessibility:**
   - ARIA labels for screen readers
   - Keyboard navigation improvements

## 🐛 Potential Issues to Check

1. **PDF Generation:**
   - Verify PDF URLs are correct format
   - Handle cases where PDF doesn't exist

2. **Email Functionality:**
   - Verify email addresses are valid before sending
   - Handle email sending failures gracefully

3. **Delete Confirmations:**
   - Ensure critical actions have proper confirmation
   - Prevent accidental deletions

4. **Status Updates:**
   - Validate status transitions (e.g., can't go from Delivered back to In Transit)
   - Handle concurrent updates

## 📋 Quick Implementation Guide

### To replace alerts with toasts:

```typescript
// Replace this:
alert('Success message');
alert('Error: ' + error.message);

// With this:
import { toast } from '../../components/Toast';
toast.success('Success message');
toast.error('Error: ' + error.message);
```

### To replace window.confirm with modal:

```typescript
// Replace this:
if (window.confirm('Are you sure?')) {
  // action
}

// With this:
import { ConfirmModal } from '../../components/ConfirmModal';
const [showConfirm, setShowConfirm] = useState(false);

<ConfirmModal
  isOpen={showConfirm}
  title="Confirm Action"
  message="Are you sure you want to do this?"
  type="danger"
  onConfirm={() => {
    // action
    setShowConfirm(false);
  }}
  onCancel={() => setShowConfirm(false)}
/>
```

## 🎯 Priority Order

1. **High Priority:**
   - Replace alerts with toast notifications
   - Replace window.confirm with ConfirmModal
   - Add delete shipment API endpoint

2. **Medium Priority:**
   - Connect User Management to backend
   - Connect System Logs to backend
   - Connect Settings to backend

3. **Low Priority:**
   - PDF generation improvements
   - Email functionality enhancements
   - UI/UX polish

