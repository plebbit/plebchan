import useGeneralStore from '../hooks/stores/useGeneralStore';

const handleStyleChange = (event) => {
  const { setBodyStyle, setSelectedStyle } = useGeneralStore.getState();

  switch (event.target.value) {
    case 'Yotsuba':
      const yotsubaBodyStyle = {
        background: '#ffe url(assets/fade.png) top repeat-x',
        color: 'maroon',
        fontFamily: 'Arial, Helvetica, sans-serif',
      };
      setBodyStyle(yotsubaBodyStyle);
      setSelectedStyle('Yotsuba');
      localStorage.setItem('selectedStyle', 'Yotsuba');
      localStorage.setItem('bodyStyle', JSON.stringify(yotsubaBodyStyle));
      break;

    case 'Yotsuba-B':
      const yotsubaBBodyStyle = {
        background: '#eef2ff url(assets/fade-blue.png) top center repeat-x',
        color: '#000',
        fontFamily: 'Arial, Helvetica, sans-serif',
      };
      setBodyStyle(yotsubaBBodyStyle);
      setSelectedStyle('Yotsuba-B');
      localStorage.setItem('selectedStyle', 'Yotsuba-B');
      localStorage.setItem('bodyStyle', JSON.stringify(yotsubaBBodyStyle));
      break;

    case 'Futaba':
      const futabaBodyStyle = {
        background: '#ffe',
        color: 'maroon',
        fontFamily: 'times new roman, serif',
      };
      setBodyStyle(futabaBodyStyle);
      setSelectedStyle('Futaba');
      localStorage.setItem('selectedStyle', 'Futaba');
      localStorage.setItem('bodyStyle', JSON.stringify(futabaBodyStyle));
      break;

    case 'Burichan':
      const burichanBodyStyle = {
        background: '#eef2ff',
        color: '#000',
        fontFamily: 'times new roman, serif',
      };
      setBodyStyle(burichanBodyStyle);
      setSelectedStyle('Burichan');
      localStorage.setItem('selectedStyle', 'Burichan');
      localStorage.setItem('bodyStyle', JSON.stringify(burichanBodyStyle));
      break;

    case 'Tomorrow':
      const tomorrowBodyStyle = {
        background: '#1d1f21 none',
        color: '#c5c8c6',
        fontFamily: 'Arial, Helvetica, sans-serif',
      };
      setBodyStyle(tomorrowBodyStyle);
      setSelectedStyle('Tomorrow');
      localStorage.setItem('selectedStyle', 'Tomorrow');
      localStorage.setItem('bodyStyle', JSON.stringify(tomorrowBodyStyle));
      break;

    case 'Photon':
      const photonBodyStyle = {
        background: '#eee none',
        color: '#333',
        fontFamily: 'Arial, Helvetica, sans-serif',
      };
      setBodyStyle(photonBodyStyle);
      setSelectedStyle('Photon');
      localStorage.setItem('selectedStyle', 'Photon');
      localStorage.setItem('bodyStyle', JSON.stringify(photonBodyStyle));
      break;

    default:
      const defaultBodyStyle = {
        background: '#ffe url(assets/fade.png) top repeat-x',
        color: 'maroon',
        fontFamily: 'Arial, Helvetica, sans-serif',
      };
      setBodyStyle(defaultBodyStyle);
      setSelectedStyle('Yotsuba');
      localStorage.setItem('selectedStyle', 'Yotsuba');
      localStorage.setItem('bodyStyle', JSON.stringify(defaultBodyStyle));
  }
};

export default handleStyleChange;
