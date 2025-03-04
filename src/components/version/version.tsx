import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';

const { version } = packageJson;
const commitRef = process.env.VITE_COMMIT_REF;
const isElectron = window.isElectron === true;

const Version = () => {
  const { t } = useTranslation();

  return (
    <>
      <a
        href={commitRef ? `https://github.com/plebbit/plebchan/commit/${commitRef}` : `https://github.com/plebbit/plebchan/releases/tag/v${version}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        plebchan v{commitRef ? `${version}-dev (#${commitRef.slice(0, 7)})` : version}
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
