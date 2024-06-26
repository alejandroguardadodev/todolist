import React from 'react'
import { styled } from '@mui/system'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'

import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

import IconButton from '@mui/material/IconButton'

import Skeleton from '@mui/material/Skeleton'

import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import WorkIcon from '@mui/icons-material/Work'

import Divider from '@mui/material/Divider'

import Swal from 'sweetalert2'

import { ProjectType } from '../../models/Project'

import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

import useToast from '../../hooks/useToast'
import useModal from '../../hooks/useModal'
import useProjects from '../../hooks/useProjects'

import { ERR_TYPE_MESSAGE } from '../../types/errTypes'

const HeaderContainer = styled('header')(() => ({
    //background: 'red',
    width: '100%',
    padding: '10px 10px 15px 10px',
    boxSizing: 'border-box',
    borderBottom: '1px solid rgba(0,0,0,.2)'
}))

const IconProjectBox = styled(Box)(({ theme }) => ({
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '15px',
    borderRadius: '10px',
    background: theme.palette.primary.light,
}))

const CustomMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
      background: theme.palette.background.default,
      border: '1px solid rgba(0, 0, 0, .3)',
      boxShadow: '0px 0px 14px -8px rgba(0,0,0,0.66) !important',
      marginTop: '5px',
    }
}))

interface ProjectPagePropsType {
    project?: null | ProjectType;
    useproject?: boolean;
}

interface IDataErr {
    err_type: string;
}

const PageHeader = ({ project = null, useproject = false }: ProjectPagePropsType) => {

    const { isLoading } =  useAuth0()
    const navigate = useNavigate()

    const { openModal: openProjectModal } = useModal("projectModal")
    const { deleteProject } = useProjects()
    const { showErrorToast } = useToast()

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
    const openTaskGroupMenu = React.useMemo(() => Boolean(anchorElUser), [anchorElUser])
    const isProjectType = React.useMemo(() => Boolean(project), [project])

    const handleOpenTaskGroupMenu = (event: React.MouseEvent<HTMLElement>) => { setAnchorElUser(event.currentTarget) }    
    const handleCloseTaskGroupMenu = () => { setAnchorElUser(null) }

    const handleDeleteProject = () => {
        if (!isProjectType) return;

        Swal.fire({
            icon: "question",
            title: "Do you want to delete this project?",
            text: "All tasks related to this project will also be removed",
            showConfirmButton: false,
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: `Delete Project`
        }).then((result) => {
            if (result.isDenied) {
                if (project) {
                    deleteProject(project?.id, (status, data) => {
                        if (status) {
                            Swal.fire("Project Deleted", "", "success");
                            navigate("/")
                        } else {
                            const { err_type } = (data as IDataErr)

                            switch(err_type) {
                                case ERR_TYPE_MESSAGE:
                                    showErrorToast("There was an error!")
                                    break
                            }
                        }
                    })
                }
            }
        });
    }

    return (<>
        <HeaderContainer>
            <Stack flexDirection="row" justifyContent="flex-start" alignItems="center" gap={1}>
                {(isLoading || (useproject && !project))? (<>
                    <Skeleton variant="rounded" width={54} height={54} />
                    <Skeleton variant="rounded" width={200} height={24} />
                </>) : (<>
                    <IconProjectBox>
                        {isProjectType? (<WorkIcon sx={{ color: 'black' }} />) : (<FormatListNumberedIcon sx={{ color: 'black' }} />)}
                    </IconProjectBox>
                    <Typography variant='h4'> {isProjectType? project?.title : "My Tasks"}</Typography>
                    {isProjectType && (
                        <IconButton onClick={handleOpenTaskGroupMenu} disableRipple>
                            <AppRegistrationIcon sx={{ color: 'rgba(0,0,0,.8)' }} />
                        </IconButton>
                    )}
                </>)}
            </Stack>
        </HeaderContainer>

        <CustomMenu
            id="menu-task-group"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={openTaskGroupMenu}
            onClose={handleCloseTaskGroupMenu}
        >
            <MenuItem onClick={handleCloseTaskGroupMenu} onClickCapture={() => { openProjectModal(project) }}>
                <ListItemIcon>
                    <EditIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Edit Project</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseTaskGroupMenu} onClickCapture={handleDeleteProject}>
                <ListItemIcon>
                    <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Delete Project</Typography>
            </MenuItem>
        </CustomMenu>
    </>)
}

export default PageHeader