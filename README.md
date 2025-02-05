### Solana Web3 Crowdfunding Platform

A decentralized crowdfunding platform built on the Solana blockchain. This project allows users to create campaigns, donate to them, and withdraw funds securely using smart contracts. The frontend is built with Next.js, and the smart contract is deployed on the Solana Devnet.

## Live Demo: [https://web3-crowdfunding.vercel.app/](https://web3-crowdfunding.vercel.app/)


## Features
Create Campaigns: Users can create crowdfunding campaigns with a title, start time, and deadline.

Donate to Campaigns: Users can donate to active campaigns using Solana tokens.

Withdraw Funds: Campaign owners can withdraw funds after the campaign deadline has passed.

Secure and Transparent: Built on Solana's blockchain for secure and transparent transactions.

## Technologies Used
Blockchain: Solana

Smart Contract Framework: Anchor (Rust)

Frontend: Next.js 

Deployment: Vercel (Frontend), Solana Devnet (Smart Contract)

## Smart Contract Overview
The smart contract is written in Rust using the Anchor framework. It is deployed on the Solana Devnet with 
the program ID: FnBWfHQmw6o7igCF1NbScApEtJNesmqAPThKWT5RmbnS

### Getting Started
Prerequisites
    Node.js (v16 or higher)
    Solana CLI
    Anchor CLI
    Yarn or npm

## Installation
Clone the repository:
    git clone https://github.com/Kavit-Patel/web3_crowdfunding
    cd web3_crowdfunding
    Install dependencies:npm install
Build and deploy the smart contract:    
    anchor build
    anchor deploy
Run the frontend:
    create .env file in root folder
        add NEXT_PUBLIC_ADMIN_WALLET_SECRET - wallet who creates campaign 
    npm run dev
    Open the application in your browser:http://localhost:3000

Deployment
Frontend: Deployed on Vercel at https://web3-crowdfunding.vercel.app/.

Smart Contract: Deployed on Solana Devnet with program ID:
FnBWfHQmw6o7igCF1NbScApEtJNesmqAPThKWT5RmbnS.

Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes.

Submit a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

License
This project is licensed under the MIT License. See the LICENSE file for details.


Contact
For questions or feedback, feel free to reach out:

Email: kvpatel.er@gmail.com

GitHub: [https://github.com/Kavit-Patel](https://github.com/Kavit-Patel)

Thank you for checking out the Solana Web3 Crowdfunding Platform! 