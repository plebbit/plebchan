import { HashLink } from 'react-router-hash-link';
import { Footer, HomeLogo } from '../home';
import styles from './faq.module.css';

const FAQ = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <HomeLogo />
        <div className={`${styles.box} ${styles.infoBox}`}>
          <div className={styles.boxBar}>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className={styles.boxContent}>
            Welcome to Plebchan's <strong>F</strong>requently <strong>A</strong>sked <strong>Q</strong>uestions page. Please remember that Plebchan does <i>not</i> have
            global admins or rules.
          </div>
        </div>
        <div className={styles.columns}>
          <div className={`${styles.box} ${styles.leftBox}`}>
            <div className={styles.boxBar}>
              <h2>Questions</h2>
            </div>
            <div className={styles.boxContent}>
              <ul className={styles.list}>
                <li>
                  <strong>
                    <HashLink to='#basics'>Basics</HashLink>
                  </strong>
                  <ul>
                    <li>
                      <HashLink to='#whatplebchan'>What is Plebchan?</HashLink>
                    </li>
                    <ul>
                      <li>
                        <HashLink to='#howaccess'>How do I access the boards?</HashLink>
                      </li>
                    </ul>
                    <li>
                      <HashLink to='#whatbasics'>What should I know before I post?</HashLink>
                    </li>
                    <ul>
                      <li>
                        <HashLink to='#postanon'>How do I post anonymously?</HashLink>
                      </li>
                      <li>
                        <HashLink to='#register'>Can I register a username?</HashLink>
                      </li>
                      <li>
                        <HashLink to='#howimage'>How do I post an image?</HashLink>
                      </li>
                      <li>
                        <HashLink to='#uploadimage'>Can I upload an image?</HashLink>
                      </li>
                      <li>
                        <HashLink to='#postimage'>Must I post an image?</HashLink>
                      </li>
                      <li>
                        <HashLink to='#replyimage'>Can I reply with an image?</HashLink>
                      </li>
                    </ul>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className={`${styles.box} ${styles.rightBox}`}>
            <div className={styles.boxBar}>
              <h2 id='basics'>Basics</h2>
            </div>
            <div className={styles.boxContent}>
              <dl>
                <dt className={styles.first} id='whatplebchan'>
                  What is Plebchan?
                </dt>
                <dd>
                  Plebchan is a serverless, adminless, decentralized 4chan alternative where any pleb can create and own unlimited boards. All data comes from the Plebbit
                  protocol, it's all text including links from which media is embedded, shared peer-to-peer. Users do not need to register an account before participating
                  in the community.
                </dd>
                <dt id='howaccess'>How do I access the boards?</dt>
                <dd>
                  Anyone can access any board at a any time by simply knowing its address. Paste it in the search box, located in the homepage or at the top of the board
                  pages. Hit enter, and you will connect peer-to-peer to the board owner. Each board is completely independent and moderates itself, the board admin has
                  full ownership of their board.
                </dd>
                <dt id='whatbasics'>What should I know before I post?</dt>
                <dd>
                  Whatever community you decide to post to, please remember to read the rules and guidelines of that board. Each board is independent and has its own
                  rules and guidelines. If you are unsure about the rules, you should try to ask the board owner or the community.
                </dd>
                <dt id='postanon'>How do I post anonymously?</dt>
                <dd>
                  To post as "Anonymous", simply do not fill in the [Name] field when submitting content. Plebchan uses the Plebbit protocol to function, which does not
                  leak IP addresses of people who post. This means that when you post on Plebchan, no board admin can know your IP address, nor can the app itself.
                  However, the Plebbit protocol is not fully anonymous, it uses IPFS, which means your IP address is part of a public P2P swarm, similarly to BitTorrent.
                </dd>
                <dt id='register'>Can I register a username?</dt>
                <dd>
                  You already have one, it's automatically generated by the app and you can find it in the settings. It's the address of your generated account file, and
                  you can change it to something readable (e.g., "myname.eth") by purchasing a crypto domain like ENS (Ethereum Name Service) and resolving your account
                  address with it.
                  <br />
                  <br />
                  By default, Anon Mode is enabled in the settings, which automatically generates and enables a new username per thread you visit. These anon mode
                  usernames stem from the currently active account file, which you can backup.
                </dd>
                <dt id='howimage'>How do I post an image?</dt>
                <dd>
                  You need a link to the image, ideally using an image hosting service, like Imgur. Paste the link to the image in the [Link] field when submitting
                  content. Plebchan will attempt to load the media from the link and show its type next to the [Link] field. If the link type is "webpage", the link is
                  not an image, and you should try another link.
                  <br />
                  <br />
                  You can also post videos, audios and gifs by pasting their direct links. Plebchan also supports the following websites to embed media without a direct
                  link: YouTube, Twitter/X, Reddit, Twitch, TikTok, Instagram, Odysee, Bitchute, Streamable, Spotify and Soundcloud.
                </dd>
                <dt id='uploadimage'>Can I upload an image?</dt>
                <dd>
                  No, because Plebchan is a client for the Plebbit protocol, which is text-only (including links, from which media is embedded by clients). However,
                  Plebbit uses IPFS, so in theory Plebchan could upload media to IPFS, and then post the direct IPFS link for the media. This is not enabled on Plebchan
                  because loading media from IPFS is extremely slow, at the moment (because most people have slow internet).
                </dd>
                <dt id='postimage'>Must I post an image?</dt>
                <dd>
                  It depends on the board. Each board has its own rules, and a board owner might decide to only allow posts with images in their community. Plebchan
                  automatically filters out text-only threads in the catalog view, and you can disable this in the [Filters] menu.
                </dd>
                <dt id='replyimage'>Can I reply with an image?</dt>
                <dd>
                  Yes. To reply to a thread with an image of your own, fill in the post box as you normally would, making sure to specify a direct image link (e.g.,
                  ending in .png or .jpeg) in the "Link" field. Plebchan will attempt to load the image, and if it worked it will show the Link type as "image", next to
                  the field, before posting. If the Link type is "webpage", the link is not an image, and you should try another link.
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FAQ;
