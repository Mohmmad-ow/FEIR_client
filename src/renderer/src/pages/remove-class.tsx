import React, { useEffect, useState } from 'react'
import {
    Container,
    Typography,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    CardHeader,
    Snackbar,
    Alert,
    Box
} from '@mui/material'
import GoBack from '@renderer/components/GoBack'
import { useAuth } from '../../context/AuthContextProvider'

interface ClassItem {
    id: number
    name: string
}

export default function RemoveClassPage(): JSX.Element {
    const [selectedClassId, setSelectedClassId] = useState<number>(0)
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error'
    }>({
        open: false,
        message: '',
        severity: 'success'
    })
    const { user } = useAuth()

    useEffect(() => {
        const getData = async () => {
            try {
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
                if (data.length > 0) setSelectedClassId(data[0].id)
            } catch (error) {
                console.error('Error fetching classes:', error)
                setSnackbar({
                    open: true,
                    message: 'Failed to fetch classes.',
                    severity: 'error'
                })
            }
        }

        getData()
    }, [user])

    const handleSubmit = async (): Promise<void> => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/classes/delete/${selectedClassId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            const result = await response.json()

            if (response.status === 401) {
                alert('Session expired, please login again')
                window.localStorage.removeItem('userData')
                window.location.href = '/login'
                return
            }

            setSnackbar({
                open: true,
                message: 'Class removed successfully!',
                severity: 'success'
            })

            setClasses((prev) => prev.filter((cls) => cls.id !== selectedClassId))

            setTimeout(() => {
                window.location.href = '/view-class'
            }, 1500)
        } catch (error) {
            console.error('Error removing class:', error)
            setSnackbar({
                open: true,
                message: 'Failed to remove class.',
                severity: 'error'
            })
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <GoBack />
            <Card elevation={3} sx={{ padding: 1, mt: 4 }}>
                <CardHeader
                    title="Remove Class"
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        textAlign: 'center',
                        paddingY: 2
                    }}
                />
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Select Class to Remove:
                            </Typography>
                            <Select
                                fullWidth
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            >
                                {classes.map((cls) => (
                                    <MenuItem key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={handleSubmit}
                            sx={{ fontWeight: 600, py: 1.5 }}
                        >
                            Remove Class
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}
