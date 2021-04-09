import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import Loading from 'components/Loading';
import Error from 'components/Error';
import { ApolloError, MutationFunctionOptions } from '@apollo/client';
import { ExecutionResult } from 'graphql';
import {
  Register as RegisterPayload,
  RegisterVariables,
} from 'schema/types/Register';

const RegisterForm = ({
  registerUser,
  loading,
  error,
}: {
  registerUser: (
    options?:
      | MutationFunctionOptions<RegisterPayload, RegisterVariables>
      | undefined,
  ) => Promise<ExecutionResult<RegisterPayload>>;
  loading: boolean;
  error: ApolloError | undefined;
}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === confirmPassword) {
      registerUser({
        variables: {
          input: {
            firstName,
            lastName,
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className="gutter" />
      <div className={styles.main}>
        {error && <Error error={error} />}
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={`form-group ${styles.formGroupCustom}`}>
              <label
                className={
                  firstName
                    ? `${styles.floatLabel}`
                    : `${styles.noLabel}`
                }
              >
                {' '}
                First Name:
              </label>
              <input
                type="text"
                value={firstName}
                placeholder="First Name"
                onChange={e => setFirstName(e.target.value)}
                className="form-control"
                required
                autoFocus
              />
            </div>
            <div className={`form-group ${styles.formGroupCustom}`}>
              <label
                className={
                  lastName
                    ? `${styles.floatLabel}`
                    : `${styles.noLabel}`
                }
              >
                {' '}
                Last Name:
              </label>
              <input
                type="text"
                value={lastName}
                placeholder="Last Name"
                onChange={e => setLastName(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className={`form-group ${styles.formGroupCustom}`}>
              <label
                className={
                  email ? `${styles.floatLabel}` : `${styles.noLabel}`
                }
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className={`form-group ${styles.formGroupCustom}`}>
              <label
                className={
                  password
                    ? `${styles.floatLabel}`
                    : `${styles.noLabel}`
                }
              >
                {' '}
                Password:
              </label>
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className={`form-group ${styles.formGroupCustom}`}>
              <label
                className={
                  confirmPassword
                    ? `${styles.floatLabel}`
                    : `${styles.noLabel}`
                }
              >
                Confirm Password:
              </label>
              <label
                style={{
                  opacity:
                    password &&
                    confirmPassword &&
                    password !== confirmPassword
                      ? 1
                      : 0,
                  color: 'red',
                }}
              >
                {' '}
                Password do not match
              </label>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={e => setConfirmPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mt-4"
            >
              Register
            </button>
            <br />
            Already have an account? <Link to="/">Login</Link>!
          </form>
        )}
      </div>
      <div className="gutter" />
    </div>
  );
};

export default RegisterForm;
