import React from 'react';
import DrawingCard from '../../components/DrawingCard';
import { DrawingsContainer } from '../../assets/styles/DrawingsContainer';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from '../../services/firebase';

const UserDrawings = () => {
	const firestore = firebase.firestore();
	const postsRef = firestore.collection('posts');
	const query = postsRef.orderBy('createdAt');
	const [posts] = useCollectionDataOnce(query, { idField: 'id' });
	const [user] = useAuthState(getAuth());

	return (
		<React.Fragment>
			<h3>Your Drawings</h3>
			<DrawingsContainer>
				{user &&
					posts?.reverse().map((post: any, index) => {
						if (user.uid === post.uid) {
							return (
								<li key={index}>
									<DrawingCard
										title={post.title}
										author={post.author}
										createdAt={post.createdAt}
										email={post.email}
										imageUrl={post.imageUrl}
										photoUrl={post.photoURL}
										docId={post.id}
										editMode={true}
									/>
								</li>
							);
						}
						return null;
					})}
			</DrawingsContainer>
		</React.Fragment>
	);
};

export default UserDrawings;
