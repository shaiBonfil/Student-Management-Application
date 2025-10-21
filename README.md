# Student Management Application

This is a full-stack application for managing a list of students.

## Tech Stack

* **Backend**: Java 17, Spring Boot, JPA/Hibernate
* **Frontend**: React, TypeScript, Vite
* **Database**: PostgreSQL (running in Docker)
* **Containerization**: Docker Compose

---

## Prerequisites

* Java 17+ (JDK)
* Node.js 18+
* Docker & Docker Compose
* Maven (or just use your IDE's built-in Maven)

---

## How to Run

This project uses a hybrid setup: the database runs in a Docker container, while the backend and frontend run locally on your machine.

### Step 1: Start the Database (Docker)

1.  **Configure Credentials:**
    Open the `docker-compose.yml` file. If you wish, change the `POSTGRES_USER` and `POSTGRES_PASSWORD` values.

2.  **Start the Container:**
    Open a terminal in the project's **root directory** (the one containing `docker-compose.yml`) and run:
    ```bash
    docker-compose up -d
    ```
    *(This starts the PostgreSQL database in the background. `-d` means "detached".)*

### Step 2: Run the Server (Spring Boot)

1.  **Configure Credentials:**
    Navigate to the server's resource folder: `/homeassignment/src/main/resources/`.
    Open the `application.properties` file.

2.  **Verify Settings:**
    Make sure the `spring.datasource.username` and `spring.datasource.password` values **exactly match** the `POSTGRES_USER` and `POSTGRES_PASSWORD` you set in the `docker-compose.yml` file.

    The file should contain these properties to connect to the Docker DB and load the sample data:
    ```properties
    # Database Connection
    spring.datasource.url=jdbc:postgresql://localhost:5432/students_db
    spring.datasource.username=your_postgres_user
    spring.datasource.password=your_postgres_password

    # JPA (Hibernate) Settings
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
    
    # SQL Initialization Settings
    # This makes sure data.sql runs AFTER Hibernate creates the tables
    spring.jpa.defer-datasource-initialization=true
    # This forces the app to run data.sql on a "real" database
    spring.sql.init.mode=always
    ```

3.  **Run the Application:**
    You can now run the application directly from your IDE (like IntelliJ) by clicking the "Run" button on your `HomeassignmentApplication.java` file.

    Alternatively, you can run it from the server's directory in your terminal:
    ```bash
    # From the /homeassignment directory
    mvn spring-boot:run
    ```
    The backend API will start on `http://localhost:8080`. On startup, it will automatically run the `data.sql` script to populate the database.

### Step 3: Run the Client (React)

1.  **Open a new terminal** (leave the server running).
2.  Navigate to the `/client` directory.
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will now be available at `http://localhost:5173`.

---

## API Endpoints

A Postman collection (`student-api.json`) is included in the repository. You can import it to test the API.

* `{{baseUrl}}`: `http://localhost:8080/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/students` | Get all students. |
| `GET` | `/students?sortBy=gpa&sortDir=DESC` | Get students with sorting and filtering. |
| `GET` | `/students/honor-candidates/top-by-department` | Get the top honor student from each department. |
| `POST` | `/students` | Add a new student. |
| `PUT` | `/students/{id}` | Update an existing student. |
