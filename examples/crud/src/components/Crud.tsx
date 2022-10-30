import { useState, useEffect, useCallback } from 'react';

import type { Item } from '../types';
import { IStorage } from '../types';

import { LIMIT } from '../constants';

import { FetchError } from '../helpers/fetch-api';

import Table from './Table';
import TableRows from './TableRows';
import Pagination from './Pagination';
import AddForm from './AddForm';
import Loading from './Loading';
import ErrorMsg from './ErrorMsg';
import Dropdown from './Dropdown';

type Props = {
  storage: IStorage<Item, number>;
};

function formatErrorMessage(err: any) {
  if (err instanceof FetchError) {
    return err.code ? `${err.code} ${err.message}` : err.message;
  }
  return err.toString();
}
const limitOptions = [
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
];

const Crud = ({ storage }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(LIMIT);

  const onError = useCallback((err: any) => {
    if ((storage as any)?.aborted || err.name === 'AbortError') {
      return;
    }
    setError(formatErrorMessage(err));
    console.error(err);
  }, []);

  const updateOffset = useCallback(async (newOffset: number) => {
    const { items: newItems, totalCount: newTotalCount } = await storage.slice(newOffset, newOffset + limit);
    setItems(newItems);
    setTotalCount(newTotalCount);
    setOffset(newOffset);
  }, []);

  const updateOffsetWrapped = useCallback(async (newOffset: number) => {
    setLoading(true);
    try {
      await updateOffset(newOffset);
    } catch (err: any) {
      onError(err);
    } finally {
      setLoading(false);
    }
  }, []);
  /**
   * `useEffect` only depends on `limit`, not `offset` and `limit`
   *
   * This is done to render correctly after the user has canceled the request.
   * We can't use `setOffset(newOffset)` for navigation.
   */
  useEffect(() => {
    setLoading(true);
    updateOffsetWrapped(0);
    return () => void storage.abort();
  }, [limit]);

  const onDelete = async (id: number) => {
    setLoading(true);
    try {
      await storage.delete(id);

      const isPageEmpty = items.length === 1;

      const newOffset = isPageEmpty ? Math.max(0, offset - limit) : offset;

      if (newOffset === offset) {
        /**
         * It's the last page.
         * Just remove one item from the `items` state to avoid the extra `fetch`.
         * */
        const lastPageOffset = (Math.ceil(totalCount / limit) - 1) * limit;
        if (offset === lastPageOffset) {
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
          return;
        }
      }

      /**
       * It isn't the last page
       * or
       * nothing left after deletion on last page.
       *
       * Go to the previous page.
       * */
      await updateOffset(newOffset);
    } catch (err: any) {
      onError(err);
    } finally {
      setLoading(false);
    }
  };

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

  const onAdd = async (src: Item) => {
    let success = false;
    setLoading(true);
    try {
      const newItem = await storage.add(src);
      if (!newItem) {
        throw new Error('err add');
      }

      const lastPageOffset = (Math.ceil((totalCount + 1) / limit) - 1) * limit;
      if (lastPageOffset === offset) {
        // it's the last page
        // just add new item to the `items` state to avoid the extra `fetch`
        setItems((prev) => [...prev, newItem]);
        setTotalCount(totalCount + 1);
      } else {
        // go to the last page
        await updateOffset(lastPageOffset);
      }

      success = true;
    } catch (err: any) {
      onError(err);
    } finally {
      setLoading(false);
      return success;
    }
  };

  const abort = useCallback(() => {
    storage.abort();
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const updateLimit = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  };

  return (
    <>
      <div className="grid grid-rows-[auto_1fr_auto] min-h-full">
        <header>
          <AddForm onAdd={onAdd} />
        </header>

        <Table>
          <TableRows items={items} onDelete={onDelete} onUpdate={onUpdate} />
        </Table>

        <footer className="flex gap-12 items-center mt-8">
          <Pagination offset={offset} totalCount={totalCount} limit={limit} updateOffset={updateOffsetWrapped} />
          <div>
            <label htmlFor="limit" className="mr-2">
              Page size:
            </label>
            <Dropdown id="limit" value={limit} options={limitOptions} onChange={updateLimit} />
          </div>
          <div>
            <span className="mr-2">Total Count:</span>
            <span data-testid="total-count">{totalCount}</span>
          </div>
        </footer>
      </div>
      <ErrorMsg error={error} onClose={clearError} />
      <Loading open={loading} onCancel={abort} />
    </>
  );
};

export default Crud;
