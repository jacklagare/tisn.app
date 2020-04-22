import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import { getUser } from '../../logic/api';
import { formatDate } from '../../logic/date-time';

import { useUser } from '../UserProvider/UserProvider';

import ErrorSnackbar from '../ErrorSnackbar/ErrorSnackbar';

import Style from '../Style/Style';

const User = ({ match }) => {
  const history = useHistory();
  const style = Style();
  const currentUser = useUser();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = match.params.userId;
  useEffect(() => {
    setError(null);
    getUser(userId)
      .then((data) => {
        if (data.errors) {
          const error = data.errors[0];
          setError(`${error.param} ${error.msg}`);
          setLoading(false);
        } else {
          setUser(data.user);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [userId]);

  const restrictedDisplay =
    currentUser && (currentUser._id === userId || currentUser.admin);

  return loading ? (
    <LinearProgress />
  ) : (
    <div className={style.root}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="h2">
            {currentUser && currentUser._id === userId
              ? 'My profile'
              : 'Profile'}
          </Typography>
        </Grid>
        {user && (
          <Grid item>
            <Card>
              <CardContent>
                <Avatar
                  className={style.avatar}
                  src={user.avatar}
                  alt={`${user.avatar}'s avatar`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                {restrictedDisplay && (
                  <Button
                    className={style.alignRight}
                    variant="outlined"
                    color="primary"
                    onClick={() => history.push(`/users/${userId}/edit`)}
                  >
                    Edit
                  </Button>
                )}
                <Typography variant="h5" component="h3">
                  {user.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {`Joined on ${formatDate(user.createdAt)}`}
                </Typography>
                <Typography gutterBottom variant="body1" color="textSecondary">
                  {`Updated on ${formatDate(user.updatedAt)}`}
                </Typography>
                {restrictedDisplay && (
                  <Fragment>
                    <Typography variant="body1">
                      {formatDate(user.dateOfBirth)}
                    </Typography>
                    <Typography gutterBottom variant="body1">
                      {user.email}
                    </Typography>
                  </Fragment>
                )}
                {user.interests.length > 0 && (
                  <Fragment>
                    <Typography variant="h6" component="h4">
                      Interests:
                    </Typography>
                    {user.interests.map((interest) => (
                      <Chip
                        className={style.chip}
                        variant="outlined"
                        key={interest._id}
                        avatar={
                          <Avatar src={interest.avatar} alt={interest.name} />
                        }
                        label={interest.name}
                      />
                    ))}
                  </Fragment>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      {error && <ErrorSnackbar error={error} />}
    </div>
  );
};

export default User;
