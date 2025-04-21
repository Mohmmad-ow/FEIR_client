import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContextProvider'
import GoBack from '@renderer/components/GoBack'
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
    Typography,
    Alert,
    Paper
} from '@mui/material'
import { useNavigate } from 'react-router'

interface ClassItem {
    id: number
    name: string
    college: string
    department: string
    year: number
}

export default function EditClassPage(): JSX.Element {
    const [selectedClassId, setSelectedClassId] = useState<number | ''>('')
    const [updatedClass, setUpdatedClass] = useState<ClassItem>({
        id: 0,
        name: '',
        college: '',
        department: '',
        year: 1
    })
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [snack, setSnack] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error'
    }>({
        open: false,
        message: '',
        severity: 'success'
    })
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        const getData = async (): Promise<void> => {
            const response = await fetch('http://127.0.0.1:8000/classes/all', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (response.status === 401) {
                alert('Session expired, please login again')
                window.localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }

            setClasses(data)
            if (data.length > 0) {
                setSelectedClassId(data[0].id)
                setUpdatedClass(data[0])
            }
        }

        getData()
    }, [user])

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        if (selectedClassId === '') return

        try {
            const response = await fetch(`http://127.0.0.1:8000/classes/edit/${selectedClassId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedClass.name,
                    college: updatedClass.college,
                    department: updatedClass.department,
                    year: updatedClass.year
                })
            })

            const result = await response.json()

            if (response.ok) {
                setSnack({
                    open: true,
                    message: 'Class updated successfully!',
                    severity: 'success'
                })
                setTimeout(() => navigate('/view-class'), 1500)
            } else {
                setSnack({
                    open: true,
                    message: result.detail || 'Failed to update class.',
                    severity: 'error'
                })
            }
        } catch (error) {
            console.error('Error updating class:', error)
            setSnack({ open: true, message: 'Something went wrong.', severity: 'error' })
        }
    }

    const onSelectClass = (e: SelectChangeEvent): void => {
        const classId = Number(e.target.value)
        const selected = classes.find((cls) => cls.id === classId)
        if (selected) {
            setSelectedClassId(classId)
            setUpdatedClass(selected)
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <GoBack />
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                    Edit Class
                </Typography>

                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Class to Edit</InputLabel>
                        <Select
                            value={selectedClassId === '' ? '' : String(selectedClassId)}
                            onChange={onSelectClass}
                            label="Select Class to Edit"
                            required
                        >
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Class Name"
                        value={updatedClass.name}
                        onChange={(e) =>
                            setUpdatedClass((prev) => ({ ...prev, name: e.target.value }))
                        }
                        margin="normal"
                        required
                    />
                    <Box
                        display="flex"
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDirection={'row'}
                        gap={2}
                        flexWrap="wrap"
                    >
                        <TextField
                            label="College"
                            value={updatedClass.college}
                            onChange={(e) =>
                                setUpdatedClass((prev) => ({ ...prev, college: e.target.value }))
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Department"
                            value={updatedClass.department}
                            onChange={(e) =>
                                setUpdatedClass((prev) => ({ ...prev, department: e.target.value }))
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Year"
                            type="number"
                            value={updatedClass.year}
                            onChange={(e) =>
                                setUpdatedClass((prev) => ({
                                    ...prev,
                                    year: Number(e.target.value)
                                }))
                            }
                            margin="normal"
                            required
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                    >
                        Update Class
                    </Button>
                </form>
            </Paper>

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snack.severity}
                    onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}
