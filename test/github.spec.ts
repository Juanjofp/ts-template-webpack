import { getOctokit } from '@actions/github';

describe('github', () => {
  it('should be tested', async () => {
    const octokit = getOctokit(
      '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'
    );

    const { data: pullRequest } = await octokit.rest.pulls.listReviews({
      owner: 'facebook',
      repo: 'react',
      pull_number: 26446,
      mediaType: {
        format: 'json'
      }
    });

    const totalComments = pullRequest.length;

    type UserReviews = { user: string; comments: number };

    const users = pullRequest.reduce((users, review) => {
      const userName = review.user?.login;

      if (!userName) return users;

      const user = users.find(user => user.user === userName);
      if (user) {
        user.comments += 1;

        return users;
      }

      return [...users, { user: userName, comments: 1 }];
    }, [] as UserReviews[]);

    const dates = pullRequest.map(review => review.submitted_at);

    const initialDate = new Date(dates[0] || 0);

    const finalDate = new Date(dates[dates.length - 1] || 0);

    const diffTime = Math.abs(finalDate.getTime() - initialDate.getTime());

    console.log('Comments:', totalComments, 'Time discussion:', convertMsToTime(diffTime), 'Users:', users);
  });
});

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(days)} days ${padTo2Digits(hours)} hours, ${padTo2Digits(minutes)} minutes}`;
}
