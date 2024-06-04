import { alpha } from '@mui/material/styles'
import { styled } from '@mui/system'
import React from 'react';

import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip';

import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton';

import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'

import Button from '@mui/material/Button'

import useResponsive from '../../../../hooks/useResponsive';

import useModal from '../../../../hooks/useModal';

const ToDoToolbar = styled(Toolbar)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: '0px !important',
    minHeight: '50px'
  }
}))

interface EnhancedTableToolbarProps {
    numSelected: number;
}

const EnhancedTableToolbar = ({numSelected}: EnhancedTableToolbarProps) => {

  const { openModal } = useModal("taskmenu")

    const { isMobile, isTabletOrMobile } = useResponsive()

    const BtnContents = React.useMemo(() => {
      if (isMobile) return null

      return numSelected > 0? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ):(
        <Button type='button' sx={{ boxShadow: 'none !important' }} variant='contained' size='large' p={2} onClick={() => {openModal()}}>Add Task</Button>
      )

    }, [isMobile, numSelected])

    return (
        <ToDoToolbar sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}>
        {numSelected > 0 ? (
            <Typography
                sx={{ flexGrow: 1 }}
                color="inherit"
                variant="h6"
                component="div"
                className='non-mouse-event'
            >
                {numSelected} selected
            </Typography>
          ) : (
            <Typography
              sx={{ flexGrow: 1 }}
              variant="h6"
              id="tableTitle"
              component="div"
              className='non-mouse-event'
            >
                All Tasks
            </Typography>
        )}
        {isTabletOrMobile && (
          <div style={{ marginRight: isMobile? '0px' : '10px' }}>
            <Tooltip title="filter">
              <IconButton>
                <FilterListIcon sx={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          </div>
        )}
        {BtnContents}
      </ToDoToolbar>
    );
}

export default EnhancedTableToolbar
