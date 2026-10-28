import { app } from './app.ts';
import { env } from './config/env.ts';

app.listen(env.PORT, () => {
  console.log(`API PlayMyJob démarrée sur http://localhost:${env.PORT}`);
});
