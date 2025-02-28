import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';

const { version } = packageJson;
const commitRef = process.env.REACT_APP_COMMIT_REF;
const isElectron = window.isElectron === true;

const Version = () => {
  const { t } = useTranslation();

  return (
    <>
      <a
        href={commitRef ? `https://github.com/plebbit/seedit/commit/${commitRef}` : `https://github.com/plebbit/seedit/releases/tag/v${version}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        v{commitRef ? '-dev' : version}
      </a>
      {isElectron && (
        <>
          {' '}
          -{' '}
          <a href='http://localhost:50019/webui/' target='_blank' rel='noreferrer'>
            {t('node_stats')}
          </a>
        </>
      )}
    </>
  );
};

export default Version;
