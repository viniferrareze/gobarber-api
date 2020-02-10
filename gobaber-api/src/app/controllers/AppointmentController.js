import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import User from '../models/User';
import Appointment from '../models/Appointment';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
   async index(req, res) {
      const { page = 1 } = req.query;

      const appointment = await Appointment.findAll({
         where: { user_id: req.userId, canceled_at: null },
         order: ['date'],
         limit: 20,
         offset: (page - 1) * 20,
         attributes: ['id', 'date'],
         include: [
            {
               model: User,
               as: 'provider',
               attributes: ['id', 'name'],
               include: [
                  {
                     model: File,
                     as: 'avatar',
                     attributes: ['id', 'path', 'url'],
                  },
               ],
            },
         ],
      });

      return res.json(appointment);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         provider_id: Yup.number().required(),
         date: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const { provider_id, date } = req.body;

      // checa se existe o usuário e se o mesmo é um provider.
      const isProvider = await User.findOne({
         where: { id: provider_id, provider: true },
      });

      if (!isProvider) {
         return res
            .status(401)
            .json({ error: 'You can only create appointment with providers!' });
      }

      // pega somente a roda da data que foi informada
      const hourStart = startOfHour(parseISO(date));

      // valida se a data que informou já passou da data atual
      if (isBefore(hourStart, new Date())) {
         return res.status(400).json({ error: 'Past dates are not permitted' });
      }

      // checar se a data informada possui já uma agendamento.
      const checkAppointment = await Appointment.findOne({
         where: {
            provider_id,
            canceled_at: null,
            date: hourStart,
         },
      });

      // se possuir não pode ser agendado
      if (checkAppointment) {
         return res
            .status(400)
            .json({ error: 'Appoint date is not available' });
      }

      // cria o agendamento
      const appointment = await Appointment.create({
         user_id: req.userId,
         provider_id,
         date: hourStart,
      });

      const user = await User.findByPk(req.userId);
      const formattedDate = format(
         hourStart,
         "'dia' dd 'de' MMMM', às' H:mm'h' ",
         { locale: pt }
      );

      // cria a notificação
      await Notification.create({
         content: `Novo agendamento de ${user.name} para dia ${formattedDate}`,
         user: provider_id,
      });

      return res.json(appointment);
   }

   async delete(req, res) {
      const appointment = await Appointment.findByPk(req.params.id);

      if (appointment.user_id !== req.userId) {
         return req.status(401).json({
            error: "You don't have permission to cancel this appointment.",
         });
      }

      // subtrai 2 horas
      const dateWithSub = subHours(appointment.date, 2);

      // verificar se o horario limite para cancelamento ja passou
      if (isBefore(dateWithSub, new Date())) {
         return res.status(401).json({
            error: 'You can only cancel appointments 2 hours in advance.',
         });
      }

      appointment.canceled_at = new Date();

      await appointment.save();

      return res.json(appointment);
   }
}

export default new AppointmentController();
