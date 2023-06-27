import {handlerFileFilter, handlerRoot} from './constant';
import {type Handler, Router} from 'express';
import {importFiles, logger} from '@epic-helper/utils';

const methods = {
  get: 'get',
  post: 'post',
  put: 'put',
  delete: 'delete',
  patch: 'patch',
} as const;

export default async function loadRoutes() {
  const router = Router();
  const commands = await importFiles<Handler[]>({
    path: `./${handlerRoot}/routes`,
    options: {
      fileFilter: [handlerFileFilter],
    },
  });
  commands.forEach(({data, path}) => {
    if (!data?.length) return;
    const routePath = '/' + path.replace(/\/\w+\.ts$/, '');
    const method = path.replace(/.*\/(\w+)\.ts$/, '$1') as ValuesOf<typeof methods>;
    if (!Object.values(methods).some((_method) => _method === method)) return;
    if (!router[method]) throw new Error(`Method ${method} not found`);
    logger({
      message: `${method.toUpperCase()} ${routePath}`,
    });
    router[method](routePath, data);
  });
  return router;
}
