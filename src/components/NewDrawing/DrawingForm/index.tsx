import React from 'react';
import * as Yup from 'yup';
import { FormikValues, Formik } from 'formik';

import { MuiButton, FormikInput, FormikForm, LoadingContainer } from './styles';
import { useHistory } from 'react-router-dom';
import createDrawing from '../../../services/createDrawing';
import { getAuth } from '../../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CircularProgress } from '@material-ui/core';

interface FormValues {
	title: string;
	author: string;
	imageUrl: string;
	email: string;
}

const initialValues: FormValues = {
	title: '',
	author: '',
	imageUrl: '',
	email: '',
};

const CreateDrawingSchema = Yup.object().shape({
	title: Yup.string().required('This field is required'),
	author: Yup.string().required('This field is required'),
	imageUrl: Yup.string()
		.url('Invalid URL format')
		.required('This field is required'),
	email: Yup.string()
		.email('Invalid e-mail format')
		.required('This field is required'),
});

const DrawingForm: React.FC = () => {
	const history = useHistory();

	const [user, loading] = useAuthState(getAuth());

	const handleSubmit = (values: FormikValues) => {
		const { uid, photoURL } = user;
		const formValues = { ...values, uid, photoURL };
		createDrawing(formValues);

		history.push('/');
	};

	const renderForm = () => {
		return (
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validationSchema={CreateDrawingSchema}
			>
				{({ dirty, isValid }) => {
					return (
						<FormikForm>
							<FormikInput name="title" label="Title" required />
							<FormikInput name="author" label="Author" required />
							<FormikInput name="imageUrl" label="Image URL" required />
							<FormikInput name="email" label="E-mail" required />
							<MuiButton
								disabled={!dirty || !isValid}
								type="submit"
								disableRipple
							>
								Submit
							</MuiButton>
						</FormikForm>
					);
				}}
			</Formik>
		);
	};

	const renderLoadingComponent = () => {
		return (
			<LoadingContainer>
				<CircularProgress
					style={{
						color: '#04d361',
						textAlign: 'center',
						height: '80px',
						width: '80px',
					}}
				/>
			</LoadingContainer>
		);
	};

	return (
		<React.Fragment>
			{user && <h3>Create your post</h3>}
			{!user && !loading && <h3>You need to be logged in for this :/</h3>}
			{!loading && user && renderForm()}
			{loading && renderLoadingComponent()}
		</React.Fragment>
	);
};

export default DrawingForm;
