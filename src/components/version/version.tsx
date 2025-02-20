import { useTranslation } from 'react-i18next';
import packageJson from '../../../package.json';

const { version } = packageJson;
const commitRef = process.env.REACT_APP_COMMIT_REF;
const isElectron = window.isElectron === true;

const getBetaVersion = (version: string) => {
  const parts = version.split('.');
  parts[parts.length - 1] = (parseInt(parts[parts.length - 1]) + 1).toString();
  return parts.join('.') + '-beta';
};

const Version = () => {
  const { t } = useTranslation();

  return (
    <>
      <a
        href={commitRef ? `https://github.com/plebbit/seedit/commit/${commitRef}` : `https://github.com/plebbit/seedit/releases/tag/v${version}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        v{commitRef ? getBetaVersion(version) : version}
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
