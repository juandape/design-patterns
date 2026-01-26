export const getUsers = (req, res) => {
    res.send('Get all users');
};

export const createUser = (req, res) => {
    res.send('Create a new user');
};

export const getUserById = (req, res) => {
    const { id } = req.params;
    res.send(`Get user with ID: ${id}`);
};

export const updateUser = (req, res) => {
    const { id } = req.params;
    res.send(`Update user with ID: ${id}`);
};

export const deleteUser = (req, res) => {
    const { id } = req.params;
    res.send(`Delete user with ID: ${id}`);
};