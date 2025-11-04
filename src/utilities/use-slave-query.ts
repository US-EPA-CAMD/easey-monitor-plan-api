import { DataSource } from 'typeorm';

export async function useSlaveQueryRunner<T>(
  dataSource: DataSource,
  callback: (query) => Promise<T>,
): Promise<T> {
  const qr = dataSource.createQueryRunner('slave');
  try {
    return await callback(qr.manager);
  } finally {
    await qr.release();
  }
}

