# Subscription-Service

## ToC

- [Subscription-Service](#subscription-service)
  - [ToC](#toc)
  - [Installation](#installation)
  - [Docker](#docker)

## Installation

1. Clone the repository

   ```bash
   git clone git@github.com:BudgetBuddyDE/Subscription-Service.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```
3. Set all required environment-variables as defined in the `.env.example`
4. Start the application
   ```bash
   npm run start
   ```

## Docker

> [!NOTE]
> You may need to sign into the Github Image Registry by using `echo <GH_PAT> | docker login ghcr.io -u <GH_USERNAME> --password-stdin`

1.  Pull the image

    ```bash
    docker pull ghcr.io/budgetbuddyde/subscription-service:latest
    ```

2.  Start an container
    ```bash
    docker run--env-file .env ghcr.io/budgetbuddyde/subscription-service:latest
    ```
