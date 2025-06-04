import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Challenge as ChallengeType } from '@plebbit/plebbit-react-hooks';
import { getPublicationType } from '../../lib/utils/challenge-utils';
import useIsMobile from '../../hooks/use-is-mobile';
import useChallengesStore from '../../stores/use-challenges-store';
import styles from './challenge-modal.module.css';
import _ from 'lodash';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

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
    if (!answers[currentChallengeIndex]) return;
    if (challenges[currentChallengeIndex + 1]) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      onSubmit();
    }
  };

  useEffect(() => {
    const onEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', onEscapeKey);
    return () => document.removeEventListener('keydown', onEscapeKey);
  }, [closeModal]);

  const nodeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const [{ x, y }, api] = useSpring(() => ({
    x: window.innerWidth / 2 - 150,
    y: window.innerHeight / 2 - 200,
  }));

  const bind = useDrag(
    ({ active, event, offset: [ox, oy] }) => {
      if (active) {
        event.preventDefault();
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
      } else {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
      }
      api.start({ x: ox, y: oy, immediate: true });
    },
    {
      from: () => [x.get(), y.get()],
      filterTaps: true,
      bounds: undefined,
    },
  );

  const modalContent = (
    <animated.div
      className={styles.container}
      ref={nodeRef}
      style={{
        x: isMobile ? window.innerWidth / 2 - 150 : x,
        y: isMobile ? window.innerHeight / 2 - 200 : y,
        touchAction: 'none',
      }}
    >
      <div className={`challengeHandle ${styles.title}`} {...(!isMobile ? bind() : {})}>
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
            {isImageChallenge && <img alt='' className={styles.challengeMedia} src={`data:image/png;base64,${challenges[currentChallengeIndex]?.challenge}`} />}
          </div>
        </div>
        <div className={styles.challengeFooter}>
          <div className={styles.counter}>{t('challenge_counter', { index: currentChallengeIndex + 1, total: challenges?.length })}</div>
          <span className={styles.buttons}>
            {!challenges[currentChallengeIndex + 1] && (
              <button onClick={onSubmit} disabled={!answers[currentChallengeIndex]}>
                {t('submit')}
              </button>
            )}
            {challenges.length > 1 && (
              <button disabled={!challenges[currentChallengeIndex - 1]} onClick={() => setCurrentChallengeIndex((prev) => prev - 1)}>
                {t('previous')}
              </button>
            )}
            {challenges[currentChallengeIndex + 1] && <button onClick={() => setCurrentChallengeIndex((prev) => prev + 1)}>{t('next')}</button>}
          </span>
        </div>
      </div>
    </animated.div>
  );

  return modalContent;
};

const ChallengeModal = () => {
  const { challenges, removeChallenge } = useChallengesStore();
  const isOpen = !!challenges.length;
  const closeModal = () => removeChallenge();

  return isOpen && <Challenge challenge={challenges[0]} closeModal={closeModal} />;
};

export default ChallengeModal;
