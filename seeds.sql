-- Create tables with unique constraints
CREATE TABLE
    IF NOT EXISTS department (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) UNIQUE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS role (
        id SERIAL PRIMARY KEY,
        title VARCHAR(30) UNIQUE NOT NULL,
        salary DECIMAL NOT NULL,
        department_id INTEGER NOT NULL,
        FOREIGN KEY (department_id) REFERENCES department (id)
    );

CREATE TABLE
    IF NOT EXISTS employee (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INTEGER NOT NULL,
        manager_id INTEGER,
        FOREIGN KEY (role_id) REFERENCES role (id),
        FOREIGN KEY (manager_id) REFERENCES employee (id),
        UNIQUE (first_name, last_name) -- Ensure employee name combination is unique
    );

-- Insert data with conflict resolution
INSERT INTO
    department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance') ON CONFLICT (name) DO NOTHING;

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('Software Engineer', 70000, 1),
    ('Sales Manager', 80000, 2),
    ('Accountant', 60000, 3) ON CONFLICT (title) DO NOTHING;

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
SELECT
    *
FROM
    (
        VALUES
            ('Ashley', 'Morgan', 1, NULL),
            ('Michael', 'Parsons', 2, 1),
            ('Sue', 'Byrd', 3, NULL)
    ) AS data (first_name, last_name, role_id, manager_id)
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            employee
        WHERE
            employee.first_name = data.first_name
            AND employee.last_name = data.last_name
    );