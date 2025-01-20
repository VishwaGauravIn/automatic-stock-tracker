# Automatic Stock Tracker and Notifier

This project fetches stock data from the my **SPECIAL** screen (list of stocks) on Screener.in (you can replace it with anything), and sends you a telegram notification daily based on which stock was added to the list or removed.

# How to use? 

#### Just get yourself added in [Telegram Channel](https://t.me/YourDailyStockTracker) (https://t.me/YourDailyStockTracker)
You will receive notification everyday @9:16AM (only if there is any change in the list)

<!-- - Step 1: Message our [Telegram Bot](https://t.me/YourDailyStockTrackerBot) (https://t.me/YourDailyStockTrackerBot) `/start`

![image](https://github.com/user-attachments/assets/68c00f39-6836-4d85-b844-0f560d274a40)

- Step 2: add your telegram username in `users.js` file in this repository and raise a Pull Request 

> [!IMPORTANT]  
> If you don't know how to do this all, just dm me on Twitter/X : [@VishwaGauravIn](https://x.com/vishwagauravin) or [LinkedIn](https://www.linkedin.com/in/vishwagauravin/) or Telegram @VishwaGaurav
-->

## Features

- **Fetches stock data**: Retrieves stock names and prices from the provided URL.
- **Calculates differences**: Compares current data with previously fetched data and calculates additions and deletions.
- **Archiving**: Saves the differences to an archive folder with a timestamp if there are any changes.
- **Telegram Notifications**: Sends a Telegram message about added and removed stocks.
- **GitHub Actions**: Automatically runs the script daily at 9:16 AM IST via GitHub Actions.

&nbsp;
-----

&nbsp;

# For Developers 
## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/VishwaGauravIn/automatic-stock-tracker.git
cd automatic-stock-tracker
```
### 2. Set Up Environment Variables
For the Telegram bot integration and any other sensitive data, you will need to set up the following environment variables:

- `BOT_TOKEN`: Your Telegram bot token.
- `SCREEN_URL`: The URL to your screener.in screen

You can set these up in GitHub Actions as Secrets:

1. Go to your repository settings on GitHub.
2. Under Secrets and Variables > Actions, click New repository secret.
3. Add the following secrets:
- `BOT_TOKEN`
- `SCREEN_URL`

### 3. Ensure that you have sent a /start message to the bot

### 4. Configure GitHub Actions Workflow
This project uses GitHub Actions to automate daily execution of the script. The workflow will run the script every day at 9:16 AM IST (3:46 AM UTC).

#### Workflow Configuration
The workflow file `.github/workflows/daily_stock_update.yml`

### 5. File Handling in the Script
The following files are handled in the script:

- `latest.json`: Contains the most recent stock data.
- `diff.json`: Contains the differences (added and removed stocks) from the last fetched data.
- `archive/`: Folder containing the archived diff.json files with timestamps.

The script will:

- Fetch stock data from the provided URL.
- Compare it with `latest.json` to find the differences (added/removed stocks).
- Save the `latest.json` and `diff.json` files.
- Archive the `diff.json` file if there are any additions or deletions in the data.
- Send a Telegram notification with the details of added and removed stocks.

### Directory Structure

```bash
stock-fetcher/
├── .github/
│   └── workflows/
│       └── daily_stock_update.yml       # GitHub Actions workflow
├── archive/                             # Contains archived diff files
├── daily_stock_update.js               # Node.js script to fetch and process stock data
├── latest.json                          # Most recent fetched stock data
├── diff.json                            # Difference data (added/removed stocks)
├── users.js                            # List of the users subscribed to the notification
└── README.md                            # Project documentation
```
