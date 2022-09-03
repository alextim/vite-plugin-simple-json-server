import RemoteStorage from './services/remote-storage';
// import LocalStorage from './services/local-storage';

import Layout from './components/Layout';
import Crud from './components/Crud';

const API_URL = 'api/json';

const storage = new RemoteStorage(window.location + API_URL);
// const storage = new LocalStorage('@example/crud');

const App = () => {
  return (
    <Layout>
      <Crud storage={storage} />
    </Layout>
  );
};

export default App;
