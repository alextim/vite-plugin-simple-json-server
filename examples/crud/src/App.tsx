import RemoteStorage from './services/remote-storage';
// import LocalStorage from './services/local-storage';

import Layout from './components/Layout';
import Crud from './components/Crud';

import { API_URL } from './constants';

const storage = new RemoteStorage(API_URL);
// const storage = new LocalStorage('@example/crud');

const App = () => {
  return (
    <Layout>
      <Crud storage={storage} />
    </Layout>
  );
};

export default App;
