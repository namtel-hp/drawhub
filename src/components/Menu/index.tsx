import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ArrowDropDown } from '@material-ui/icons';
import { MenuTrigger } from './styles';
import { signOut } from '../../services/firebase';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			'@media (max-width: 767px)': {
				marginTop: '20px',
			},
		},
		paper: {
			marginRight: theme.spacing(2),
		},
	})
);

interface MenuProps {
	photoURL: string;
}

const Menu: React.FC<MenuProps> = ({ photoURL }) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef<HTMLButtonElement>(null);
	const history = useHistory();

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event: React.MouseEvent<EventTarget>) => {
		if (
			anchorRef.current &&
			anchorRef.current.contains(event.target as HTMLElement)
		) {
			return;
		}

		setOpen(false);
	};

	const logout = (event: React.MouseEvent<EventTarget>) => {
		signOut();
		handleClose(event);
	};

	const navigateToSourceCode = (event: React.MouseEvent<EventTarget>) => {
		window.open('https://github.com/marco-amorim/drawhub', '_blank');
		handleClose(event);
	};

	const navigateToPostCreation = (event: React.MouseEvent<EventTarget>) => {
		history.push('/post/new');
		handleClose(event);
	};

	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}

	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current!.focus();
		}

		prevOpen.current = open;
	}, [open]);

	return (
		<div className={classes.root}>
			<div>
				<MenuTrigger
					disableRipple
					ref={anchorRef}
					aria-controls={open ? 'menu-list-grow' : undefined}
					aria-haspopup="true"
					onClick={handleToggle}
				>
					<img src={photoURL} alt="Menu" />
					<ArrowDropDown />
				</MenuTrigger>
				<Popper
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					transition
					disablePortal
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === 'bottom' ? 'center top' : 'center bottom',
							}}
						>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList
										autoFocusItem={open}
										id="menu-list-grow"
										onKeyDown={handleListKeyDown}
									>
										<MenuItem
											onClick={(event) => navigateToPostCreation(event)}
										>
											New Post
										</MenuItem>
										<MenuItem onClick={handleClose}>My Posts</MenuItem>
										<MenuItem onClick={(event) => navigateToSourceCode(event)}>
											Source Code
										</MenuItem>
										<MenuItem onClick={(event) => logout(event)}>
											Logout
										</MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		</div>
	);
};

export default Menu;
