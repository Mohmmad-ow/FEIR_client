import { useState } from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Tooltip,
    Divider,
    Button
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { useAuth } from '../../context/AuthContextProvider'

export default function Navbar(): JSX.Element {
    const { logout, user } = useAuth()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const autherzation = user?.isAdmin ? 'Admin' : 'User'

    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" noWrap component="div">
                    Attendance Dashboard
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1" sx={{ display: { xs: 'none', md: 'block' } }}>
                        {user?.username} | {autherzation}
                    </Typography>

                    <Tooltip title="Account actions">
                        <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
                            <Avatar alt={user?.username} src="/default-avatar.png" />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 4,
                            sx: {
                                overflow: 'visible',
                                mt: 1.5,
                                minWidth: 180,
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={() => { window.location.href = '/settings' }}>
                            <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={() => { alert('Switch logic placeholder') }}>
                            <SwapHorizIcon fontSize="small" sx={{ mr: 1 }} />
                            Switch
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { logout() }}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
