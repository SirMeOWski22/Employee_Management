-- Insert departments
INSERT INTO
    department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance') ON CONFLICT (name) DO NOTHING;

-- Insert roles
INSERT INTO
    role (title, salary, department_id)
VALUES
    (
        'Software Engineer',
        70000,
        (
            SELECT
                id
            FROM
                department
            WHERE
                name = 'Engineering'
        )
    ),
    (
        'Sales Manager',
        80000,
        (
            SELECT
                id
            FROM
                department
            WHERE
                name = 'Sales'
        )
    ),
    (
        'Accountant',
        60000,
        (
            SELECT
                id
            FROM
                department
            WHERE
                name = 'Finance'
        )
    ) ON CONFLICT (title) DO NOTHING;

-- Insert employees
INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    (
        'Ashley',
        'Morgan',
        (
            SELECT
                id
            FROM
                role
            WHERE
                title = 'Software Engineer'
        ),
        NULL
    ),
    (
        'Michael',
        'Parsons',
        (
            SELECT
                id
            FROM
                role
            WHERE
                title = 'Sales Manager'
        ),
        (
            SELECT
                id
            FROM
                employee
            WHERE
                first_name = 'Ashley'
                AND last_name = 'Morgan'
        )
    ),
    (
        'Sue',
        'Byrd',
        (
            SELECT
                id
            FROM
                role
            WHERE
                title = 'Accountant'
        ),
        NULL
    ) ON CONFLICT (first_name, last_name) DO NOTHING;