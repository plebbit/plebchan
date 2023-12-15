import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useSubplebbit } from '@plebbit/plebbit-react-hooks';
import { debounce } from 'lodash';
import { Container, NavBar, Header, Break, PostMenu, PostForm, PostMenuMobile } from '../styled/views/Board.styled';
import { TopBar, BoardForm, Footer, ReplyFormLink } from '../styled/views/Thread.styled';
import { PostMenuCatalog } from '../styled/views/Catalog.styled';
import BoardStats from '../BoardStats';
import ImageBanner from '../ImageBanner';
import CreateBoardModal from '../modals/CreateBoardModal';
import AdminListModal from '../modals/AdminListModal';
import OfflineIndicator from '../OfflineIndicator';
import SettingsModal from '../modals/SettingsModal';
import getDate from '../../utils/getDate';
import handleStyleChange from '../../utils/handleStyleChange';
import useGeneralStore from '../../hooks/stores/useGeneralStore';
import packageJson from '../../../package.json';
const { version } = packageJson;
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : '';

const Rules = () => {
  const { defaultSubplebbits, isSettingsOpen, setIsSettingsOpen, selectedAddress, setSelectedAddress, selectedStyle, setSelectedTitle } = useGeneralStore(
    (state) => state,
  );

  // temporary hardcode
  const plebtokenRules = [
    'This community is strictly SFW. Any NSFW language or content will be removed.',
    <span>
      Only post about the plebbit token ($PLEB). For general cryptocurrency discussion, go to{' '}
      <Link className='quotelink' to='/p/business-and-finance.eth'>
        p/business-and-finance.eth
      </Link>
      .
    </span>,
    'FUD is allowed unless blatantly meaningless and spammy.',
  ];

  const navigate = useNavigate();

  const threadMenuRefs = useRef({});
  const threadMenuRefsMobile = useRef({});
  const postMenuMobileRef = useRef(null);
  const postMenuCatalogRef = useRef(null);

  const [isAdminListOpen, setIsAdminListOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [mobileMenuPosition, setMobileMenuPosition] = useState({ top: 0, left: 0 });
  const [openMenuCid, setOpenMenuCid] = useState(null);
  const [openMobileMenuCid, setOpenMobileMenuCid] = useState(null);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isClientRedirectMenuOpen, setIsClientRedirectMenuOpen] = useState(false);

  const { subplebbitAddress } = useParams();
  const subplebbit = useSubplebbit({ subplebbitAddress: selectedAddress });

  const handleOptionClick = () => {
    setOpenMenuCid(null);
  };

  const handleMobileOptionClick = () => {
    setOpenMobileMenuCid(null);
  };

  const handleOutsideClick = useCallback(
    (e) => {
      if (openMenuCid !== null && !postMenuCatalogRef.current.contains(e.target)) {
        setOpenMenuCid(null);
      }
    },
    [openMenuCid, postMenuCatalogRef],
  );

  const handleMobileOutsideClick = useCallback(
    (e) => {
      if (openMobileMenuCid !== null && !postMenuMobileRef.current.contains(e.target)) {
        setOpenMobileMenuCid(null);
      }
    },
    [openMobileMenuCid, postMenuMobileRef],
  );

  useEffect(() => {
    if (openMenuCid !== null) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [openMenuCid, handleOutsideClick]);

  useEffect(() => {
    if (openMobileMenuCid !== null) {
      document.addEventListener('click', handleMobileOutsideClick);
    } else {
      document.removeEventListener('click', handleMobileOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleMobileOutsideClick);
    };
  }, [openMobileMenuCid, handleMobileOutsideClick]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const selectedSubplebbit = defaultSubplebbits.find((subplebbit) => subplebbit.address === subplebbitAddress);
    if (subplebbitAddress) {
      setSelectedAddress(subplebbitAddress);
    } else if (subplebbit?.address) {
      setSelectedAddress(subplebbit.address);
    }
    if (selectedSubplebbit) {
      setSelectedTitle(selectedSubplebbit.title);
    } else if (subplebbit?.title) {
      setSelectedTitle(subplebbit.title);
    }
  }, [subplebbitAddress, setSelectedAddress, setSelectedTitle, defaultSubplebbits, subplebbit?.address, subplebbit?.title]);

  // mobile navbar scroll effect
  useEffect(() => {
    const debouncedHandleScroll = debounce(() => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    }, 50);

    window.addEventListener('scroll', debouncedHandleScroll);

    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [prevScrollPos, visible]);

  // mobile navbar board select functionality
  const handleSelectChange = (event) => {
    const selected = event.target.value;

    if (selected === 'subscriptions') {
      navigate(`/p/subscriptions`);
      return;
    } else if (selected === 'all') {
      navigate(`/p/all`);
      return;
    }

    const selectedTitle = defaultSubplebbits.find((subplebbit) => subplebbit.address === selected).title;
    setSelectedTitle(selectedTitle);
    setSelectedAddress(selected);
    navigate(`/p/${selected}`);
  };

  return (
    <>
      <Helmet>
        <title>{'Board Rules - ' + (subplebbit.title || subplebbit.address) + ' - plebchan'}</title>
      </Helmet>
      <Container>
        <CreateBoardModal selectedStyle={selectedStyle} isOpen={isCreateBoardOpen} closeModal={() => setIsCreateBoardOpen(false)} />
        <AdminListModal selectedStyle={selectedStyle} isOpen={isAdminListOpen} closeModal={() => setIsAdminListOpen(false)} roles={subplebbit.roles} />
        <SettingsModal selectedStyle={selectedStyle} isOpen={isSettingsOpen} closeModal={() => setIsSettingsOpen(false)} />
        <NavBar selectedStyle={selectedStyle}>
          <>
            <span className='boardList'>
              [<Link to={{ pathname: `/p/all`, state: { scrollToTop: true } }}>All</Link>
               / 
              <Link to={{ pathname: `/p/subscriptions`, state: { scrollToTop: true } }}>Subscriptions</Link>
              ]&nbsp;[
              {defaultSubplebbits.map((subplebbit, index) => (
                <span className='boardList' key={`span-${subplebbit.address}`}>
                  {index === 0 ? null : '\u00a0'}
                  <Link
                    to={`/p/${subplebbit.address}`}
                    key={`a-${subplebbit.address}`}
                    onClick={() => {
                      setSelectedTitle(subplebbit.title);
                      setSelectedAddress(subplebbit.address);
                    }}
                  >
                    {subplebbit.title ? subplebbit.title : subplebbit.address}
                  </Link>
                  {index !== defaultSubplebbits.length - 1 ? ' /' : null}
                </span>
              ))}
              ]
            </span>
            <span className='nav'>
              [
              <span
                id='button-span'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  window.electron && window.electron.isElectron
                    ? setIsCreateBoardOpen(true)
                    : alert(
                        'HOW TO CREATE A BOARD (currently via CLI only):\n\n(1) have a computer you can use as server, because users will connect to your board peer-to-peer;\n\n(2) go to https://github.com/plebbit/plebbit-cli#install and follow the instructions to run your daemon, create a subplebbit (board) and edit its settings;\n\n(3) users can always connect to your board via its address, but it can be added below by submitting a pull request here: https://github.com/plebbit/temporary-default-subplebbits. This will be automated with a plebbit DAO using the plebbit token.',
                      );
                }}
              >
                Create Board
              </span>
              ] [
              <Link to={`/p/${selectedAddress}/rules/settings`} onClick={() => setIsSettingsOpen(true)}>
                Settings
              </Link>
              ] [<Link to='/'>Home</Link>]
            </span>
            <div id='board-nav-mobile' style={{ top: visible ? 0 : '-23px' }}>
              <div className='nav-container'>
                <div className='board-select'>
                  <strong>Board</strong>
                  &nbsp;
                  <select id='board-select-mobile' value={selectedAddress} onChange={handleSelectChange}>
                    <option value='all'>All</option>
                    <option value='subscriptions'>Subscriptions</option>
                    {!defaultSubplebbits.some((subplebbit) => subplebbit.address === selectedAddress) && <option value={selectedAddress}>{selectedAddress}</option>}
                    {defaultSubplebbits.map((subplebbit) => (
                      <option key={`option-${subplebbit.address}`} value={subplebbit.address}>
                        {subplebbit.title ? subplebbit.title : subplebbit.address}
                      </option>
                    ))}
                  </select>
                   
                  <span
                    id='button-span'
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      alert(
                        'HOW TO CREATE A BOARD (currently via CLI only):\n\n(1) have a computer you can use as server, because users will connect to your board peer-to-peer;\n\n(2) go to https://github.com/plebbit/plebbit-cli#install and follow the instructions to run your daemon, create a subplebbit (board) and edit its settings;\n\n(3) users can always connect to your board via its address, but it can be added below by submitting a pull request here: https://github.com/plebbit/temporary-default-subplebbits. This will be automated with a plebbit DAO using the plebbit token.',
                      )
                    }
                  >
                    Create Board
                  </span>
                </div>
                <div className='page-jump'>
                  <Link to={`/p/${selectedAddress}/rules/settings`} onClick={() => setIsSettingsOpen(true)}>
                    Settings
                  </Link>
                  &nbsp;
                  <Link
                    to='/'
                    onClick={() => {
                      handleStyleChange({ target: { value: 'Yotsuba' } });
                    }}
                  >
                    Home
                  </Link>
                </div>
              </div>
            </div>
            <div id='separator-mobile'>&nbsp;</div>
            <div id='separator-mobile'>&nbsp;</div>
          </>
        </NavBar>
        <Header selectedStyle={selectedStyle}>
          <>
            <div className='banner'>
              <ImageBanner />
            </div>
            <>
              <div className='board-title'>{subplebbit.title ?? null}</div>
              <div className='board-address'>
                p/{subplebbit.address}
                <OfflineIndicator address={subplebbit.address} className='offline' tooltipPlace='top' />
              </div>
            </>
          </>
        </Header>
        <Break selectedStyle={selectedStyle} />
        <PostForm selectedStyle={selectedStyle}>
          <ReplyFormLink id='post-form-link' selectedStyle={selectedStyle} style={{ marginBottom: '10px' }}>
            <div id='return-button-mobile'>
              <span className='btn-wrap'>
                <Link to={{ pathname: `/p/${selectedAddress}`, state: { scrollToTop: true } }}>Return</Link>
              </span>
            </div>
            <div id='catalog-button-mobile'>
              <span className='btn-wrap'>
                <Link to={{ pathname: `/p/${selectedAddress}/catalog`, state: { scrollToTop: true } }}>Catalog</Link>
              </span>
            </div>
            <div id='bottom-button-mobile'>
              <span className='btn-wrap'>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.scrollTo(0, document.body.scrollHeight)}
                  onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
                >
                  Bottom
                </span>
              </span>
            </div>
          </ReplyFormLink>
        </PostForm>
        <BoardStats subplebbitAddress={selectedAddress} />
        <TopBar selectedStyle={selectedStyle}>
          <span className='style-changer'>
            Style:  
            <select id='style-selector' onChange={handleStyleChange} value={selectedStyle}>
              <option value='Yotsuba'>Yotsuba</option>
              <option value='Yotsuba-B'>Yotsuba B</option>
              <option value='Futaba'>Futaba</option>
              <option value='Burichan'>Burichan</option>
              <option value='Tomorrow'>Tomorrow</option>
              <option value='Photon'>Photon</option>
            </select>
          </span>
          <span className='return-button' id='return-button-desktop'>
            [<Link to={{ pathname: `/p/${selectedAddress}`, state: { scrollToTop: true } }}>Return</Link>]
          </span>
          <span className='return-button catalog-button' id='catalog-button-desktop'>
            [<Link to={{ pathname: `/p/${selectedAddress}/catalog`, state: { scrollToTop: true } }}>Catalog</Link>]
          </span>
          <span className='return-button catalog-button' id='bottom-button-desktop'>
            [
            <span
              id='button'
              style={{ cursor: 'pointer' }}
              onClick={() => window.scrollTo(0, document.body.scrollHeight)}
              onMouseOver={(event) => (event.target.style.cursor = 'pointer')}
              onTouchStart={() => window.scrollTo(0, document.body.scrollHeight)}
            >
              Bottom
            </span>
            ]
          </span>
        </TopBar>
        <Tooltip id='tooltip' className='tooltip' />
        <BoardForm selectedStyle={selectedStyle}>
          <>
            <div className='thread'>
              <div className='op-container'>
                <div className='post op op-desktop'>
                  <hr />
                  <div className='post-info'>
                    <span className='name-block'>
                      <span className='title'>Rules</span>
                      &nbsp;
                      <span
                        className='name capcode'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setIsAdminListOpen(!isAdminListOpen);
                        }}
                      >
                        ## Board Mods
                      </span>
                      &nbsp;
                      <span className='date-time'>{getDate(subplebbit.createdAt)}</span>
                      &nbsp;
                      <img src='assets/sticky.gif' alt='Sticky' title='Sticky' style={{ marginBottom: '-1px', imageRendering: 'pixelated' }} />
                      &nbsp;
                      <img src='assets/closed.gif' alt='Closed' title='Closed' style={{ marginBottom: '-1px', imageRendering: 'pixelated' }} />
                      <span>
                        &nbsp; [
                        <Link to={() => {}} style={{ textDecoration: 'none' }} className='reply-link'>
                          Reply
                        </Link>
                        ]
                      </span>
                      <PostMenu
                        title='Post menu'
                        ref={(el) => {
                          threadMenuRefs.current['rules'] = el;
                        }}
                        className='post-menu-button'
                        rotated={openMenuCid === 'rules'}
                        onClick={(event) => {
                          event.stopPropagation();
                          const rect = threadMenuRefs.current['rules'].getBoundingClientRect();
                          setMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                          setOpenMenuCid((prevCid) => (prevCid === 'rules' ? null : 'rules'));
                        }}
                      >
                        ▶
                      </PostMenu>
                      {createPortal(
                        <PostMenuCatalog
                          selectedStyle={selectedStyle}
                          ref={(el) => {
                            postMenuCatalogRef.current = el;
                          }}
                          onClick={(event) => event.stopPropagation()}
                          style={{ position: 'absolute', top: menuPosition.top + 7, left: menuPosition.left }}
                        >
                          <div className={`post-menu-thread post-menu-thread-${'rules'}`} style={{ display: openMenuCid === 'rules' ? 'block' : 'none' }}>
                            <ul className='post-menu-catalog'>
                              {/* {canModerate ? (
                              <>
                                change rules
                              </>
                            ) : null} */}
                              <li
                                onMouseOver={() => {
                                  setIsClientRedirectMenuOpen(true);
                                }}
                                onMouseLeave={() => {
                                  setIsClientRedirectMenuOpen(false);
                                }}
                              >
                                View on »
                                <ul className='dropdown-menu post-menu-catalog' style={{ display: isClientRedirectMenuOpen ? 'block' : 'none' }}>
                                  <li onClick={() => handleOptionClick('rules')}>
                                    <a href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}`} target='_blank' rel='noreferrer'>
                                      Plebbit
                                    </a>
                                  </li>
                                  <li onClick={() => handleOptionClick('rules')}>
                                    <a href={`https://seedit.eth.limo/#/p/${selectedAddress}`} target='_blank' rel='noreferrer'>
                                      Seedit
                                    </a>
                                  </li>
                                  <li onClick={() => handleOptionClick('rules')}>
                                    <a href={`https://plebones.eth.limo/#/p/${selectedAddress}`} target='_blank' rel='noreferrer'>
                                      Plebones
                                    </a>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </div>
                        </PostMenuCatalog>,
                        document.body,
                      )}
                    </span>
                    <blockquote>
                      <div className='custom-paragraph' style={{ paddingBottom: '17px' }}>
                        {subplebbit.address === 'plebtoken.eth'
                          ? plebtokenRules.map((rule, index) => (
                              <React.Fragment key={index}>
                                {index + 1}. {rule}
                                <br />
                              </React.Fragment>
                            ))
                          : subplebbit.rules?.map((rule, index) => (
                              <React.Fragment key={index}>
                                {index + 1}. {rule}
                                <br />
                              </React.Fragment>
                            ))}
                      </div>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
            <div className='thread-mobile'>
              <hr />
              <div className='op-container'>
                <div className='post op op-mobile'>
                  <div className='post-info-mobile'>
                    <button
                      key={`mob-pb-`}
                      className='post-menu-button-mobile'
                      ref={(el) => {
                        threadMenuRefsMobile.current['rules'] = el;
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        const rect = threadMenuRefsMobile.current['rules'].getBoundingClientRect();
                        setMobileMenuPosition({ top: rect.top + window.scrollY, left: rect.left });
                        setOpenMobileMenuCid((prevCid) => (prevCid === 'rules' ? null : 'rules'));
                      }}
                      style={{ all: 'unset', cursor: 'pointer' }}
                    >
                      ...
                    </button>
                    {createPortal(
                      <PostMenuMobile
                        selectedStyle={selectedStyle}
                        ref={(el) => {
                          postMenuMobileRef.current = el;
                        }}
                        onClick={(event) => event.stopPropagation()}
                        style={{
                          position: 'absolute',
                          display: openMobileMenuCid === 'rules' ? 'block' : 'none',
                          top: mobileMenuPosition.top + 20,
                          left: mobileMenuPosition.left,
                        }}
                      >
                        <ul className={`post-menu-mobile-thread-description`}>
                          <a
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            href={`https://plebbitapp.eth.limo/#/p/${selectedAddress}`}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <li onClick={() => handleMobileOptionClick('rules')}>View on plebbit</li>
                          </a>
                          <a
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            href={`https://seedit.eth.limo/#/p/${selectedAddress}`}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <li onClick={() => handleMobileOptionClick('rules')}>View on seedit</li>
                          </a>
                          <a
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            href={`https://plebones.eth.limo/#/p/${selectedAddress}`}
                            target='_blank'
                            rel='noreferrer'
                          >
                            <li onClick={() => handleMobileOptionClick('rules')}>View on plebones</li>
                          </a>
                        </ul>
                      </PostMenuMobile>,
                      document.body,
                    )}
                    <span className='name-block-mobile'>
                      <span
                        className='name-mobile capcode'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setIsAdminListOpen(!isAdminListOpen);
                        }}
                      >
                        ## Board Mods
                      </span>
                      &nbsp;
                      <span className='thread-icons-mobile'>
                        <img
                          src='assets/sticky.gif'
                          alt='Sticky'
                          title='Sticky'
                          style={{ all: 'unset', marginBottom: '-2px', paddingLeft: '2px', imageRendering: 'pixelated' }}
                        />
                        &nbsp;
                        <img
                          src='assets/closed.gif'
                          alt='Closed'
                          title='Closed'
                          style={{ all: 'unset', marginBottom: '-2px', paddingLeft: '2px', imageRendering: 'pixelated' }}
                        />
                      </span>
                      <br />
                      <span className='subject-mobile' style={{ marginBottom: '-15px' }}>
                        Rules
                      </span>
                      &nbsp;
                    </span>
                    <span className='date-time-mobile post-number-mobile'>{getDate(subplebbit.createdAt)}</span>
                    &nbsp;
                  </div>
                  <blockquote className='post-message-mobile'>
                    <div className='custom-paragraph'>
                      {subplebbit.address === 'plebtoken.eth'
                        ? plebtokenRules.map((rule, index) => (
                            <React.Fragment key={index}>
                              {index + 1}. {rule}
                              <br />
                            </React.Fragment>
                          ))
                        : subplebbit.rules?.map((rule, index) => (
                            <React.Fragment key={index}>
                              {index + 1}. {rule}
                              <br />
                            </React.Fragment>
                          ))}
                    </div>
                  </blockquote>
                </div>
                <div className='post-link-mobile'>
                  <Link to={() => {}} className='button-mobile'>
                    View Thread
                  </Link>
                </div>
              </div>
            </div>
          </>
        </BoardForm>
        <Footer selectedStyle={selectedStyle}>
          <Break
            id='break'
            selectedStyle={selectedStyle}
            style={{
              marginTop: '-36px',
              width: '100%',
            }}
          />
          <Break
            selectedStyle={selectedStyle}
            style={{
              width: '100%',
            }}
          />
          <span
            className='style-changer'
            style={{
              float: 'right',
              marginTop: '2px',
            }}
          >
            Style:  
            <select id='style-selector' onChange={handleStyleChange} value={selectedStyle}>
              <option value='Yotsuba'>Yotsuba</option>
              <option value='Yotsuba-B'>Yotsuba B</option>
              <option value='Futaba'>Futaba</option>
              <option value='Burichan'>Burichan</option>
              <option value='Tomorrow'>Tomorrow</option>
              <option value='Photon'>Photon</option>
            </select>
          </span>
          <NavBar
            selectedStyle={selectedStyle}
            style={{
              marginTop: '42px',
            }}
          >
            <>
              <span className='boardList'>
                [<Link to={{ pathname: `/p/all`, state: { scrollToTop: true } }}>All</Link>
                 / 
                <Link to={{ pathname: `/p/subscriptions`, state: { scrollToTop: true } }}>Subscriptions</Link>
                ]&nbsp;
              </span>
              {defaultSubplebbits.map((subplebbit, index) => (
                <span className='boardList' key={`span-${subplebbit.address}`}>
                  {index === 0 ? null : '\u00a0'}
                  <Link
                    to={`/p/${subplebbit.address}`}
                    key={`a-${subplebbit.address}`}
                    onClick={() => {
                      setSelectedTitle(subplebbit.title);
                      setSelectedAddress(subplebbit.address);
                    }}
                  >
                    {subplebbit.title ? subplebbit.title : subplebbit.address}
                  </Link>
                  {index !== defaultSubplebbits.length - 1 ? ' /' : null}
                </span>
              ))}
              <span className='nav'>
                [
                <span
                  id='button-span'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    window.electron && window.electron.isElectron
                      ? setIsCreateBoardOpen(true)
                      : alert(
                          'HOW TO CREATE A BOARD (currently via CLI only):\n\n(1) have a computer you can use as server, because users will connect to your board peer-to-peer;\n\n(2) go to https://github.com/plebbit/plebbit-cli#install and follow the instructions to run your daemon, create a subplebbit (board) and edit its settings;\n\n(3) users can always connect to your board via its address, but it can be added below by submitting a pull request here: https://github.com/plebbit/temporary-default-subplebbits. This will be automated with a plebbit DAO using the plebbit token.',
                        );
                  }}
                >
                  Create Board
                </span>
                ] [
                <Link to={`/p/${selectedAddress}/rules/settings`} onClick={() => setIsSettingsOpen(true)}>
                  Settings
                </Link>
                ] [
                <Link to='/' onClick={() => handleStyleChange({ target: { value: 'Yotsuba' } })}>
                  Home
                </Link>
                ]
              </span>
            </>
          </NavBar>
          <div id='version'>
            plebchan v{version}
            {commitRef}. GPL-2.0
          </div>
          <div
            className='footer-links'
            style={{
              textAlign: 'center',
              fontSize: 'x-small',
              fontFamily: 'arial',
              marginTop: '5px',
              marginBottom: '15px',
            }}
          >
            <a style={{ textDecoration: 'underline' }} href='https://plebbit.com' target='_blank' rel='noopener noreferrer'>
              About
            </a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href='https://github.com/plebbit/plebchan/releases/latest' target='_blank' rel='noopener noreferrer'>
              App
            </a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href='https://twitter.com/plebchan_eth' target='_blank' rel='noopener noreferrer'>
              Twitter
            </a>
            &nbsp;•&nbsp;
            <a style={{ textDecoration: 'underline' }} href='https://t.me/plebbit' target='_blank' rel='noopener noreferrer'>
              Telegram
            </a>
          </div>
        </Footer>
      </Container>
    </>
  );
};

export default Rules;
