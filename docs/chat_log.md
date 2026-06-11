# RIC Badminton - Project Learning Reference & Chat Log

This document serves as your complete learning reference and conversation log, compiled directly from your pairing session. It contains all the step-by-step tutorials, explanations of Git commands, directory commands, and serverless hosting architectures we covered.

---

## 1. Project Enhancements & Achievements
During this session, we elevated the **RIC Badminton** web application into a fully complete, professional system by implementing three major features:

### 🖼️ Click-to-Change Profile Pictures
* **What we did**: Enabled administrators to update profile pictures for **already registered** players directly from the Admin Panel.
* **How it works**: Hovering over any player's avatar in the Check-In grid or Active Queue displays a sleek **camera overlay (`📷`)** and scales the avatar. Clicking it launches a file input dialog, converts the chosen picture to a high-fidelity **Base64 Data URL** via `FileReader`, and instantly syncs it to both the permanent roster and the active session.

### 🏷️ Sleek RIC SVG Shuttlecock Branding & Navigation
* **What we did**: Replaced generic emojis and gears with a custom-engineered **vector SVG Badminton Shuttlecock logo** in the header of all pages.
* **Branding features**: Features a gradient circular badge (`#00f2fe` to `#ff2a5f`) enclosing a high-fidelity feather shuttlecock (cork base, feather shafts, and binding threads). Hovering over the logo/title triggers a smooth `10deg` rotation, a glow transition, and shifts the title text into a vibrant gradient.
* **Home Navigation**: The entire brand header is wrapped in an anchor link (`index.html`) so clicking it on any page instantly returns the user to the home board.

### 🔍 Check-In Grid Search Box
* **What we did**: Added a real-time, responsive search input inside the **Check-In Selection Grid** on the Admin Panel.
* **UX detail**: As you type, the grid dynamically filters player cards. We designed the system to auto-invoke `filterCheckin()` after any event (like checking in a player or uploading a photo), preserving your search filter state seamlessly.

---

## 2. Command Prompt & Git Learning Guide
You executed these commands manually in your Command Prompt (`cmd`) to publish your first repository to GitHub!

### The Step-by-Step GitHub Publish Workflow

```cmd
:: 1. Navigate to your project folder
cd C:\Users\User\codex

:: 2. Initialize a local Git tracking system
git init

:: 3. Configure your global Git username and email
git config --global user.name "kyaw-hein222"
git config --global user.email "kyawhtethein.pt@gmail.com"

:: 4. Stage all files for a snapshot
git add .

:: 5. Create a snapshot (Commit) of your progress
git commit -m "feat: RIC Badminton scoreboard with interactive avatars and search"

:: 6. Rename your default timeline to "main"
git branch -M main

:: 7. Link your local Command Prompt to your GitHub repository
git remote add origin https://github.com/kyaw-hein222/ric-badminton.git

:: 8. Push your code to the cloud
git push -u origin main
```

---

## 3. Explanations of Key Git Concepts

### 💡 The "Save Game" Analogy (Commits)
Running a **`git commit`** is exactly like saving your progress in a video game before a dangerous boss battle.
* If you make a mistake next week and accidentally break all your pages, you don't have to panic! You can run a command to **"load your last save state"** and your files will instantly revert back to this exact working second.
* **`-m "..."`**: The `-m` stands for **message**. This is your diary entry describing the save file. Starting with `feat:` (feature) or `docs:` (documentation) is an industry-standard format called **Conventional Commits** that looks highly professional on a portfolio.

### 💡 Glossary of Git Terms
* **`git init`**: Turns your folder into a Git repository. It creates a hidden `.git` folder which acts as a history ledger for your project.
* **`git add .`**: Stages your files. If Git is a camera, this tells your files to stand in front of the lens, smile, and get ready for the picture. The `.` (dot) means "add everything in this directory".
* **`git remote add origin <url>`**: Creates a bridge between your local drive and the internet. `origin` is just a nickname Git uses for your online GitHub repository address so you don't have to type it out every time.
* **`git push -u origin main`**: Uploads your save states to the cloud. The `-u` (upstream) tells Git to remember this connection. For all future uploads, you only have to type **`git push`**!

### 💡 The "LF to CRLF" Warning
If you see the warning: `LF will be replaced by CRLF the next time Git touches it`:
* **LF** (Line Feed) is the line ending character used by Mac and Linux.
* **CRLF** (Carriage Return Line Feed) is the line ending character used by Windows.
* Because your files were generated with Mac/Linux style line endings, Git automatically standardizes them to Windows style line endings to make sure they display perfectly on your PC. **This warning is 100% normal and safe to ignore!**

---

## 4. AWS Serverless Hosting Architecture
Instead of using managed services, you chose the **manual AWS Serverless** route. This demonstrates full-stack cloud capabilities on your portfolio.

### 🏗️ S3 + CloudFront + API Gateway + Lambda + DynamoDB

* **Storage (Amazon S3)**: Your static files (`index.html`, `admin.html`, `records.html`) are saved in a private S3 bucket.
* **Security (CloudFront OAC)**: To protect your data, your S3 bucket is **100% private**. We configure **CloudFront Origin Access Control (OAC)**. Only your global CloudFront CDN is authorized to read files from your S3 bucket.
* **Database (Amazon DynamoDB)**: Stores player rosters and daily matches in a NoSQL database named `ric_badminton_state`.
* **Serverless Code (AWS Lambda)**: Processes requests (GET/POST) and handles database connections.
* **Security (Admin Passcode)**: Passcode validation is performed strictly on the server-side (inside your AWS Lambda function) using environment variables. Public scoreboards are safely locked to a read-only mode and never have access to write-privileges.
* **API Interface (Amazon API Gateway)**: Exposes your Lambda function over a secure public HTTPS endpoint and manages CORS.
