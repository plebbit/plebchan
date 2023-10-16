const Embed = ({ url }) => {
  const parsedUrl = new URL(url);

  if (youtubeHosts.has(parsedUrl.host)) {
    return <YoutubeEmbed parsedUrl={parsedUrl} />;
  }
  if (twitterHosts.has(parsedUrl.host)) {
    return <TwitterEmbed parsedUrl={parsedUrl} />;
  }
  if (redditHosts.has(parsedUrl.host)) {
    return <RedditEmbed parsedUrl={parsedUrl} />;
  }
  if (twitchHosts.has(parsedUrl.host)) {
    return <TwitchEmbed parsedUrl={parsedUrl} />;
  }
  if (tiktokHosts.has(parsedUrl.host)) {
    return <TiktokEmbed parsedUrl={parsedUrl} />;
  }
  if (instagramHosts.has(parsedUrl.host)) {
    return <InstagramEmbed parsedUrl={parsedUrl} />;
  }
  if (odyseeHosts.has(parsedUrl.host)) {
    return <OdyseeEmbed parsedUrl={parsedUrl} />;
  }
  if (bitchuteHosts.has(parsedUrl.host)) {
    return <BitchuteEmbed parsedUrl={parsedUrl} />;
  }
  if (streamableHosts.has(parsedUrl.host)) {
    return <StreamableEmbed parsedUrl={parsedUrl} />;
  }
  if (spotifyHosts.has(parsedUrl.host)) {
    return <SpotifyEmbed parsedUrl={parsedUrl} />;
  }
};

const youtubeHosts = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be']);

const YoutubeEmbed = ({ parsedUrl }) => {
  let youtubeId;
  if (parsedUrl.host.endsWith('youtu.be')) {
    youtubeId = parsedUrl.pathname.replaceAll('/', '');
  } else {
    youtubeId = parsedUrl.searchParams.get('v');
  }
  return (
    <iframe
      className='enlarged youtube-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowfullscreen
      title={parsedUrl.href}
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
    />
  );
};

const twitterHosts = new Set(['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com']);

const TwitterEmbed = ({ parsedUrl }) => {
  return (
    <iframe
      className='enlarged twitter-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      title={parsedUrl.href}
      srcdoc={`
      <blockquote class="twitter-tweet" data-theme="dark">
        <a href="${parsedUrl.href.replace('x.com', 'twitter.com')}"></a>
      </blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    `}
    />
  );
};

const redditHosts = new Set(['reddit.com', 'www.reddit.com', 'old.reddit.com']);

const RedditEmbed = ({ parsedUrl }) => {
  return (
    <iframe
      className='enlarged reddit-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      title={parsedUrl.href}
      srcdoc={`
      <style>
        /* fix reddit iframe being centered */
        iframe {
          margin: 0!important;
        }
      </style>
      <blockquote class="reddit-embed-bq" style="height:240px" data-embed-theme="dark">
        <a href="${parsedUrl.href}"></a>    
      </blockquote>
      <script async src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>
    `}
    />
  );
};

const twitchHosts = new Set(['twitch.tv', 'www.twitch.tv']);

const TwitchEmbed = ({ parsedUrl }) => {
  let iframeUrl;
  if (parsedUrl.pathname.startsWith('/videos/')) {
    const videoId = parsedUrl.pathname.replace('/videos/', '');
    iframeUrl = `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`;
  } else {
    const channel = parsedUrl.pathname.replaceAll('/', '');
    iframeUrl = `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`;
  }
  return (
    <iframe
      className='enlarged twitch-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowfullscreen
      title={parsedUrl.href}
      src={iframeUrl}
    />
  );
};

const tiktokHosts = new Set(['tiktok.com', 'www.tiktok.com']);

const TiktokEmbed = ({ parsedUrl }) => {
  const videoId = parsedUrl.pathname.replace(/.+\/video\//, '').replaceAll('/', '');
  return (
    <iframe
      className='enlarged tiktok-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      title={parsedUrl.href}
      srcdoc={`
      <blockquote class="tiktok-embed" data-video-id="${videoId}">
        <a></a>
      </blockquote> 
      <script async src="https://www.tiktok.com/embed.js"></script>
    `}
    />
  );
};

const instagramHosts = new Set(['instagram.com', 'www.instagram.com']);

const InstagramEmbed = ({ parsedUrl }) => {
  const pathNames = parsedUrl.pathname.replace(/\/+$/, '').split('/');
  const id = pathNames[pathNames.length - 1];
  return (
    <iframe
      className='enlarged instagram-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      title={parsedUrl.href}
      srcdoc={`
      <blockquote class="instagram-media">
        <a href="https://www.instagram.com/p/${id}/"></a>
      </blockquote>
      <script async src="//www.instagram.com/embed.js"></script>
    `}
    />
  );
};

const odyseeHosts = new Set(['odysee.com', 'www.odysee.com']);

const OdyseeEmbed = ({ parsedUrl }) => {
  const iframeUrl = `https://odysee.com/$/embed${parsedUrl.pathname}`;
  return (
    <iframe
      className='enlarged odysee-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowfullscreen
      title={parsedUrl.href}
      src={iframeUrl}
    />
  );
};

const bitchuteHosts = new Set(['bitchute.com', 'www.bitchute.com']);

const BitchuteEmbed = ({ parsedUrl }) => {
  const videoId = parsedUrl.pathname.replace(/\/video\//, '').replaceAll('/', '');
  return (
    <iframe
      className='enlarged bitchute-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowfullscreen
      title={parsedUrl.href}
      src={`https://www.bitchute.com/embed/${videoId}/`}
    />
  );
};

const streamableHosts = new Set(['streamable.com', 'www.streamable.com']);

const StreamableEmbed = ({ parsedUrl }) => {
  const videoId = parsedUrl.pathname.replaceAll('/', '');
  return (
    <iframe
      className='enlarged streamable-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowfullscreen
      title={parsedUrl.href}
      src={`https://streamable.com/e/${videoId}`}
    />
  );
};

const spotifyHosts = new Set(['spotify.com', 'www.spotify.com', 'open.spotify.com']);

const SpotifyEmbed = ({ parsedUrl }) => {
  const iframeUrl = `https://open.spotify.com/embed${parsedUrl.pathname}?theme=0`;
  return (
    <iframe
      className='enlarged spotify-embed'
      height='100%'
      width='100%'
      frameborder='0'
      credentialless
      referrerpolicy='no-referrer'
      allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowfullscreen
      title={parsedUrl.href}
      src={iframeUrl}
    />
  );
};

const canEmbedHosts = new Set([
  ...youtubeHosts,
  ...twitterHosts,
  ...redditHosts,
  ...twitchHosts,
  ...tiktokHosts,
  ...instagramHosts,
  ...odyseeHosts,
  ...bitchuteHosts,
  ...streamableHosts,
  ...spotifyHosts,
]);

export const canEmbed = (parsedUrl) => canEmbedHosts.has(parsedUrl.host);

export default Embed;
