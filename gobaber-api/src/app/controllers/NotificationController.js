import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
   async index(req, res) {
      const checkUserProvider = await User.findOne({
         where: {
            id: req.userId,
            provider: true,
         },
      });

      if (!checkUserProvider) {
         return res
            .status(401)
            .json({ error: 'Only provider can load notifications!' });
      }

      const notifications = await Notification.find({
         user: req.userId,
      })
         .sort({ createdAt: 'desc' })
         .limit(20);

      return res.json(notifications);
   }

   async update(req, res) {
      // const notification = await Notification.findById(req.params.id);

      // vai buscar no banco e atualizar pelo id
      const notification = await Notification.findByIdAndUpdate(
         req.params.id,
         { read: true },
         { new: true } // o new vai retornar ja o registro atualizado para varivavel "notification"
      );

      return res.json(notification);
   }
}

export default new NotificationController();
