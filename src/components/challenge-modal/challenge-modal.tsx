import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import { Challenge as ChallengeType } from '@plebbit/plebbit-react-hooks';
import { getPublicationType } from '../../lib/utils/challenge-utils';
import useChallenges from '../../hooks/use-challenges';
import styles from './challenge-modal.module.css';
import _ from 'lodash';

interface ChallengeProps {
  challenge: ChallengeType;
  closeModal: () => void;
}

const Challenge = ({ challenge, closeModal }: ChallengeProps) => {
  const { t } = useTranslation();

  const challenges = challenge?.[0]?.challenges;
  const publication = challenge?.[1];

  const publicationType = getPublicationType(publication);
  const { author, content, link, title } = publication || {};
  const { displayName } = author || {};

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const isTextChallenge = challenges[currentChallengeIndex].type === 'text/plain';
  const isImageChallenge = challenges[currentChallengeIndex].type === 'image/png';

  const onAnswersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentChallengeIndex] = e.target.value;
      return updatedAnswers;
    });
  };

  const onSubmit = () => {
    publication.publishChallengeAnswers(answers);
    setAnswers([]);
    closeModal();
  };

  const onEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    if (challenges[currentChallengeIndex + 1]) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      onSubmit();
    }
  };

  // react-draggable requires a ref to the modal node
  const nodeRef = useRef(null);

  return (
    <Draggable handle='.challengeHandle' nodeRef={nodeRef}>
      <div className={styles.container} ref={nodeRef}>
        <div className={`challengeHandle ${styles.title}`}>
          Challenge for {publicationType}
          <button className={styles.closeIcon} onClick={closeModal} title='close' />
        </div>
        <div className={styles.publication}>
          <div className={styles.name}>
            <input type='text' value={displayName || _.capitalize(t('anonymous'))} disabled />
          </div>
          {title && (
            <div className={styles.subject}>
              <input type='text' value={title} disabled />
            </div>
          )}
          {content && (
            <div className={styles.content}>
              <textarea value={content} disabled cols={48} rows={4} wrap='soft' />
            </div>
          )}
          {link && (
            <div className={styles.link}>
              <input type='text' value={link} disabled />
            </div>
          )}
          <div className={styles.challengeContainer}>
            <input
              className={styles.challengeAnswer}
              type='text'
              autoComplete='off'
              autoCorrect='off'
              spellCheck='false'
              placeholder='TYPE THE ANSWER HERE AND PRESS ENTER'
              onKeyDown={onEnterKey}
              onChange={onAnswersChange}
              value={answers[currentChallengeIndex] || ''}
              autoFocus
            />
            <div className={styles.challengeMediaWrapper}>
              {isTextChallenge && <div className={styles.challengeMedia}>{challenges[currentChallengeIndex]?.challenge}</div>}
              {isImageChallenge && (
                <img alt={t('loading')} className={styles.challengeMedia} src={`data:image/png;base64,${challenges[currentChallengeIndex]?.challenge}`} />
              )}
            </div>
          </div>
          <div className={styles.challengeFooter}>
            <div className={styles.counter}>{t('challenge_counter', { index: currentChallengeIndex + 1, total: challenges?.length })}</div>
            <span className={styles.buttons}>
              {!challenges[currentChallengeIndex + 1] && <button onClick={onSubmit}>{t('submit')}</button>}
              {challenges.length > 1 && (
                <button disabled={!challenges[currentChallengeIndex - 1]} onClick={() => setCurrentChallengeIndex((prev) => prev - 1)}>
                  {t('previous')}
                </button>
              )}
              {challenges[currentChallengeIndex + 1] && <button onClick={() => setCurrentChallengeIndex((prev) => prev + 1)}>{t('next')}</button>}
            </span>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

const ChallengeModal = () => {
  const { challenges, removeChallenge } = useChallenges();
  const isOpen = !!challenges.length;
  const closeModal = () => removeChallenge();

  return isOpen && <Challenge challenge={challenges[0]} closeModal={closeModal} />;
};

export default ChallengeModal;
