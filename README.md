Backend Development – E-Commerce Website


1. Introduction
This project represents the backend layer of an e-commerce website developed as part of an academic teamwork project.
The backend is responsible for all server-side operations, including data persistence, business logic, security enforcement, and communication with the frontend through a structured API.
The system was designed following modern web architecture principles, ensuring:


Clear separation between frontend and backend


Maintainability and scalability


Secure data handling


Compatibility with different frontend implementations



2. Technologies and Tools
The backend was implemented using the following technologies:


PHP 8.x – Server-side programming language


MySQL – Relational database management system


Apache Server (XAMPP) – Local development environment


PDO (PHP Data Objects) – Secure database access


JSON – Data exchange format between backend and frontend


REST-style API design


Git & GitHub – Version control and team collaboration



3. Architectural Approach
The backend follows an API-oriented architecture, where:


The backend does not generate HTML views


Each functionality is exposed as an API endpoint


Data is exchanged using JSON


The frontend consumes the API via HTTP requests (GET / POST)


This approach ensures that:


The backend is independent from the frontend


Multiple frontends (web, mobile) can reuse the same backend


Responsibilities are clearly separated



4. Project Structure
The backend is organized into a modular and logical directory structure:
backend/
│
├── api/                  # API endpoints (business logic)
│   ├── products/
│   ├── categories/
│   ├── orders/
│   ├── cart/
│   ├── contact/
│   └── admin/
│
├── config/               # Configuration files
│   ├── database.php
│   └── mail.php
│
├── core/                 # Shared core logic
│   ├── response.php
│   ├── auth.php
│   └── helpers.php
│
├── uploads/              # File storage
│   ├── products/images/
│   └── temp/
│
├── .htaccess             # Security and access rules
└── index.php             # Global entry protection

This structure follows the principle of separation of concerns, where each folder has a clear and unique responsibility.

5. API Layer Description (/api)
Each API module corresponds to a specific domain of the system.
5.1 Products API
Handles product-related operations:


Retrieve all products


Retrieve product details


Filter products (price, category, availability, search)


Create, update, and delete products (admin only)


The API ensures stock validation and data consistency with the database.

5.2 Categories API
Manages product categories:


Retrieve active categories


Create new categories (admin)


Categories are used to organize products and support filtering on the frontend.

5.3 Cart API


calculate.php
Calculates cart totals based on selected products and quantities.
It validates:


Product existence


Available stock


Correct price computation


No cart data is stored permanently at this stage; calculations are done dynamically.

5.4 Orders API
Handles the complete order lifecycle:


Order creation from checkout form


Stock verification and update


Order items storage


Order status management


Admin order listing and details


Each order is linked to its items and delivery information.

5.5 Contact API
Manages customer communication:


Customers can send messages via contact form


Messages are stored in the database


Admin can reply and update message status


This ensures traceability of customer support interactions.

5.6 Admin API
Provides basic administration functionality:


Admin authentication (login/logout)


Session-based access control


Admin profile retrieval


At the current stage, the system supports a single administrator, with scalability for multiple admins in the future.

6. Core Layer (/core)
The core layer contains shared logic used across all APIs.
6.1 response.php
Defines a standardized JSON response format used by all endpoints:
{
  "success": true,
  "message": "Operation description",
  "data": {}
}

This ensures consistency, clarity, and easier frontend integration.

6.2 auth.php
Handles:


Admin authentication checks


Access protection for admin-only APIs


It centralizes security rules and avoids code duplication.

6.3 helpers.php
Contains utility functions such as:


Input sanitization


Data formatting


Reusable helper logic



7. Configuration Layer (/config)


database.php
Establishes a secure PDO connection to MySQL using best practices.


mail.php
Defines email configuration used for contact message replies.



8. Security Implementation
8.1 .htaccess
Used to:


Prevent direct access to sensitive folders


Disable directory listing


Restrict unauthorized file execution



8.2 index.php
Acts as a security gate:


Prevents unintended access to backend structure


Ensures controlled API usage



9. Database Design
The backend interacts with a normalized MySQL database composed of:


products


categories


orders


order_items


delivery_prices


contact_messages


admins


Relational integrity is enforced using foreign keys.

10. Data Exchange (JSON & JavaScript)


All backend responses are sent in JSON


The frontend (HTML, CSS, JavaScript, jQuery) consumes these responses


JSON acts as the contract between frontend and backend


This allows:


Dynamic UI updates


Asynchronous operations (AJAX)


Clean separation between layers



11. Version Control and Collaboration


Backend developed in a dedicated Git branch


Code pushed to GitHub for team collaboration


Frontend and backend maintained independently


Clear responsibility distribution among team members



12. Project Status
✔ Backend fully implemented
✔ Database schema finalized
✔ APIs tested and functional
✔ Security measures applied
✔ Ready for frontend integration

13. Conclusion
This backend provides a robust, secure, and scalable foundation for the e-commerce platform.
Its API-driven design ensures compatibility with the frontend and allows future extensions such as mobile applications, payment integration, and advanced administration features.

