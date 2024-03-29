import { Question } from "./entity/Question";
import { Appointment } from "./entity/Appointment";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Doctor } from "./entity/Doctor";
import { Request, Response } from "express";
import express = require("express");
import bodyParser = require("body-parser");
import { Specialization } from "./entity/Specialization";
import init from "./init";
import { User } from "./entity/User";
import { Option } from "./entity/Option";
import cors = require("cors");
import { Answer } from "./entity/Answer";
import { print } from "util";

createConnection()
  .then(async connection => {
    const doctorsRepository = connection.getRepository(Doctor);
    const usersRepository = connection.getRepository(User);
    const appointmentRepository = connection.getRepository(Appointment);
    const specializationRepository = connection.getRepository(Specialization);
    const questionRepository = connection.getRepository(Question);
    const optionRepository = connection.getRepository(Option);
    const answersRepository = connection.getRepository(Answer);

    await init(connection);

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    // Логин
    app.get("/api/v1/login", async function(req: Request, res: Response) {
      const users = await usersRepository.find();
      return res.json(users[0]);
    });

    // Получение всех направлений
    app.get("/api/v1/specializations", async function(
      req: Request,
      res: Response
    ) {
      const specializations = await specializationRepository.find();
      return res.json(specializations);
    });

    // Получение всех врачей
    app.get("/api/v1/doctors", async function(req: Request, res: Response) {
      const { specializationId } = req.query;
      let doctors;

      if (specializationId) {
        const specialization = new Specialization();
        specialization.id = specializationId;

        doctors = await doctorsRepository.find({
          where: { specialization },
          relations: ["specialization"]
        });
      } else {
        doctors = await doctorsRepository.find({
          relations: ["specialization"]
        });
      }

      return res.json(doctors);
    });

    // Создание встречи
    app.post("/api/v1/appointments", async function(
      req: Request,
      res: Response
    ) {
      const appointment = await appointmentRepository.create(req.body);
      const results = await appointmentRepository.save(appointment);

      const createdAppointment = await appointmentRepository.findOne({
        where: { id: results["id"] },
        relations: ["doctor", "doctor.specialization", "user"]
      });

      return res.json(createdAppointment);
    });

    // Подтверждение встречи
    app.post("/api/v1/appointments/:appointmentId/confirm", async function(
      req: Request,
      res: Response
    ) {
      const { appointmentId } = req.params;

      const appointment = await appointmentRepository.findOne(appointmentId);
      appointment.isConfirmedByUser = true;
      const results = await appointmentRepository.save(appointment);
      return res.json(results);
    });

    // Завершение встречи
    app.post("/api/v1/appointments/:appointmentId/finish", async function(
      req: Request,
      res: Response
    ) {
      const { appointmentId } = req.params;

      const appointment = await appointmentRepository.findOne(appointmentId);
      appointment.isFinishedByDoctor = true;
      const results = await appointmentRepository.save(appointment);
      return res.json(results);
    });

    // Получение встреч
    app.get("/api/v1/appointments", async function(
      req: Request,
      res: Response
    ) {
      const { userId } = req.query;

      let appointments;

      if (!userId) {
        appointments = await appointmentRepository.find({
          relations: ["doctor", "doctor.specialization", "user"]
        });
      } else {
        const user = await usersRepository.findOne(userId);

        appointments = await appointmentRepository.find({
          where: { user },
          relations: ["doctor", "doctor.specialization", "user"]
        });
      }

      return res.json(appointments);
    });

    // Получение вопросов, все - без параметров, для юзера - userId и appointmentId (айди записи)
    app.get("/api/v1/questions", async function(req: Request, res: Response) {
      let questions = await questionRepository.find({
        relations: ["specializations", "options"]
      });

      const { userId, appointmentId } = req.query;

      if (userId && appointmentId) {
        const user: User = await usersRepository.findOne(userId);
        const appointment: Appointment = await appointmentRepository.findOne(
          appointmentId,
          { relations: ["doctor", "doctor.specialization"] }
        );

        questions = questions.filter((question: Question) => {
          const isSexAccepted = question.sex ? user.sex === question.sex : true;
          const isAgeAccepted =
            question.minAge && question.maxAge
              ? user.age > question.minAge && user.age < question.maxAge
              : true;

          let isSpecializationAccepted = true;

          if (question.specializations.length > 0) {
            isSpecializationAccepted = !!question.specializations.find(
              specialization =>
                specialization.id === appointment.doctor.specialization.id
            );
          }

          return isSexAccepted && isAgeAccepted && isSpecializationAccepted;
        });
      }

      return res.json(questions);
    });

    // Создание вопроса
    app.post("/api/v1/questions", async function(req: Request, res: Response) {
      const results = await questionRepository.save(req.body);
      const question = await questionRepository.findOne({
        where: { id: results.id },
        relations: ["specializations"]
      });
      return res.json(question);
    });

    // Удаление вопроса
    app.delete("/api/v1/questions/:questionId", async function(
      req: Request,
      res: Response
    ) {
      const { questionId } = req.params;
      await questionRepository.delete(questionId);
      return res.status(200).json("Deleted");
    });

    // Редактирование вопроса
    app.put("/api/v1/questions/:questionId", async function(
      req: Request,
      res: Response
    ) {
      const { questionId } = req.params;

      const question = await questionRepository.findOne(questionId);
      await questionRepository.merge(question, req.body);

      const results = await questionRepository.save(question);
      return res.json(results);
    });

    // Создание опции
    app.post("/api/v1/options", async function(req: Request, res: Response) {
      const results = await optionRepository.save(req.body);
      return res.json(results);
    });

    // Удаление опции
    app.delete("/api/v1/options/:optionId", async function(
      req: Request,
      res: Response
    ) {
      const { optionId } = req.params;
      await optionRepository.delete(optionId);
      return res.status(200).json("Deleted");
    });

    // Создание ответов
    app.post("/api/v1/answers", async function(req: Request, res: Response) {
      const { appointmentId } = req.query;
      const results = await answersRepository.save(req.body);

      const appointment = await appointmentRepository.findOne(appointmentId);
      appointment.isPollFinishedByUser = true;
      await appointmentRepository.save(appointment);

      return res.json(results);
    });

    // Получения ответов
    app.get("/api/v1/answers", async function(req: Request, res: Response) {
      const answers = await answersRepository.find({
        relations: ["user", "appointment", "question"]
      });
      return res.json(answers);
    });

    app.listen(3000, () => {
      console.log("Server is ready...");
    });
  })
  .catch(error => console.log(error));
