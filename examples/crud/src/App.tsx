import { useState, useEffect } from 'react';

// import LocalStorage from './services/local-storage';
import { FetchError } from './helpers/fetch-api';
import RemoteStorage from './services/remote-storage';

import type { Item } from './types';

import Table from './components/Table';
import AddForm from './components/AddForm';
import Layout from './components/Layout';
import Loading from './components/Loading';
import ErrorMsg from './components/ErrorMsg';

// const storage = new LocalStorage('@example/crud');

const API_URL = 'api/json';
const getApiUrl = () => window.location + API_URL;
const storage = new RemoteStorage(getApiUrl());

function formatErrorMessage(err: any) {
  if (err instanceof FetchError) {
    return err.code ? `${err.code} ${err.message}` : err.message;
  }
  return err.toString();
}

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const onError = (err: any) => {
    if (storage.aborted || err.name === 'AbortError') {
      return;
    }
    setError(formatErrorMessage(err));
    console.error(err);
  };

  useEffect(() => {
    const loadAsync = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await storage.getAll();
        setItems(data);
      } catch (err: any) {
        onError(err);
      } finally {
        setLoading(false);
      }
    };

    loadAsync();

    return () => void storage.abort();
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
      onError(err);
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
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async (src: Item) => {
    let success = false;

    setLoading(true);

    try {
      const newItem = await storage.add(src);
      if (!newItem) {
        throw new Error('err add');
      }
      setItems((prev) => [...prev, newItem]);
      success = true;
    } catch (err: any) {
      onError(err);
    } finally {
      setLoading(false);
      return success;
    }
  };

  const abort = () => {
    storage.abort();
    setLoading(false);
  };

  const clearError = () => {
    setError('');
  };

  return (
    <>
      <Layout>
        <AddForm onAdd={onAdd} />
        <Table items={items} onDelete={onDelete} onUpdate={onUpdate} />
      </Layout>
      <ErrorMsg open={!!error} error={error} onClose={clearError} />
      <Loading open={loading} onCancel={abort} />
    </>
  );
};

export default App;
