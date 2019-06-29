import { Question } from './entity/Question';
import { Appointment } from './entity/Appointment';
import { Connection } from "typeorm";
import { Specialization } from "./entity/Specialization";
import { Doctor } from "./entity/Doctor";
import { User } from "./entity/User";
import * as fs from 'fs';

export default async function init(connection: Connection) {
    const db = fs.readFileSync('./db.json', 'utf8');
    const parsedDb = JSON.parse(db);

    const { users, specializations, doctors, appointments, questions } = parsedDb;

    const specializationRepository = await connection.getRepository(Specialization);
    await asyncForEach(specializations, async specialization => {
        await specializationRepository.save(specialization);
    });

    const usersRepository = await connection.getRepository(User);    
    await asyncForEach(users, async user => {
        await usersRepository.save(user);
    });

    const doctorsRepository = await connection.getRepository(Doctor);
    await asyncForEach(doctors, async doctor => {
        await doctorsRepository.save(doctor);
    });

    const appointmentsRepository = await connection.getRepository(Appointment);
    await asyncForEach(appointments, async appointment => {
        await appointmentsRepository.save(appointment);
    });

    const questionsRepository = await connection.getRepository(Question);
    await asyncForEach(questions, async question => {
        await questionsRepository.save(question);
    });
}

async function asyncForEach(array: [], callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i]);
    }
}