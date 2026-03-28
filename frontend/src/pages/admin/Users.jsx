import React from "react";
import { useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const users = [
  {
    id: 1,
    name: "Ram Sharma",
    email: "ram@gmail.com",
    helmet: "H101",
    status: "Active",
  },
  {
    id: 2,
    name: "Sita Rai",
    email: "sita@gmail.com",
    helmet: "H203",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Hari Thapa",
    email: "hari@gmail.com",
    helmet: "H312",
    status: "Active",
  },
];

function Users() {
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/users", {
          method: "GET",
        });

        const data = response.body;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllUsers();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Users Management
      </Typography>

      {/* Search + Add User */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <TextField label="Search User" variant="outlined" size="small" />

        <Button variant="contained" color="primary">
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Helmet ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>

                <TableCell>{user.name}</TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>{user.helmet}</TableCell>

                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === "Active" ? "success" : "warning"}
                  />
                </TableCell>

                <TableCell align="center">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default Users;
