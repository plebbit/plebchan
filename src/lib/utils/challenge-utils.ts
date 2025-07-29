import { ChallengeVerification } from '@plebbit/plebbit-react-hooks';

export const alertChallengeVerificationFailed = (challengeVerification: ChallengeVerification, publication: any) => {
  if (challengeVerification?.challengeSuccess === false) {
    console.warn('Challenge Verification Failed:', challengeVerification, 'Publication:', publication);

    let errorMessages: string[] = [];
    if (challengeVerification?.challengeErrors) {
      if (
        typeof challengeVerification.challengeErrors === 'object' &&
        challengeVerification.challengeErrors !== null &&
        !Array.isArray(challengeVerification.challengeErrors)
      ) {
        // Handle challengeErrors as object (extract values and filter for strings)
        errorMessages = Object.values(challengeVerification.challengeErrors).filter((val): val is string => typeof val === 'string');
      } else if (Array.isArray(challengeVerification.challengeErrors)) {
        // Handle challengeErrors as array
        errorMessages = [...challengeVerification.challengeErrors];
      } else {
        console.warn('challengeVerification.challengeErrors is not an object or array:', challengeVerification.challengeErrors);
      }
    }

    if (challengeVerification?.reason) {
      errorMessages.push(challengeVerification.reason);
    }

    const finalMessage = errorMessages.filter(Boolean).join(' ');
    alert(`p/${publication?.subplebbitAddress} challenge error: ${finalMessage || 'unknown error'}`);
  } else {
    console.log(challengeVerification, publication);
  }
};

export const getPublicationType = (publication: any) => {
  if (!publication) {
    return;
  }
  if (typeof publication.vote === 'number') {
    return 'vote';
  }
  if (publication.parentCid) {
    return 'reply';
  }
  if (publication.commentCid) {
    return 'edit';
  }
  return 'post';
};

export const getVotePreview = (publication: any) => {
  if (typeof publication?.vote !== 'number') {
    return '';
  }
  let votePreview = '';
  if (publication.vote === -1) {
    votePreview += ' -1';
  } else {
    votePreview += ` +${publication.vote}`;
  }
  return votePreview;
};

export const getPublicationPreview = (publication: any) => {
  if (!publication) {
    return '';
  }
  let publicationPreview = '';
  if (publication.title) {
    publicationPreview += publication.title;
  }
  if (publication.content) {
    if (publicationPreview) {
      publicationPreview += ': ';
    }
    publicationPreview += publication.content;
  }
  if (!publicationPreview && publication.link) {
    publicationPreview += publication.link;
  }

  if (publicationPreview.length > 50) {
    publicationPreview = publicationPreview.substring(0, 50) + '...';
  }
  return publicationPreview;
};
