import GoBack from '@renderer/components/GoBack'
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
    Divider
} from '@mui/material'
import { Link } from 'react-router'

export default function StudentsClassesPage(): JSX.Element {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <GoBack />
            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                Classes & Students Info Page
            </Typography>

            {/* Manage Classes Section */}
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Manage Classes
                    </Typography>
                    <List>
                        <ListItemButton component={Link} to="/add-class">
                            <ListItemText primary="Add Class" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton component={Link} to="/edit-class">
                            <ListItemText primary="Edit Class" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton component={Link} to="/remove-class">
                            <ListItemText primary="Remove Class" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton component={Link} to="/view-class">
                            <ListItemText primary="View Classes" />
                        </ListItemButton>

                    </List>
                </CardContent>
            </Card>

            {/* Manage Students Section */}
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Manage Students
                    </Typography>
                    <List>
                        <ListItemButton component={Link} to="/view-students">
                            <ListItemText primary="View Students" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton component={Link} to="/assign-students">
                            <ListItemText primary="Assign Students to Classes" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton component={Link} to="/students/create">
                            <ListItemText primary="Create Students" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton component={Link} to="/students/delete">
                            <ListItemText primary="Delete Students" />
                        </ListItemButton>
                        <Divider />
                        <ListItemButton component={Link} to="/attendance-records">
                            <ListItemText primary="Filter Students by Group, College, Year" />
                        </ListItemButton>
                        <Divider />
                    </List>
                </CardContent>
            </Card>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Manage Records
                    </Typography>
                    <List>
                        <ListItemButton component={Link} to="/attendance-records">
                            <ListItemText primary="View Student Attendance Data" />
                        </ListItemButton>
                    </List>
                </CardContent>
            </Card>
        </Container>
    )
}
