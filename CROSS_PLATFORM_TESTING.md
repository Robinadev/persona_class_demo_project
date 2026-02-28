# Talateri Cross-Platform Testing Guide

## Overview
This guide provides comprehensive testing procedures to verify feature parity and security across the web app, mobile app, and admin panel, all sharing a single Supabase database with real-time synchronization.

## Pre-Testing Setup

### Environment Configuration
```bash
# Web App (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mobile App (app.json)
"supabase": {
  "url": "https://your-project.supabase.co",
  "anonKey": "your-anon-key"
}

# Admin Panel (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
API_PORT=3001
```

### Test Database Seeding
```bash
# Create test users
npm run seed:test-users

# Creates:
- super_admin@test.com / password123
- admin@test.com / password123
- support@test.com / password123
- user@test.com / password123
```

## Test Scenarios

### 1. Authentication Cross-Platform Testing

#### 1.1 User Registration
**Steps:**
1. Open web app → Click "Create Account"
2. Fill form: Email, Password, Name, Role (User)
3. Complete signup
4. Verify email in Supabase dashboard
5. Open mobile app → Repeat steps 1-4
6. Check both users exist in `profiles` table

**Expected Results:**
- Same user data in database
- Both platforms authenticate successfully
- JWT tokens valid for 7 days
- Refresh token stored securely

**Validation:**
```sql
SELECT * FROM profiles 
WHERE email LIKE '%test%' 
ORDER BY created_at DESC;
```

#### 1.2 Login and Session Management
**Steps (Web App):**
1. Navigate to login page
2. Enter credentials: user@test.com / password123
3. Click "Login"
4. Verify redirect to dashboard

**Steps (Mobile App):**
1. Start app → Login screen appears
2. Enter same credentials
3. Complete login
4. Verify redirect to user dashboard

**Expected Results:**
- Both show dashboard within 2 seconds
- JWT token valid on both platforms
- Session persists after app close/reopen
- Token refresh automatic when expiring
- Logout clears session from both

**Token Verification:**
```javascript
// Check token in browser console
localStorage.getItem('auth_token');

// Check mobile secure storage
SecureStore.getItemAsync('auth_token');
```

#### 1.3 Password Reset Flow
**Steps:**
1. Click "Forgot Password"
2. Enter registered email: user@test.com
3. Check email for reset link
4. Click reset link
5. Enter new password
6. Verify login with new password

**Expected Results:**
- Reset email sent within 30 seconds
- Link expires after 1 hour
- New password works on both platforms
- Old password rejected
- Audit log entry created

**Validation:**
```sql
SELECT * FROM activity_logs 
WHERE action = 'password_reset' 
AND user_id = (SELECT id FROM profiles WHERE email = 'user@test.com');
```

### 2. Transaction Sync Testing

#### 2.1 Real-time Transaction Display
**Setup:**
- User logged in on both web and mobile
- Both apps showing transaction list

**Test Steps:**
1. On mobile: Initiate transfer of $50
2. Watch admin panel and web app
3. Verify transaction appears within 2 seconds on both
4. Verify transaction status matches on all platforms

**Expected Results:**
- Transaction appears instantly on web app
- Admin panel shows transaction in real-time
- All platforms show same transaction details
- Status updates propagate in real-time

**Monitoring:**
```javascript
// In browser console, watch Supabase subscriptions
supabase.channel('transactions').subscribe((status) => {
  console.log('Subscription status:', status);
});
```

#### 2.2 Transaction History Consistency
**Steps:**
1. Web app: Filter transactions by date range
2. Mobile app: Same filter
3. Admin panel: View all transactions
4. Compare totals across platforms

**Expected Results:**
- Same transaction count on both user platforms
- Admin panel shows superset of all transactions
- Filters return identical results
- Pagination consistent

#### 2.3 Transaction Receipt Generation
**Steps:**
1. Web app: Select transaction → Generate Receipt
2. Mobile app: Select same transaction → View Receipt
3. Compare receipts

**Expected Results:**
- PDF format consistent
- Same data displayed
- Receipt numbers match
- Timestamps identical

### 3. Wallet and Balance Testing

#### 3.1 Balance Consistency
**Setup:**
- Same user logged in on web and mobile
- Initial balance: $500

**Test Steps:**
1. Web app: Check balance
2. Mobile app: Check balance
3. Perform topup ($100) from web app
4. Watch balance update on mobile
5. Perform withdrawal ($50) from mobile
6. Watch balance update on web app

**Expected Results:**
- Balance identical on both platforms
- Updates within 1 second
- Running total consistent
- No duplicate transactions

**Validation:**
```sql
SELECT * FROM wallets 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'user@test.com');
```

#### 3.2 Payment Method Management
**Steps:**
1. Web app: Add payment method (bank account)
2. Verify encryption in database
3. Mobile app: View payment methods
4. Verify account number masked
5. Initiate topup using saved method from mobile
6. Verify web app shows updated balance

**Expected Results:**
- Encrypted data in database
- Masked display on both platforms
- Same masked format (`****1234`)
- Transfer successful using encrypted method

**Database Check:**
```sql
SELECT id, method_type, account_number_encrypted, account_number_hash 
FROM payment_methods 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'user@test.com');

-- Encrypted field should contain: {iv: "...", data: "...", authTag: "..."}
-- Hash field should contain: SHA256 hash for verification
```

### 4. Security & Encryption Testing

#### 4.1 PII Encryption Verification
**Setup:**
- Create user with sensitive data
- Web app: Add phone number and SSN

**Test Steps:**
1. Check database directly (raw query)
2. Verify phone_encrypted is not plaintext
3. Verify ssn_encrypted is not plaintext
4. Check phone_hash and ssn_hash exist
5. Attempt to decrypt without proper credentials

**Expected Results:**
- Encrypted fields contain JSONB: `{iv, data, authTag}`
- Hash fields contain SHA256 values
- Direct decryption fails without encryption key
- Decryption via API succeeds only for authorized user

**Raw Database Query:**
```sql
SELECT email, phone_encrypted, phone_hash, ssn_encrypted, ssn_hash 
FROM profiles 
WHERE email = 'user@test.com';
```

#### 4.2 Audit Trail for Sensitive Data
**Steps:**
1. Mobile app: Update phone number
2. Web app: View profile (triggers decryption)
3. Admin panel: Check activity logs

**Expected Results:**
- Update logged in activity_logs
- View access logged in sensitive_data_logs
- IP address captured
- User agent captured
- Timestamp recorded

**Audit Query:**
```sql
SELECT * FROM sensitive_data_logs 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'user@test.com') 
ORDER BY timestamp DESC;
```

#### 4.3 Session Security
**Steps:**
1. Login on web app
2. Extract JWT token from localStorage
3. Try using token on different device/browser
4. Verify access control

**Expected Results:**
- Token works across platforms (designed for mobile)
- Token expires after 7 days
- Refresh token rotates on use
- Logout invalidates token

### 5. Admin Panel Real-time Testing

#### 5.1 Real-time User Activity Monitoring
**Setup:**
- Admin logged in on admin panel
- Regular user on mobile app

**Test Steps:**
1. Mobile user: Login, create transaction, logout
2. Admin panel: Observe activity feed
3. Verify each action appears in real-time

**Expected Results:**
- Login appears within 1 second
- Transaction appears within 2 seconds
- Logout appears within 1 second
- All with timestamps and user details

#### 5.2 Transaction Monitoring
**Steps:**
1. Multiple users on mobile app initiate transfers
2. Admin panel: Watch transaction stream
3. Filter by user/amount/status

**Expected Results:**
- All transactions appear in real-time
- Filtering works without page reload
- Status updates reflect immediately
- Admin can drill down into transaction details

#### 5.3 User Analytics Dashboard
**Steps:**
1. Create 5 test transactions across different users
2. Admin panel: View analytics
3. Verify charts update with new data

**Expected Results:**
- Charts reflect all transactions
- Daily totals accurate
- User growth metrics correct
- Revenue calculations match database

### 6. Data Consistency Testing

#### 6.1 Transaction Atomicity
**Setup:**
- Two users ready to perform transfer

**Test Steps:**
1. Initiate transfer from User A to User B
2. At exact midpoint, kill network connection
3. Reconnect and verify state

**Expected Results:**
- Transaction either succeeds or fails completely
- No partial/orphaned transactions
- Balances remain consistent
- Status is deterministic

#### 6.2 Concurrent Operations
**Steps:**
1. 10 concurrent users initiate transfers simultaneously
2. Each transfers $50
3. Monitor for race conditions

**Expected Results:**
- All 10 transactions complete successfully
- Balances accurate for all users
- No duplicate transactions
- Timestamps preserve order

#### 6.3 Database Integrity
**Steps:**
1. Run integrity check queries
2. Verify referential integrity
3. Check constraint violations

**SQL Validation:**
```sql
-- Check orphaned profiles
SELECT * FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Check orphaned transactions
SELECT * FROM transactions 
WHERE user_id NOT IN (SELECT id FROM profiles);

-- Check wallet consistency
SELECT p.email, w.balance, SUM(t.amount) as total_transactions
FROM profiles p
LEFT JOIN wallets w ON p.id = w.user_id
LEFT JOIN transactions t ON p.id = t.user_id
GROUP BY p.id, p.email, w.balance;

-- Check payment method ownership
SELECT pm.*, p.email
FROM payment_methods pm
LEFT JOIN profiles p ON pm.user_id = p.id
WHERE p.id IS NULL;
```

### 7. Performance Testing

#### 7.1 Response Time Benchmarks
**Web App:**
- Login: < 2 seconds
- Load dashboard: < 1 second
- List transactions: < 500ms
- Create transaction: < 3 seconds

**Mobile App:**
- Login: < 3 seconds (network dependent)
- Load dashboard: < 1.5 seconds
- Create transaction: < 4 seconds (with validation)

**Admin Panel:**
- Load dashboard: < 1 second
- Real-time transaction stream: < 500ms latency
- Generate report: < 5 seconds

#### 7.2 Load Testing
```bash
# Using Apache Bench to test API endpoints
ab -n 1000 -c 10 https://api.talateri.com/api/transactions

# Expected results:
# - Requests per second: > 100
# - Failed requests: 0
# - Average latency: < 100ms
```

### 8. Error Handling Testing

#### 8.1 Network Failures
**Steps:**
1. Mobile app: Initiate transfer
2. Disable network during transaction
3. Watch error handling

**Expected Results:**
- User sees "Network error" message
- Data queued for retry
- Auto-retry when connection restored
- No data loss

#### 8.2 Server Errors
**Steps:**
1. Trigger server error (modify API request)
2. Verify error message
3. Check admin is notified

**Expected Results:**
- User sees friendly error message
- Actual error logged server-side
- Support ticket auto-created
- No sensitive data in error messages

#### 8.3 Invalid Data
**Steps:**
1. Attempt to send invalid email
2. Attempt negative amount transfer
3. Attempt to exceed limits

**Expected Results:**
- Client-side validation rejects data
- Server-side validation double-checks
- Error messages guide user to fix
- Audit log records attempt

## Regression Testing Checklist

### Authentication
- [ ] Login with correct credentials works
- [ ] Login with wrong password fails
- [ ] Login attempts limited to 5
- [ ] Password reset email sent
- [ ] Password reset token expires
- [ ] Session persists across page refreshes
- [ ] Logout on all platforms
- [ ] Token refresh works

### Transactions
- [ ] Create transaction with valid data
- [ ] Reject invalid recipient
- [ ] Reject amount > balance
- [ ] Reject amount < minimum ($0.01)
- [ ] Transfer fee calculated correctly
- [ ] Recipient receives funds
- [ ] Transaction marked as complete
- [ ] Receipt generated successfully
- [ ] History shows all transactions
- [ ] Export to CSV works

### Wallet
- [ ] Check balance returns correct amount
- [ ] Topup increases balance correctly
- [ ] Withdrawal decreases balance
- [ ] Transaction fees deducted accurately
- [ ] Daily/monthly limits enforced
- [ ] Low balance warning shows

### Security
- [ ] PII encrypted in database
- [ ] Sensitive data access logged
- [ ] Unauthorized users can't decrypt PII
- [ ] Password never shown in logs
- [ ] Session tokens validated
- [ ] CORS headers correct
- [ ] SQL injection prevented
- [ ] XSS prevention active

### Real-time
- [ ] Transaction appears on all platforms within 2 seconds
- [ ] Balance updates in real-time
- [ ] Admin sees user activity instantly
- [ ] Disconnect/reconnect handled
- [ ] No duplicate real-time events
- [ ] Subscriptions cleanup on logout

### Admin Panel
- [ ] User list loads
- [ ] User search works
- [ ] Suspend user functionality
- [ ] View user details
- [ ] Transaction monitoring
- [ ] Report generation
- [ ] Activity logs display
- [ ] Real-time dashboard updates

## Sign-Off Procedure

### QA Sign-Off
```
[ ] All authentication tests pass
[ ] All transaction tests pass
[ ] All wallet tests pass
[ ] All security tests pass
[ ] All real-time tests pass
[ ] All admin tests pass
[ ] Performance benchmarks met
[ ] Error handling verified
[ ] Regression tests complete

QA Tester: _______________
Date: _______________
```

### Deployment Readiness
```
[ ] All critical tests passing
[ ] No high severity bugs
[ ] Documentation updated
[ ] Security audit complete
[ ] Performance acceptable
[ ] Database backups verified
[ ] Rollback plan documented

Product Manager: _______________
Date: _______________
```

## Troubleshooting

### Common Issues

**Issue: Transactions not syncing**
```
Solution:
1. Check Supabase connection: console.log(supabase.auth.session())
2. Verify RLS policies: SELECT * FROM policies
3. Check network tab for failed API calls
4. Restart app and clear cache
```

**Issue: Encrypted data not decrypting**
```
Solution:
1. Verify encryption key in .env
2. Check IV format: should be 24-character hex string
3. Verify auth tag present in encrypted object
4. Check user has permission to decrypt
```

**Issue: Real-time updates not working**
```
Solution:
1. Verify Supabase realtime enabled: Settings → Realtime
2. Check channel subscriptions: supabase.getChannels()
3. Monitor WebSocket in Network tab
4. Restart Supabase service
```

**Issue: Admin panel not showing real-time data**
```
Solution:
1. Verify admin role assigned to user
2. Check RLS policy allows admin select
3. Verify useRealtimeTransactions hook mounted
4. Check browser console for subscription errors
```

## Contact & Support

For issues during testing:
- Slack: #talateri-qa
- Email: qa@talateri.com
- Jira: Create issue with tag "testing"
