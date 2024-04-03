import { useState, useEffect } from 'react';
import { Greeting } from 'shared/types';
import { MainProps } from 'shared/main_props';
import { Button, Card, Code, Container, Title, Title2 } from './Elements';
// @ts-ignore
import logo from './assets/picnic.svg';

function App(mainProps: MainProps) {
  const greeting = mainProps.greeting;
  const [serverGreeting, setServerGreeting] = useState<Greeting>(greeting);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Container>
      <img src={logo} height="100" /><br />
      <Title2>Murat's Bun, React & Vite template</Title2>
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
          <li>SSR is done with explicit code, no framework magic required</li>
          <li>Enabled by default, with entry point in <Code>server/ssr.tsx</Code></li>
        </ul>

        <Title2>Express & socket.io</Title2>
        <ul>
          <li>Express router in <Code>server/http.ts</Code></li>
          <li>Socket.io setup in <Code>server/sockets.ts</Code></li>
        </ul>
      </Card>
      <div>
      {!loading ? (
        <>
          SSR & <Button onClick={async () => {
            setLoading(true);
            const res = await fetch("/api/props");
            const { greeting } = await res.json() as MainProps;

            setServerGreeting(greeting);
            setLoading(false);
          }}>/api/state</Button> say:
        </>
      ) : (
        "Loading..."
      )}{' '}{serverGreeting?.text} 
      </div>
    </Container>
  );
}

export default App;