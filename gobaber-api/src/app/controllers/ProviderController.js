import User from '../models/User';
import File from '../models/File';

class ProviderController {
   async index(req, res) {
      const teste = await User.findAll({
         where: { provider: true },
         attributes: ['id', 'name', 'email', 'avatar_id'],
         include: [
            { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
         ],
      });

      return res.json(teste);
   }
}

export default new ProviderController();
