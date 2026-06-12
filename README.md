<h1 align="center">ESN UniPi Backend API</h1>
<h3 align="center">Robust Server-Side Infrastructure & RESTful Orchestration Engine</h3>

<p align="center">
  The production-ready server-side core driving the <strong>ESN UniPi Portal</strong> ecosystem. This backend infrastructure orchestrates secure data persistence, deterministic RESTful API routing, stateful/stateless user authentication pipelines, and transactional database communication for international student services.
</p>

<p align="center">
  <a href="https://esn-unipi-12345.netlify.app/">
    <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
  </a>
</p>

---

### ✨ Core Functionalities

* **Scalable RESTful API Design:** Exposes highly decoupled, resource-oriented endpoints designed to efficiently manage dynamic Erasmus event schemas, administrative notifications, announcements, and user records.
* **Stateless JWT Authentication Middleware:** Implements robust cryptographically signed JSON Web Token (JWT) authorization flows, establishing strict role-based route guardrails to isolate student operations from administrative permissions.
* **Object-Data Modeling (ODM) Isolation:** Utilizes Mongoose to enforce structural schema validation, optimized indexing, and safe CRUD abstractions over an enterprise MongoDB cluster.
* **Express-Level Request Validation & Sanitization:** Integrates strict server-side input sanitation filters to mitigate Cross-Site Scripting (XSS), NoSQL injection vulnerabilities, and schema pollution.

---

### 🛠️ Production Tech Stack

**Runtime Environment & Core Framework**
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
</p>

**Data Persistence & Modeling**
<p align="left">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
</p>

**Security, Authentication & Utilities**
<p align="left">
  <img src="https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=jsonwebtext&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Bcrypt-000000?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Bcrypt Hash" />
  <img src="https://img.shields.io/badge/CORS-000000?style=for-the-badge" alt="CORS" />
  <img src="https://img.shields.io/badge/Dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" alt="Dotenv" />
</p>

---

### 🚀 Setup & Local Development

**1. Clone the repository:**
```bash
git clone https://github.com/filipposobrijanu/esn-unipi-backend.git
cd esn-unipi-backend
```

**2. Dependency Provisioning:**
```bash
npm install
```

**3. Execute Local Runtime Server:**
```bash
# Run the application with hot-reloading active via nodemon
npm run dev

# Alternatively, boot using standard node runtime
npm start
```
