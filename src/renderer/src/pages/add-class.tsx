import React, { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Grid,
    Snackbar,
    Alert,
} from "@mui/material";
import { useAuth } from "../../context/AuthContextProvider";
import GoBack from "@renderer/components/GoBack";
import { useNavigate } from "react-router";

export default function AddClassPage() {
    const [className, setClassName] = useState("");
    const [college, setCollege] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState<number>(1);

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            let response = await fetch("http://127.0.0.1:8000/classes/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: className, college, department, year: year.toString() }),
            });

            const data = await response.json();

            if (data.status === 200 || response.status === 200) {
                setSnackbar({
                    open: true,
                    message: "Class added successfully!",
                    severity: "success",
                });
                setTimeout(() => navigate("/"), 1500);
            } else {
                setSnackbar({
                    open: true,
                    message: "Failed to add class. Please try again.",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Error adding class:", error);
            setSnackbar({
                open: true,
                message: "An error occurred while adding the class.",
                severity: "error",
            });
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <GoBack />
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" component="h1" align="center" gutterBottom>
                    Add New Class
                </Typography>

                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        label="Class Name"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        margin="normal"
                        required
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="College"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Year"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                required
                                inputProps={{ min: 1, max: 5 }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={handleSubmit}
                    >
                        Add Class
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity as "success" | "error"}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
