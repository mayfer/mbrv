import ReactDOMServer from 'react-dom/server'
import App from '../client/App'

// if you need to integrate other styling frameworks,
// implement them here & add to the head tags for SSR
import { ServerStyleSheet } from "styled-components";

export function render(url, context) {
  const sheet = new ServerStyleSheet();
  const body = ReactDOMServer.renderToString(
    sheet.collectStyles(
      <App greeting={context.greeting} />
    )
  )
  return {
    body,
    head: sheet.getStyleTags()
  }
}