# 💰 Modern Budget Tracker

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow.svg)

A modern, feature-rich single-page application (SPA) for tracking your personal finances. Manage income and expenses, visualize your financial data with interactive charts, generate PDF reports, and take control of your budget—all in your browser with no backend required.

## ✨ Features

### 🔐 User Authentication
- **Register**: Create a new account with username and password
- **Login**: Secure login system with credential validation
- **Password Reset**: Reset your password if forgotten
- **Profile Management**: Update username and password from your profile
- **Session Management**: Automatic session handling with logout functionality

### 📊 Dashboard
- **Visual Summary Cards**: Display total balance, income, expenses, and transaction count
- **Interactive Bar Chart**: Visualize recent transactions with Chart.js
- **Income vs Expense Summary**: Quick overview of your financial status
- **Net Balance Calculation**: Real-time balance updates with color-coded indicators
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 💵 Transaction Management
- **Add Income/Expense**: Intuitive forms for adding financial transactions
- **Multiple Currencies**: Support for 8+ international currencies (LKR, USD, EUR, GBP, INR, JPY, CAD, AUD)
- **Categories**: Pre-defined categories for both income and expenses
  - Income: Salary, Business, Gift, Other
  - Expense: Food, Transport, Shopping, Bills, Health, Other
- **Tags**: Add custom tags to transactions for better organization
- **Date Tracking**: Automatic timestamp for every transaction
- **Currency Memory**: Last used currency is remembered for convenience

### 📝 Transaction History
- **Complete Transaction List**: View all your financial transactions in one place
- **Visual Indicators**: Color-coded income (green) and expenses (red)
- **Transaction Details**: See description, date, category, tags, amount, and currency
- **Delete Functionality**: Remove unwanted transactions with one click
- **Empty State**: Friendly message when no transactions exist
- **Animated List**: Smooth animations for better user experience

### 📄 PDF Reports
- **Three Report Types**: 
  - Income Report (all income transactions)
  - Expense Report (all expense transactions)
  - Combined Report (complete financial overview)
- **Date Range Filtering**: Generate reports for specific time periods
- **Professional Layout**: Clean, branded PDF documents with tables
- **Summary Statistics**: Total income, expenses, and transaction counts
- **Export Functionality**: Download reports with timestamped filenames
- **Currency Display**: Shows amounts with appropriate currency symbols

### 🎨 User Interface
- **Dark Mode**: Toggle between light and dark themes
- **Modern Design**: Clean, gradient-based aesthetic with smooth transitions
- **Responsive Navigation**: Sticky navigation bar with active state indicators
- **Font Awesome Icons**: Professional iconography throughout
- **Toast Notifications**: Non-intrusive feedback messages for user actions
- **Modal Dialogs**: Elegant popups for report generation
- **Smooth Animations**: Slide-in effects and hover states

### 💾 Data Storage
- **LocalStorage**: All data stored locally in your browser
- **No Backend Required**: Completely client-side application
- **Privacy First**: Your financial data never leaves your device
- **Persistent Data**: Data persists across browser sessions
- **Multi-user Support**: Separate data for different user accounts

## 🚀 Getting Started

### Prerequisites

All you need is a modern web browser! No installations, no dependencies, no setup required.

**Supported Browsers:**
- Google Chrome (recommended)
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

### Installation

There are two ways to get started:

#### Option 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/adriel03-dp/web-based-budget-tracker-modern.git

# Navigate to the project directory
cd web-based-budget-tracker-modern

# Open index.html in your browser
# On Windows:
start index.html
# On macOS:
open index.html
# On Linux:
xdg-open index.html
```

#### Option 2: Download as ZIP

1. Download the project as a ZIP file from GitHub
2. Extract the ZIP file to your desired location
3. Open `index.html` in your web browser

That's it! No npm install, no build process, no server required.

## 📖 Usage Guide

### First Time Setup

1. **Open the Application**: Launch `index.html` in your browser
2. **Register an Account**: 
   - Click "Sign Up" on the login page
   - Enter a username and password
   - Confirm your password
   - Click "Register"

### Adding Your First Transaction

1. **Navigate to Add Transaction**: Click the "Add Transaction" button in the navigation bar
2. **Choose Transaction Type**: Click either "Add Income" or "Add Expense"
3. **Fill in Details**:
   - Description: What is this transaction for?
   - Amount: Enter the transaction amount (positive number)
   - Currency: Select your currency
   - Category: Choose from pre-defined categories
   - Tags: Add optional tags (comma-separated)
4. **Submit**: Click the corresponding button to save

### Viewing Your Dashboard

1. **Access Dashboard**: Click "Dashboard" in the navigation
2. **Review Summary Cards**: See your total balance, income, expenses, and transaction count
3. **Analyze Chart**: View the bar chart showing your recent 7 transactions
4. **Check Net Balance**: Monitor your overall financial status

### Managing Transactions

1. **View History**: Click "History" in the navigation
2. **Review All Transactions**: Scroll through your complete transaction list
3. **Delete Transactions**: Click the trash icon on any transaction to remove it

### Generating Reports

1. **Open Reports**: Click "Reports" in the navigation
2. **Set Date Range** (Optional): Select start and end dates for filtering
3. **Generate Report**: Click "Generate Report" button
4. **Choose Report Type**:
   - Income Report: Download PDF of all income
   - Expense Report: Download PDF of all expenses
   - Combined Report: Download complete financial report
5. **Download**: PDF will automatically download to your device

### Customizing Your Experience

1. **Dark Mode**: Click the moon/sun icon in the navigation bar to toggle dark mode
2. **Edit Profile**: 
   - Click "Profile" in the navigation
   - Update your username
   - Change your password (optional)
   - Click "Save Changes"
3. **Logout**: Click your profile avatar and select "Logout"

## 🗂️ Project Structure

```
web-based-budget-tracker-modern/
│
├── index.html              # Main HTML file (SPA container)
├── app.js                  # Core JavaScript (all functionality)
├── styles.css              # Complete styling (light & dark themes)
│
├── budget-tracker/         # Legacy/alternate version
│   ├── index.html
│   ├── add.html
│   ├── dashboard.html
│   ├── history.html
│   ├── script.js
│   ├── add.js
│   ├── dashboard.js
│   ├── history.js
│   └── styles.css
│
├── add.html               # Legacy add page
├── add.js                 # Legacy add script
├── dashboard.html         # Legacy dashboard page
├── dashboard.js           # Legacy dashboard script
├── history.html           # Legacy history page
├── history.js             # Legacy history script
├── login.html             # Legacy login page
│
└── README.md              # This file
```

**Main Application Files:**
- `index.html`: The single-page application entry point
- `app.js`: All application logic including SPA routing, authentication, transactions, charts, and reports
- `styles.css`: Complete styling with CSS variables for theming

**Legacy Files:**
The `budget-tracker/` directory contains an earlier multi-page version. The current recommended version is the SPA in the root directory.

## 🎨 Customization

### Changing Default Currency

Edit `app.js` and modify the `getLastCurrency()` function default:

```javascript
function getLastCurrency() {
    return localStorage.getItem('budget-last-currency') || 'USD'; // Change 'USD' to your preferred currency
}
```

### Adding New Currencies

Add new currency to the currency symbol mapping in `app.js`:

```javascript
const currencySymbols = {
    USD: '$', 
    EUR: '€', 
    GBP: '£', 
    INR: '₹', 
    JPY: '¥', 
    CAD: '$', 
    AUD: '$', 
    LKR: 'Rs.',
    // Add your currency here:
    BRL: 'R$',  // Example: Brazilian Real
};
```

Then add the option to the currency select elements in `index.html`:

```html
<option value="BRL">R$ BRL</option>
```

### Modifying Categories

Edit the category options in `index.html`:

**For Income Categories:**
```html
<select id="income-category" required>
    <option value="Salary">Salary</option>
    <option value="Business">Business</option>
    <option value="Gift">Gift</option>
    <option value="Investment">Investment</option>  <!-- Add new -->
    <option value="Other">Other</option>
</select>
```

**For Expense Categories:**
```html
<select id="expense-category" required>
    <option value="Food">Food</option>
    <option value="Transport">Transport</option>
    <option value="Shopping">Shopping</option>
    <option value="Entertainment">Entertainment</option>  <!-- Add new -->
    <option value="Bills">Bills</option>
    <option value="Health">Health</option>
    <option value="Other">Other</option>
</select>
```

### Customizing Colors

The application uses CSS variables for easy color customization. Edit `styles.css`:

```css
:root {
    --primary: #667eea;        /* Primary brand color */
    --primary-dark: #764ba2;   /* Primary dark variant */
    --success: #10b981;        /* Success/Income color */
    --danger: #ef4444;         /* Danger/Expense color */
    --info: #3b82f6;           /* Info color */
    /* Add or modify colors here */
}
```

### Changing Chart Appearance

Modify the Chart.js configuration in `app.js` within the `renderBarChart()` function:

```javascript
barChart = new Chart(ctx, {
    type: 'bar',  // Change to 'line', 'pie', etc.
    // Modify other chart options
});
```

## 🔧 Technical Details

### Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| HTML5 | Structure | - |
| CSS3 | Styling & Animations | - |
| JavaScript (ES6) | Application Logic | ES2015+ |
| Chart.js | Data Visualization | 4.x (CDN) |
| jsPDF | PDF Generation | 2.5.1 (CDN) |
| jsPDF-AutoTable | PDF Tables | 3.7.0 (CDN) |
| Font Awesome | Icons | 6.0.0 (CDN) |
| LocalStorage API | Data Persistence | Native |

### Architecture

**Single Page Application (SPA):**
- Hash-based routing (`window.location.hash`)
- Dynamic content rendering
- No page reloads for navigation
- Client-side state management

**Data Flow:**
```
User Action → Event Listener → Update LocalStorage → Update UI → Render View
```

**Key Design Patterns:**
- Module pattern for code organization
- Event-driven architecture
- Separation of concerns (UI, Data, Business Logic)
- DRY (Don't Repeat Yourself) principles

### Browser Storage

The application uses LocalStorage to persist data:

```javascript
// User data
localStorage.setItem('budget-user', JSON.stringify(user));
localStorage.setItem('budget-users', JSON.stringify(users));

// Transaction data
localStorage.setItem('budget-transactions', JSON.stringify(transactions));

// Preferences
localStorage.setItem('budget-dark-mode', '1');
localStorage.setItem('budget-last-currency', 'USD');
```

**Storage Limits:**
- Most browsers: 5-10 MB per domain
- Data persists until explicitly cleared
- Private/Incognito mode: Data cleared when window closes

### Security Considerations

⚠️ **Important Notes:**
- This is a **client-side only** application
- Passwords are stored in **plain text** in LocalStorage
- **No encryption** is implemented
- Suitable for **personal use** and **learning purposes**
- **Not recommended** for production use with sensitive data

For production use, consider:
- Implementing a backend with proper authentication
- Using encryption for password storage (bcrypt, argon2)
- Adding HTTPS for secure communication
- Implementing proper session management
- Adding input validation and sanitization

## 🌐 Browser Compatibility

| Browser | Minimum Version | Tested |
|---------|----------------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Opera | 76+ | ✅ |

**Required Browser Features:**
- ES6 JavaScript support
- LocalStorage API
- Canvas API (for charts)
- CSS Grid and Flexbox
- CSS Custom Properties (variables)

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/adriel03-dp/web-based-budget-tracker-modern.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make Your Changes**
   - Write clean, commented code
   - Follow existing code style
   - Test thoroughly in multiple browsers

4. **Commit Your Changes**
   ```bash
   git commit -m "Add: Your feature description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Link any related issues
   - Wait for review

### Code Style Guidelines

- Use meaningful variable and function names
- Add comments for complex logic
- Follow consistent indentation (2 spaces)
- Keep functions small and focused
- Use ES6+ features where appropriate

## 🐛 Known Issues

- Multiple currencies in transactions show "Mixed" in dashboard summaries
- Chart may not render immediately on first load (refresh to fix)
- No data export/import functionality
- No backup mechanism for LocalStorage data
- Password reset requires existing username (no email verification)

## 🚧 Future Enhancements

Potential features for future versions:

- [ ] **Data Export/Import**: Backup and restore functionality (JSON/CSV)
- [ ] **Recurring Transactions**: Automatically add recurring income/expenses
- [ ] **Budget Goals**: Set and track monthly/yearly budget goals
- [ ] **Advanced Filtering**: Filter transactions by date, category, tags, amount
- [ ] **Search Functionality**: Search transactions by description
- [ ] **Multiple Accounts**: Support for multiple budget accounts
- [ ] **Currency Conversion**: Real-time currency conversion with API
- [ ] **Spending Analytics**: More detailed charts and insights
- [ ] **Category Icons**: Custom icons for transaction categories
- [ ] **Receipt Attachments**: Upload and attach receipt images
- [ ] **Expense Splitting**: Split expenses among multiple people
- [ ] **Savings Tracker**: Track savings goals and progress
- [ ] **Mobile App**: Progressive Web App (PWA) support
- [ ] **Cloud Sync**: Optional cloud backup with authentication
- [ ] **Multi-language Support**: Internationalization (i18n)

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Modern Budget Tracker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 💬 Support

If you encounter any issues or have questions:

1. **Check Existing Issues**: Review open/closed issues on GitHub
2. **Create New Issue**: Open a new issue with detailed description
3. **Discussions**: Use GitHub Discussions for general questions

## 🙏 Acknowledgments

- **Chart.js** - Beautiful, flexible charts
- **jsPDF** - Client-side PDF generation
- **Font Awesome** - Comprehensive icon library
- **MDN Web Docs** - Excellent web development documentation
- **Stack Overflow Community** - Invaluable problem-solving resource

## 📸 Screenshots

> **Note**: Add screenshots of your application in action:
> - Dashboard view (light mode)
> - Dashboard view (dark mode)
> - Add Transaction form
> - Transaction History
> - PDF Report preview
> - Mobile responsive view

---

**Made with ❤️ for better personal finance management**

*Last Updated: December 2024*