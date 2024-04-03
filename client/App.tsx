import { useState, useEffect } from 'react';
import { Greeting, SocketTester } from 'shared/types';
import { MainProps } from 'shared/main_props';
import { Button, Card, InnerCard, Code, Container, Title, Title2 } from './Elements';
import io from 'socket.io-client';
// @ts-ignore
import logo from './assets/picnic.svg';

function App(mainProps: MainProps) {
  const greeting = mainProps.greeting;
  const [serverGreeting, setServerGreeting] = useState<Greeting>(greeting);
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // setup socket.io
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
      <img src={logo} height="100" /><br />
      <Title2>Murat's Bun, React & Vite template</Title2>
      <Title2><a href='https://github.com/mayfer/mbrv'>Clone on GitHub</a></Title2>
      <Title>MBRV</Title>
      <Card>
        <Title2>Single port convenience</Title2>
        <ul>
          <li>Server and client run on the same port</li>
          <li>No proxies or CORS issues</li>
        </ul>

        <Title2>Bun's flexibility</Title2>
        <ul>
          <li>
            Speed aside, <a href='https://bun.sh' target="_blank">bun</a> makes it a pleasure to run TypeScript without a transpiler
          </li>
          <li>
            <Code>run.ts</Code> as single clear entry point
          </li>
        </ul>

        <Title2>React hot module reloads</Title2>
        <ul>
          <li>Edit <Code>client/App.tsx</Code> and save to test React HMR</li>
          <li>Server will also reload when <Code>server/</Code> or <Code>shared/</Code> changes, using nodemon to restart the bun process</li>
        </ul>

        <Title2>Shared files</Title2>
        <ul>
          <li>Server & client can use shared interfaces, types, and functions via <Code>shared/</Code> folder </li>
        </ul>

        <Title2>Sane server-side rendering</Title2>
        <ul>
          <li>SSR is done with explicit code, no framework magic</li>
          <li>Enabled by default, with entry point in <Code>server/ssr.tsx</Code></li>
        </ul>

        <Title2>Express & socket.io</Title2>
        <ul>
          <li>Express router in <Code>server/http.ts</Code></li>
          <li>Socket.io setup in <Code>server/sockets.ts</Code></li>
        </ul>
        <InnerCard>
          <Title2>Instructions</Title2>
          <ul>
            <li><a href='https://github.com/mayfer/mbrv'>Clone on GitHub</a> & run <Code>bun install</Code></li>
            <li>Make application-specific changes in <Code>client/</Code>, <Code>shared/</Code> & <Code>server/</Code> dirs</li>
            <li><Code>bun dev</Code> provides hot reloads & source maps</li>
            <li><Code>bun prod</Code> builds & serves production</li>
            <li><Code>bun run.ts</Code> to run without any build process</li>
          </ul>
        </InnerCard>
      </Card>

      <Card>
        
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
    </Container>
  );
}

export default App;
