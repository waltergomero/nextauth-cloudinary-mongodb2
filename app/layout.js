import "@styles/globals.css";

import NavBar from "@components/ui/navbar";
import Provider from "@components/provider";
import { Alert } from "@components/Alert";

export const metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <Provider>
        <main >
          <NavBar />
          <Alert/>
          {children}
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;