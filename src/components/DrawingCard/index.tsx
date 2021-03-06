import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
	Delete,
	Email,
	FavoriteBorder,
	Favorite,
	InsertComment,
	InsertCommentOutlined,
} from '@material-ui/icons';
import DrawingModal from '../DrawingModal';
import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from '../../services/firebase';
import deleteDrawing from '../../services/deleteDrawing';
import updateLikes from '../../services/updateLikes';
import getLikes from '../../services/getLikes';
import getLikesCount from '../../services/getLikesCount';
import {
	Collapse,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	Avatar,
	IconButton,
} from '@material-ui/core';
import CommentForm from '../CommentForm';
import CommentsList from '../CommentsList';
import getCommentsCount from '../../services/getCommentsCount';
import ActionModal from '../ActionModal';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 345,
			backgroundColor: 'var(--shape-hover)',
			margin: '11px',

			'@media (max-width: 767px)': {
				width: 310,
			},
		},
		media: {
			height: 0,
			paddingTop: '56.25%',
		},
		rightIcons: {
			marginLeft: 'auto',
		},

		createdBy: {
			fontSize: '13px',
		},

		body: {
			height: 100,
		},
	})
);

interface DrawingCardProps {
	title: string;
	author: string;
	imageUrl: string;
	email: string;
	createdAt: firebase.firestore.Timestamp;
	photoUrl: string;
	docId: string;
	editMode: boolean;
}

const DrawingCard: React.FC<DrawingCardProps> = ({
	title,
	author,
	createdAt,
	email,
	imageUrl,
	photoUrl,
	docId,
	editMode,
}) => {
	const classes = useStyles();
	const [user] = useAuthState(getAuth());
	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [commentsCount, setCommentsCount] = useState(0);
	const [showComments, setShowComments] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		async function initialLikeState() {
			setLiked(await getLikes(user?.uid, docId));
		}

		async function initialLikesCount() {
			setLikesCount(await getLikesCount(docId));
		}

		async function initialCommentsCount() {
			setCommentsCount(await getCommentsCount(docId));
		}

		initialLikeState();
		initialLikesCount();
		initialCommentsCount();
	});

	const handleShowComments = () => {
		if (commentsCount > 0 || user) {
			setShowComments(!showComments);
		}
	};

	const handleDelete = async () => {
		await deleteDrawing(docId);
		window.location.reload();
	};

	const handleLikes = async () => {
		setLiked(await updateLikes(user?.uid, docId));
	};

	return (
		<>
			{showDeleteModal && (
				<ActionModal
					onConfirm={handleDelete}
					onDismiss={() => setShowDeleteModal(false)}
					currentState={showDeleteModal}
					description={'Are you sure you want to delete this post?'}
					title={'Delete Post'}
				/>
			)}

			<Card className={classes.root}>
				<CardHeader
					avatar={<Avatar src={photoUrl} aria-label="user photo" />}
					action={
						editMode && (
							<IconButton
								aria-label="delete"
								onClick={() => setShowDeleteModal(true)}
							>
								<Delete />
							</IconButton>
						)
					}
					title={title}
					subheader={new Date(createdAt.toDate()).toLocaleDateString()}
				/>
				<CardMedia className={classes.media} image={imageUrl} title={title} />

				<CardContent className={classes.createdBy}>
					Created by: {author}
				</CardContent>
				<CardActions disableSpacing>
					<IconButton aria-label="add to favorites" onClick={handleLikes}>
						{liked ? <Favorite /> : <FavoriteBorder />}
					</IconButton>
					{likesCount}
					<IconButton
						aria-label="show comments"
						aria-expanded={showComments}
						onClick={handleShowComments}
					>
						{showComments ? <InsertComment /> : <InsertCommentOutlined />}
					</IconButton>
					{commentsCount}
					<div className={classes.rightIcons}>
						<IconButton
							aria-label="send email"
							onClick={() => window.open('mailto:' + email, '_blank')}
						>
							<Email />
						</IconButton>
						<IconButton aria-label="full screen">
							<DrawingModal imageUrl={imageUrl} />
						</IconButton>
					</div>
				</CardActions>
				<Collapse in={showComments} timeout="auto" unmountOnExit>
					<CardContent>
						<CommentsList docId={docId} />
						{user && <CommentForm docId={docId} />}
					</CardContent>
				</Collapse>
			</Card>
		</>
	);
};

export default DrawingCard;
