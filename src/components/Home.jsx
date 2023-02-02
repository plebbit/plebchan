import React from 'react';
import { Link } from 'react-router-dom';
import {Container, Header, Logo, Image, Page, About, BoxOuter, BoxInner, BoxBar, BoxContent } from './styled/Home.styled';

const Home = () => {
  return (
    <Container>
      <Header>
        <Logo>
          <Link to="/">
            <Image alt="plebchan" src="/logo-transparent.png"></Image>
          </Link>
        </Logo>
      </Header>
      <Page>
        <About>
          <BoxOuter>
            <BoxInner>
              <BoxBar>
                <h2>What is plebchan?</h2>
              </BoxBar>
              <BoxContent>
                <div id="content">
                  <p>Plebchan is a simple image-based bulletin board where anyone can post comments and share images. There are boards dedicated to a variety of topics, from Japanese animation and culture to videogames, music, and photography. Users do not need to register an account before participating in the community. Feel free to click on a board below that interests you and jump right in!</p>
                  <br />
                  <p>Be sure to familiarize yourself with the Rules before posting, and read the FAQ if you wish to learn more about how to use the site.</p>
                </div>
              </BoxContent>
            </BoxInner>
          </BoxOuter>
        </About>
        <BoxOuter>
          <BoxInner>
            <BoxBar>
              <h2>Boards</h2>
            </BoxBar>
            <BoxContent>
              <div id="box-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor nec feugiat nisl pretium. Porta lorem mollis aliquam ut. Risus nec feugiat in fermentum posuere urna. Aliquam purus sit amet luctus venenatis lectus. Adipiscing elit ut aliquam purus sit. Ipsum consequat nisl vel pretium. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam. Neque ornare aenean euismod elementum nisi quis eleifend. Urna nec tincidunt praesent semper feugiat nibh. In fermentum posuere urna nec. Et netus et malesuada fames ac turpis egestas integer. Quam id leo in vitae turpis massa sed elementum tempus. Sed felis eget velit aliquet sagittis. At risus viverra adipiscing at in. Senectus et netus et malesuada fames ac turpis egestas. Consectetur adipiscing elit ut aliquam. At erat pellentesque adipiscing commodo elit at. Dolor sit amet consectetur adipiscing elit. Augue mauris augue neque gravida in.
                  
                Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Ut ornare lectus sit amet est. Aliquam id diam maecenas ultricies mi eget mauris pharetra. Quam nulla porttitor massa id neque aliquam vestibulum. Justo eget magna fermentum iaculis eu. Varius morbi enim nunc faucibus. Nisl tincidunt eget nullam non nisi est sit. Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Elementum curabitur vitae nunc sed velit dignissim. Non sodales neque sodales ut etiam sit. Cursus mattis molestie a iaculis at erat pellentesque. Amet consectetur adipiscing elit pellentesque habitant morbi. Id venenatis a condimentum vitae sapien pellentesque habitant. Pellentesque habitant morbi tristique senectus et netus. Id cursus metus aliquam eleifend mi. Quam quisque id diam vel quam elementum pulvinar etiam non. Mauris pharetra et ultrices neque ornare aenean euismod. Vel pharetra vel turpis nunc eget lorem dolor sed viverra. Cras fermentum odio eu feugiat pretium. Risus pretium quam vulputate dignissim suspendisse in est ante in.
                
                Nec feugiat in fermentum posuere urna nec tincidunt praesent semper. Dolor morbi non arcu risus quis varius quam quisque. Nunc vel risus commodo viverra maecenas accumsan lacus. Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu. In vitae turpis massa sed. Aliquet risus feugiat in ante metus dictum at tempor commodo. Purus sit amet luctus venenatis lectus magna fringilla urna porttitor. Vestibulum sed arcu non odio euismod lacinia at quis risus. Tristique senectus et netus et malesuada fames ac turpis. Accumsan in nisl nisi scelerisque eu ultrices vitae auctor. Morbi leo urna molestie at. Quam elementum pulvinar etiam non quam. Sed risus ultricies tristique nulla aliquet enim tortor at. Tincidunt ornare massa eget egestas purus viverra. Convallis aenean et tortor at risus viverra. Blandit volutpat maecenas volutpat blandit. Felis eget nunc lobortis mattis. Lorem ipsum dolor sit amet consectetur adipiscing elit duis. Egestas pretium aenean pharetra magna ac placerat.
                
                A diam maecenas sed enim ut. Sit amet est placerat in egestas. Fringilla urna porttitor rhoncus dolor. Sed risus ultricies tristique nulla aliquet enim. Viverra suspendisse potenti nullam ac. Augue interdum velit euismod in pellentesque massa placerat duis ultricies. Adipiscing bibendum est ultricies integer quis auctor. Pharetra vel turpis nunc eget. Quam lacus suspendisse faucibus interdum posuere lorem. Volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris. Amet cursus sit amet dictum sit. Tempus egestas sed sed risus pretium quam vulputate dignissim. Ullamcorper malesuada proin libero nunc consequat interdum.
                
                Vestibulum lectus mauris ultrices eros in cursus turpis. Euismod nisi porta lorem mollis aliquam ut porttitor leo a. Integer eget aliquet nibh praesent. Gravida arcu ac tortor dignissim convallis aenean. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. Tincidunt tortor aliquam nulla facilisi cras fermentum odio eu feugiat. Aenean euismod elementum nisi quis. Cras sed felis eget velit aliquet sagittis id. Nec feugiat in fermentum posuere urna nec tincidunt praesent semper. Metus dictum at tempor commodo ullamcorper. Euismod quis viverra nibh cras pulvinar mattis. Sed libero enim sed faucibus turpis in eu mi bibendum.</p>
              </div>
            </BoxContent>
          </BoxInner>
        </BoxOuter>
      </Page>
    </Container>
  )
};

export default Home;