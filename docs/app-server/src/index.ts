import {AddressInfo} from 'net';
import {app} from './app';

const port = 3000;

export const server = app.listen(process.env.PORT || port, () => {
  const address = server.address();

  // tslint:disable-next-line:no-console
  console.log(`
    Example app listening at http://127.0.0.1:${(address as AddressInfo).port}
    -------
    status route: /
  `);
});
