import {mongoClient} from '../../services/mongoose/mongoose.service';
import {serverSchema} from './server.schema';
import {IServer} from './server.type';

const dbServer = mongoClient.model('servers', serverSchema);

interface IRegisterServerProps {
  serverId: string;
  name: string;
}

const registerServer = async ({serverId, name}: IRegisterServerProps): Promise<IServer> => {
  const server = await dbServer.findOne({serverId});

  if (!server) {
    const newServer = new dbServer({
      serverId,
      name,
    });

    await newServer.save();
    return newServer;
  }
  return server;
};

interface IGetServerProps {
  serverId: string;
}

const getServer = async ({serverId}: IGetServerProps): Promise<IServer | null> => {
  const server = await dbServer.findOne({serverId});

  if (!server) {
    return null;
  }
  return server;
};

const listRegisteredServersId = async (): Promise<string[]> => {
  const servers = await dbServer.find(
    {},
    {
      serverId: 1,
    }
  );
  return servers?.map((server) => server.serverId) ?? [];
};

const serverService = {
  registerServer,
  getServer,
  listRegisteredServersId,
};

export default serverService;
