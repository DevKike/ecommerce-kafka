# E-commerce Project with Kafka

## Description

This project is an e-commerce application that uses **Apache Kafka** as a messaging system to implement an event-driven architecture. Below are its main features.

---

## 🧱 Architecture

- **Event-Driven Pattern**: Asynchronous communication between services using Apache Kafka as the message broker.
- **Microservices**: The application is divided into several functional modules:
  - Users
  - Products
  - Cart
  - Payments
  - Notifications
- **Database**: MongoDB for persistent data storage.

---

## 🧩 Main Modules

- **Authentication (auth)**: Handles user registration and login.
- **Products**: Catalog of available products.
- **Cart**: Shopping cart management.
- **Payments**: Order processing and invoice generation.
- **Notifications**: Sends email notifications to users.

---

## 🔄 Main Event Flows

- **User Registration**: When a user registers, a `welcome_flow` event is published, triggering the sending of a welcome email.
- **Cart Management**: When adding or removing products, `cart_updates` and `cart_removals` events are published.
- **Order Processing**: When an order is created, events are generated to process the payment and issue the invoice.
- **Notifications**: Events trigger automatic emails for actions such as welcome messages, cart removals, or invoices.

---

## 🛠️ Technologies Used

- **Backend**: Node.js with TypeScript
- **Messaging**: Apache Kafka
- **Database**: MongoDB
- **Email**: Nodemailer
- **Containers**: Docker for Kafka, Zookeeper, and MongoDB
- **Authentication**: JSON Web Tokens (JWT)

---

## 👨‍💻 Project Members

- Sahir Ruiz Taborda  
- Martin Escudero Hernández  
- Jared Trujillo Espinosa  
- Álvaro Narváez Escorcia  

---

## 🚀 Objective

To implement a scalable, maintainable, and decoupled e-commerce system by leveraging the benefits of event-driven architecture.
