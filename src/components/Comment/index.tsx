import {
	ListItem,
	Avatar,
	ListItemAvatar,
	ListItemText,
	ListItemIcon,
	IconButton,
	makeStyles,
	Theme,
	createStyles,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import deleteComment from '../../services/deleteComment';
import { getAuth } from '../../services/firebase';
import ActionModal from '../ActionModal';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			maxWidth: '36ch',
			color: 'var(--white)',
		},

		date: {
			fontSize: '0.75rem',
			justifyContent: 'flex-start',
		},
	})
);

interface CommentProps {
	comment: any;
	docId: string;
}

const Comment: React.FC<CommentProps> = ({ comment, docId }) => {
	const classes = useStyles();
	const { createdAt, photoURL, displayName, text, uid } = comment;
	const [user] = useAuthState(getAuth());
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleDelete = async () => {
		await deleteComment(comment, docId);
	};

	return (
		<>
			{showDeleteModal && (
				<ActionModal
					onConfirm={handleDelete}
					onDismiss={() => setShowDeleteModal(false)}
					currentState={showDeleteModal}
					description={'Are you sure you want to delete this comment?'}
					title={'Delete Comment'}
				/>
			)}
			<ListItem className={classes.date}>
				{new Date(createdAt.toDate()).toLocaleDateString()}
			</ListItem>
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar alt="profile" src={photoURL} />
				</ListItemAvatar>
				<ListItemText primary={displayName} secondary={text} />
				{user?.uid === uid && (
					<ListItemIcon>
						<IconButton onClick={() => setShowDeleteModal(true)}>
							<Delete />
						</IconButton>
					</ListItemIcon>
				)}
			</ListItem>
		</>
	);
};

export default Comment;
