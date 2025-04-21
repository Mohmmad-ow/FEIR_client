import React, { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    Autocomplete,
    TextField,
    Paper
} from '@mui/material'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'

interface Student {
    id: number
    name: string
}

export default function DeleteStudents(): JSX.Element {
    const { user } = useAuth()
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error'
    }>({
        open: false,
        message: '',
        severity: 'success'
    })

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/students/all', {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`
                    }
                })

                if (res.status === 401) {
                    alert('Session expired. Please login again.')
                    window.localStorage.removeItem('userData')
                    window.location.href = '/login'
                    return
                }

                const data = await res.json()
                setStudents(data)
            } catch (err) {
                console.error(err)
                setSnackbar({ open: true, message: 'Failed to fetch students', severity: 'error' })
            }
        }

        fetchStudents()
    }, [user])

    const handleDelete = async () => {
        if (selectedStudents.length === 0) {
            setSnackbar({ open: true, message: 'No students selected.', severity: 'error' })
            return
        }

        setLoading(true)
        try {
            const res = await fetch('http://127.0.0.1:8000/students/delete-multiple', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    students: selectedStudents.map((s) => s.id)
                })
            })

            const result = await res.json()

            if (res.ok) {
                setSnackbar({
                    open: true,
                    message: 'Students deleted successfully!',
                    severity: 'success'
                })
                setStudents((prev) =>
                    prev.filter((s) => !selectedStudents.some((sel) => sel.id === s.id))
                )
                setSelectedStudents([])
            } else {
                setSnackbar({
                    open: true,
                    message: result.detail || 'Failed to delete students.',
                    severity: 'error'
                })
            }
        } catch (err) {
            console.error(err)
            setSnackbar({
                open: true,
                message: 'Error occurred during deletion.',
                severity: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box className="min-h-screen flex flex-col items-center p-4 bg-gray-50">
            <GoBack />
            <Paper elevation={3} sx={{ p: 4, mt: 4, width: '100%', maxWidth: 600 }}>
                <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
                    Delete Students
                </Typography>

                <Autocomplete
                    multiple
                    options={students}
                    getOptionLabel={(option) => option.name}
                    value={selectedStudents}
                    onChange={(e, value) => setSelectedStudents(value)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Students" variant="outlined" />
                    )}
                    sx={{ mb: 4 }}
                />

                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleDelete}
                    disabled={loading}
                    startIcon={loading && <CircularProgress color="inherit" size={20} />}
                >
                    {loading ? 'Deleting...' : 'Delete Selected Students'}
                </Button>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
