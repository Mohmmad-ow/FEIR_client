import GoBack from '@renderer/components/GoBack'
import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    Grid
} from '@mui/material'
import { useAuth } from '../../context/AuthContextProvider'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


interface AttendanceStudent {
    id: number
    isPresent: boolean
    hours: number
    name: string
}

interface AttendanceRecord {
    record_id: number
    date_created: string
    class: {
        id: number
        name: string
        department: string
        college: string
        year: number
    }
    class_id: number
    user_id: number
    total_students: number
    attended_students: number
    students: AttendanceStudent[]
    attendance_percentage: number
}

export default function AttendanceRecords(): JSX.Element {
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)

    const [searchTerm, setSearchTerm] = useState('')
    const [date, setDate] = useState('')
    const [college, setCollege] = useState('')
    const [department, setDepartment] = useState('')
    const [year, setYear] = useState('')
    const [advancedSearch, setAdvancedSearch] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch('http://localhost:8000/records/summary', {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`
                    }
                })
                const data = await res.json()
                setRecords(data)
            } catch (error) {
                console.error('Error fetching records:', error)
            }
        }
        fetchRecords()
    }, [])

    useEffect(() => {
        const filtered = records.filter((record) => {
            const matchesSearch = record.class?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
            const matchesDate = date ? record.date_created.startsWith(date) : true
            const matchesCollege = college
                ? record.class?.college?.toLowerCase().includes(college.toLowerCase())
                : true
            const matchesDept = department
                ? record.class?.department?.toLowerCase().includes(department.toLowerCase())
                : true
            const matchesYear = year ? record.class?.year.toString() === year : true
            return matchesSearch && matchesDate && matchesCollege && matchesDept && matchesYear
        })
        setFilteredRecords(filtered)
    }, [records, searchTerm, date, college, department, year])

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredRecords.map((r) => ({
                Class: r.class.name,
                Date: r.date_created,
                Attendance: `${r.attendance_percentage.toFixed(2)}%`
            }))
        )
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, worksheet, 'Attendance Records')
        XLSX.writeFile(wb, 'attendance_records.xlsx')
    }

    const exportToPDF = () => {
        const doc = new jsPDF()
        doc.text('Attendance Records', 14, 16)
        const tableData = filteredRecords.map((r) => [
            r.class.name,
            new Date(r.date_created).toLocaleDateString(),
            `${r.attendance_percentage.toFixed(2)}%`
        ])
        autoTable(doc, {
            head: [['Class', 'Date', 'Attendance']],
            body: tableData,
            startY: 20,})
        
        doc.save(`attendance_records-${Date.now()}.pdf`)
    }

    return (
        <Box p={4} bgcolor="#f4f6f8" minHeight="100vh">
            <GoBack />
            <Typography variant="h4" align="center" gutterBottom color="primary">
                Attendance Records
            </Typography>

            <Grid container spacing={2} justifyContent="center" mb={2}>
                <Grid item>
                    <TextField
                        label="Search class"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid item>
                    <TextField
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        size="small"
                    />
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => setAdvancedSearch(!advancedSearch)}>
                        Advanced Search
                    </Button>
                </Grid>
            </Grid>

            <Collapse in={advancedSearch}>
                <Grid container spacing={2} justifyContent="center" mb={3}>
                    <Grid item>
                        <TextField
                            label="College"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </Collapse>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                            <TableCell>Class</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Attendance %</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.length ? (
                            filteredRecords.map((record, idx) => (
                                <TableRow
                                    key={idx}
                                    hover
                                    onClick={() => setSelectedRecord(record)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{record.class.name}</TableCell>
                                    <TableCell>
                                        {new Date(record.date_created).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {record.attendance_percentage.toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={3} display="flex" gap={2} justifyContent="center">
                <Button variant="contained" color="primary" onClick={exportToExcel}>
                    Export to Excel
                </Button>
                <Button variant="contained" color="secondary" onClick={exportToPDF}>
                    Export to PDF
                </Button>
            </Box>

            <Typography variant="h5" align="center" mt={6} color="primary">
                Attendance Insights
            </Typography>
            <Box mt={2}>
                {selectedRecord ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                    <TableCell>Student Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Hours Attended</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedRecord.students.map((student, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            {student.isPresent ? 'Present' : 'Absent'}
                                        </TableCell>
                                        <TableCell>{student.hours}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Paper sx={{ padding: 2, textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            Attendance insights will be displayed here.
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    )
}
