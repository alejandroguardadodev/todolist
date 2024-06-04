import React from 'react'
import { styled } from '@mui/system'

import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'

import IconButton from '@mui/material/IconButton'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import EditIcon from '@mui/icons-material/Edit'

import useResponsive from '../../../../hooks/useResponsive'

import { TableTaskType } from '../../../../models/Task'

import useModal from '../../../../hooks/useModal'

import ToDoTableSubMenu from '../../../menus/submenus/ToDoTableSubMenu'

const ToDoTableRow = styled(TableRow)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        '& th': {
            padding: '10px 0px 10px 10px !important',
            boxSize: 'borber-box'
        }
    }
}))

type HandleClickType = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => void;

interface ToDoRowType {
    isItemSelected: boolean;
    labelId: string;
    row: TableTaskType;
    handleClick: HandleClickType;
}

interface MousePositionType {
    x: number;
    y: number;
}

const ToDoRow = ({ isItemSelected, labelId, row, handleClick }:ToDoRowType) => {

    const [mousePosition, setMousePosition] = React.useState<null | MousePositionType>(null);

    const { isMobile, isDesktopVersion, isTabletOrMobile } = useResponsive()

    const { openModal } = useModal("taskmenu")

    const openSubMenu = React.useMemo(() => Boolean(mousePosition), [mousePosition])
    
    const handleSubMenuClose = () => { setMousePosition(null); };

    return (<>
        <ToDoTableRow
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
            sx={{ cursor: 'pointer' }}
            onDoubleClick={() => { openModal(row) }}
            onContextMenu={(event) => {
                event.preventDefault()
                
                if (!openSubMenu) {
                    setMousePosition({
                        x: event.clientX,
                        y: event.clientY,
                    })
                }
            }}
        >
            {!isMobile && (<TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{ 'aria-labelledby': labelId }}
                    onClick={(event) => handleClick(event, row.id)}
                />
            </TableCell>)}
            <TableCell component="th" id={labelId} scope="row" padding="none"> {row.title}</TableCell>
            { isDesktopVersion && (<>
                <TableCell sx={{ textTransform: 'capitalize' }} align="left" style={{ width: 300 }}>{row.project}</TableCell>
                <TableCell align="left" style={{ width: 160 }}>{row.due}</TableCell>
            </>) }
            
            <TableCell align="right" style={{ width: isMobile? 60 : 160 }}>
                <IconButton aria-label="edit" onClick={() => { openModal(row) }}><EditIcon /></IconButton>
                {!isMobile && (<>
                    <IconButton aria-label="complete"><PanoramaFishEyeIcon /></IconButton>
                    <IconButton aria-label="start"><StarBorderIcon /></IconButton>
                </>)}
            </TableCell>
            
        </ToDoTableRow>
        <ToDoTableSubMenu id={`sub-menu-${row.id}-${row.title}`} position={mousePosition} onClose={handleSubMenuClose} open={openSubMenu} task={row} />
    </>)
}

export default ToDoRow
