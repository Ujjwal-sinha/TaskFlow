"use client";
import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        <div className="relative container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">About Our Decentralized Task Platform</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up">
            Empowering a new era of work through transparency, security, and efficiency on the blockchain.
          </p>
          <Link href="/marketplace" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg animate-fade-in-up delay-200">
            Explore Tasks
          </Link>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <section className="mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fade-in">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Our Mission</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto">
            Our mission is to revolutionize the way tasks are managed and executed by leveraging the power of blockchain technology. We aim to create a decentralized, transparent, and efficient platform where users can securely post tasks, find skilled professionals, and ensure fair compensation through smart contracts.
            We believe in fostering a global community where trust is inherent, and opportunities are accessible to everyone, regardless of geographical boundaries.
          </p>
        </section>

        {/* What We Offer Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-10 text-purple-700 dark:text-purple-400">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-fade-in delay-100">
              <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <h3 className="text-2xl font-semibold mb-3">Decentralized Task Management</h3>
              <p className="text-gray-700 dark:text-gray-300">Post and manage tasks on a secure, distributed ledger, ensuring immutability and transparency.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-fade-in delay-200">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.873 5.785 4.514 7.5a12.001 12.001 0 0013.029-.001c2.642-1.714 4.515-4.428 4.515-7.5a12.001 12.001 0 00-3.042-8.618z"></path></svg>
              <h3 className="text-2xl font-semibold mb-3">Smart Contract Escrow</h3>
              <p className="text-gray-700 dark:text-gray-300">Funds are held securely in escrow via smart contracts, guaranteeing fair payment upon task completion.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-fade-in delay-300">
              <svg className="w-16 h-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
              <h3 className="text-2xl font-semibold mb-3">Transparent Operations</h3>
              <p className="text-gray-700 dark:text-gray-300">All transactions and task statuses are publicly verifiable on the blockchain, ensuring complete transparency.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-fade-in delay-400">
              <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-9a2 2 0 00-2-2H7a2 2 0 00-2 2v9m4 3h2m-2 0h2m-2 0V9m0 3h.01M17 12h.01"></path></svg>
              <h3 className="text-2xl font-semibold mb-3">Global Talent Pool</h3>
              <p className="text-gray-700 dark:text-gray-300">Connect with skilled professionals and exciting opportunities from around the globe, without intermediaries.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-fade-in delay-500">
              <svg className="w-16 h-16 text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.873 5.785 4.514 7.5a12.001 12.001 0 0013.029-.001c2.642-1.714 4.515-4.428 4.515-7.5a12.001 12.001 0 00-3.042-8.618z"></path></svg>
              <h3 className="text-2xl font-semibold mb-3">Secure & Trustless Environment</h3>
              <p className="text-gray-700 dark:text-gray-300">Minimize fraud and disputes through cryptographic security and the inherent trustlessness of blockchain.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105 animate-fade-in delay-600">
              <svg className="w-16 h-16 text-pink-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 12m-6-4h.01M12 12h.01M12 16h.01M4.932 19.493A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21l3.5-1.5c.A9.953 9.953 0 0012 22z"></path></svg>
              <h3 className="text-2xl font-semibold mb-3">Automated Dispute Resolution</h3>
              <p className="text-gray-700 dark:text-gray-300">Leverage smart contract logic for automated and fair dispute resolution, reducing manual intervention.</p>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fade-in">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-purple-600 dark:text-purple-300">Frontend & UI/UX</h3>
              <ul className="list-disc list-inside ml-4">
                <li><span className="font-medium">Next.js:</span> A React framework for production, providing server-side rendering and static site generation.</li>
                <li><span className="font-medium">React:</span> A JavaScript library for building user interfaces.</li>
                <li><span className="font-medium">Tailwind CSS:</span> A utility-first CSS framework for rapidly building custom designs.</li>
                <li><span className="font-medium">Shadcn/ui:</span> Reusable components built with Radix UI and Tailwind CSS.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-purple-600 dark:text-purple-300">Blockchain & Smart Contracts</h3>
              <ul className="list-disc list-inside ml-4">
                <li><span className="font-medium">XDC Network:</span> An enterprise-grade, EVM-compatible blockchain (XinFin Delegated Proof of Stake) offering near-zero transaction fees, high transaction speeds (2000+ TPS), and instant finality. Its interoperability with other blockchain networks via cross-chain bridges makes it ideal for scalable decentralized applications (dApps) and real-world asset tokenization, providing a robust and efficient foundation for our platform's transactions and smart contracts.</li>
                <li><span className="font-medium">Solidity:</span> The primary language for developing robust and verifiable smart contracts.</li>
                <li><span className="font-medium">Ethers.js:</span> A complete and compact library for interacting with the Ethereum blockchain and its ecosystem.</li>
                <li><span className="font-medium">Hardhat:</span> A development environment to compile, deploy, test, and debug your Ethereum software.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-purple-600 dark:text-purple-300">Backend & Data</h3>
              <ul className="list-disc list-inside ml-4">
                <li><span className="font-medium">Node.js:</span> A JavaScript runtime built on Chrome's V8 JavaScript engine.</li>
                <li><span className="font-medium">Express.js:</span> A minimal and flexible Node.js web application framework.</li>
                <li><span className="font-medium">MongoDB:</span> A NoSQL database for flexible and scalable data storage.</li>
                <li><span className="font-medium">Mongoose:</span> An ODM library for MongoDB and Node.js.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3 text-purple-600 dark:text-purple-300">Authentication & AI</h3>
              <ul className="list-disc list-inside ml-4">
                <li><span className="font-medium">Civic Pass:</span> A decentralized identity verification solution built on blockchain technology. It enables users to prove their identity and verify credentials (e.g., age, residency, KYC/AML compliance) without directly exposing sensitive personal data to every service. This enhances user privacy and security on our platform by allowing for selective disclosure of verified attributes, streamlining compliance, and preventing Sybil attacks.</li>
                <li><span className="font-medium">Eliza AI:</span> Our custom-built artificial intelligence module, integrated to enhance user experience and operational efficiency. Eliza AI provides intelligent task matching by analyzing project requirements and freelancer skills, automates customer support through an advanced chatbot, and offers personalized insights to optimize user engagement and platform performance. It leverages machine learning algorithms to continuously improve its suggestions and interactions.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Our Components Section */}
        <section className="mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fade-in">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Our Components</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto">
            We utilize a suite of custom and open-source components to deliver a rich and interactive user experience.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-lg bg-gray-50 p-6 shadow-sm dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">XDCEscrowForm</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">A form component for managing escrow payments on the XDC Network.</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 shadow-sm dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">TaskEscrowIntegration</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Integrates task escrow functionalities within the platform.</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 shadow-sm dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">XDCpayment</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Handles XDC token payments securely.</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 shadow-sm dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Chatbot</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">An interactive chatbot for user assistance and communication.</p>
            </div>
            
          </div>
        </section>

        {/* Our Vision Section */}
        <section className="mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-fade-in">
          <h2 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Our Vision</h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-center max-w-4xl mx-auto">
            We envision a future where individuals and businesses can collaborate globally with unprecedented trust and efficiency. By eliminating traditional intermediaries and leveraging the inherent security of blockchain, we aim to foster a new era of decentralized work, empowering both task posters and performers.
            Our goal is to build a resilient, fair, and accessible ecosystem that redefines the future of employment and value exchange.
          </p>
        </section>

        {/* Call to Action / Contact Section */}
        <section className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-8 rounded-lg shadow-lg animate-fade-in">
          <h2 className="text-4xl font-bold mb-6">Join Our Decentralized Revolution!</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Ready to experience the future of work? Whether you're looking to post a task or offer your skills, our platform provides the tools you need to succeed in a decentralized world.
          </p>
          <Link href="/post-task" className="bg-white text-blue-700 hover:bg-gray-100 px-10 py-4 rounded-full text-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg mr-4">
            Post a Task
          </Link>
          <Link href="/marketplace" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 px-10 py-4 rounded-full text-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
            Find Tasks
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-8 text-center">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Decentralized Task Platform. All rights reserved.</p>
          <p className="mt-2">Contact us at <a href="mailto:info@example.com" className="text-blue-600 hover:underline">info@example.com</a></p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;