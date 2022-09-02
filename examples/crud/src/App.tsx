import { useState, useEffect } from 'react';

// import LocalStorage from './services/local-storage';
import RemoteStorage, { FetchError } from './services/remote-storage';

import { Item } from './types';

import Table from './components/Table';
import AddForm from './components/AddForm';
import Layout from './components/Layout';

// const storage = new LocalStorage('@example/crud');
const storage = new RemoteStorage(window.location + 'api/json');

function formatErrorMessage(err: any) {
  if (err instanceof FetchError) {
    return err.code ? `${err.code} ${err.message}` : err.message;
  }
  return err.toString();
}

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    storage
      .getAll()
      .then((data: any) => setItems(data))
      .catch((err: any) => {
        setError(formatErrorMessage(err));
        console.error(err);
      })
      .finally(() => void setLoading(false));
  }, []);

  const onDelete = async (id: number) => {
    setLoading(true);
    try {
      if (!(await storage.delete(id))) {
        throw new Error(`delete: id=${id} not found in storage`);
      }
      setItems((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index === -1) {
          console.error(`delete: id=${id} not found in items`);
          return prev;
        }
        const modified = [...prev];
        modified.splice(index, 1);
        return modified;
      });
    } catch (err: any) {
      setError(formatErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (item: Item) => {
    setLoading(true);
    try {
      if (!(await storage.update(item))) {
        throw new Error(`update: id=${item.id} not found in storage`);
      }
      setItems((prev) => {
        const index = prev.findIndex((el) => el.id === item.id);
        if (index === -1) {
          console.error(`update: id=${item.id} not found in items`);
          return prev;
        }
        const modified = [...prev];
        modified.splice(index, 1, item);
        return modified;
      });
    } catch (err: any) {
      setError(formatErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async (src: Item) => {
    let ok = false;
    setLoading(true);
    try {
      const added = await storage.add(src);
      if (!added) {
        throw new Error('err add');
      }
      setItems((prev) => [...prev, added]);
      ok = true;
    } catch (err: any) {
      setError(formatErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
      return ok;
    }
  };

  return (
    <Layout>
      <AddForm onAdd={onAdd} />
      <Table items={items} onDelete={onDelete} onUpdate={onUpdate} />
      {loading && (
        <div className="alert alert-info shadow-lg mt-6">
          <div>
            <span>Wait...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-error shadow-lg mt-6">
          <div>
            <span> {error}</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
