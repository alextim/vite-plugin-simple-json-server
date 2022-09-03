import { useState, useEffect, useCallback } from 'react';

import { FetchError } from '../helpers/fetch-api';

import type { Item } from '../types';

import Table from './Table';
import AddForm from './AddForm';
import Loading from './Loading';
import ErrorMsg from './ErrorMsg';
import TableRows from './TableRows';
import { IStorage } from '../types';

type Props = {
  storage: IStorage<Item, number>;
};

function formatErrorMessage(err: any) {
  if (err instanceof FetchError) {
    return err.code ? `${err.code} ${err.message}` : err.message;
  }
  return err.toString();
}

const Crud = ({ storage }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const onError = useCallback((err: any) => {
    if ((storage as any)?.aborted || err.name === 'AbortError') {
      return;
    }
    setError(formatErrorMessage(err));
    console.error(err);
  }, []);

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

    return () => void (storage as any)?.abort();
  }, []);

  const onDelete = useCallback(async (id: number) => {
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
  }, []);

  const onUpdate = useCallback(async (item: Item) => {
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
  }, []);

  const onAdd = useCallback(async (src: Item) => {
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
  }, []);

  const abort = useCallback(() => {
    (storage as any)?.abort();
    setLoading(false);
  }, [setLoading]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  return (
    <>
      <AddForm onAdd={onAdd} />
      <Table>
        <TableRows items={items} onDelete={onDelete} onUpdate={onUpdate} />
      </Table>
      <ErrorMsg error={error} onClose={clearError} />
      <Loading open={loading} onCancel={abort} />
    </>
  );
};

export default Crud;
