import { useState, useEffect } from 'react';
import { Greeting, SocketTester } from 'shared/types';
import { MainProps } from 'shared/main_props';
import { Button, Card, CardsContainer, Code, Container, Title,Title1, Title2 } from './Elements';
import io from 'socket.io-client';
import { GithubIcon } from './Icons';
import styled from 'styled-components';
import './Demo.css';

const CloneGithub = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(to right, #efe57d, #95d560);
  color: #333 !important;
  padding: 5px 10px;
  border-radius: 4px;
  margin: 10px;
  text-decoration: none !important;
`;

const Title3 = styled(Title2)`
  font-weight: normal;
  color: #ffffffaa;
`;

function Demo(mainProps: MainProps) {
  const greeting = mainProps.greeting;
  const [serverGreeting, setServerGreeting] = useState<Greeting>(greeting);
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const socket = io();
    socket.on('connect', () => {
      console.log('connected to socket.io');
    });

    socket.on('test', (data: SocketTester) => {
      setCount(data.counter);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <Container>
      <Title>mbrv.org</Title>
      <Title3>Murat's Bun, React & Vite template</Title3> 
      <Title2 style={{color: 'rgb(255 255 255)', textShadow: '0 0 20px rgba(255, 142, 30, 1)'}}>Easiest way to Use TypeScript on both client & server</Title2>
      <Title2>
        <CloneGithub href='https://github.com/mayfer/mbrv'>
          <GithubIcon /> Clone on GitHub
        </CloneGithub>
        </Title2>


      <CardsContainer>
        <Card>
          <Title1>Benefits</Title1>
          <Title2>Single port convenience</Title2>
          <ul>
            <li>Server & client run on the same process, same port</li>
            <li>No proxies or CORS issues</li>
          </ul>

          <Title2>Bun's flexibility</Title2>
          <ul>
            <li>
              Speed aside, <a href='https://bun.sh' target="_blank">bun</a> makes it a pleasure to run TypeScript without a transpiler
            </li>
            <li>
              <Code>run.ts</Code> as single entry point
            </li>
          </ul>

          <Title2>React hot module reloads</Title2>
          <ul>
            <li>UI code changes appear instantly in the browser</li>
            <li>Page will reload if any server code is changed</li>
          </ul>

          <Title2>Shared files</Title2>
          <ul>
            <li>Server & client can use shared TypeScript interfaces, types, and functions via <Code>shared/</Code> folder </li>
          </ul>

          <Title2>Sane server-side rendering</Title2>
          <ul>
            <li>SSR is done with explicit code, no framework magic: <Code>index.html</Code> is generated in <Code>run.ts</Code></li>
            <li>Enabled by default, with entry point in <Code>server/ssr.tsx</Code></li>
          </ul>
        </Card>
        <Card>
          <Title1>Instructions</Title1>
          <Title2>Setup</Title2>
          <ul>
            <li><Code>bun i</Code> to install packages</li>
            <li><Code>bun dev</Code> provides hot reloads & source maps</li>
            <li><Code>bun build</Code> builds only (into <Code>dist/</Code>)</li>
            <li><Code>bun prod</Code> serves production</li>
          </ul>
          <Title2>Make changes</Title2>
          <ul>
            <li><Code>client/</Code> contains React UI code</li>
            <li><Code>shared/</Code> folder contains shared interfaces, types, and functions that both client & server can use</li>
            <li><Code>server/</Code> contains http & socket APIs
              <ul>
                <li>Express endpoints in <Code>server/apis/http.ts</Code></li>
                <li>Socket.io setup in <Code>server/apis/sockets.ts</Code></li>
              </ul>
            </li>
          </ul>
        </Card>

        <Card>
            <Title1>Demo</Title1>
              <Title2>Test the HTTP API & SSR:</Title2>
              <Button onClick={async () => {
                setLoading(true);
                const res = await fetch("/api/props");
                const { greeting } = await res.json() as MainProps;

                setServerGreeting(greeting);
                setLoading(false);
              }}>Fetch clock from server</Button>
              {loading && <span> Loading...</span>}

              <br />
              Response: "{serverGreeting?.text}"

            <br /><br />
            <Title2>Test Socket.io:</Title2>
            Counter: {count}
        </Card>
      </CardsContainer>
    </Container>
  );
}

export default Demo;
