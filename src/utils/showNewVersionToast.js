export const showNewVersionToast = async (setNewInfoMessage, isElectron, packageJson, commitRef) => {
  try {
    const packageRes = await fetch('https://raw.githubusercontent.com/plebbit/plebchan/master/package.json', { cache: 'no-cache' });
    const packageData = await packageRes.json();

    if (packageJson.version !== packageData.version) {
      const newVersionInfo = isElectron
        ? `New version available, plebchan v${packageData.version}. You are using v${packageJson.version}. Download the latest version here: https://github.com/plebbit/plebchan/releases/latest`
        : `New version available, plebchan v${packageData.version}. You are using v${packageJson.version}. Refresh to update.`;
      setNewInfoMessage(newVersionInfo);
    }

    if (commitRef.length > 0) {
      const commitRes = await fetch('https://api.github.com/repos/plebbit/plebchan/commits?per_page=1&sha=development', { cache: 'no-cache' });
      const commitData = await commitRes.json();

      const latestCommitHash = commitData[0].sha;

      if (latestCommitHash.trim() !== commitRef.trim()) {
        const newVersionInfo = `New dev version available, commit ${latestCommitHash.slice(0, 7)}. You are using commit ${commitRef.slice(0, 7)}. Refresh to update.`;
        setNewInfoMessage(newVersionInfo);
      }
    }
  } catch (error) {
    console.error('Failed to fetch latest version info:', error);
  }
};

export default showNewVersionToast;
